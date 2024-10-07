const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    productId: {
        type: String,
        required: true,
        unique: true 
    },
    name: {
        type: String,
        required: true 
    },

    price: {
        type: Number,
        required: true, 
        min: 0 
    },
    category: {
        type: String,
        required: true 
    },
    quantity:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    }
});

const Product = mongoose.model('masterData', productSchema);

module.exports = Product;