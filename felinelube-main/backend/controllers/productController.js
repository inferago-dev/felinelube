const prisma = require('../config/db');
const {
  sanitizeStr, sanitizeEmail, sanitizeFloat, sanitizeInt,
  sanitizePageParam, safeJsonParse, isValidEmail
} = require('../utils/sanitize');

// Allowed status values to prevent arbitrary data injection
const ALLOWED_PRODUCT_STATUSES = ['ACTIVE', 'INACTIVE', 'DRAFT'];

// ---------------------------------------------------------------
// @desc    Get all products (Public) with pagination
// @route   GET /api/products
// ---------------------------------------------------------------
exports.getProducts = async (req, res) => {
  try {
    // SANITIZE: page and limit query params — clamp to safe integers
    const page  = sanitizePageParam(req.query.page,  1, 1, 1000);
    const limit = sanitizePageParam(req.query.limit, 12, 1, 100);
    const skip  = (page - 1) * limit;

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where: { status: 'ACTIVE' },
        include: { images: true },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.product.count({ where: { status: 'ACTIVE' } })
    ]);

    return res.json({
      data: products,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('getProducts error:', error);
    return res.status(500).json({ message: 'Server error fetching products' });
  }
};

// ---------------------------------------------------------------
// @desc    Get single product (Public)
// @route   GET /api/products/:slug
// ---------------------------------------------------------------
exports.getProductBySlug = async (req, res) => {
  try {
    // SANITIZE: slug — only alphanumeric and hyphens allowed
    const slug = req.params.slug;
    if (!slug || !/^[a-z0-9-]+$/.test(slug)) {
      return res.status(400).json({ message: 'Invalid product identifier' });
    }
    // Hard cap to prevent extremely long slugs
    if (slug.length > 200) {
      return res.status(400).json({ message: 'Invalid product identifier' });
    }

    const product = await prisma.product.findUnique({
      where: { slug },
      include: { images: true },
    });

    if (!product) return res.status(404).json({ message: 'Product not found' });
    return res.json(product);
  } catch (error) {
    console.error('getProductBySlug error:', error);
    return res.status(500).json({ message: 'Server error fetching product' });
  }
};

// ---------------------------------------------------------------
// @desc    Get all products (Admin - includes hidden/draft)
// @route   GET /api/products/admin/all
// ---------------------------------------------------------------
exports.adminGetProducts = async (req, res) => {
  try {
    const products = await prisma.product.findMany({
      include: { images: true },
      orderBy: { createdAt: 'desc' },
    });
    return res.json(products);
  } catch (error) {
    console.error('adminGetProducts error:', error);
    return res.status(500).json({ message: 'Server error fetching products' });
  }
};

// ---------------------------------------------------------------
// @desc    Create Product (Admin)
// @route   POST /api/products/admin
// ---------------------------------------------------------------
exports.createProduct = async (req, res) => {
  try {
    const {
      name, slug, description, shortDesc, category, apiRating,
      viscosity, price, stock, isFeatured, features, specs, variants, restockDate
    } = req.body;

    // Validate required fields
    if (!name || !slug) {
      return res.status(400).json({ message: 'Name and slug are required' });
    }

    // SANITIZE: slug — only lowercase alphanumeric + hyphens, max 200 chars
    if (!/^[a-z0-9-]+$/.test(slug) || slug.length > 200) {
      return res.status(400).json({ message: 'Slug must contain only lowercase letters, numbers, and hyphens' });
    }

    // SANITIZE: numeric fields
    const parsedPrice = sanitizeFloat(price, 0);
    const parsedStock = sanitizeInt(stock, 0);
    if (parsedPrice === null) return res.status(400).json({ message: 'Invalid price value' });
    if (parsedStock === null) return res.status(400).json({ message: 'Invalid stock value' });

    // SANITIZE: restockDate
    let parsedRestockDate = null;
    if (restockDate) {
      parsedRestockDate = new Date(restockDate);
      if (isNaN(parsedRestockDate.getTime())) {
        return res.status(400).json({ message: 'Invalid restock date' });
      }
    }

    // SANITIZE: features array — each element must be a string, max 20 items
    let cleanFeatures = [];
    if (Array.isArray(features)) {
      cleanFeatures = features.slice(0, 20).map(f => sanitizeStr(String(f), 200)).filter(Boolean);
    } else if (typeof features === 'string') {
      const parsed = safeJsonParse(features, []);
      cleanFeatures = Array.isArray(parsed)
        ? parsed.slice(0, 20).map(f => sanitizeStr(String(f), 200)).filter(Boolean)
        : [];
    }

    // SANITIZE: specs and variants — safe JSON parse only
    const parsedSpecs    = safeJsonParse(specs, {});
    const parsedVariants = safeJsonParse(variants, null);

    let imageUrl = null;
    let pdfUrlStr = null;
    if (req.files) {
      if (req.files.image) imageUrl  = `/${req.files.image[0].path.replace(/\\/g, '/')}`;
      if (req.files.pdf)   pdfUrlStr = `/${req.files.pdf[0].path.replace(/\\/g, '/')}`;
    }

    const product = await prisma.product.create({
      data: {
        name:        sanitizeStr(name, 200),
        slug,
        description: sanitizeStr(description, 2000),
        shortDesc:   sanitizeStr(shortDesc, 500),
        category:    sanitizeStr(category, 100),
        apiRating:   sanitizeStr(apiRating, 50),
        viscosity:   sanitizeStr(viscosity, 50),
        price:       parsedPrice,
        stock:       parsedStock,
        isFeatured:  isFeatured === 'true' || isFeatured === true,
        features:    cleanFeatures,
        specs:       parsedSpecs,
        variants:    parsedVariants,
        image:       imageUrl,
        pdfUrl:      pdfUrlStr,
        restockDate: parsedRestockDate,
      }
    });

    return res.status(201).json(product);
  } catch (error) {
    console.error('createProduct error:', error);
    return res.status(400).json({ message: 'Failed to create product. Check your input.' });
  }
};

