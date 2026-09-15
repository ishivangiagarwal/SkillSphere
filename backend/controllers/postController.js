const asyncHandler = require('express-async-handler');
const Post = require('../models/Post');
const Comment = require('../models/Comment');
const Notification = require('../models/Notification');

// @desc  Get community feed
// @route GET /api/posts
// @access Private
const getPosts = asyncHandler(async (req, res) => {
  const posts = await Post.find()
    .populate('author', 'name avatar role')
    .populate({ path: 'comments', populate: { path: 'author', select: 'name avatar' } })
    .sort('-createdAt');
  res.json({ success: true, count: posts.length, posts });
});

// @desc  Create post
// @route POST /api/posts
// @access Private
const createPost = asyncHandler(async (req, res) => {
  const { content, image, tags } = req.body;
  if (!content) {
    res.status(400);
    throw new Error('Post content is required');
  }
  const post = await Post.create({ author: req.user._id, content, image, tags });
  const populated = await post.populate('author', 'name avatar role');
  res.status(201).json({ success: true, post: populated });
});

// @desc  Update own post
// @route PUT /api/posts/:id
// @access Private (owner)
const updatePost = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (!post) {
    res.status(404);
    throw new Error('Post not found');
  }
  if (post.author.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized to edit this post');
  }
  post.content = req.body.content ?? post.content;
  post.image = req.body.image ?? post.image;
  post.tags = req.body.tags ?? post.tags;
  await post.save();
  res.json({ success: true, post });
});

// @desc  Delete own post (or admin)
// @route DELETE /api/posts/:id
// @access Private (owner, admin)
const deletePost = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (!post) {
    res.status(404);
    throw new Error('Post not found');
  }
  if (post.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    res.status(403);
    throw new Error('Not authorized to delete this post');
  }
  await Comment.deleteMany({ post: post._id });
  await post.deleteOne();
  res.json({ success: true, message: 'Post deleted successfully' });
});

// @desc  Like / unlike a post
// @route PUT /api/posts/:id/like
// @access Private
const toggleLike = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (!post) {
    res.status(404);
    throw new Error('Post not found');
  }

  const liked = post.likes.some((u) => u.toString() === req.user._id.toString());
  if (liked) {
    post.likes = post.likes.filter((u) => u.toString() !== req.user._id.toString());
  } else {
    post.likes.push(req.user._id);
    if (post.author.toString() !== req.user._id.toString()) {
      await Notification.create({
        user: post.author,
        type: 'new-like',
        message: `${req.user.name} liked your post`,
        link: `/community`,
      });
    }
  }
  await post.save();
  res.json({ success: true, likesCount: post.likes.length, liked: !liked });
});

// @desc  Add comment to post
// @route POST /api/posts/:id/comments
// @access Private
const addComment = asyncHandler(async (req, res) => {
  const { text } = req.body;
  if (!text) {
    res.status(400);
    throw new Error('Comment text is required');
  }
  const post = await Post.findById(req.params.id);
  if (!post) {
    res.status(404);
    throw new Error('Post not found');
  }

  const comment = await Comment.create({ post: post._id, author: req.user._id, text });
  const populated = await comment.populate('author', 'name avatar');

  if (post.author.toString() !== req.user._id.toString()) {
    await Notification.create({
      user: post.author,
      type: 'new-comment',
      message: `${req.user.name} commented on your post`,
      link: `/community`,
    });
  }

  res.status(201).json({ success: true, comment: populated });
});

module.exports = { getPosts, createPost, updatePost, deletePost, toggleLike, addComment };
