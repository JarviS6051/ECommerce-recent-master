import Product from '../models/product.model.js';

export const getAllProducts = async (req, res) => {
    try {
        const products = await Product.find({});
        res.status(200).json({ products });
    } catch (error) {
        console.log("Error getting products", error);
        res.status(500).json({ message: error.message });
    }
}

export const getProductsByCategory = async (req, res) => {
    const category = req.params.category;
    try {
        const products = await Product.find({ category
        });
        res.status(200).json({ products });
    } catch (error) {
        console.log("Error getting products by category", error);
        res.status(500).json({ message: error.message });
}};