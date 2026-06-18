import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, User, ArrowRight } from 'lucide-react';

const PostCard = ({ post, onTagClick }) => {
  const formattedDate = new Date(post.createdAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <article className="glass-card post-card fade-in">
      {post.coverImage && (
        <div 
          className="post-cover" 
          style={{ 
            background: `url(${post.coverImage}) center/cover no-repeat` 
          }} 
        />
      )}
      
      <div className="post-card-content">
        <div className="post-meta">
          <div className="meta-item">
            <Calendar size={14} />
            <span>{formattedDate}</span>
          </div>
          <div className="meta-item">
            <User size={14} />
            <span>{post.author?.username || 'Anonymous'}</span>
          </div>
        </div>

        <Link to={`/posts/${post._id}`} className="post-card-link">
          <h3 className="post-card-title">{post.title}</h3>
        </Link>
        
        <p className="post-card-excerpt">{post.excerpt}</p>
        
        {post.tags && post.tags.length > 0 && (
          <div className="post-card-tags">
            {post.tags.map((tag) => (
              <span 
                key={tag} 
                className="tag-badge"
                onClick={(e) => {
                  e.preventDefault();
                  if (onTagClick) onTagClick(tag);
                }}
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        <div className="post-card-footer">
          <Link to={`/posts/${post._id}`} className="btn-readmore">
            <span>Read Article</span>
            <ArrowRight size={16} className="arrow-icon" />
          </Link>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .post-card {
          display: flex;
          flex-direction: column;
          height: 100%;
          overflow: hidden;
          padding: 0 !important;
          border-radius: var(--radius-md);
        }
        .post-cover {
          height: 180px;
          width: 100%;
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
          position: relative;
        }
        .post-card-content {
          padding: 1.5rem;
          display: flex;
          flex-direction: column;
          flex-grow: 1;
        }
        .post-meta {
          display: flex;
          gap: 1rem;
          margin-bottom: 0.75rem;
          font-size: 0.8rem;
          color: var(--text-muted);
        }
        .meta-item {
          display: flex;
          align-items: center;
          gap: 0.3rem;
        }
        .post-card-link {
          text-decoration: none;
          color: inherit;
        }
        .post-card-title {
          font-size: 1.3rem;
          margin-bottom: 0.75rem;
          transition: color var(--transition-fast);
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .post-card-link:hover .post-card-title {
          color: var(--accent-primary);
        }
        .post-card-excerpt {
          font-size: 0.9rem;
          color: var(--text-secondary);
          margin-bottom: 1.25rem;
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
          flex-grow: 1;
        }
        .post-card-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 0.4rem;
          margin-bottom: 1.25rem;
        }
        .post-card-footer {
          margin-top: auto;
          border-top: 1px solid rgba(255, 255, 255, 0.05);
          padding-top: 1rem;
        }
        .btn-readmore {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          color: var(--accent-primary);
          text-decoration: none;
          font-size: 0.9rem;
          font-weight: 600;
          transition: gap var(--transition-fast), color var(--transition-fast);
        }
        .btn-readmore:hover {
          color: var(--accent-secondary);
          gap: 0.6rem;
        }
        .arrow-icon {
          transition: transform var(--transition-fast);
        }
        .btn-readmore:hover .arrow-icon {
          transform: translateX(2px);
        }
      `}} />
    </article>
  );
};

export default PostCard;
