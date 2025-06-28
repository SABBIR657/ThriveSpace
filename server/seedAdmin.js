require('dotenv').config();
const mongoose = require("mongoose");
const User = require("./models/User");
const bcrypt = require("bcryptjs");

const MONGO_URI = process.env.MONGO_URI;

mongoose.connect(MONGO_URI).then(async()=>{
    const email = process.env.ADMIN_EMAIL;
    const username = process.env.ADMIN_USERNAME;
    const plainPassword = process.env.ADMIN_PASSWORD;

    if(!email || !username || !plainPassword){
        console.error("Admin credentials are missing in .env");

        return mongoose.disconnect();
    }

    const existingAdmin = await User.findOne({email});

    if(!existingAdmin){
        const hasedPassword = await bcrypt.hash(plainPassword, 10);

        await User.create({
            username,
            email,
            password: hasedPassword,
            isAdmin: true,
        });
        console.log("Admin created Successfully");
    }else{
        console.log("admin already exists");
    }

    mongoose.disconnect();
})