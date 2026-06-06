const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// @desc    Get all products (Public)
// @route   GET /api/products
exports.getProducts = async (req, res) => {
  try {
    const products = await prisma.product.findMany({
      where: { status: 'ACTIVE' },
      include: { images: true },
      orderBy: { createdAt: 'desc' }
    });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single product (Public)
// @route   GET /api/products/:slug
exports.getProductBySlug = async (req, res) => {
  try {
    const product = await prisma.product.findUnique({
      where: { slug: req.params.slug },
      include: { images: true }
    });
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all products (Admin - includes hidden/draft)
// @route   GET /api/admin/products
exports.adminGetProducts = async (req, res) => {
  try {
    const products = await prisma.product.findMany({
      include: { images: true },
      orderBy: { createdAt: 'desc' }
    });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create Product (Admin)
// @route   POST /api/admin/products
exports.createProduct = async (req, res) => {
  try {
    const { name, slug, description, shortDesc, category, apiRating, viscosity, price, stock, isFeatured, features, specs } = req.body;
    
    const product = await prisma.product.create({
      data: {
        name,
        slug,
        description,
        shortDesc,
        category,
        apiRating,
        viscosity,
        price: parseFloat(price),
        stock: parseInt(stock),
        isFeatured: isFeatured === 'true' || isFeatured === true,
        features: Array.isArray(features) ? features : [],
        specs: specs ? JSON.parse(specs) : {}
      }
    });
    
    res.status(201).json(product);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update Product (Admin)
// @route   PUT /api/admin/products/:id
exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = { ...req.body };
    
    if (updateData.price) updateData.price = parseFloat(updateData.price);
    if (updateData.stock) updateData.stock = parseInt(updateData.stock);
    if (updateData.isFeatured) updateData.isFeatured = updateData.isFeatured === 'true' || updateData.isFeatured === true;
    if (updateData.specs && typeof updateData.specs === 'string') updateData.specs = JSON.parse(updateData.specs);

    const product = await prisma.product.update({
      where: { id },
      data: updateData
    });
    
    res.json(product);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete Product (Admin)
// @route   DELETE /api/admin/products/:id
exports.deleteProduct = async (req, res) => {
  try {
    await prisma.product.delete({ where: { id: req.params.id } });
    res.json({ message: 'Product deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
