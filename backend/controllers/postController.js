import Post from '../models/Post.js';
import Comment from '../models/Comment.js';

// @desc    Create a new post
// @route   POST /api/posts
// @access  Private
export const createPost = async (req, res) => {
  const { title, content, coverImage, tags } = req.body;

  try {
    if (!title || !content) {
      return res.status(400).json({ message: 'Title and content are required' });
    }

    const post = await Post.create({
      title,
      content,
      coverImage,
      tags: Array.isArray(tags) ? tags : [],
      author: req.user._id,
    });

    const populatedPost = await Post.findById(post._id).populate('author', 'username email');
    res.status(201).json(populatedPost);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all posts (with search and tag filters)
// @route   GET /api/posts
// @access  Public
export const getAllPosts = async (req, res) => {
  const { search, tag, authorId } = req.query;
  const query = {};

  if (search) {
    query.$or = [
      { title: { $regex: search, $options: 'i' } },
      { content: { $regex: search, $options: 'i' } }
    ];
  }

  if (tag) {
    query.tags = tag;
  }

  if (authorId) {
    query.author = authorId;
  }

  try {
    const posts = await Post.find(query)
      .populate('author', 'username email')
      .sort({ createdAt: -1 });
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get a single post
// @route   GET /api/posts/:id
// @access  Public
export const getPostById = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).populate('author', 'username email');
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    res.json(post);
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Post not found' });
    }
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a post
// @route   PUT /api/posts/:id
// @access  Private
export const updatePost = async (req, res) => {
  const { title, content, coverImage, tags } = req.body;

  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Check post ownership
    if (post.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to edit this post' });
    }

    post.title = title || post.title;
    post.content = content || post.content;
    post.coverImage = coverImage !== undefined ? coverImage : post.coverImage;
    post.tags = Array.isArray(tags) ? tags : post.tags;

    // Trigger post pre-save hooks (like excerpt update)
    await post.save();

    const updatedPost = await Post.findById(post._id).populate('author', 'username email');
    res.json(updatedPost);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a post and its comments
// @route   DELETE /api/posts/:id
// @access  Private
export const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Check post ownership
    if (post.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this post' });
    }

    // Delete all associated comments
    await Comment.deleteMany({ post: post._id });

    // Delete the post
    await Post.deleteOne({ _id: post._id });

    res.json({ message: 'Post and its comments successfully deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
