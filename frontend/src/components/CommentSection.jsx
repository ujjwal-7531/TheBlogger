import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { api } from '../utils/api.js';
import { Trash2, MessageSquare, Send } from 'lucide-react';

const CommentSection = ({ postId, postAuthorId }) => {
  const { user } = useAuth();
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const fetchComments = async () => {
    try {
      setLoading(true);
      const data = await api.getComments(postId);
      setComments(data);
      setError('');
    } catch (err) {
      console.error('Failed to load comments:', err.message);
      setError('Could not fetch comments. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (postId) {
      fetchComments();
    }
  }, [postId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      setSubmitting(true);
      setError('');
      const addedComment = await api.addComment(postId, newComment.trim());
      setComments((prev) => [...prev, addedComment]);
      setNewComment('');
    } catch (err) {
      setError(err.message || 'Failed to submit comment.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (commentId) => {
    if (!window.confirm('Are you sure you want to delete this comment?')) return;

    try {
      await api.deleteComment(commentId);
      setComments((prev) => prev.filter((c) => c._id !== commentId));
    } catch (err) {
      alert(err.message || 'Failed to delete comment.');
    }
  };

  return (
    <section className="comments-section">
      <h3 className="comments-title">
        <MessageSquare size={20} className="comments-icon" />
        <span>Discussion ({comments.length})</span>
      </h3>

      {error && <div className="error-message">{error}</div>}

      {/* Write Comment Box */}
      {user ? (
        <form onSubmit={handleSubmit} className="comment-form">
          <textarea
            rows="3"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Add a comment to the discussion..."
            required
            disabled={submitting}
          />
          <div className="form-actions">
            <button type="submit" className="btn btn-primary btn-sm btn-submit" disabled={submitting || !newComment.trim()}>
              <Send size={14} />
              <span>{submitting ? 'Posting...' : 'Comment'}</span>
            </button>
          </div>
        </form>
      ) : (
        <div className="login-prompt glass-card">
          <p>You must be signed in to join the conversation.</p>
          <Link to="/auth" className="btn btn-secondary btn-sm">
            Sign In
          </Link>
        </div>
      )}

      {/* Comment List */}
      {loading ? (
        <div className="loading-comments">Loading discussion...</div>
      ) : comments.length === 0 ? (
        <div className="empty-comments">No comments yet. Start the conversation!</div>
      ) : (
        <div className="comments-list">
          {comments.map((comment) => {
            const formattedDate = new Date(comment.createdAt).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            });

            const isCommentAuthor = user && user._id === comment.author?._id;
            const isPostOwner = user && user._id === postAuthorId;
            const canDelete = isCommentAuthor || isPostOwner;

            return (
              <div key={comment._id} className="comment-item glass-card fade-in">
                <div className="comment-header">
                  <div className="comment-author-info">
                    <span className="comment-author">{comment.author?.username || 'Anonymous'}</span>
                    <span className="comment-date">{formattedDate}</span>
                  </div>
                  {canDelete && (
                    <button
                      onClick={() => handleDelete(comment._id)}
                      className="btn-delete-comment"
                      title="Delete Comment"
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
                <div className="comment-body">
                  <p>{comment.content}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <style dangerouslySetInnerHTML={{ __html: `
        .comments-section {
          margin-top: 3rem;
          border-top: 1px solid rgba(255, 255, 255, 0.05);
          padding-top: 2rem;
        }
        .comments-title {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 1.5rem;
          font-size: 1.25rem;
        }
        .comments-icon {
          color: var(--accent-primary);
        }
        .error-message {
          padding: 0.8rem;
          background: rgba(239, 68, 68, 0.1);
          border: 1px solid rgba(239, 68, 68, 0.2);
          border-radius: var(--radius-sm);
          color: #fca5a5;
          margin-bottom: 1rem;
          font-size: 0.9rem;
        }
        .comment-form {
          margin-bottom: 2rem;
        }
        .comment-form textarea {
          resize: vertical;
          margin-bottom: 0.75rem;
        }
        .form-actions {
          display: flex;
          justify-content: flex-end;
        }
        .btn-submit {
          gap: 0.4rem;
        }
        .login-prompt {
          text-align: center;
          padding: 1.5rem;
          margin-bottom: 2rem;
        }
        .login-prompt p {
          color: var(--text-secondary);
          margin-bottom: 1rem;
          font-size: 0.95rem;
        }
        .loading-comments, .empty-comments {
          text-align: center;
          color: var(--text-muted);
          padding: 2rem 0;
          font-size: 0.95rem;
        }
        .comments-list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        .comment-item {
          padding: 1rem 1.25rem !important;
          border-radius: var(--radius-sm) !important;
          box-shadow: none !important;
        }
        .comment-item:hover {
          border-color: rgba(255, 255, 255, 0.1) !important;
          box-shadow: none !important;
        }
        .comment-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.5rem;
        }
        .comment-author-info {
          display: flex;
          align-items: center;
          gap: 0.6rem;
        }
        .comment-author {
          font-weight: 600;
          font-size: 0.9rem;
          color: var(--text-primary);
        }
        .comment-date {
          font-size: 0.75rem;
          color: var(--text-muted);
        }
        .btn-delete-comment {
          background: transparent;
          border: none;
          color: var(--text-muted);
          cursor: pointer;
          transition: color var(--transition-fast);
          padding: 0.2rem;
        }
        .btn-delete-comment:hover {
          color: var(--error);
        }
        .comment-body {
          font-size: 0.9rem;
          color: var(--text-secondary);
          word-break: break-word;
          white-space: pre-wrap;
        }
      `}} />
    </section>
  );
};

export default CommentSection;
