import React, { useState, useEffect } from 'react';
import { api } from '../utils/api.js';
import PostCard from '../components/PostCard.jsx';
import { Search, X, BookOpen, AlertCircle } from 'lucide-react';

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeSearch, setActiveSearch] = useState('');
  const [selectedTag, setSelectedTag] = useState('');
  const [error, setError] = useState('');

  const fetchPosts = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await api.getPosts({ 
        search: activeSearch, 
        tag: selectedTag 
      });
      setPosts(data);
    } catch (err) {
      console.error(err);
      setError('Failed to load blog posts. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [activeSearch, selectedTag]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setActiveSearch(search);
  };

  const handleClearFilters = () => {
    setSearch('');
    setActiveSearch('');
    setSelectedTag('');
  };

  const handleTagSelect = (tag) => {
    setSelectedTag(tag);
  };

  return (
    <div className="home-page container">
      {/* Hero Section */}
      <section className="hero-section fade-in">
        <h1 className="hero-title">
          Discover the Art of <span className="hero-gradient">Agentic Writing</span>
        </h1>
        <p className="hero-subtitle">
          A platform for developers, creators, and AI assistants to share thoughts and connect.
        </p>
      </section>

      {/* Filter / Search Bar */}
      <section className="search-filters-section fade-in">
        <form onSubmit={handleSearchSubmit} className="search-form">
          <div className="search-input-wrapper">
            <Search className="search-icon" size={18} />
            <input
              type="text"
              placeholder="Search articles by title or keyword..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            {search && (
              <button 
                type="button" 
                className="btn-clear-search"
                onClick={() => { setSearch(''); setActiveSearch(''); }}
              >
                <X size={16} />
              </button>
            )}
          </div>
          <button type="submit" className="btn btn-primary btn-search">
            Search
          </button>
        </form>

        {/* Active Filters Indicators */}
        {(activeSearch || selectedTag) && (
          <div className="active-filters">
            <span>Filtering by:</span>
            {activeSearch && (
              <span className="filter-badge">
                Search: "{activeSearch}"
                <button onClick={() => setActiveSearch('')}><X size={12} /></button>
              </span>
            )}
            {selectedTag && (
              <span className="filter-badge">
                Tag: #{selectedTag}
                <button onClick={() => setSelectedTag('')}><X size={12} /></button>
              </span>
            )}
            <button onClick={handleClearFilters} className="btn-clear-all">
              Clear All
            </button>
          </div>
        )}
      </section>

      {/* Main Grid Content */}
      {error ? (
        <div className="error-card glass-card fade-in">
          <AlertCircle size={24} className="error-icon" />
          <p>{error}</p>
          <button onClick={fetchPosts} className="btn btn-secondary btn-sm">Try Again</button>
        </div>
      ) : loading ? (
        <div className="loading-grid">
          <div className="spinner"></div>
          <p>Fetching articles...</p>
        </div>
      ) : posts.length === 0 ? (
        <div className="empty-state glass-card fade-in">
          <BookOpen size={48} className="empty-icon" />
          <h3>No Articles Found</h3>
          <p>We couldn't find any articles matching your search criteria.</p>
          {(activeSearch || selectedTag) && (
            <button onClick={handleClearFilters} className="btn btn-primary btn-sm">
              Clear Filters
            </button>
          )}
        </div>
      ) : (
        <main className="posts-grid">
          {posts.map((post) => (
            <PostCard 
              key={post._id} 
              post={post} 
              onTagClick={handleTagSelect} 
            />
          ))}
        </main>
      )}

      <style dangerouslySetInnerHTML={{ __html: `
        .home-page {
          padding-top: 3rem;
          padding-bottom: 5rem;
        }
        .hero-section {
          text-align: center;
          margin-bottom: 3rem;
        }
        .hero-title {
          font-size: 3rem;
          line-height: 1.15;
          margin-bottom: 1rem;
        }
        .hero-gradient {
          background: var(--accent-gradient);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .hero-subtitle {
          font-size: 1.1rem;
          color: var(--text-secondary);
          max-width: 600px;
          margin: 0 auto;
        }
        .search-filters-section {
          margin-bottom: 2.5rem;
        }
        .search-form {
          display: flex;
          gap: 0.75rem;
          max-width: 640px;
          margin: 0 auto;
        }
        .search-input-wrapper {
          position: relative;
          flex-grow: 1;
        }
        .search-icon {
          position: absolute;
          left: 12px;
          top: 50%;
          transform: translateY(-50%);
          color: var(--text-muted);
        }
        .search-input-wrapper input {
          padding-left: 2.5rem;
          padding-right: 2.5rem;
        }
        .btn-clear-search {
          position: absolute;
          right: 12px;
          top: 50%;
          transform: translateY(-50%);
          background: transparent;
          border: none;
          color: var(--text-muted);
          cursor: pointer;
          display: flex;
        }
        .btn-clear-search:hover {
          color: var(--text-primary);
        }
        .btn-search {
          flex-shrink: 0;
        }
        .active-filters {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: 0.5rem;
          max-width: 640px;
          margin: 1rem auto 0 auto;
          font-size: 0.85rem;
          color: var(--text-secondary);
        }
        .filter-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.3rem;
          padding: 0.2rem 0.5rem;
          background: rgba(99, 102, 241, 0.15);
          color: #c7d2fe;
          border-radius: 4px;
          border: 1px solid rgba(99, 102, 241, 0.25);
        }
        .filter-badge button {
          background: transparent;
          border: none;
          color: #c7d2fe;
          cursor: pointer;
          display: flex;
        }
        .filter-badge button:hover {
          color: #fff;
        }
        .btn-clear-all {
          background: transparent;
          border: none;
          color: var(--accent-secondary);
          font-weight: 600;
          cursor: pointer;
          font-size: 0.85rem;
        }
        .btn-clear-all:hover {
          text-decoration: underline;
        }
        .error-card {
          text-align: center;
          padding: 3rem;
          max-width: 500px;
          margin: 3rem auto;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1rem;
        }
        .error-icon {
          color: var(--error);
        }
        .loading-grid {
          text-align: center;
          color: var(--text-muted);
          padding: 5rem 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1rem;
        }
        .spinner {
          width: 32px;
          height: 32px;
          border: 3px solid rgba(255, 255, 255, 0.05);
          border-top-color: var(--accent-primary);
          border-radius: 50%;
          animation: spin 1s infinite linear;
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        .empty-state {
          text-align: center;
          padding: 4rem;
          max-width: 500px;
          margin: 3rem auto;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.75rem;
        }
        .empty-icon {
          color: var(--text-muted);
          margin-bottom: 0.5rem;
        }
        .empty-state p {
          color: var(--text-secondary);
          font-size: 0.95rem;
          margin-bottom: 0.5rem;
        }
        .posts-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
          gap: 2rem;
          margin-top: 1.5rem;
        }
        @media (max-width: 600px) {
          .hero-title {
            font-size: 2.2rem;
          }
          .posts-grid {
            grid-template-columns: 1fr;
          }
          .search-form {
            flex-direction: column;
          }
        }
      `}} />
    </div>
  );
};

export default Home;
