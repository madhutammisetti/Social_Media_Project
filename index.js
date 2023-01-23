const express = require("express")
const app = express()
const mongoose = require("mongoose");
const dotenv = require("dotenv")
const helmet = require("helmet")
const morgan = require("morgan")
const userRoute = require("./Routes/users")
const authRoute = require("./Routes/auth")
const postRoute = require("./Routes/posts")

dotenv.config();

mongoose.connect(process.env.MONGO_URL,{useNewUrlParser:true, useUnifiedTopology:true},
    ()=>{
    console.log("Connected to MongoDB")
});

//middleware

app.use(express.json());
app.use(helmet());
app.use(morgan("common"));

app.use("/api/users" , userRoute);
app.use("/api/auth" , authRoute);
app.use("/api/posts" , postRoute);




app.listen(8000,()=>{
console.log("Backend Server is ready and running..")
})