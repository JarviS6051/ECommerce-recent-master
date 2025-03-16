import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    description: {
        type: String,
        trim: true
    },
    image: {
        type: String,
        required: [true, 'Image is required ']
    },
    category: {
        type: String,
        required: true,
        trim: true
    },
    size: {
        type: String,
        trim: true
    },
    color: {
        type: String,
        trim: true
    },
    rating: {
        type: Number,
        min: 0,
        max: 5
    }
});

const Product = mongoose.model('Product', productSchema);

export default Product;