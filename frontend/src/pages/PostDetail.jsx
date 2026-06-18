import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { api } from '../utils/api.js';
import CommentSection from '../components/CommentSection.jsx';
import { ArrowLeft, Edit2, Trash2, Calendar, User, AlertCircle } from 'lucide-react';

const PostDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchPost = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await api.getPost(id);
      setPost(data);
    } catch (err) {
      console.error(err);
      setError('Article not found or server error.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchPost();
    }
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this article? All comments will be removed permanently.')) return;
    
    try {
      await api.deletePost(id);
      navigate('/');
    } catch (err) {
      alert(err.message || 'Failed to delete the article.');
    }
  };

  if (loading) {
    return (
      <div className="detail-loading container">
        <div className="spinner"></div>
        <p>Loading article contents...</p>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="detail-error container">
        <div className="error-card glass-card fade-in">
          <AlertCircle size={32} className="error-icon" />
          <h3>Article Error</h3>
          <p>{error || 'The requested article could not be loaded.'}</p>
          <Link to="/" className="btn btn-secondary btn-sm">
            <ArrowLeft size={14} /> Back to Feed
          </Link>
        </div>
      </div>
    );
  }

  const formattedDate = new Date(post.createdAt).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  const isAuthor = user && post.author && user._id === post.author._id;

  return (
    <div className="post-detail-page container fade-in">
      <Link to="/" className="btn-back">
        <ArrowLeft size={16} />
        <span>Back to Feed</span>
      </Link>

      <article className="post-article">
        {/* Cover Banner */}
        {post.coverImage && (
          <div 
            className="article-banner" 
            style={{ 
              background: `url(${post.coverImage}) center/cover no-repeat` 
            }} 
          />
        )}

        {/* Content Header */}
        <header className="article-header">
          <h1 className="article-title">{post.title}</h1>
          
          <div className="article-meta-row">
            <div className="article-meta-info">
              <span className="meta-badge">
                <User size={14} />
                <span>{post.author?.username || 'Anonymous'}</span>
              </span>
              <span className="meta-badge">
                <Calendar size={14} />
                <span>{formattedDate}</span>
              </span>
            </div>

            {/* Author edit/delete controls */}
            {isAuthor && (
              <div className="author-controls">
                <Link to={`/edit/${post._id}`} className="btn btn-secondary btn-sm btn-icon" title="Edit Article">
                  <Edit2 size={14} />
                  <span>Edit</span>
                </Link>
                <button onClick={handleDelete} className="btn btn-danger btn-sm btn-icon" title="Delete Article">
                  <Trash2 size={14} />
                  <span>Delete</span>
                </button>
              </div>
            )}
          </div>

          {post.tags && post.tags.length > 0 && (
            <div className="article-tags">
              {post.tags.map((tag) => (
                <span key={tag} className="tag-badge">#{tag}</span>
              ))}
            </div>
          )}
        </header>

        {/* Main Text Content */}
        <div className="article-body">
          {post.content.split('\n\n').map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </div>
      </article>

      {/* Discussion comments thread */}
      <CommentSection postId={post._id} postAuthorId={post.author?._id} />

      <style dangerouslySetInnerHTML={{ __html: `
        .post-detail-page {
          padding-top: 2rem;
          padding-bottom: 5rem;
          max-width: 800px !important;
        }
        .btn-back {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          color: var(--text-secondary);
          text-decoration: none;
          font-size: 0.95rem;
          margin-bottom: 1.5rem;
          transition: color var(--transition-fast);
        }
        .btn-back:hover {
          color: var(--text-primary);
        }
        .detail-loading {
          min-height: 50vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 1rem;
          color: var(--text-muted);
        }
        .detail-error {
          padding-top: 5rem;
        }
        .post-article {
          background: var(--glass-bg);
          border: var(--glass-border);
          border-radius: var(--radius-lg);
          overflow: hidden;
          box-shadow: var(--shadow-lg);
        }
        .article-banner {
          height: 320px;
          width: 100%;
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
        }
        .article-header {
          padding: 2.5rem 2.5rem 1.5rem 2.5rem;
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
        }
        .article-title {
          font-size: 2.5rem;
          line-height: 1.2;
          margin-bottom: 1.5rem;
        }
        .article-meta-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 1rem;
          margin-bottom: 1rem;
        }
        .article-meta-info {
          display: flex;
          gap: 1.25rem;
          color: var(--text-secondary);
          font-size: 0.9rem;
        }
        .meta-badge {
          display: flex;
          align-items: center;
          gap: 0.4rem;
        }
        .author-controls {
          display: flex;
          gap: 0.5rem;
        }
        .btn-icon {
          gap: 0.3rem;
          font-size: 0.85rem;
          padding: 0.4rem 0.8rem;
        }
        .article-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
          margin-top: 0.5rem;
        }
        .article-body {
          padding: 2.5rem;
          font-size: 1.1rem;
          line-height: 1.8;
          color: rgba(248, 250, 252, 0.9);
        }
        .article-body p {
          margin-bottom: 1.5rem;
          word-break: break-word;
          white-space: pre-wrap;
        }
        @media (max-width: 600px) {
          .article-title {
            font-size: 1.8rem;
          }
          .article-header {
            padding: 1.5rem 1.5rem 1rem 1.5rem;
          }
          .article-body {
            padding: 1.5rem;
            font-size: 1rem;
          }
          .article-banner {
            height: 200px;
          }
          .article-meta-row {
            flex-direction: column;
            align-items: flex-start;
          }
        }
      `}} />
    </div>
  );
};

export default PostDetail;
