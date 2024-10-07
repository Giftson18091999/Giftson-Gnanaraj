const mongoose = require('mongoose');
const XLSX = require('xlsx');
const chokidar = require('chokidar');
const cors=require("cors");
const express =require('express');
const app=express();
const bodyParser=require('body-parser');
const path=require("path");
const Product= require('./models/excelShema');



mongoose.connect('mongodb://0.0.0.0:27017/storage');
mongoose.connection.on("connected", ()=> console.log("MongoDB Connected"));


const uploadExcelToMongo = async () => {
    try {
        // Load the Excel file
        const workbook = XLSX.readFile('products.xlsx'); // Ensure this file exists in the same directory
        const sheetName = workbook.SheetNames[0]; // Get the first sheet
        const sheet = workbook.Sheets[sheetName]; // Get the sheet data

        // Convert the sheet data to JSON
        const data = XLSX.utils.sheet_to_json(sheet);
        console.log('Excel Data:', data);

        // Process each product
        for (const product of data) {
            try {
                const { productId,name,category ,price,quantity,description} = product; // Extract productId and other data
                const updateData = {
                    productId:productId ,
                    name: name,
                    price:price ,
                    category: category ,
                    quantity: quantity,
                    description:description
                }
                console.log(updateData)
                // Find the product by ID
                const existingProduct = await Product.findOne({ productId });
                if (existingProduct) {
                    // Update existing product
                    await Product.findOneAndUpdate({ productId }, updateData);
                    console.log('Updated product:', productId);
                } else {
                    // Insert new product
                    await Product.create(product);
                    console.log('Inserted new product:', productId);
                }
            } catch (insertOrUpdateError) {
                console.error('Error processing product:', insertOrUpdateError.message);
            }
        }
        console.log('All products processed successfully');
    } catch (error) {
        console.error('Error uploading data:', error.message); // Detailed error message
    } finally {
        await mongoose.connection.close(); // Close MongoDB connection
    }
};

// Watch for changes in the Excel file
const watcher = chokidar.watch('products.xlsx', {
    persistent: true,
    ignoreInitial: true,
    usePolling: true
});

// Trigger update when Excel file is modified
watcher.on('change', () => {
    console.log('Excel file changed. Syncing with MongoDB...');
    uploadExcelToMongo();
});


app.use(cors({
    origin:'http:localhost:4200',
    credentials:true
}))


 const PORT =8080;
 app.listen(PORT,()=>{
  console.log(`server is running on PORT ${PORT}`);
    })
 app.use(bodyParser.json());

















