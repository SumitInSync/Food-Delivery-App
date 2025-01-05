import express from 'express';
import cors from 'cors';
import { connectDB } from './config/db.js';
import dotenv from 'dotenv';
import foodRouter from './routes/foodRoutes.js';
import userRoueter from './routes/userRoutes.js';
import cartRouter from './routes/cartRoutes.js';
import orderRouter from './routes/orderRoutes.js';

dotenv.config();

// app config
const app = express();
const port =  process.env.PORT || 4000;

// middleware
app.use(express.json() )
app.use(cors())


// DB connected
connectDB();

// api endpoint
app.use("/api/food",foodRouter)
app.use("/images",express.static("uploads"))
app.use("/api/user",userRoueter)
app.use("/api/cart",cartRouter);
app.use("/api/order",orderRouter);

app.get('/',(req,res )=> {
    res.send("Api Working")
})


app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
})


