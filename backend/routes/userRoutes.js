import express from 'express';
import { loginUser,registerUser } from '../controllers/userController.js';

const userRoueter = express.Router();

userRoueter.post("/register",registerUser)
userRoueter.post("/login",loginUser)


export default userRoueter