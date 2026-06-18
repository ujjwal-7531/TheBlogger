import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.jsx';
import Navbar from './components/Navbar.jsx';
import Home from './pages/Home.jsx';
import PostDetail from './pages/PostDetail.jsx';
import Editor from './pages/Editor.jsx';
import Auth from './pages/Auth.jsx';

import { GoogleOAuthProvider } from '@react-oauth/google';

const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || 'temp_google_client_id';

function App() {
  return (
    <GoogleOAuthProvider clientId={googleClientId}>
      <AuthProvider>
        <Router>
        <div className="app-layout">
          <Navbar />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/posts/:id" element={<PostDetail />} />
              <Route path="/write" element={<Editor />} />
              <Route path="/edit/:id" element={<Editor />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
          
          <footer className="app-footer">
            <div className="container">
              <p>&copy; {new Date().getFullYear()} TheBlogger. All rights reserved.</p>
            </div>
          </footer>
        </div>

        <style dangerouslySetInnerHTML={{ __html: `
          .app-layout {
            display: flex;
            flex-direction: column;
            min-height: 100vh;
          }
          .main-content {
            flex-grow: 1;
          }
          .app-footer {
            border-top: 1px solid #21262d;
            background: #0d1117;
            padding: 1.5rem 0;
            text-align: center;
            font-size: 0.85rem;
            color: var(--text-muted);
          }
        `}} />
      </Router>
    </AuthProvider>
  </GoogleOAuthProvider>
  );
}

export default App;
