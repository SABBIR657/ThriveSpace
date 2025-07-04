const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const userRoutes = require('./routes/userRoutes');
const blogRoutes = require('./routes/blogRoutes');

const app = express();

app.use(cors({ origin: ['https://thrive-space.vercel.app'], credentials: true }));
app.use(express.json());
app.use(cookieParser());

app.use('/api/users', userRoutes);
app.use('/api/blogs', blogRoutes);

// ✅ Test route
app.get('/', (req, res) => {
  res.send('🚀 ThriveSpace Backend is live!');
});

module.exports = app;
