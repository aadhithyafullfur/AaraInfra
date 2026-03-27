const Product = require('../models/Product');
const fs = require('fs');
const path = require('path');

const WINDOW_IMAGE_MAP = {
    'Tilt & Turn Window': 'tilt and turn window modern',
    'French Window': 'french window home design',
    'Casement Window': 'casement window aluminum',
    'Sliding Window': 'sliding window upvc',
    'Fixed Glass Window': 'fixed glass window modern house',
    'Ventilator Window': 'bathroom ventilator window small',
    'Three track aluminum sliding': 'three track aluminum sliding window'
};

const WINDOW_IMAGE_FALLBACK = 'https://via.placeholder.com/400?text=Window';

const normalize = (value = '') => value.toString().trim().toLowerCase();

const normalizeMap = Object.keys(WINDOW_IMAGE_MAP).reduce((acc, key) => {
    acc[normalize(key)] = WINDOW_IMAGE_MAP[key];
    return acc;
}, {});

const getMappedKeyword = (productName = '') => {
    const normalizedName = normalize(productName);
    if (normalizeMap[normalizedName]) return normalizeMap[normalizedName];

    if (normalizedName.includes('tilt') && normalizedName.includes('turn')) return WINDOW_IMAGE_MAP['Tilt & Turn Window'];
    if (normalizedName.includes('french')) return WINDOW_IMAGE_MAP['French Window'];
    if (normalizedName.includes('casement')) return WINDOW_IMAGE_MAP['Casement Window'];
    if (normalizedName.includes('sliding') && normalizedName.includes('three')) return WINDOW_IMAGE_MAP['Three track aluminum sliding'];
    if (normalizedName.includes('sliding')) return WINDOW_IMAGE_MAP['Sliding Window'];
    if (normalizedName.includes('fixed')) return WINDOW_IMAGE_MAP['Fixed Glass Window'];
    if (normalizedName.includes('ventilator')) return WINDOW_IMAGE_MAP['Ventilator Window'];

    return null;
};

const getMappedImageUrl = (productName = '') => {
    const keyword = getMappedKeyword(productName);
    if (!keyword) return WINDOW_IMAGE_FALLBACK;
    return `https://source.unsplash.com/featured/?${encodeURIComponent(keyword)}`;
};

const resolveProductImage = (product) => {
    if (product.image && /^https?:\/\//i.test(product.image)) {
        return product.image;
    }

    if (product.image && !/^https?:\/\//i.test(product.image)) {
        return product.image.replace(/\\/g, '/');
    }

    return getMappedImageUrl(product.name);
};

const withResolvedImage = (product) => ({
    ...product,
    image: resolveProductImage(product)
});

// @desc    Get all products
// @route   GET /api/products
// @access  Private (Accessible by Both Admin and Client)
const getProducts = async (req, res) => {
    try {
        const products = await Product.find({}).lean();
        res.json(products.map(withResolvedImage));
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @desc    Get single product by id
// @route   GET /api/products/:id
// @access  Private (Accessible by Both Admin and Client)
const getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id).lean();

        if (!product) {
            return res.status(404).json({ msg: 'Product not found' });
        }

        return res.json(withResolvedImage(product));
    } catch (err) {
        console.error(err.message);
        return res.status(500).send('Server Error');
    }
};

// @desc    Create new product
// @route   POST /api/products
// @access  Private
const createProduct = async (req, res) => {
    try {
        const { name, category, material, size, pricePerSqFt, gstRate, hsnCode, description } = req.body;

        let image = '';
        if (req.file) {
            image = req.file.path.replace(/\\/g, "/"); // normalize path separators
        }

        const newProduct = new Product({
            name,
            category,
            material,
            size,
            pricePerSqFt,
            gstRate: gstRate || 18,
            hsnCode,
            image,
            description,
            createdBy: req.user.id
        });

        const product = await newProduct.save();
        res.json(product);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @desc    Update product
// @route   PUT /api/products/:id
// @access  Private
const updateProduct = async (req, res) => {
    try {
        const { name, category, material, size, pricePerSqFt, gstRate, hsnCode, description } = req.body;
        let product = await Product.findById(req.params.id);

        if (!product) return res.status(404).json({ msg: 'Product not found' });
        if (product.createdBy.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'Not authorized' });
        }

        let image = product.image;
        if (req.file) {
            // Delete old image if exists
            if (product.image) {
                const oldPath = path.join(__dirname, '..', product.image);
                if (fs.existsSync(oldPath)) {
                    fs.unlinkSync(oldPath);
                }
            }
            image = req.file.path.replace(/\\/g, "/");
        }

        product = await Product.findByIdAndUpdate(
            req.params.id,
            { $set: { name, category, material, size, pricePerSqFt, gstRate, hsnCode, description, image } },
            { new: true }
        );

        res.json(product);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @desc    Delete product
// @route   DELETE /api/products/:id
// @access  Private
const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) return res.status(404).json({ msg: 'Product not found' });
        if (product.createdBy.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'Not authorized' });
        }

        if (product.image) {
            const imagePath = path.join(__dirname, '..', product.image);
            if (fs.existsSync(imagePath)) {
                fs.unlinkSync(imagePath);
            }
        }

        await Product.findByIdAndDelete(req.params.id);
        res.json({ msg: 'Product removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

module.exports = {
    getProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
};
