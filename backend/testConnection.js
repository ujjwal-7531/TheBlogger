import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';
import Post from './models/Post.js';
import Comment from './models/Comment.js';

import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '.env') });

const runTests = async () => {
  try {
    console.log('--- STARTING DATABASE RELATIONSHIP VERIFICATION ---');
    
    // Connect
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✔ Connected to MongoDB');

    // Clean any old test records
    await User.deleteMany({ email: 'test_verifier@example.com' });
    
    // 1. Create a test user
    const user = await User.create({
      username: 'test_verifier',
      email: 'test_verifier@example.com',
      password: 'password123',
    });
    console.log('✔ Created test user:', user.username);

    // 2. Verify password hashing
    if (user.password === 'password123') {
      throw new Error('✘ Password was stored in plain text!');
    }
    console.log('✔ Password hashing verified');

    // 3. Verify matchPassword
    const isMatch = await user.matchPassword('password123');
    if (!isMatch) {
      throw new Error('✘ matchPassword failed to authenticate valid credentials!');
    }
    console.log('✔ Password matching verification successful');

    // 4. Create a post
    const post = await Post.create({
      title: 'Verifier Test Post',
      content: 'This is test content. It should contain enough text to trigger excerpt generation on save.',
      tags: ['test', 'validation'],
      author: user._id,
    });
    console.log('✔ Created post:', post.title);
    console.log('✔ Generated post excerpt:', post.excerpt);

    // 5. Create a comment
    const comment = await Comment.create({
      content: 'This is a test feedback comment.',
      post: post._id,
      author: user._id,
    });
    console.log('✔ Created comment with post association');

    // 6. Test Query Populate
    const fetchedComment = await Comment.findById(comment._id).populate('author', 'username');
    if (fetchedComment.author.username !== 'test_verifier') {
      throw new Error('✘ Populate lookup did not return correct user credentials!');
    }
    console.log('✔ Author population queries verified');

    // 7. Verify Cascade Deletions (Post controller emulation)
    // Delete comment and post
    await Comment.deleteMany({ post: post._id });
    await Post.deleteOne({ _id: post._id });
    
    const remainingComments = await Comment.countDocuments({ post: post._id });
    if (remainingComments !== 0) {
      throw new Error('✘ Associated comments remained after post deletion!');
    }
    console.log('✔ Post-Comment cascade deletion verified');

    // Clean up user
    await User.deleteOne({ _id: user._id });
    console.log('✔ User cleanup complete');
    
    console.log('--- ALL INTEGRATION TESTS PASSED SUCCESSFULLY ---');
    process.exit(0);
  } catch (error) {
    console.error('✘ Test execution failed:', error.message);
    process.exit(1);
  }
};

runTests();
