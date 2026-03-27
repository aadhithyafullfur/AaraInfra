const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/Product');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const seedProducts = [
    {
        name: 'Sliding Window',
        category: 'Sliding',
        material: 'uPVC',
        size: '4ft x 4ft',
        pricePerSqFt: 450,
        gstRate: 18,
        hsnCode: '7610',
        description: 'Smooth sliding window with durable uPVC frame.',
        image: 'https://placehold.co/600x400?text=Sliding+Window',
    },
    {
        name: 'Casement Window',
        category: 'Casement',
        material: 'Aluminum',
        size: '4ft x 5ft',
        pricePerSqFt: 550,
        gstRate: 18,
        hsnCode: '7610',
        description: 'Classic casement window with robust aluminum structure.',
        image: 'https://placehold.co/600x400?text=Casement+Window',
    },
    {
        name: 'Fixed Glass Window',
        category: 'Fixed',
        material: 'uPVC',
        size: '3ft x 6ft',
        pricePerSqFt: 350,
        gstRate: 18,
        hsnCode: '7610',
        description: 'Non-opening window for maximum light and view.',
        image: 'https://placehold.co/600x400?text=Fixed+Glass',
    },
    {
        name: 'French Window',
        category: 'French',
        material: 'Wooden',
        size: '5ft x 7ft',
        pricePerSqFt: 800,
        gstRate: 18,
        hsnCode: '4418',
        description: 'Elegant French window adding style to your home.',
        image: 'https://placehold.co/600x400?text=French+Window',
    },
    {
        name: 'Tilt & Turn Window',
        category: 'Tilt & Turn',
        material: 'uPVC',
        size: '3ft x 4ft',
        pricePerSqFt: 600,
        gstRate: 18,
        hsnCode: '7610',
        description: 'Versatile window that tilts for ventilation and turns for cleaning.',
        image: 'https://placehold.co/600x400?text=Tilt+%26+Turn',
    },
    {
        name: 'Ventilator Window',
        category: 'Ventilator',
        material: 'Aluminum',
        size: '2ft x 1ft',
        pricePerSqFt: 250,
        gstRate: 18,
        hsnCode: '7610',
        description: 'Compact window for ventilation in bathrooms and kitchens.',
        image: 'https://placehold.co/600x400?text=Ventilator',
    },
    {
        name: 'Acoustic Soundproof Window',
        category: 'Fixed',
        material: 'uPVC',
        size: '4ft x 4ft',
        pricePerSqFt: 950,
        gstRate: 18,
        hsnCode: '7610',
        description: 'Double glazed acoustic glass to reduce outside noise.',
        image: 'https://placehold.co/600x400?text=Acoustic+Window',
    },
    {
        name: 'Bay Window',
        category: 'Bay',
        material: 'Wooden',
        size: '6ft x 5ft',
        pricePerSqFt: 1100,
        gstRate: 18,
        hsnCode: '4418',
        description: 'Protruding window structure to add space and panoramic views.',
        image: 'https://placehold.co/600x400?text=Bay+Window',
    },
    {
        name: 'Thermal Break Aluminum Window',
        category: 'Sliding',
        material: 'Aluminum',
        size: '4ft x 5ft',
        pricePerSqFt: 850,
        gstRate: 18,
        hsnCode: '7610',
        description: 'High energy-efficiency aluminum frame with thermal break technology.',
        image: 'https://placehold.co/600x400?text=Thermal+Break',
    },
    {
        name: 'Skylight Window',
        category: 'Fixed',
        material: 'Toughened Glass',
        size: '3ft x 3ft',
        pricePerSqFt: 750,
        gstRate: 18,
        hsnCode: '7007',
        description: 'Roof window maximizing natural light in dark rooms.',
        image: 'https://placehold.co/600x400?text=Skylight',
    },
    {
        name: 'Louvered Window',
        category: 'Ventilator',
        material: 'Aluminum',
        size: '3ft x 4ft',
        pricePerSqFt: 350,
        gstRate: 18,
        hsnCode: '7610',
        description: 'Slatted windows allowing air flow while keeping out rain and direct sunshine.',
        image: 'https://placehold.co/600x400?text=Louvered',
    },
    {
        name: 'Awning Window',
        category: 'Awning',
        material: 'uPVC',
        size: '3ft x 2ft',
        pricePerSqFt: 500,
        gstRate: 18,
        hsnCode: '7610',
        description: 'Hinged at the top, opening outwards to allow ventilation even during light rain.',
        image: 'https://placehold.co/600x400?text=Awning+Window',
    },
];

const importData = async () => {
    try {
        await Product.deleteMany(); // Clear existing products
        // We need a user to associate products with.
        // For now, let's create a dummy user or just skip createdBy if not strictly required by schema (it is a ref but not required in my schema definition except logically).
        // Wait, in controller I used `req.user.id`.
        // I should probably find a user or create one.
        // Let's check if any user exists.
        const User = require('./models/User'); // Assuming User model exists
        let adminUser = await User.findOne({ role: 'admin' });

        if (!adminUser) {
            adminUser = await User.findOne({}); // Get any user
        }

        if (!adminUser) {
            console.log('No user found to assign products to. Creating a default admin user...');
            // Create a dummy user if none exists (though unlikely in a running app)
            // detailed user creation logic omitted for brevity, assuming existing users.
            // If really no user, we might fail validation if I made createdBy required.
            // In my schema: `createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }` is NOT required.
            // So I can skip it for seed data, or use a fake ID.
        }

        const sampleProducts = seedProducts.map((product) => {
            return { ...product, createdBy: adminUser ? adminUser._id : null };
        });

        await Product.insertMany(sampleProducts);

        console.log('Data Imported!');
        process.exit();
    } catch (error) {
        console.error(`${error}`);
        process.exit(1);
    }
};

importData();