// ---------------------------------------------------------------
// @desc    Update Product (Admin)
// @route   PUT /api/products/admin/:id
// ---------------------------------------------------------------
exports.updateProduct = async (req, res) => {
  try {
    // SANITIZE: route param id
    const { id } = req.params;
    if (!id || typeof id !== 'string' || id.length > 128) {
      return res.status(400).json({ message: 'Invalid product ID' });
    }

    const {
      name, description, shortDesc, category, apiRating,
      viscosity, price, stock, isFeatured, features, specs, status, variants, restockDate
    } = req.body;

    const updateData = {};

    if (name        !== undefined) updateData.name        = sanitizeStr(name, 200);
    if (description !== undefined) updateData.description = sanitizeStr(description, 2000);
    if (shortDesc   !== undefined) updateData.shortDesc   = sanitizeStr(shortDesc, 500);
    if (category    !== undefined) updateData.category    = sanitizeStr(category, 100);
    if (apiRating   !== undefined) updateData.apiRating   = sanitizeStr(apiRating, 50);
    if (viscosity   !== undefined) updateData.viscosity   = sanitizeStr(viscosity, 50);

    if (price !== undefined) {
      const p = sanitizeFloat(price, 0);
      if (p === null) return res.status(400).json({ message: 'Invalid price value' });
      updateData.price = p;
    }
    if (stock !== undefined) {
      const s = sanitizeInt(stock, 0);
      if (s === null) return res.status(400).json({ message: 'Invalid stock value' });
      updateData.stock = s;
    }
    if (isFeatured !== undefined) {
      updateData.isFeatured = isFeatured === 'true' || isFeatured === true;
    }
    if (features !== undefined) {
      if (Array.isArray(features)) {
        updateData.features = features.slice(0, 20).map(f => sanitizeStr(String(f), 200)).filter(Boolean);
      } else if (typeof features === 'string') {
        const parsed = safeJsonParse(features, []);
        updateData.features = Array.isArray(parsed)
          ? parsed.slice(0, 20).map(f => sanitizeStr(String(f), 200)).filter(Boolean)
          : [];
      }
    }
    if (specs    !== undefined) updateData.specs    = safeJsonParse(specs, {});
    if (variants !== undefined) updateData.variants = safeJsonParse(variants, null);

    if (restockDate !== undefined) {
      if (restockDate) {
        const d = new Date(restockDate);
        if (isNaN(d.getTime())) return res.status(400).json({ message: 'Invalid restock date' });
        updateData.restockDate = d;
      } else {
        updateData.restockDate = null;
      }
    }
    if (status !== undefined) {
      if (!ALLOWED_PRODUCT_STATUSES.includes(status)) {
        return res.status(400).json({ message: 'Invalid status value' });
      }
      updateData.status = status;
    }

    if (req.files) {
      if (req.files.image) updateData.image  = `/${req.files.image[0].path.replace(/\\/g, '/')}`;
      if (req.files.pdf)   updateData.pdfUrl = `/${req.files.pdf[0].path.replace(/\\/g, '/')}`;
    }

    // SECURITY: verify product exists before mutating
    const existing = await prisma.product.findUnique({ where: { id }, select: { id: true } });
    if (!existing) return res.status(404).json({ message: 'Product not found' });

    const product = await prisma.product.update({ where: { id }, data: updateData });
    return res.json(product);
  } catch (error) {
    console.error('updateProduct error:', error);
    return res.status(400).json({ message: 'Failed to update product' });
  }
};

// ---------------------------------------------------------------
// @desc    Delete Product (Admin)
// @route   DELETE /api/products/admin/:id
// ---------------------------------------------------------------
exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id || typeof id !== 'string' || id.length > 128) {
      return res.status(400).json({ message: 'Invalid product ID' });
    }

    // SECURITY: verify product exists before deleting
    const existing = await prisma.product.findUnique({ where: { id }, select: { id: true } });
    if (!existing) return res.status(404).json({ message: 'Product not found' });

    await prisma.product.delete({ where: { id } });
    return res.json({ message: 'Product deleted' });
  } catch (error) {
    console.error('deleteProduct error:', error);
    return res.status(500).json({ message: 'Failed to delete product' });
  }
};
