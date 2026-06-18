import express from 'express';
import {
  addComment,
  getCommentsByPostId,
  deleteComment
} from '../controllers/commentController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.route('/:postId')
  .post(protect, addComment)
  .get(getCommentsByPostId);

router.route('/:id')
  .delete(protect, deleteComment);

export default router;
