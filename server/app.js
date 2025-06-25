const express = require('express')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const userRoutes = require('./routes/userRoutes')
const blogRoutes = require('./routes/blogRoutes')

const app = express();
app.use(cors({origin:'http://localhost:5173', credentials:true}));
app.use(express.json());
app.use(cookieParser());

app.use('/api/users', userRoutes);
app.use('/api/blogs', blogRoutes);

module.exports = app;