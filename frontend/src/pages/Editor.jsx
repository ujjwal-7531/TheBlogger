import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { api } from '../utils/api.js';
import { AlertCircle, PenSquare, Eye, Save, X } from 'lucide-react';

const Editor = () => {
  const { id } = useParams(); // Exists only in Edit mode
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const isEditMode = !!id;

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [tagsString, setTagsString] = useState('');
  const [loading, setLoading] = useState(isEditMode);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Authentication barrier: Redirect to login if user is not signed in
  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth', { state: { from: location } });
    }
  }, [user, authLoading, navigate, location]);

  // Fetch post data if in Edit Mode
  useEffect(() => {
    const fetchPostToEdit = async () => {
      if (!isEditMode) return;
      try {
        setLoading(true);
        const post = await api.getPost(id);
        
        // Verify post author ownership
        if (post.author?._id !== user?._id) {
          setError('You are not authorized to edit this article.');
          return;
        }

        setTitle(post.title);
        setContent(post.content);
        setCoverImage(post.coverImage || '');
        setTagsString(post.tags ? post.tags.join(', ') : '');
      } catch (err) {
        console.error(err);
        setError('Failed to retrieve the article details.');
      } finally {
        setLoading(false);
      }
    };

    if (user && isEditMode) {
      fetchPostToEdit();
    }
  }, [id, isEditMode, user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!title.trim() || !content.trim()) {
      setError('Title and content are required.');
      return;
    }

    // Process tag inputs (split by commas, trim and remove empty elements)
    const tags = tagsString
      .split(',')
      .map((tag) => tag.trim().toLowerCase())
      .filter((tag) => tag.length > 0);

    try {
      setSubmitting(true);
      let post;
      if (isEditMode) {
        post = await api.updatePost(id, title.trim(), content.trim(), coverImage.trim(), tags);
      } else {
        post = await api.createPost(title.trim(), content.trim(), coverImage.trim(), tags);
      }
      navigate(`/posts/${post._id}`);
    } catch (err) {
      setError(err.message || 'An error occurred while saving the article.');
    } finally {
      setSubmitting(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="editor-loading container">
        <div className="spinner"></div>
        <p>{isEditMode ? 'Loading article details...' : 'Verifying account access...'}</p>
      </div>
    );
  }

  return (
    <div className="editor-page container fade-in">
      <div className="editor-card glass-card">
        <header className="editor-header">
          <div className="editor-icon-badge">
            <PenSquare size={20} className="glow-icon" />
          </div>
          <h2>{isEditMode ? 'Edit Article' : 'Publish Article'}</h2>
          <p className="editor-subtitle">
            {isEditMode ? 'Modify your post. Changes will take effect immediately.' : 'Share your knowledge and ideas with the world.'}
          </p>
        </header>

        {error && (
          <div className="error-alert fade-in">
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        {/* Prevent editor rendering if there is an error in edit mode (e.g. Unauthorized) */}
        {isEditMode && error && error.includes('authorized') ? (
          <div className="unauthorized-message">
            <button onClick={() => navigate('/')} className="btn btn-secondary">
              Back to Feed
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="editor-form">
            <div className="form-group">
              <label htmlFor="title">Article Title</label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter a captivating title..."
                required
                maxLength="120"
                disabled={submitting}
              />
            </div>

            <div className="form-group">
              <label htmlFor="coverImage">Cover Image URL (Optional)</label>
              <input
                type="url"
                id="coverImage"
                value={coverImage}
                onChange={(e) => setCoverImage(e.target.value)}
                placeholder="https://images.unsplash.com/photo-..."
                disabled={submitting}
              />
              <span className="input-hint">If left empty, a unique colorful gradient is auto-generated for you!</span>
            </div>

            <div className="form-group">
              <label htmlFor="tags">Tags (Comma-separated, optional)</label>
              <input
                type="text"
                id="tags"
                value={tagsString}
                onChange={(e) => setTagsString(e.target.value)}
                placeholder="javascript, coding, productivity"
                disabled={submitting}
              />
              <span className="input-hint">Enter keywords separated by commas (e.g. react, css)</span>
            </div>

            <div className="form-group">
              <label htmlFor="content">Article Content</label>
              <textarea
                id="content"
                rows="12"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Write your thoughts here... Separate paragraphs with a blank line."
                required
                disabled={submitting}
              />
            </div>

            <div className="editor-actions">
              <button 
                type="button" 
                className="btn btn-secondary btn-cancel"
                onClick={() => isEditMode ? navigate(`/posts/${id}`) : navigate('/')}
                disabled={submitting}
              >
                Cancel
              </button>
              <button type="submit" className="btn btn-primary btn-save" disabled={submitting}>
                <Save size={16} />
                <span>{submitting ? 'Saving...' : isEditMode ? 'Update' : 'Publish'}</span>
              </button>
            </div>
          </form>
        )}
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .editor-page {
          padding-top: 2rem;
          padding-bottom: 5rem;
          max-width: 760px !important;
        }
        .editor-card {
          padding: 2.5rem !important;
          border-radius: var(--radius-lg) !important;
        }
        .editor-header {
          text-align: center;
          margin-bottom: 2rem;
        }
        .editor-icon-badge {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 48px;
          height: 48px;
          background: rgba(99, 102, 241, 0.1);
          border: 1px solid rgba(99, 102, 241, 0.2);
          border-radius: 50%;
          margin-bottom: 1rem;
        }
        .glow-icon {
          color: var(--accent-primary);
          filter: drop-shadow(0 0 4px var(--accent-primary));
        }
        .editor-header h2 {
          font-size: 1.8rem;
          margin-bottom: 0.5rem;
        }
        .editor-subtitle {
          font-size: 0.9rem;
          color: var(--text-secondary);
        }
        .error-alert {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: rgba(239, 68, 68, 0.1);
          border: 1px solid rgba(239, 68, 68, 0.2);
          padding: 0.8rem;
          border-radius: var(--radius-sm);
          color: #fca5a5;
          font-size: 0.85rem;
          margin-bottom: 1.5rem;
        }
        .unauthorized-message {
          text-align: center;
          margin-top: 1.5rem;
        }
        .editor-form {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }
        .input-hint {
          font-size: 0.75rem;
          color: var(--text-muted);
          margin-top: 0.3rem;
        }
        .editor-form textarea {
          resize: vertical;
          line-height: 1.6;
          font-size: 1rem;
        }
        .editor-actions {
          display: flex;
          justify-content: flex-end;
          gap: 1rem;
          border-top: 1px solid rgba(255, 255, 255, 0.05);
          padding-top: 1.5rem;
          margin-top: 0.5rem;
        }
        .editor-loading {
          min-height: 50vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 1rem;
          color: var(--text-muted);
        }
      `}} />
    </div>
  );
};

export default Editor;
