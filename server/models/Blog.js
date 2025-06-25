const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
    user: {type:mongoose.Schema.Types.ObjectId, ref:'User', required:true},
    category:{
        type:String,
        enum: ['motivation', 'study', 'story', 'book','Productivity','Healthy Life', 'Career', 'Technology','Inspiration', 'Finance' ],
        required: true
    },
    title:{type: String, required:true},
    content: {type: String,  required: true},
    likes:[{type: mongoose.Schema.Types.ObjectId, ref: 'User'}],
    comments: [{type:mongoose.Schema.Types.ObjectId, ref: 'Comment'}]
}, {timestamps: true})

module.exports = mongoose.model('Blog', blogSchema)