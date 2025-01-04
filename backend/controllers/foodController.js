import foodModel from "../models/foodModel.js";
import fs from "fs";


// add food items
const addFood = async(req,res) => {
    if (!req.file) {
        return res.status(400).json({
            success: false,
            message: 'No image uploaded'
        });
    }
    let image_filename = `${req.file.filename}`;
    const food = new foodModel({
        name : req.body.name,
        description : req.body.description,
        price : req.body.price,
        image : image_filename,
        category : req.body.category
    })

    try {
        await food.save();
        res.json({
            success : true ,
            message : "Food added successfully"
        })
    } catch (error) {
        console.log(error);
        res.json({success : false , message : "Error while Food Adding"})
    }
}

// all food list
const listFood = async(req,res) => {
    try {
        const food = await foodModel.find();
        res.json({
            success : true,
            data : food
        })
    } catch (error) {
        console.log(error);
        res.json({success : false , message : "Error while fetching food list"})
    }
}

// remove food items
const removeFood = async(req,res) => {
    try {
        const food = await foodModel.findById(req.body.id);
        fs.unlink(`uploads/${food.image}`,()=>{})
        await foodModel.findByIdAndDelete(req.body.id);
        res.json({
            success : true,
            message : "Food removed successfully"
        })
        
    } catch (error) {
        console.log(error);
        res.json({
            success : false,
            message : "Error while removing food"
        })
    }
}
export {addFood,listFood,removeFood}