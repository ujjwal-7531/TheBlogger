# TheBlogger

A clean, modern, dark-mode blogging platform built using the MERN stack (MongoDB, Express, React, Node.js). Features standard email/password authentication, Google OAuth 2.0 login, real-time search, tag filtering, article creation, and a threaded commenting system.

---

## Features

- **Authentication**:
  - Secure credential-based login and registration with hashed passwords (`bcryptjs`).
  - One-click Google OAuth 2.0 Login integration.
- **Blog Feed**:
  - Text-search filtering by title or content keywords.
  - Category tag filtering with clean tag badges.
  - Dynamically rendered card layout with conditional banner cover images.
- **Articles & Editorial Content**:
  - Full CRUD operations: Create, read, edit, and delete posts.
  - Auto-generated article excerpts.
- **Comments Thread**:
  - Threaded comment section on each article for active user discussion.
  - Dynamic controls allowing authors to delete comments on their posts.

---

## Tech Stack

- **Frontend**: React (Vite), React Router, Lucide Icons, Google OAuth client
- **Backend**: Node.js, Express, JSON Web Tokens (JWT), Google Auth Library
- **Database**: MongoDB (Mongoose ODM)
- **Styling**: Modern, responsive dark editorial Vanilla CSS (slate-black aesthetic)

---

## Getting Started

### Prerequisites
- Node.js (v18+)
- MongoDB (local instance or MongoDB Atlas cluster)

### 1. Clone & Install Dependencies
Run the unified installer script in the root directory to install packages for the root, backend, and frontend directories:
```bash
npm run install-all
```

### 2. Configure Environment Variables

Create a `.env` file in the **`backend/`** directory:
```env
PORT=5500
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_signature_secret_key
NODE_ENV=development

# Google OAuth Credentials
GOOGLE_CLIENT_ID=your_google_client_id.apps.googleusercontent.com
```

Create a `.env` file in the **`frontend/`** directory:
```env
VITE_GOOGLE_CLIENT_ID=your_google_client_id.apps.googleusercontent.com
```

### 3. Run Locally (Development Mode)
To spin up both the Express API (port 5500) and the Vite development proxy (port 5173/5174) concurrently:
```bash
npm run dev
```

---

## Production Deployment (Render)

This repository is optimized to compile the React client into static assets and serve them directly from the Express backend, allowing you to deploy the entire MERN stack as a **single Web Service** on Render.

### Steps to Deploy:
1. Push your repository to GitHub.
2. Log into **Render** and create a new **Web Service** connected to your repository.
3. Configure the build parameters:
   - **Build Command**: `npm run install-all && npm run build`
   - **Start Command**: `npm start`
4. Set the following **Environment Variables** in Render's settings tab:
   - `NODE_ENV` = `production`
   - `MONGO_URI` = *Your MongoDB Atlas connection string*
   - `JWT_SECRET` = *Your secure JWT secret*
   - `GOOGLE_CLIENT_ID` = *Your Google OAuth client ID*
   - `VITE_GOOGLE_CLIENT_ID` = *Your Google OAuth client ID* (required during build compiling)
5. Add your live deployment URL to the **Authorized JavaScript origins** list inside the Google Cloud Console Credentials menu.
