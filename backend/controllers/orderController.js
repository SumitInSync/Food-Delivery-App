import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import Stripe from "stripe"
import dotenv from "dotenv";
dotenv.config(); // Load environment variables from .env

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
// placing user order from frontend
const placeOrder = async(req,res) => {
    const frontendUrl = "http://localhost:5174";
    try {
        const newOrder = new orderModel({
            userId : req.body.userId,
            items : req.body.items,
            amount : req.body.amount,
            address : req.body.address
        })
 
        await newOrder.save();
        await userModel.findByIdAndUpdate(req.body.userId,{cartData : {}});

        const line_items = req.body.items.map((item)=> ({
            price_data : {
                currency : "inr",
                product_data : {
                    name : item.name
                },
                unit_amount : item.price*100*85
            },
            quantity : item.quantity
        }))
        line_items.push({
            price_data : {
                currency : "inr",
                product_data : {
                    name : "Delivery charges",
                },
                unit_amount : 2*100*85
            },
            quantity : 1
        })

        const session = await stripe.checkout.sessions.create({
            line_items : line_items,
            mode : 'payment',
            success_url : `${frontendUrl}/verify?success=true&orderId=${newOrder._id}`,
            cancel_url : `${frontendUrl}/verify?success=false&orderId=${newOrder._id}`,
        })

        res.json({
            success : true,
            session_url : session.url
        })

    } catch (error) {
        console.log(error);
        res.json({
            success : false,
            message : "Error"
        })
        
    }
}

const verifyOrder = async(req,res) => {
    const {orderId,success} = req.body;

    try {
        if(success === "true"){
            await orderModel.findByIdAndUpdate(orderId,{payment : true});
            res.json({
                success:true,
                message : "paid"
            })
        }
        else{
            await orderModel.findByIdAndDelete(orderId);
            res.json({
                success:false,
                message : "Not paid"
            })
        }
    } catch (error) {
        console.log(error);
        res.json({
            success:false,
            message : "Error"
        })
    }
}

// user orders for frontend
const userOrders = async (req,res) => {
    try {
        const orders = await orderModel.find({userId : req.body.userId})
        res.json({
            success:true,
            data : orders
        })
    } catch (error) {
        console.log(error);
        res.json({
            success:false,
            message : "Error"
        })
    }
}

// lisitng orders for admin pannel
const listOrders =async(req , res) => {
    try {
        const orders = await orderModel.find({})
        res.json({
            success: true,
            data : orders
        })
    } catch (error) {
        console.log(error);
        res.json({
            success : false,
            message : "Error"
        })
        
    }
}

// api for updating order status
const updateStatus = async (req,res) => {
    try {
        await orderModel.findByIdAndUpdate(req.body.orderId,{status : req.body.status})
        res.json({
            success : true,
            message :  "Status Updated"
        })
    } catch (error) {
        console.log(error);
        res.json({
            success : false,
            message :  "Error"
        })
    }
}

export {placeOrder,verifyOrder,userOrders,listOrders,updateStatus}