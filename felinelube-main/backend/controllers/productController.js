const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Allowed status values to prevent arbitrary data injection
const ALLOWED_PRODUCT_STATUSES = ['ACTIVE', 'INACTIVE', 'DRAFT'];

// Helper: safely parse a JSON string, return fallback on failure
const safeJsonParse = (str, fallback = {}) => {
  try {
    return typeof str === 'string' ? JSON.parse(str) : fallback;
  } catch {
    return fallback;
  }
};

// Helper: sanitize string input (trim, max length)
const sanitizeStr = (val, maxLen = 500) =>
  typeof val === 'string' ? val.trim().slice(0, maxLen) : undefined;

// ---------------------------------------------------------------
// @desc    Get all products (Public)
// @route   GET /api/products
// ---------------------------------------------------------------
exports.getProducts = async (req, res) => {
  try {
    const products = await prisma.product.findMany({
      where: { status: 'ACTIVE' },
      include: { images: true },
      orderBy: { createdAt: 'desc' },
    });
    return res.json(products);
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
    // Validate slug: only alphanumeric and hyphens allowed
    const slug = req.params.slug;
    if (!slug || !/^[a-z0-9-]+$/.test(slug)) {
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
    const { name, slug, description, shortDesc, category, apiRating, viscosity, price, stock, isFeatured, features, specs } = req.body;

    // Validate required fields
    if (!name || !slug) {
      return res.status(400).json({ message: 'Name and slug are required' });
    }

    // Validate slug format
    if (!/^[a-z0-9-]+$/.test(slug)) {
      return res.status(400).json({ message: 'Slug must contain only lowercase letters, numbers, and hyphens' });
    }

    // Validate and parse numeric fields
    const parsedPrice = parseFloat(price);
    const parsedStock = parseInt(stock, 10);
    if (isNaN(parsedPrice) || parsedPrice < 0) {
      return res.status(400).json({ message: 'Invalid price value' });
    }
    if (isNaN(parsedStock) || parsedStock < 0) {
      return res.status(400).json({ message: 'Invalid stock value' });
    }

    // Safely parse specs — never crash server on bad JSON
    const parsedSpecs = safeJsonParse(specs, {});

    const product = await prisma.product.create({
      data: {
        name: sanitizeStr(name, 200),
        slug,
        description: sanitizeStr(description, 2000),
        shortDesc: sanitizeStr(shortDesc, 500),
        category: sanitizeStr(category, 100),
        apiRating: sanitizeStr(apiRating, 50),
        viscosity: sanitizeStr(viscosity, 50),
        price: parsedPrice,
        stock: parsedStock,
        isFeatured: isFeatured === 'true' || isFeatured === true,
        features: Array.isArray(features) ? features.slice(0, 20) : [],
        specs: parsedSpecs,
      },
    });

    return res.status(201).json(product);
  } catch (error) {
    console.error('createProduct error:', error);
    // Don't leak Prisma error messages (may contain DB schema info)
    return res.status(400).json({ message: 'Failed to create product. Check your input.' });
  }
};

// ---------------------------------------------------------------
// @desc    Update Product (Admin)
// @route   PUT /api/products/admin/:id
// ---------------------------------------------------------------
exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;

    // Whitelist only the fields that are allowed to be updated
    const {
      name, description, shortDesc, category, apiRating,
      viscosity, price, stock, isFeatured, features, specs, status
    } = req.body;

    const updateData = {};

    if (name !== undefined)        updateData.name        = sanitizeStr(name, 200);
    if (description !== undefined) updateData.description = sanitizeStr(description, 2000);
    if (shortDesc !== undefined)   updateData.shortDesc   = sanitizeStr(shortDesc, 500);
    if (category !== undefined)    updateData.category    = sanitizeStr(category, 100);
    if (apiRating !== undefined)   updateData.apiRating   = sanitizeStr(apiRating, 50);
    if (viscosity !== undefined)   updateData.viscosity   = sanitizeStr(viscosity, 50);

    if (price !== undefined) {
      const p = parseFloat(price);
      if (isNaN(p) || p < 0) return res.status(400).json({ message: 'Invalid price value' });
      updateData.price = p;
    }
    if (stock !== undefined) {
      const s = parseInt(stock, 10);
      if (isNaN(s) || s < 0) return res.status(400).json({ message: 'Invalid stock value' });
      updateData.stock = s;
    }
    if (isFeatured !== undefined) {
      updateData.isFeatured = isFeatured === 'true' || isFeatured === true;
    }
    if (Array.isArray(features)) {
      updateData.features = features.slice(0, 20);
    }
    if (specs !== undefined) {
      updateData.specs = safeJsonParse(specs, {});
    }
    if (status !== undefined) {
      if (!ALLOWED_PRODUCT_STATUSES.includes(status)) {
        return res.status(400).json({ message: 'Invalid status value' });
      }
      updateData.status = status;
    }

    const product = await prisma.product.update({
      where: { id },
      data: updateData,
    });

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
    if (!id || typeof id !== 'string') {
      return res.status(400).json({ message: 'Invalid product ID' });
    }

    await prisma.product.delete({ where: { id } });
    return res.json({ message: 'Product deleted' });
  } catch (error) {
    console.error('deleteProduct error:', error);
    return res.status(500).json({ message: 'Failed to delete product' });
  }
};
