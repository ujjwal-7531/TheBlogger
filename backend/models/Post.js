import mongoose from 'mongoose';

const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide a title'],
      trim: true,
      maxlength: [120, 'Title cannot exceed 120 characters'],
    },
    content: {
      type: String,
      required: [true, 'Content is required'],
    },
    excerpt: {
      type: String,
      trim: true,
    },
    coverImage: {
      type: String,
      default: '', // Will hold a visual gradient choice or generated image URL
    },
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Auto-generate excerpt if not provided
postSchema.pre('save', function (next) {
  if (!this.excerpt && this.content) {
    // Strip HTML/Markdown tags and take first 150 chars
    const plainText = this.content
      .replace(/<[^>]*>/g, '') // remove HTML tags
      .replace(/[*_#`\[\]()]/g, '') // remove common markdown punctuation
      .trim();
    this.excerpt = plainText.length > 150 ? plainText.substring(0, 147) + '...' : plainText;
  }
  next();
});

const Post = mongoose.model('Post', postSchema);
export default Post;
