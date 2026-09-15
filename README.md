# SkillSphere – AI-Powered Learning & Collaboration Platform

SkillSphere is a full-stack MERN application where **students** can browse and enroll in
courses, track lesson progress, chat with an AI learning assistant (Gemini), build a resume,
and participate in a community feed. **Mentors** can create courses and lessons. **Admins**
manage users, courses, and posts from a dedicated admin panel.

Built as a portfolio / placement-interview project — every feature is wired to a real
MongoDB-backed REST API. There is no mock or dummy data.

---

## Tech Stack

**Frontend:** React (Vite), Tailwind CSS, React Router, Axios, Context API, React Hook Form
**Backend:** Node.js, Express.js, MongoDB Atlas, Mongoose, JWT, bcrypt
**AI:** Google Gemini API (`@google/generative-ai`)
**Deployment:** Netlify (frontend) · Render (backend) · MongoDB Atlas (database)

---

## Project Structure

```
skillsphere/
├── backend/
│   ├── config/          # MongoDB connection
│   ├── controllers/     # Business logic (one file per resource)
│   ├── middleware/       # JWT auth, role-based access, error handler
│   ├── models/           # Mongoose schemas
│   ├── routes/           # Express routers
│   ├── seed/             # Database seeder script
│   ├── utils/             # generateToken.js
│   ├── .env.example
│   ├── package.json
│   └── server.js
│
└── frontend/
    ├── src/
    │   ├── assets/
    │   ├── components/   # Navbar, Footer, ProtectedRoute, Modal, Card, etc.
    │   ├── context/       # AuthContext, ThemeContext
    │   ├── hooks/          # useDebounce
    │   ├── layouts/        # MainLayout
    │   ├── pages/           # Landing, Login, Dashboard, Courses, AI Assistant, ...
    │   ├── services/        # Axios API modules (one per resource)
    │   ├── utils/            # formatDate, constants
    │   ├── App.jsx
    │   └── main.jsx
    ├── .env.example
    ├── package.json
    └── tailwind.config.js
```

---

## Database Collections & Relationships

| Collection    | Key relationships                                                          |
|---------------|------------------------------------------------------------------------------|
| Users         | Referenced by Course.instructor, Enrollment.student, Post.author, etc.       |
| Courses       | `instructor` → User; has many Lessons (virtual populate)                     |
| Lessons       | `course` → Course                                                            |
| Enrollments   | `student` → User, `course` → Course, `completedLessons` → [Lesson]           |
| Posts         | `author` → User; has many Comments (virtual populate), `likes` → [User]      |
| Comments      | `post` → Post, `author` → User                                               |
| Notifications | `user` → User                                                                |
| Resumes       | `user` → User (1:1, unique index)                                            |
| AIChats       | `user` → User                                                                |

---

## Features

- **Auth:** Register, Login, Logout, Forgot/Reset Password, JWT, protected + role-based routes.
- **Dashboard:** Enrollment stats, progress chart, recent activity, AI learning suggestion.
- **Profile:** Edit name/bio/skills/social links.
- **Courses:** Browse/search/filter, view details, enroll, mark lessons complete, mentors create courses & lessons.
- **AI Assistant (Gemini):** Ask questions, explain code, generate roadmap, generate quiz, summarize notes — all persisted as chat history.
- **Community:** Create/edit/delete own posts, like, comment, view feed.
- **Resume Builder:** Editable sections (education, experience, skills, projects) with live preview and PDF export (jsPDF + html2canvas).
- **Notifications:** Enrollment, likes, comments, generated automatically by backend actions; bell dropdown with mark-as-read.
- **Admin Panel:** Platform stats (charts), manage users (activate/deactivate/delete), delete any course/post.

---

## Installation Guide

### Prerequisites
- Node.js 18+
- A MongoDB Atlas cluster (or local MongoDB)
- A Gemini API key from [Google AI Studio](https://aistudio.google.com/app/apikey)

### 1. Clone & install

```bash
git clone <your-repo-url> skillsphere
cd skillsphere

# Backend
cd backend
npm install
cp .env.example .env   # fill in MONGO_URI, JWT_SECRET, GEMINI_API_KEY

# Frontend
cd ../frontend
npm install
cp .env.example .env   # set VITE_API_URL=http://localhost:5000/api
```

### 2. Configure environment variables

**backend/.env**
```
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb+srv://<user>:<password>@cluster0.mongodb.net/skillsphere
JWT_SECRET=some_long_random_string
JWT_EXPIRE=7d
GEMINI_API_KEY=your_gemini_api_key
CLIENT_URL=http://localhost:5173
```

**frontend/.env**
```
VITE_API_URL=http://localhost:5000/api
```

### 3. (Optional) Seed the database

Creates an admin account, a mentor account, and one sample course with lessons:

```bash
cd backend
npm run seed
```
- Admin login: `admin@skillsphere.com` / `Admin@123`
- Mentor login: `mentor@skillsphere.com` / `Mentor@123`

### 4. Run locally

```bash
# Terminal 1
cd backend
npm run dev        # http://localhost:5000

# Terminal 2
cd frontend
npm run dev         # http://localhost:5173
```

---

## Deployment Guide

### Database — MongoDB Atlas
1. Create a free cluster at [mongodb.com/atlas](https://www.mongodb.com/atlas).
2. Create a database user and allow network access from `0.0.0.0/0` (or Render's IPs).
3. Copy the connection string into `MONGO_URI`.

### Backend — Render
1. Push the `backend/` folder to a GitHub repo (or the monorepo root, setting the Root Directory).
2. On [Render](https://render.com), create a **New Web Service** from your repo.
3. Settings:
   - Root Directory: `backend`
   - Build Command: `npm install`
   - Start Command: `npm start`
4. Add environment variables from `.env.example` (`MONGO_URI`, `JWT_SECRET`, `JWT_EXPIRE`, `GEMINI_API_KEY`, `CLIENT_URL`, `NODE_ENV=production`).
5. Deploy — note the generated URL, e.g. `https://skillsphere-api.onrender.com`.

### Frontend — Netlify
1. Push `frontend/` to GitHub.
2. On [Netlify](https://netlify.com), **Add new site → Import an existing project**.
3. Settings:
   - Base directory: `frontend`
   - Build command: `npm run build`
   - Publish directory: `frontend/dist`
4. Add environment variable: `VITE_API_URL=https://skillsphere-api.onrender.com/api`
5. Deploy. Update `CLIENT_URL` on Render to match your Netlify URL for CORS.

A `netlify.toml` and SPA redirect are already included so client-side routing works after deployment.

---

## Security Notes
- Passwords hashed with bcrypt (10 salt rounds).
- JWT auth via `Authorization: Bearer <token>` header, verified in `middleware/auth.js`.
- Role-based route guards on both backend (`authorize()` middleware) and frontend (`ProtectedRoute`).
- Centralized error handling normalizes Mongoose/cast/duplicate-key errors into clean JSON responses.
- `.env` files are gitignored; only `.env.example` templates are committed.

## License
This project is provided for educational and portfolio purposes.
