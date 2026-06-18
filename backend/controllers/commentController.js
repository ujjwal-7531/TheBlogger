import Comment from '../models/Comment.js';
import Post from '../models/Post.js';

// @desc    Add a comment to a post
// @route   POST /api/comments/:postId
// @access  Private
export const addComment = async (req, res) => {
  const { content } = req.body;
  const { postId } = req.params;

  try {
    if (!content) {
      return res.status(400).json({ message: 'Comment content cannot be empty' });
    }

    // Verify post exists
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const comment = await Comment.create({
      content,
      post: postId,
      author: req.user._id,
    });

    const populatedComment = await Comment.findById(comment._id).populate('author', 'username email');
    res.status(201).json(populatedComment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get comments for a post
// @route   GET /api/comments/:postId
// @access  Public
export const getCommentsByPostId = async (req, res) => {
  const { postId } = req.params;

  try {
    const comments = await Comment.find({ post: postId })
      .populate('author', 'username email')
      .sort({ createdAt: 1 }); // Oldest first (chronological conversation style)
    res.json(comments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a comment
// @route   DELETE /api/comments/:id
// @access  Private
export const deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id).populate('post');

    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    // Authorized if user is the comment author OR the owner of the blog post
    const isCommentAuthor = comment.author.toString() === req.user._id.toString();
    const isPostOwner = comment.post && comment.post.author.toString() === req.user._id.toString();

    if (!isCommentAuthor && !isPostOwner) {
      return res.status(403).json({ message: 'Not authorized to delete this comment' });
    }

    await Comment.deleteOne({ _id: comment._id });
    res.json({ message: 'Comment deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
