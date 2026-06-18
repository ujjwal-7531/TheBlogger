const API_BASE = '/api';

// Helper to get request headers (attaches Authorization if token exists)
const getHeaders = (contentType = 'application/json') => {
  const token = localStorage.getItem('blogger_token');
  const headers = {};
  
  if (contentType) {
    headers['Content-Type'] = contentType;
  }
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  return headers;
};

// Generic response handler
const handleResponse = async (response) => {
  const data = await response.json().catch(() => ({}));
  
  if (!response.ok) {
    const errorMsg = data.message || `Request failed with status ${response.status}`;
    throw new Error(errorMsg);
  }
  
  return data;
};

export const api = {
  // Authentication APIs
  register: async (username, email, password) => {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ username, email, password }),
    });
    const data = await handleResponse(res);
    if (data.token) {
      localStorage.setItem('blogger_token', data.token);
    }
    return data;
  },

  login: async (loginIdentifier, password) => {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ loginIdentifier, password }),
    });
    const data = await handleResponse(res);
    if (data.token) {
      localStorage.setItem('blogger_token', data.token);
    }
    return data;
  },

  googleLogin: async (credential) => {
    const res = await fetch(`${API_BASE}/auth/google`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ credential }),
    });
    const data = await handleResponse(res);
    if (data.token) {
      localStorage.setItem('blogger_token', data.token);
    }
    return data;
  },

  logout: () => {
    localStorage.removeItem('blogger_token');
  },

  getMe: async () => {
    const token = localStorage.getItem('blogger_token');
    if (!token) return null;
    
    const res = await fetch(`${API_BASE}/auth/me`, {
      method: 'GET',
      headers: getHeaders(),
    });
    return await handleResponse(res);
  },

  // Blog Post APIs
  getPosts: async (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.search) params.append('search', filters.search);
    if (filters.tag) params.append('tag', filters.tag);
    if (filters.authorId) params.append('authorId', filters.authorId);

    const queryString = params.toString() ? `?${params.toString()}` : '';
    const res = await fetch(`${API_BASE}/posts${queryString}`, {
      method: 'GET',
      headers: getHeaders(null),
    });
    return await handleResponse(res);
  },

  getPost: async (id) => {
    const res = await fetch(`${API_BASE}/posts/${id}`, {
      method: 'GET',
      headers: getHeaders(null),
    });
    return await handleResponse(res);
  },

  createPost: async (title, content, coverImage, tags) => {
    const res = await fetch(`${API_BASE}/posts`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ title, content, coverImage, tags }),
    });
    return await handleResponse(res);
  },

  updatePost: async (id, title, content, coverImage, tags) => {
    const res = await fetch(`${API_BASE}/posts/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify({ title, content, coverImage, tags }),
    });
    return await handleResponse(res);
  },

  deletePost: async (id) => {
    const res = await fetch(`${API_BASE}/posts/${id}`, {
      method: 'DELETE',
      headers: getHeaders(null),
    });
    return await handleResponse(res);
  },

  // Comments APIs
  getComments: async (postId) => {
    const res = await fetch(`${API_BASE}/comments/${postId}`, {
      method: 'GET',
      headers: getHeaders(null),
    });
    return await handleResponse(res);
  },

  addComment: async (postId, content) => {
    const res = await fetch(`${API_BASE}/comments/${postId}`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ content }),
    });
    return await handleResponse(res);
  },

  deleteComment: async (id) => {
    const res = await fetch(`${API_BASE}/comments/${id}`, {
      method: 'DELETE',
      headers: getHeaders(null),
    });
    return await handleResponse(res);
  },
};
