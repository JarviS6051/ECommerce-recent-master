import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    type: {
        type: String,
        required: true,
        trim: true
    },
    brand: {
        type: String,
        required: true,
        trim: true
    },
    collection: [{
        collectionName: {
            type: String,
            required: true
        }
    }],
    category: {
        type: String,
        required: true,
        trim: true
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    sale: {
        type: Boolean,
        default: false
    },
    discount: {
        type: String,
        default: '0'
    },
    stock: {
        type: Number,
        required: true,
        min: 0
    },
    new: {
        type: Boolean,
        default: false
    },
    tags: [{
        type: String,
        trim: true
    }],
    variants: [{
        variant_id: {
            type: Number,
            required: true
        },
        sku: {
            type: String,
            required: true
        },
        size: {
            type: String,
            required: true
        },
        color: {
            type: String,
            required: true
        },
        image_id: {
            type: Number,
            required: true
        }
    }],
    images: [{
        image_id: {
            type: Number,
            required: true
        },
        alt: {
            type: String,
            required: true
        },
        src: {
            type: String,
            required: true
        },
        variant_id: [{
            type: Number,
            required: true
        }]
    }]
});

const Product = mongoose.model('Product', productSchema);

export default Product;
