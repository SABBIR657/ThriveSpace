const Blog = require('../models/Blog');
const Comment = require('../models/Comment');

//create a blog
exports.createBlog = async (req, res) =>{
    const {category, title, content}= req.body;

    try{
        const blog = await Blog.create({
            user:req.user._id,
            category,
            title,
            content,
        });

        res.status(201).json(blog);
    } catch(err){
        res.status(500).json({message: 'Failed to create blog', error:err.message})
    }
};


//get all blogs
exports.getAllBlogs = async (req, res) =>{
   try {
    const { search } = req.query;

    const query = search
      ? {
          $or: [
            { title: { $regex: search, $options: 'i' } },
            { content: { $regex: search, $options: 'i' } },
          ],
        }
      : {};

    const blogs = await Blog.find(query)
      .populate('user', 'username')
      .populate({ path: 'comments', populate: { path: 'user', select: 'username' } })
      .sort({ createdAt: -1 });

    res.json(blogs);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching blogs', error: err.message });
  }
};

//get blog by ID
exports.getBlogById = async(req, res) =>{
    try{
        const blog = await Blog.findById(req.params.id)
        .populate('user', 'username')
        .populate({path: 'comments', populate:{path:'user', select: 'username'}});

        if(!blog)return res.status(404).json({message:'Blog not found of this user id'});

        res.json(blog);
    }catch(err){
        res.status(500).json({message:'Error fetching blog', error:err.message})
    
    }
};


//like and unlike blog
exports.likeBlog = async (req, res) =>{
    try{
        const blog = await Blog.findById(req.params.id);
        if(!blog) return res.status(404).json({message:'Blog not found'});

        const userId = req.user._id;
        const alreadyLiked = blog.likes.includes(userId);

        if(alreadyLiked){
            blog.likes.pull(userId);
        }else{
            blog.likes.push(userId);
        }

        await blog.save();
        res.json({message:alreadyLiked?'Unliked': 'Liked', likes:blog.likes.length});
    }catch(err){
        res.status(500).json({message: 'Like operation failed', error: err.message})
    }
};


//comment on a blog
exports.commentOnBlog = async(req, res)=>{
    const {text} = req.body;


    try{
        const blog = await Blog.findById(req.params.id);
        if(!blog) return res.status(404).json({message:"Blog not found"});

        const comment = await Comment.create({
            user:req.user._id,
            blog:blog._id,
            text,
        });

         blog.comments.push(comment._id);
        await blog.save();

        res.status(201).json(comment)
    } catch(err){
        res.status(500).json({message:'failed to comment', error:err.message})
    }
};


// Update blog
exports.updateBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ message: 'Blog not found' });

    if (blog.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Unauthorized to update this blog' });
    }

    const { title, category, content } = req.body;
    blog.title = title || blog.title;
    blog.category = category || blog.category;
    blog.content = content || blog.content;

    await blog.save();
    res.json(blog);
  } catch (error) {
    console.error('Update blog error:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};



// Delete blog
exports.deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ message: 'Blog not found' });

    // Allow blog owner OR admin
    if (
      blog.user.toString() !== req.user._id.toString() &&
      !req.user.isAdmin
    ) {
      return res
        .status(403)
        .json({ message: 'Unauthorized to delete this blog' });
    }

    await Blog.findByIdAndDelete(req.params.id);
    res.json({ message: 'Blog deleted successfully' });
  } catch (error) {
    console.error('Delete blog error', error);
    res.status(500).json({ message: 'Server error' });
  }
};
