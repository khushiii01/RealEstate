import express from "express";
import morgan from "morgan";
import cors from "cors";
import mongoose from "mongoose";
import { DATABASE } from "./config.js";
import authRoutes from "./serverr/routes/auth.js";
import adRoutes from './serverr/routes/ad.js';
const app=express();

mongoose.set("strictQuery",false);
mongoose
.connect(DATABASE)
.then(()=>console.log("db_connected"))
.catch((err)=>console.log("Error occured", err))

//middlewares

app.use(express.json({limit:"10mb"}));
app.use(morgan("dev"));
app.use(cors());

//routes middleware
app.use("/api",authRoutes);
app.use("/api",adRoutes);
app.listen(8000,()=> console.log("server_running_on_port_8000"));