const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const {
createBlog,
getAllBlogs,
getBlogById,
likeBlog,
commentOnBlog,
updateBlog,
deleteBlog
} = require('../controllers/blogController')


// Public - Get all blogs
router.get('/', getAllBlogs);

// Public - Get single blog
router.get('/:id', getBlogById);

// Authenticated - Create a blog
router.post('/', auth, createBlog);

// Authenticated - Like a blog
router.patch('/:id/like', auth, likeBlog);

// Authenticated - Comment on a blog
router.post('/:id/comment', auth, commentOnBlog);

//edit blog
router.put('/:id', auth, updateBlog);

//delete blog
router.delete('/:id', auth, deleteBlog);


module.exports = router;