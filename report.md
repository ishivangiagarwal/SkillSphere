# SkillSphere – Complete Project Audit & Viva Examination Report

---

## 1. Project Title

* **Project Name:** SkillSphere
* **Tagline:** AI-Powered Learning & Collaboration Platform
* **One-Line Description:** A full-stack MERN platform where students learn courses, track progress, chat with an AI tutor (Google Gemini), manage projects/tasks/notes, and build resumes, while mentors publish content and admins oversee platform operations.

---

## 2. Project Overview

### What the Project Is
SkillSphere is a modern, responsive, full-stack web application designed for interactive computer science and technical learning. It combines structured learning (courses, modules, video resources), artificial intelligence (Gemini-powered code explanations, roadmaps, and quizzes), personal developer productivity tools (projects showcase, task kanban board, study notes), career preparation (live resume builder with PDF export), and community engagement (posts, likes, comments).

### What Problem It Solves
1. **Scattered Learning Resources:** Students usually learn on YouTube, practice code somewhere else, manage tasks in Trello, and build resumes on external builders. SkillSphere unifies all these into a single workspace.
2. **Lack of Instant Tutoring:** When students get stuck on coding concepts or need custom study roadmaps, they either have to search forums or wait for a mentor. SkillSphere integrates Google Gemini 1.5 Flash to give instant, tailored explanations and custom quizzes.
3. **Role Segregation:** Most learning portals don't clearly distinguish students, mentors, and administrators. SkillSphere provides dedicated, secure dashboards for all three user types with distinct privileges.

### Why the Project Was Created
SkillSphere was developed as a real-world, portfolio-grade placement project demonstrating end-to-end full-stack engineering proficiency:
- Designing modular RESTful micro-architectures with Express.js and Node.js.
- Implementing NoSQL document modeling with Mongoose (virtual populates, compound unique indexes, cascade cleanups).
- Secure authentication using JSON Web Tokens (JWT) and Bcrypt password hashing.
- State management, context encapsulation, custom hooks, and dynamic layouts in React 18 with Vite.
- Real integration with third-party generative AI models (`@google/generative-ai`).
- Modern UI/UX design with Tailwind CSS, dark/light theme switching, and client-side PDF rendering.

### Main Purpose of the Application
To provide an interactive ecosystem where:
- **Students** can discover skills, study step-by-step curriculum lessons, test their knowledge with AI, create resumes, and track their productivity.
- **Mentors** can create and update curricula, publish lessons, monitor student enrollment metrics, and track average student completion rates.
- **Admins** can monitor platform-wide metrics (users, courses, posts, enrollments), approve mentors, deactivate suspicious accounts, and moderate content.

### Target Users
1. **Students & Aspiring Developers:** Individuals seeking structured roadmaps, hands-on learning, and career-building tools.
2. **Educators & Mentors:** Instructors creating curricula, publishing lessons, and monitoring student learning curves.
3. **Platform Administrators:** Managers maintaining community safety, managing user roles, and analyzing platform activity.

---

## 3. Objectives

* **Role-Based Access Control:** Build distinct authentication and authorization flows for Students, Mentors, and Administrators.
* **Structured Course Management:** Allow mentors to author rich course syllabi with modules, durations, and content, while enabling students to mark lessons complete and calculate real-time completion percentages.
* **AI-Assisted Learning:** Integrate Google Gemini AI to assist learners with code explanations, week-by-week learning roadmaps, automatic quiz generation, and notes summarization.
* **Productivity Workspace:** Provide students with private project showcases, a 3-stage Kanban task board (To Do, In Progress, Completed), and searchable markdown-friendly study notes.
* **Community Networking:** Implement an interactive feed where users post updates, discuss programming topics, like posts, and leave comments with real-time notification alerts.
* **Career Readiness:** Build an interactive, live-preview Resume Builder supporting dynamic section creation (education, experience, projects, skills) and one-click PDF generation.
* **Dark & Light Mode UI:** Ensure a comfortable user experience across light and dark environments with persistent theme state.

---

## 4. Technologies Used

| Technology | Purpose in SkillSphere |
| :--- | :--- |
| **React 18** | Frontend user interface library; uses functional components, custom hooks, and the Virtual DOM for snappy UI updates. |
| **Vite** | Modern, fast frontend build tool and local development server replacing older Create-React-App setups. |
| **Tailwind CSS 3** | Utility-first CSS framework used for responsive styling, dark mode classes, glassmorphism, animations, and color palettes. |
| **Node.js** | Server-side JavaScript runtime environment that executes the Express backend application. |
| **Express.js 4** | Backend web application framework used to build RESTful API endpoints, middleware pipelines, and request routing. |
| **MongoDB Atlas** | Cloud-hosted NoSQL document database used to store persistent records for users, courses, lessons, posts, comments, etc. |
| **Mongoose 8** | Object Data Modeling (ODM) library for MongoDB that provides schema validation, middleware hooks, and model virtuals. |
| **JSON Web Tokens (JWT)** | Stateless token-based user authentication mechanism passed in HTTP `Authorization: Bearer <token>` headers. |
| **Bcryptjs** | Cryptographic library used on the server to hash and salt user passwords before storing them in MongoDB. |
| **Google Gemini API (`@google/generative-ai`)** | Large language model integration (`gemini-1.5-flash`) providing intelligent chat, roadmap generation, and quiz creation. |
| **Axios** | Promise-based HTTP client for making API requests with request/response interceptors for auth tokens and 401 handling. |
| **React Router Dom 6** | Client-side routing library handling SPA URL navigation, nested route layouts, and protected route guards. |
| **React Hook Form** | High-performance form state management and input validation with minimal re-renders. |
| **Recharts** | Composable charting library used for data visualization (Pie charts for student progress, Bar charts for admin & mentor analytics). |
| **Lucide React** | Modern, lightweight SVG icon package used throughout the navigation, stat cards, and action buttons. |
| **jsPDF & html2canvas** | Client-side libraries used in the Resume Builder to capture DOM elements as canvases and render them into downloadable A4 PDF documents. |
| **React Hot Toast** | Lightweight, animated toast notification provider for success, warning, and error alerts across user actions. |

---

## 5. Project Features

### Feature 1: Authentication & Authorization (JWT + Role Guards)
* **What it does:** Allows users to register as a student or mentor, log in securely, view their session profile, request password reset tokens, and submit a new password.
* **How user uses it:** User fills out registration or login forms. Upon success, JWT token and user info are saved to `localStorage`, granting access to private routes.
* **Implementing files:** `backend/controllers/authController.js`, `backend/middleware/auth.js`, `backend/routes/authRoutes.js`, `frontend/src/context/AuthContext.jsx`, `frontend/src/pages/Login.jsx`, `frontend/src/pages/Register.jsx`.
* **Important logic:** Passwords are hashed using bcrypt with 10 salt rounds before saving via a Mongoose `pre('save')` hook. The server issues a signed JWT containing user ID and role. The frontend Axios interceptor automatically attaches this token to all subsequent API requests.

### Feature 2: Personalized Student Dashboard
* **What it does:** Displays enrollment counts, completed course tallies, overall average progress percentage, active courses with quick-resume links, category breakdown charts, and an AI-driven learning suggestion box.
* **How user uses it:** Automatically shown to students upon logging in or navigating to `/dashboard`.
* **Implementing files:** `frontend/src/pages/StudentDashboard.jsx`, `backend/controllers/userController.js` (`getDashboardData`).
* **Important logic:** Aggregates student enrollments in MongoDB, computes `avgProgress = sum(progress) / totalCourses`, and renders interactive charts via Recharts (`PieChart`, `BarChart`).

### Feature 3: Course Catalog & Interactive Lesson Viewer
* **What it does:** Allows students to search and filter courses by title, category, and difficulty level; view syllabus modules; enroll in courses; and mark individual lessons complete with real-time progress updates.
* **How user uses it:** Navigate to `/courses`, click on a course card to view details, click "Enroll Now", and click on modules to read lessons and check them off.
* **Implementing files:** `backend/controllers/courseController.js`, `backend/controllers/enrollmentController.js`, `frontend/src/pages/Courses.jsx`, `frontend/src/pages/CourseDetail.jsx`.
* **Important logic:** Lessons are stored in a separate collection referencing the `Course` ID and exposed on courses via Mongoose virtual populate. When a student toggles a lesson, `enrollment.completedLessons` updates, and `enrollment.progress = Math.round((completed / total) * 100)` is calculated automatically.

### Feature 4: Mentor Management & Course Authoring
* **What it does:** Allows approved mentors to create new courses with metadata, durations, and tags; publish syllabus lessons; track student enrollment counts; and inspect each enrolled student's individual progress.
* **How user uses it:** Mentors access `/mentor/dashboard`, click "Create Course" to open the creation modal, and click "Students" on any course to open the progress breakdown modal.
* **Implementing files:** `backend/controllers/mentorController.js`, `backend/controllers/courseController.js`, `frontend/src/pages/MentorDashboard.jsx`, `frontend/src/pages/CreateCourse.jsx`.
* **Important logic:** Uses Express middleware `authorize('mentor', 'admin')` to ensure students cannot create or edit courses. Unique student counts are computed using `new Set(enrollments.map(...)).size`.

### Feature 5: AI Learning Assistant (Google Gemini)
* **What it does:** Provides an interactive chat interface with specialized modes: general Q&A, code explanation, week-by-week learning roadmap generation, multiple-choice quiz creation, and notes summarization. Chat entries are saved in MongoDB.
* **How user uses it:** Navigate to `/ai-assistant`, select a mode tab, enter a query or code snippet, and receive structured Markdown responses from Gemini.
* **Implementing files:** `backend/controllers/aiController.js`, `backend/models/AIChat.js`, `frontend/src/pages/AIAssistant.jsx`, `frontend/src/services/aiService.js`.
* **Important logic:** `aiController.js` injects customized system prompts based on the selected mode (e.g. "Generate a 5-question multiple choice quiz..."), invokes `model.generateContent(fullPrompt)`, and saves both the prompt and answer in the `AIChat` MongoDB collection for persistent history.

### Feature 6: Community Feed & Social Engagement
* **What it does:** Allows users to share posts, edit or delete their own posts, toggle post likes, and write comments.
* **How user uses it:** Navigate to `/community`, write a post in the top box, like other posts, or click comments to expand discussions.
* **Implementing files:** `backend/controllers/postController.js`, `backend/models/Post.js`, `backend/models/Comment.js`, `frontend/src/pages/Community.jsx`.
* **Important logic:** Liking a post toggles the user's ObjectId in `post.likes`. When another user likes or comments on a post, the backend automatically creates a notification document for the post's author.

### Feature 7: In-App Notification System
* **What it does:** Displays unread notification badges in the navigation bar; lists alerts for course enrollments, post likes, and comments; and allows marking individual or all notifications as read.
* **How user uses it:** Click the bell icon in the top navbar to view the dropdown; click an item to navigate to its related resource.
* **Implementing files:** `backend/controllers/notificationController.js`, `backend/models/Notification.js`, `frontend/src/components/NotificationBell.jsx`.
* **Important logic:** The bell component polls `getNotifications()` every 30 seconds and maintains an outside-click listener via React `useRef` to auto-dismiss the dropdown.

### Feature 8: Resume Builder & PDF Export
* **What it does:** An interactive form allowing students to input contact details, summary, education history, work experience, technical skills, and projects, with a live A4 paper preview and one-click PDF generation.
* **How user uses it:** Navigate to `/resume-builder`, fill in details, click "Save Resume" (persisted to MongoDB), and click "Download PDF".
* **Implementing files:** `backend/controllers/resumeController.js`, `backend/models/Resume.js`, `frontend/src/pages/ResumeBuilder.jsx`.
* **Important logic:** Uses `react-hook-form`'s `useFieldArray` for dynamic repeatable fields (adding/removing schools or jobs). PDF export uses `html2canvas` to render the DOM node at 2x scale and passes the image data into `jsPDF` configured for A4 page dimensions.

### Feature 9: Project Showcase, Task Kanban & Study Notes
* **What it does:** Private productivity utilities for students:
  - **Projects:** Card-based showcase of student web projects with live demo and GitHub repository links.
  - **Tasks:** 3-column Kanban board (To Do, In Progress, Completed) with priority tags and move buttons.
  - **Notes:** Subject-categorized study notes with modal preview, search filter, and timestamps.
* **How user uses it:** Access `/projects`, `/tasks`, and `/notes` from the student sidebar.
* **Implementing files:** `frontend/src/pages/Projects.jsx`, `frontend/src/pages/Tasks.jsx`, `frontend/src/pages/Notes.jsx`.
* **Important logic:** Pre-loaded with realistic default items and persisted in client-side `localStorage` (`skillsphere_projects`, `skillsphere_tasks`, `skillsphere_notes`), allowing instant client operations.

### Feature 10: Platform Admin Dashboard
* **What it does:** Gives administrators a command center to view platform stats, search and filter users, activate/deactivate accounts, delete users (with cascading enrollment removal), approve mentors, and delete inappropriate courses or posts.
* **How user uses it:** Log in with admin credentials, navigate to `/admin`, switch between Overview, Users, Courses, Mentors, and Analytics tabs.
* **Implementing files:** `backend/controllers/adminController.js`, `backend/routes/adminRoutes.js`, `frontend/src/pages/AdminDashboard.jsx`.
* **Important logic:** Protected by `authorize('admin')`. Provides aggregated stats via MongoDB `$group` and `Promise.all([User.countDocuments(), ...])`.

---

## 6. Project Folder Structure

Below is the verified, exact directory layout of the SkillSphere codebase:

```text
skillsphere/
├── README.md                          # Project documentation and setup guide
├── package-lock.json                  # Root lockfile (optional workspace helper)
│
├── backend/                           # Node.js & Express REST API
│   ├── .env                           # Local environment variables (PORT, MONGO_URI, JWT_SECRET, etc.)
│   ├── .env.example                   # Template environment configuration
│   ├── .gitignore                     # Git exclusions (node_modules, .env)
│   ├── package.json                   # Backend dependencies and scripts
│   ├── package-lock.json              # Exact backend dependency tree
│   ├── render.yaml                    # Render.com cloud deployment configuration
│   ├── server.js                      # Main Express application entry point
│   ├── config/
│   │   └── db.js                      # Mongoose connection to MongoDB Atlas
│   ├── controllers/                   # Core business logic (one controller per resource)
│   │   ├── adminController.js         # Admin statistics, user moderation, mentor approval
│   │   ├── aiController.js            # Google Gemini AI chat prompts and history
│   │   ├── authController.js          # Registration, login, password reset
│   │   ├── courseController.js        # Course catalog CRUD and lesson management
│   │   ├── enrollmentController.js    # Course enrollment and lesson completion tracking
│   │   ├── mentorController.js        # Mentor dashboard metrics and student progress
│   │   ├── notificationController.js  # User notifications and read-state management
│   │   ├── postController.js          # Community posts, likes, and comments
│   │   ├── resumeController.js        # User resume retrieval and upsert
│   │   └── userController.js          # User profiles and student dashboard summaries
│   ├── middleware/                    # Reusable Express request middlewares
│   │   ├── auth.js                    # JWT verification (protect) & role checks (authorize)
│   │   └── errorHandler.js            # 404 route handler and centralized error normalizer
│   ├── models/                        # Mongoose data schemas and validation models
│   │   ├── AIChat.js                  # AI chat prompts, responses, and modes
│   │   ├── Comment.js                 # Comments on community posts
│   │   ├── Course.js                  # Course metadata, level, category, and instructor ref
│   │   ├── Enrollment.js              # Student-course link with completed lessons array
│   │   ├── Lesson.js                  # Individual lessons belonging to courses
│   │   ├── Notification.js            # User notification alerts
│   │   ├── Post.js                    # Community feed posts and like references
│   │   ├── Resume.js                  # Complete resume schema (education, experience, etc.)
│   │   └── User.js                    # User accounts with bcrypt hashing and roles
│   ├── routes/                        # Express API route declarations
│   │   ├── adminRoutes.js             # /api/admin endpoints
│   │   ├── aiRoutes.js                # /api/ai endpoints
│   │   ├── authRoutes.js              # /api/auth endpoints
│   │   ├── courseRoutes.js            # /api/courses endpoints
│   │   ├── enrollmentRoutes.js        # /api/enrollments endpoints
│   │   ├── mentorRoutes.js            # /api/mentor endpoints
│   │   ├── notificationRoutes.js      # /api/notifications endpoints
│   │   ├── postRoutes.js              # /api/posts endpoints
│   │   ├── resumeRoutes.js            # /api/resumes endpoints
│   │   └── userRoutes.js              # /api/users endpoints
│   ├── seed/
│   │   └── seeder.js                  # Database seeder script (admin, mentor, 18+ rich courses)
│   └── utils/
│       └── generateToken.js           # Helper to sign JWTs with expiration
│
└── frontend/                          # React + Vite client-side single page app
    ├── .env                           # Local frontend environment (VITE_API_URL)
    ├── .env.example                   # Template frontend environment
    ├── .gitignore                     # Git exclusions (dist, node_modules)
    ├── index.html                     # HTML5 shell file with root div and Inter font
    ├── netlify.toml                   # Netlify redirect configuration for client routing
    ├── package.json                   # Frontend dependencies and build scripts
    ├── package-lock.json              # Exact frontend dependency tree
    ├── postcss.config.js              # PostCSS plugins (Tailwind CSS, Autoprefixer)
    ├── tailwind.config.js             # Tailwind theme colors, keyframes, and dark mode setup
    ├── vite.config.js                 # Vite bundler configuration with React plugin
    ├── public/
    │   ├── _redirects                 # SPA fallback rule (/* -> /index.html 200)
    │   └── favicon.svg                # SkillSphere brand icon
    └── src/
        ├── App.jsx                    # Root route mapping, route guards, and layout binding
        ├── index.css                  # Global Tailwind imports and reusable CSS component classes
        ├── main.jsx                   # React root mount with StrictMode and Context Providers
        ├── assets/                    # Asset directory (.gitkeep)
        ├── components/                # Reusable UI component building blocks
        │   ├── Badge.jsx              # Status and role badge tag pill
        │   ├── Card.jsx               # Base container card with light/dark borders
        │   ├── EmptyState.jsx         # Clean placeholder for empty lists and searches
        │   ├── Footer.jsx             # Platform footer with platform & account links
        │   ├── Loader.jsx             # Animated loading spinner (inline and full-screen)
        │   ├── Modal.jsx              # Backdrop dialog modal with click-outside dismissal
        │   ├── Navbar.jsx             # Top public navigation bar with theme toggle
        │   ├── NotificationBell.jsx   # Interactive notification bell with unread counter
        │   ├── ProgressBar.jsx        # Gradient progress bar with percentage indicator
        │   ├── ProtectedRoute.jsx     # Route guard enforcing authentication and roles
        │   └── StatCard.jsx           # Metric display card with icon, value, and subtitle
        ├── context/                   # Global React Context state providers
        │   ├── AuthContext.jsx        # User login state, token persistence, and auth handlers
        │   └── ThemeContext.jsx       # Light/Dark mode state synced to html class & localStorage
        ├── hooks/
        │   └── useDebounce.js         # Custom hook debouncing fast input (e.g. search queries)
        ├── layouts/                   # Nested route structural layouts
        │   ├── MainLayout.jsx         # Public layout: Navbar at top, Outlet in middle, Footer
        │   └── SidebarLayout.jsx      # Authenticated layout: Responsive collapsible sidebar
        ├── pages/                     # Full-page view components
        │   ├── AIAssistant.jsx        # Dual-pane Gemini AI interface with mode tabs
        │   ├── AdminDashboard.jsx     # Full-featured tabbed admin management center
        │   ├── AdminPanel.jsx         # Compact / alternative admin management view
        │   ├── Community.jsx          # Public feed with post creation, likes, and comments
        │   ├── CourseDetail.jsx       # Course overview, lesson reader, progress tracker
        │   ├── Courses.jsx            # Course catalog with search and multi-criteria filters
        │   ├── CreateCourse.jsx       # Mentor form for authoring new courses
        │   ├── Dashboard.jsx          # Base student dashboard layout
        │   ├── ForgotPassword.jsx     # Password reset token generation screen
        │   ├── Landing.jsx            # Modern homepage with hero, popular courses, and CTA
        │   ├── Login.jsx              # Split-screen graphic login portal
        │   ├── MentorDashboard.jsx    # Mentor course analytics and student progress tracking
        │   ├── NotFound.jsx           # Clean 404 error page with return navigation
        │   ├── Notes.jsx              # Study notes manager with search and preview modal
        │   ├── Profile.jsx            # User profile editor and portfolio link showcase
        │   ├── Projects.jsx           # Personal projects showcase cards with demo links
        │   ├── Register.jsx           # User registration form with role selection
        │   ├── ResetPassword.jsx      # Form to submit new password using reset token
        │   ├── ResumeBuilder.jsx      # Dynamic resume authoring tool with live PDF export
        │   ├── StudentDashboard.jsx   # Complete, feature-rich student learning analytics page
        │   └── Tasks.jsx              # 3-column interactive Kanban task manager
        ├── services/                  # Axios service modules communicating with backend
        │   ├── adminService.js        # Admin API calls
        │   ├── aiService.js           # Gemini AI chat API calls
        │   ├── api.js                 # Configured Axios instance with auth interceptors
        │   ├── authService.js         # Auth endpoints (login, register, me, passwords)
        │   ├── courseService.js       # Course and lesson endpoints
        │   ├── enrollmentService.js   # Enrollment and lesson completion endpoints
        │   ├── mentorService.js       # Mentor dashboard & course student endpoints
        │   ├── notificationService.js # Notification list and read-state endpoints
        │   ├── postService.js         # Post, like, and comment endpoints
        │   ├── resumeService.js       # Resume get and save endpoints
        │   └── userService.js         # User profile and dashboard summary endpoints
        └── utils/
            ├── constants.js           # Course categories, levels, and user roles
            └── formatDate.js          # Date and time formatting helpers

```

---

## 7. File-by-File Explanation

### Backend Files

#### `backend/server.js`
* **Purpose:** Entry point of the Express backend server.
* **What it contains:** Configures environment variables via `dotenv`, initializes MongoDB connection, mounts middlewares (`cors`, `express.json`, `express.urlencoded`, `morgan`), mounts all route handlers under `/api/*`, and defines 404 and error-handling middleware.
* **Important components/functions:**
  - `connectDB()`: Connects to MongoDB on startup.
  - `app.use(cors(...))`: Allows requests from the client domain (`CLIENT_URL`).
  - Route mounts: `/api/auth`, `/api/users`, `/api/courses`, `/api/enrollments`, `/api/posts`, `/api/notifications`, `/api/resumes`, `/api/ai`, `/api/admin`, `/api/mentor`.
  - `app.listen(PORT)`: Binds server to port (default 5000).
* **How it connects:** Imports all route files from `./routes` and connects to `./config/db.js`.

#### `backend/config/db.js`
* **Purpose:** Manages the connection to the MongoDB Atlas database.
* **What it contains:** An asynchronous function `connectDB` using `mongoose.connect()`.
* **Important code:** Catches connection errors and calls `process.exit(1)` if MongoDB fails to connect, preventing the server from running in a broken state.
* **How it connects:** Called directly by `server.js` at startup.

#### `backend/utils/generateToken.js`
* **Purpose:** Issues signed JSON Web Tokens for authenticated sessions.
* **What it contains:** A single function `generateToken(id, role)` returning `jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: '7d' })`.
* **How it connects:** Imported by `authController.js` during user registration, login, and password reset.

#### `backend/middleware/auth.js`
* **Purpose:** Protects private endpoints and enforces role-based access control.
* **Important functions:**
  - `protect`: Extracts the token from `req.headers.authorization` (`Bearer <token>`), verifies it with `jwt.verify`, finds the user by ID in MongoDB (excluding the password), and attaches the user document to `req.user`.
  - `authorize(...roles)`: Higher-order middleware checking if `roles.includes(req.user.role)`. If not, responds with HTTP 403 Forbidden.
* **How it connects:** Used across all protected route files (`courseRoutes.js`, `adminRoutes.js`, `mentorRoutes.js`, etc.).

#### `backend/middleware/errorHandler.js`
* **Purpose:** Catches unmatched routes and normalizes backend errors into structured JSON responses.
* **Important functions:**
  - `notFound`: Generates a clean 404 error when a requested URL is not found.
  - `errorHandler`: Normalizes Mongoose errors (invalid ObjectIds via `CastError`, unique constraint violations via `code === 11000`, and validation errors via `ValidationError`) and sends `{ success: false, message }`.
* **How it connects:** Bound at the very bottom of `server.js`.

#### `backend/models/User.js`
* **Purpose:** Mongoose schema defining user credentials, roles, profile info, and password hashing.
* **Important fields:** `name`, `email` (unique), `password` (`select: false`), `role` (`student`, `mentor`, `admin`), `avatar`, `bio`, `skills`, `socialLinks`, `isActive`.
* **Methods & hooks:**
  - `userSchema.pre('save')`: Hashes modified passwords using `bcrypt.genSalt(10)` and `bcrypt.hash()`.
  - `matchPassword(enteredPassword)`: Compares candidate passwords using `bcrypt.compare()`.
* **How it connects:** Referenced by nearly all controllers and models (`Course.instructor`, `Post.author`, `Enrollment.student`).

#### `backend/models/Course.js`
* **Purpose:** Defines the data schema for courses.
* **Important fields:** `title`, `description`, `category`, `level`, `thumbnail`, `instructor` (ObjectId referencing User), `tags`, `duration`, `isPublished`.
* **Virtuals:** `courseSchema.virtual('lessons', { ref: 'Lesson', localField: '_id', foreignField: 'course' })` allowing automatic population of related lessons without storing arrays of lesson IDs in the course document.
* **How it connects:** Referenced by `Lesson.js`, `Enrollment.js`, and used in `courseController.js`.

#### `backend/models/Lesson.js`
* **Purpose:** Stores individual modules and lessons belonging to a specific course.
* **Important fields:** `course` (ref to Course), `title`, `content`, `videoUrl`, `order`, `duration` (in minutes).
* **How it connects:** Populated on courses via virtual populate in `courseController.js` and `mentorController.js`.

#### `backend/models/Enrollment.js`
* **Purpose:** Tracks a student's enrollment in a course and their lesson completion progress.
* **Important fields:** `student` (ref to User), `course` (ref to Course), `completedLessons` (array of Lesson ObjectIds), `progress` (0-100 percentage), `status` (`in-progress` or `completed`), `enrolledAt`.
* **Compound Index:** `enrollmentSchema.index({ student: 1, course: 1 }, { unique: true })` prevents duplicate enrollments.
* **How it connects:** Used in `enrollmentController.js`, `userController.js`, and `mentorController.js`.

#### `backend/models/Post.js` & `backend/models/Comment.js`
* **Purpose:** Schemas powering the Community Feed.
* **Post schema:** `author` (ref to User), `content`, `image`, `likes` (array of User ObjectIds), virtual populate for `comments`.
* **Comment schema:** `post` (ref to Post), `author` (ref to User), `text`.
* **How it connects:** Used in `postController.js` to create feed discussions.

#### `backend/models/Notification.js`
* **Purpose:** Stores user alerts triggered by actions across the platform.
* **Important fields:** `user` (recipient), `type` (`enrollment`, `new-like`, `new-comment`, `system`), `message`, `link`, `isRead`.
* **How it connects:** Created automatically by `enrollmentController.js` and `postController.js`; queried by `notificationController.js`.

#### `backend/models/Resume.js`
* **Purpose:** Stores complete developer resume details.
* **Important fields:** `user` (unique ref to User), `fullName`, `email`, `phone`, `address`, `summary`, `education` array, `experience` array, `skills` array, `projects` array.
* **How it connects:** Queried and updated via upsert in `resumeController.js`.

#### `backend/models/AIChat.js`
* **Purpose:** Persists AI interaction history.
* **Important fields:** `user` (ref to User), `mode` (`ask`, `explain-code`, `roadmap`, `quiz`, `summarize`), `prompt`, `response`.
* **How it connects:** Managed by `aiController.js`.

#### `backend/controllers/authController.js`
* **Purpose:** Implements user registration, login, token issuing, and password reset flows.
* **Important functions:**
  - `registerUser`: Validates fields, checks for duplicate email, creates User, and returns JWT.
  - `loginUser`: Verifies email and password using `matchPassword()`, checks `user.isActive`, and returns JWT.
  - `getMe`: Returns current logged-in user details.
  - `forgotPassword`: Generates random crypto token, hashes it via SHA-256, stores in `user.resetPasswordToken` with 30-minute expiry, and returns token.
  - `resetPassword`: Finds user by hashed token, sets new password, and saves (triggering bcrypt pre-save).

#### `backend/controllers/courseController.js`
* **Purpose:** Manages course querying and mentor course authoring.
* **Important functions:**
  - `getCourses`: Returns published courses with optional regex search by title, category, and level filters.
  - `getCourseById`: Returns single course populated with instructor details and sorted lessons.
  - `createCourse`: Creates a new course authored by `req.user._id`.
  - `updateCourse` & `deleteCourse`: Ensures only the course instructor or an admin can modify/delete. Deletion cascades to lessons and enrollments.
  - `addLesson`: Appends a lesson to a course.

#### `backend/controllers/enrollmentController.js`
* **Purpose:** Handles student course enrollments and progress calculation.
* **Important functions:**
  - `enrollInCourse`: Creates enrollment record and generates an enrollment notification.
  - `getMyEnrollments`: Retrieves all courses enrolled by `req.user._id`.
  - `markLessonComplete`: Toggles a lesson in `completedLessons`, recalculates percentage (`progress = Math.round((completed / total) * 100)`), and marks status as `completed` when reaching 100%.

#### `backend/controllers/aiController.js`
* **Purpose:** Interfaces with Google Gemini 1.5 Flash.
* **Important functions:**
  - `buildPrompt(mode, prompt)`: Wraps user input in specialized instructions for roadmaps, code explanations, or quizzes.
  - `chatWithAI`: Calls `model.generateContent(fullPrompt)`, extracts text, and saves to `AIChat`.
  - `getChatHistory`: Fetches the user's past 50 AI queries.
  - `deleteChatEntry`: Deletes a specific chat history record.

#### `backend/controllers/adminController.js`
* **Purpose:** Powers platform administration.
* **Important functions:**
  - `getStats`: Runs parallel counts (`User`, `Course`, `Post`, `Enrollment`) and aggregations for courses by category.
  - `getAllUsers`, `updateUser`, `deleteUser`: Full user management with account deactivation toggles.
  - `adminDeleteCourse`, `adminDeletePost`: Moderation overrides.
  - `getMentors`, `approveMentor`: Manages mentor onboarding and active status.

#### `backend/controllers/mentorController.js`
* **Purpose:** Provides mentor-specific analytics.
* **Important functions:**
  - `getMentorDashboard`: Computes total courses, unique students taught, and average completion across courses.
  - `getCourseStudents`: Returns all enrolled students for a given course with individual progress percentages.
  - `getMentorCourses`: Lists all courses authored by the mentor with lesson and enrollment counts.

#### `backend/seed/seeder.js`
* **Purpose:** Database bootstrap script (`npm run seed`).
* **What it contains:** Seeds default admin (`admin@skillsphere.com` / `Admin@123`), default mentor (`mentor@skillsphere.com` / `Mentor@123`), and extensive courses with real coding curriculum lessons across Web Development, Data Science, DevOps, Mobile, AI/ML, and Programming Basics.

---

### Frontend Files

#### `frontend/src/main.jsx`
* **Purpose:** Client entry point.
* **What it contains:** Mounts React into `#root` DOM element wrapped in `StrictMode`, `BrowserRouter`, `ThemeProvider`, and `AuthProvider`.

#### `frontend/src/App.jsx`
* **Purpose:** Master route table and layout controller.
* **What it contains:**
  - `DynamicLayout`: Renders `SidebarLayout` for authenticated users and `MainLayout` for guests.
  - `DashboardRedirect`: Directs admins to `/admin`, mentors to `/mentor/dashboard`, and students to `/student/dashboard`.
  - Nested routes with `ProtectedRoute` guards specifying `allowedRoles`.

#### `frontend/src/context/AuthContext.jsx`
* **Purpose:** Global state management for user authentication.
* **What it contains:** `user`, `loading`, `login()`, `register()`, `logout()`, `updateUserInContext()`.
* **Important logic:** On initial mount, reads `skillsphere_token` and `skillsphere_user` from `localStorage`, and verifies token validity with `authService.getMe()`.

#### `frontend/src/context/ThemeContext.jsx`
* **Purpose:** Manages light/dark mode.
* **What it contains:** Toggles the `dark` class on `document.documentElement` and stores the selection in `localStorage` under `skillsphere_theme`.

#### `frontend/src/hooks/useDebounce.js`
* **Purpose:** Prevents excessive API requests while typing.
* **What it contains:** Custom hook delaying value updates until a specified timeout (default 400ms) has elapsed without new changes.

#### `frontend/src/layouts/MainLayout.jsx`
* **Purpose:** Public wrapper with `Navbar` at top, `<Outlet />` for page content, and `Footer` at bottom.

#### `frontend/src/layouts/SidebarLayout.jsx`
* **Purpose:** Authenticated dashboard shell.
* **What it contains:** Sticky left navigation drawer with role-based links (Admin gets Dashboard/Courses/Community/AI/Profile; Student gets additional Projects/Tasks/Notes/Resume), responsive mobile overlay drawer, top bar with search placeholder, theme toggle, and notification bell.

#### `frontend/src/components/ProtectedRoute.jsx`
* **Purpose:** Route gatekeeper.
* **What it contains:** Checks `loading`, redirects unauthenticated users to `/login`, and checks `allowedRoles` to redirect unauthorized users to `/dashboard`.

#### `frontend/src/components/NotificationBell.jsx`
* **Purpose:** Top-bar interactive bell.
* **What it contains:** Unread badge pill, automatic 30-second polling, mark-as-read buttons, and outside-click dismiss listener via `useRef`.

#### `frontend/src/components/ProgressBar.jsx` & `StatCard.jsx` & `Badge.jsx` & `Modal.jsx` & `EmptyState.jsx`
* **Purpose:** Reusable atomic UI components ensuring design consistency across all pages.

#### `frontend/src/services/api.js`
* **Purpose:** Centralized Axios instance.
* **What it contains:** Base URL configuration (`import.meta.env.VITE_API_URL`), request interceptor adding JWT Bearer tokens, and response interceptor catching 401 Unauthorized errors to clear local storage and redirect to `/login`.

#### `frontend/src/pages/Landing.jsx`
* **Purpose:** Public landing page.
* **What it contains:** Hero section with course search bar, category pill filters, popular courses grid fetched from the backend, platform feature highlights, and call-to-action button.

#### `frontend/src/pages/Login.jsx` & `Register.jsx`
* **Purpose:** User authentication views.
* **What it contains:** High-converting split-screen layout with left-hand graphic branding card and right-hand form with password visibility toggle, role selector, and React Hook Form validation.

#### `frontend/src/pages/StudentDashboard.jsx`
* **Purpose:** Student hub.
* **What it contains:** Gradient greeting banner, quick statistics, resume cards for in-progress courses, course category breakdown bar chart, completion pie chart, recent notifications list, and Gemini AI suggestion box.

#### `frontend/src/pages/MentorDashboard.jsx`
* **Purpose:** Mentor management console.
* **What it contains:** Overview tab with analytics chart, My Courses tab with edit/delete/student modal buttons, and Student Progress tab tracking individual learners.

#### `frontend/src/pages/AdminDashboard.jsx`
* **Purpose:** Complete administrative console.
* **What it contains:** Overview metrics, user search and role filter table with activation toggles, course delete overrides, mentor approval controls, and analytics distributions.

#### `frontend/src/pages/Courses.jsx` & `CourseDetail.jsx`
* **Purpose:** Course exploration and learning views.
* **What it contains:** Search and category filter inputs, course cards with category gradient banners, lesson syllabus reader, and completion toggle checkboxes.

#### `frontend/src/pages/AIAssistant.jsx`
* **Purpose:** Gemini AI learning workbench.
* **What it contains:** Mode selector tabs, dual-pane query history and chat thread, code snippet display, and auto-scrolling conversation bubbles.

#### `frontend/src/pages/Community.jsx`
* **Purpose:** Community interaction feed.
* **What it contains:** Post authoring box, like toggles with real-time count updates, nested comment threads, and edit/delete controls for authors.

#### `frontend/src/pages/ResumeBuilder.jsx`
* **Purpose:** Career preparation tool.
* **What it contains:** Form with dynamic field arrays for education, experience, skills, and projects; real-time A4 visual preview; and client-side PDF export via `html2canvas` and `jsPDF`.

#### `frontend/src/pages/Projects.jsx`, `Tasks.jsx`, `Notes.jsx`
* **Purpose:** Student productivity suite.
* **What it contains:** Projects showcase with live/GitHub links; 3-column interactive Kanban task board; searchable notes table with modal content viewer.

---

## 8. Code Explanation (Key Concepts)

### 1. Variables (`const`, `let`)
* **What is it?** Keywords to declare data containers. `const` creates block-scoped variables that cannot be reassigned; `let` allows reassignment.
* **Where used:** Everywhere in backend and frontend (e.g., `const [user, setUser] = useState(null)` in `AuthContext.jsx`).
* **Why used:** Prevents accidental reassignment bugs and keeps scope localized to blocks.
* **How it works here:** `const` is used for component declarations, imported modules, and state variables. `let` is used when values change conditionally (such as `let token` in `auth.js`).

### 2. Arrow Functions (`() => {}`)
* **What is it?** Concise ES6 function syntax that lexically binds the `this` value.
* **Where used:** Component declarations (e.g., `const Navbar = () => { ... }`), callbacks, and event handlers.
* **Why used:** Shorter syntax, cleaner code, and avoids issues with JavaScript's dynamic `this`.
* **How it works here:** Powers all functional components and array iteration callbacks.

### 3. Arrays and Array Methods (`map`, `filter`, `reduce`)
* **What are they?** Built-in methods to transform, filter, and aggregate list data without mutating the original array.
* **Where used:**
  - `map()`: In `Courses.jsx` to render `<Card>` components for each course:
    ```javascript
    courses.map((course) => <Link key={course._id} to={`/courses/${course._id}`}>...</Link>)
    ```
  - `filter()`: In `enrollmentController.js` to compute completed courses:
    ```javascript
    const completedCourses = enrollments.filter((e) => e.status === 'completed').length;
    ```
  - `reduce()`: In `userController.js` to calculate average progress:
    ```javascript
    const avgProgress = totalCourses > 0
      ? Math.round(enrollments.reduce((sum, e) => sum + e.progress, 0) / totalCourses)
      : 0;
    ```
* **Why used:** Declarative, readable, and functional programming approach to data transformations.

### 4. Asynchronous JavaScript (`async` / `await` & Promises)
* **What is it?** Syntax to handle asynchronous operations (database queries, network requests) cleanly without "callback hell".
* **Where used:** In all Express controller methods and frontend service calls.
* **Why used:** Interacting with MongoDB Atlas and Gemini AI takes time; `await` pauses execution until the promise resolves.
* **How it works here:** In `authController.js`:
  ```javascript
  const user = await User.findOne({ email });
  ```

### 5. Object Destructuring & Spread Operator (`...`)
* **What is it?** Destructuring extracts properties from objects into variables; spread expands elements of an array or object.
* **Where used:**
  - Destructuring request bodies: `const { title, description, category } = req.body;` in `courseController.js`.
  - Spread operator for merging state: `setPosts((prev) => [newPost, ...prev]);` in `Community.jsx`.
* **Why used:** Eliminates repetitive `req.body.title` code and enables immutable state updates.

### 6. Local Storage (`localStorage`)
* **What is it?** Browser key-value storage that persists even after closing the tab.
* **Where used:**
  - `skillsphere_token`: Stores JWT for session persistence.
  - `skillsphere_user`: Caches user profile for instant UI hydration.
  - `skillsphere_theme`: Stores `'light'` or `'dark'`.
  - `skillsphere_projects`, `skillsphere_tasks`, `skillsphere_notes`: Stores productivity items.
* **Why used:** Keeps users logged in between refreshes and preserves dark mode preferences.

### 7. Form Validation (React Hook Form)
* **What is it?** Library managing form values, error messages, and submission lifecycle.
* **Where used:** In `Login.jsx`, `Register.jsx`, `CreateCourse.jsx`, `ResumeBuilder.jsx`.
* **Why used:** Highly performant because it avoids re-rendering the entire component on every keystroke.
* **How it works here:** Registers inputs via `{...register('email', { required: 'Email is required' })}` and catches validation errors in `formState.errors`.

### 8. Routing & Route Guards (React Router 6)
* **What is it?** Client-side navigation system enabling multi-page feel in a Single Page App.
* **Where used:** `App.jsx` and `ProtectedRoute.jsx`.
* **Why used:** Allows page transitions without browser page reloads.
* **How it works here:** `<ProtectedRoute allowedRoles={['admin']}>` checks the user's role before rendering the nested `<Outlet />` or redirecting.

### 9. CSS Flexbox & Grid (Tailwind CSS)
* **What is it?** Modern CSS layout modules. Flexbox handles 1-dimensional layouts; Grid handles 2-dimensional layouts.
* **Where used:**
  - Flexbox: `flex items-center justify-between` in `Navbar.jsx` and `StatCard.jsx`.
  - Grid: `grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6` in `StudentDashboard.jsx`.
* **Why used:** Ensures clean, fluid responsive layouts across phones, tablets, and desktop screens.

---

## 9. React Concepts Used

| Concept | File / Component Example | Explanation in Simple English |
| :--- | :--- | :--- |
| **Functional Components** | `Courses.jsx`, `StatCard.jsx` | JavaScript functions that accept props and return JSX describing what should appear on the screen. |
| **JSX (JavaScript XML)** | `App.jsx`, `Landing.jsx` | Syntax extension that lets you write HTML-like tags directly inside JavaScript code. |
| **Props** | `Badge.jsx` (`text`, `variant`), `StatCard.jsx` (`icon`, `value`) | Parameters passed from parent to child components to configure display and behavior. |
| **State (`useState`)** | `AIAssistant.jsx` (`prompt`, `chats`) | Local memory inside a component that causes the UI to re-render when updated. |
| **Side Effects (`useEffect`)** | `CourseDetail.jsx`, `NotificationBell.jsx` | Hook that runs side effects (fetching data from API, starting timers) on component mount or dependency changes. |
| **Context API (`createContext`, `useContext`)** | `AuthContext.jsx`, `ThemeContext.jsx` | Solves "prop drilling" by sharing global state (user login, active theme) across the entire component tree. |
| **Custom Hooks** | `useDebounce.js` | Custom JavaScript function combining built-in React hooks to encapsulate reusable logic. |
| **Memoized Callbacks (`useCallback`)** | `AuthContext.jsx` (`login`, `logout`), `Courses.jsx` (`fetchCourses`) | Memorizes function references across re-renders to prevent unnecessary effect triggers. |
| **DOM References (`useRef`)** | `AIAssistant.jsx` (`bottomRef`), `ResumeBuilder.jsx` (`previewRef`) | Stores a direct reference to a DOM element for scrolling or canvas capturing without causing re-renders. |
| **Conditional Rendering** | `CourseDetail.jsx` (`isOwner ? ... : ...`) | Uses JavaScript ternaries (`? :`) or logical AND (`&&`) to show or hide elements based on state. |
| **Lists & Keys** | `Courses.jsx` (`key={course._id}`) | Rendering lists of data using `.map()`, assigning a unique `key` so React efficiently tracks item changes. |

---

## 10. HTML Explanation

Although SkillSphere is a Single Page Application rendered via React JSX, it adheres strictly to semantic HTML principles:

* **Semantic Elements:**
  - `<nav>`: Used in `Navbar.jsx` to demarcate the primary header navigation.
  - `<aside>`: Used in `SidebarLayout.jsx` for the persistent desktop and mobile sidebar menus.
  - `<main>`: Used in `MainLayout.jsx` and `SidebarLayout.jsx` to wrap the primary page content.
  - `<header>`: Used in `SidebarLayout.jsx` for the top search and user profile bar.
  - `<footer>`: Used in `Footer.jsx` for platform-wide copyright and navigation links.
  - `<section>`: Used in `Landing.jsx` to delineate the Hero, Popular Courses, Features, and CTA sections.
* **Forms & Form Controls:**
  - `<form>`: Encapsulates user inputs and handles `onSubmit` events cleanly.
  - `<input>`: Types include `text`, `email`, `password`, `number`, and `url` with placeholders and validation attributes.
  - `<textarea>`: Multi-line text inputs for post content, AI prompts, notes, and course descriptions.
  - `<select>` & `<option>`: Dropdown menus used for course categories, levels, and task priority stages.
* **Interactive Elements:**
  - `<button>`: Triggers actions (e.g., "Enroll Now", "Download PDF", "Post", "Delete") with `type="button"` or `type="submit"`.
  - `<a>` & `<Link>`: Anchor elements for internal SPA routing (via React Router) and external links (GitHub, live demos).
* **DOM Mounting Root:**
  - In `frontend/index.html`, `<div id="root"></div>` serves as the container where React mounts the entire component tree via `createRoot()`.

---

## 11. CSS Explanation

SkillSphere uses **Tailwind CSS 3** with custom theme extensions defined in `tailwind.config.js` and custom component classes in `index.css`:

### 1. Theme Configuration (`tailwind.config.js`)
* **Color Palette:** Curated HSL-derived violet/purple (`primary`), cyan (`accent`), and deep royal dark hues (`royal-darkBg: #12091f`, `royal-darkCard: #1c1230`, `royal-darkBorder: #2e2247`).
* **Typography:** Configured to use the Google Font `'Inter'` for modern readability.
* **Keyframes & Animations:** Custom keyframes for `fadeIn`, `slideUp`, and `pulseSubtle` creating subtle micro-interactions.

### 2. Custom Component Utilities (`frontend/src/index.css`)
Rather than cluttering JSX with repetitive class strings, reusable design tokens are defined in `@layer components`:
* `.btn-primary`: Gradient purple background (`from-primary-600 to-primary-500`), rounded corners (`rounded-xl`), smooth hover shadow (`shadow-primary-500/25`), and active scale compression (`active:scale-95`).
* `.btn-secondary`: Bordered card button with subtle hover backgrounds in both light and dark modes.
* `.card` & `.glass-card`: Rounded cards with thin purple borders, backdrop blur, and subtle hover elevations.
* `.input-field`: Standardized form input styling with focused ring highlights.

### 3. Dark Mode Architecture
Dark mode is activated via the `class` strategy (`darkMode: 'class'`). When the user toggles theme in `ThemeContext.jsx`, the class `dark` is appended to the root `<html>` element. All components specify paired utilities such as `bg-white dark:bg-royal-darkCard` and `text-gray-900 dark:text-white`.

---

## 12. JavaScript Explanation

### ES6+ Language Features Used
1. **Modules (`import` / `export`):** ES module imports keep components modular and organized.
2. **Template Literals (`` `Bearer ${token}` ``):** String interpolation used for API URLs and dynamic classes.
3. **Nullish Coalescing (`??`) & Optional Chaining (`?.`):**
   - `user?.name`: Safely accesses nested properties without throwing errors if `user` is null.
   - `req.body.name ?? user.name`: Preserves existing data when optional fields are omitted.
4. **Crypto Hashing:** `crypto.createHash('sha256').update(resetToken).digest('hex')` hashes reset tokens for secure database lookups.
5. **Set Data Structure:** `new Set(enrollments.map(...)).size` computes unique student counts in O(n) time.

---

## 13. Data Flow

Here is how data moves through SkillSphere from user interaction to database persistence:

```text
[ User Action: Types Prompt & Clicks 'Send' in AIAssistant.jsx ]
                           │
                           ▼
[ Event Handler: handleSend(e) ]
                           │
                           ▼
[ Axios API Call: aiService.chatWithAI(prompt, mode) ]
                           │
                           ▼
[ Axios Request Interceptor: Injects 'Authorization: Bearer <token>' ]
                           │
                           ▼
[ Express Router: POST /api/ai/chat ]
                           │
                           ▼
[ Middleware: protect -> jwt.verify -> loads req.user from MongoDB ]
                           │
                           ▼
[ Controller: aiController.js -> buildPrompt(mode, prompt) ]
                           │
                           ▼
[ External API: Google Generative AI (gemini-1.5-flash) generates text ]
                           │
                           ▼
[ Mongoose: AIChat.create({ user, mode, prompt, response }) -> MongoDB ]
                           │
                           ▼
[ Response Sent: res.status(201).json({ success: true, chat }) ]
                           │
                           ▼
[ React State Update: setChats(prev => [...prev, res.chat]) ]
                           │
                           ▼
[ Virtual DOM Reconciliation -> UI Updates & Smoothly Scrolls to Bottom ]
```

---

## 14. Application Workflow

### Step-by-Step Student Journey
1. **Arrival:** Student lands on `Landing.jsx`, browses popular courses, or searches for a topic.
2. **Registration / Login:** Student navigates to `/register`, selects role "Student", and signs up. JWT is stored in `localStorage`.
3. **Dashboard:** Student is greeted by `StudentDashboard.jsx` showing enrolled course progress, categories, and AI tips.
4. **Course Enrollment:** Student visits `/courses`, selects a course, clicks "Enroll Now", and begins reading lessons.
5. **Progress Completion:** Clicking the checkmark on a lesson marks it complete, updating the progress bar in real time.
6. **AI Study Help:** Student opens `/ai-assistant` to ask for a roadmap or a 5-question multiple-choice quiz.
7. **Networking:** Student visits `/community` to share learning milestones and discuss code with peers.
8. **Career Preparation:** Student builds their resume on `/resume-builder` and downloads the generated PDF.

### Step-by-Step Mentor Journey
1. Mentor logs in; `App.jsx` redirects them to `/mentor/dashboard`.
2. Mentor clicks "Create Course", specifies title, category, level, tags, and description.
3. Mentor opens the course syllabus and adds structured lessons with duration and content.
4. Mentor monitors enrolled students and views real-time progress percentages.

### Step-by-Step Admin Journey
1. Admin logs in; `App.jsx` redirects them to `/admin`.
2. Admin reviews total user counts, courses, enrollments, and post metrics.
3. Admin moderates content by deactivating problematic users or deleting unauthorized posts/courses.
4. Admin reviews pending mentor accounts and toggles approval.

---

## 15. UI/UX Explanation

* **Responsive Sidebar Layout:** Uses a desktop sidebar and a slide-out mobile drawer triggered by a hamburger button.
* **Persistent Dark & Light Themes:** Toggle in the top navbar smoothly switches between clean white/purple and deep royal navy palettes.
* **Visual Hierarchy:** Card headers use bold gradients, typography uses distinct weights (400, 600, 700, 900), and badges clearly communicate difficulty levels and roles.
* **Micro-Interactions & Feedback:**
  - Active button states use `active:scale-95`.
  - Toast alerts provide immediate visual feedback for network actions.
  - Spinners and skeleton states appear while waiting for server responses.

---

## 16. Validation and Error Handling

### Client-Side Validation
* Handled using **React Hook Form**:
  - Email format regex validation.
  - Password minimum length (6 characters).
  - Password confirmation matching (`validate: value => value === password`).
  - Required field guards on all course, note, project, and task forms.

### Backend Validation & Error Handling
* **Mongoose Schema Validators:** `required: [true, '...']`, `unique: true`, `enum: [...]`, `maxlength: 300`.
* **Centralized Error Normalization (`errorHandler.js`):**
  - Mongoose `CastError` (invalid ObjectId) returns 404 "Resource not found".
  - Mongoose `code === 11000` (duplicate email or duplicate enrollment) returns 400 "Duplicate value entered".
  - Mongoose `ValidationError` maps error messages into a comma-separated readable string.
* **Expired Token Handling (`api.js`):** When the backend returns 401 Unauthorized, the Axios response interceptor automatically removes the expired token and redirects the user to `/login`.

---

## 17. Storage / Database / API

### 1. MongoDB Atlas (Cloud Database)
* Document-oriented NoSQL database storing 9 collections: `users`, `courses`, `lessons`, `enrollments`, `posts`, `comments`, `notifications`, `resumes`, `aichats`.
* Mongoose manages relational modeling via ObjectIds (`ref`) and compound unique indexes.

### 2. Browser Local Storage
* Client-side persistent key-value store for session tokens, cached user objects, theme preferences, and student productivity items.

### 3. REST API Architecture
* Standard HTTP methods:
  - `GET`: Query resources (courses, dashboard stats, chat history).
  - `POST`: Create resources (registration, courses, comments, AI prompts).
  - `PUT`: Update resources (profile changes, lesson completion, mentor approval).
  - `DELETE`: Remove resources (delete course, delete post, delete user).

### 4. Google Gemini API
* Integrated using the official `@google/generative-ai` SDK communicating with `gemini-1.5-flash`.

---

## 18. Important Code Snippets

### Snippet 1: Lesson Progress Calculation (`backend/controllers/enrollmentController.js`)
```javascript
const alreadyDone = enrollment.completedLessons.some((l) => l.toString() === lessonId);
if (alreadyDone) {
  enrollment.completedLessons = enrollment.completedLessons.filter((l) => l.toString() !== lessonId);
} else {
  enrollment.completedLessons.push(lessonId);
}

const totalLessons = await Lesson.countDocuments({ course: courseId });
enrollment.progress = totalLessons > 0 
  ? Math.round((enrollment.completedLessons.length / totalLessons) * 100) 
  : 0;
enrollment.status = enrollment.progress === 100 ? 'completed' : 'in-progress';

await enrollment.save();
```
**Explanation:**
1. Checks if the clicked lesson ID already exists in `completedLessons`.
2. If already done, filters it out (un-completes it); otherwise, pushes it into the array.
3. Counts total lessons for the course in MongoDB.
4. Calculates progress as `(completed / total) * 100` rounded to the nearest integer.
5. If progress equals 100%, updates `status` to `'completed'`, then saves the document.

---

### Snippet 2: JWT Protection Middleware (`backend/middleware/auth.js`)
```javascript
const protect = asyncHandler(async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    res.status(401);
    throw new Error('Not authorized, no token provided');
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select('-password');
    next();
  } catch (error) {
    res.status(401);
    throw new Error('Not authorized, token failed');
  }
});
```
**Explanation:**
1. Inspects the incoming request header for `Authorization: Bearer <token>`.
2. Splits the string by space to isolate the token.
3. If token is missing, responds with HTTP 401.
4. Uses `jwt.verify` to validate the token against the server's `JWT_SECRET`.
5. Retrieves the user from MongoDB (omitting the password hash via `.select('-password')`) and attaches it to `req.user` before calling `next()`.

---

### Snippet 3: Axios Authentication Interceptor (`frontend/src/services/api.js`)
```javascript
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('skillsphere_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```
**Explanation:**
1. Intercepts every outgoing HTTP request made via the Axios instance.
2. Checks browser `localStorage` for `skillsphere_token`.
3. If present, injects the `Authorization: Bearer <token>` header automatically, ensuring backend authentication without manual header injection on every API call.

---

### Snippet 4: Password Hashing Pre-Save Hook (`backend/models/User.js`)
```javascript
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});
```
**Explanation:**
1. Runs automatically before any User document is saved to MongoDB.
2. Checks if the password field was modified; if not, skips re-hashing.
3. Generates a random cryptographic salt with 10 rounds.
4. Replaces the plain-text password with the bcrypt hash and proceeds.

---

## 19. Project Strengths

1. **Complete Full-Stack Architecture:** Connects a real React frontend to a real Node/Express backend and persistent cloud MongoDB database — no dummy mocks.
2. **True Role-Based Access Control:** Students, mentors, and administrators have completely separate dashboards and backend route guards.
3. **Real GenAI Integration:** Uses Google Gemini 1.5 Flash to provide adaptive, mode-specific learning prompts.
4. **Relational NoSQL Modeling:** Effectively uses Mongoose compound unique indexes (preventing duplicate enrollments) and virtual populates (preventing massive array bloating on parent documents).
5. **Modern Design System:** Tailored purple/royal color scheme, responsive sidebar, and dark mode.
6. **Career & Productivity Value:** Includes a live A4 resume preview with client-side PDF export and productivity tools (Kanban tasks, projects, notes).
7. **Automated Database Seeder:** The `seeder.js` script provisions pre-configured admin, mentor, and 18+ comprehensive coding courses.

---

## 20. Limitations & Project Audit Findings

During our thorough line-by-line audit of the project code, the following architectural observations and limitations were identified:

1. **Unused / Legacy Pages in Codebase:**
   - `frontend/src/pages/Dashboard.jsx`: Imported in `App.jsx` line 13, but never mounted to any `<Route>`. The application uses `StudentDashboard.jsx` instead.
   - `frontend/src/pages/AdminPanel.jsx`: Exists in the pages directory but is completely superseded by `AdminDashboard.jsx`.
2. **Productivity Suite Stored in LocalStorage:**
   - `Projects.jsx`, `Tasks.jsx`, and `Notes.jsx` store items in browser `localStorage` rather than dedicated MongoDB collections. While this makes them fast and private to the device, they do not sync across different browsers or computers.
3. **Password Reset Token Returned in API Response:**
   - In `backend/controllers/authController.js`, `forgotPassword` returns the raw `resetToken` in the JSON response rather than emailing it via an SMTP service (such as Nodemailer or SendGrid). *Note: The code explicitly documents this as an intentional decision to keep the project functional without third-party email credentials.*
4. **Unused Asset Files:**
   - `frontend/src/assets/.gitkeep` exists as an empty directory placeholder since all icons are imported as SVG components from `lucide-react`.

---

## 21. Future Improvements

### Short-Term Improvements
1. **Connect Productivity Suite to MongoDB:** Create Mongoose schemas and REST endpoints for Projects, Tasks, and Notes so they persist to the student's cloud account.
2. **Email Service Integration:** Connect Nodemailer or SendGrid to send real password reset links and course announcement emails.
3. **Clean Up Unused Files:** Safely delete `Dashboard.jsx` and `AdminPanel.jsx` to reduce codebase bundle size.

### Advanced Improvements
1. **Realtime WebSockets (Socket.io):** Replace 30-second notification polling with real-time push notifications and live peer-to-peer chat.
2. **Payment Gateway Integration:** Add Stripe or Razorpay to support paid premium courses.
3. **In-Browser Code Execution Sandbox:** Add Monaco Editor with a WebAssembly or Docker container runner so students can execute code directly inside lessons.

---

## 22. Testing Table

| Test Case | Input / Action | Expected Result | Actual / Implemented Behavior |
| :--- | :--- | :--- | :--- |
| **TC-01: User Registration** | Submit name, unique email, password (min 6 chars), role | New user document created, JWT generated, redirected to dashboard | **Passed:** User saved with bcrypt hash, JWT stored in `localStorage`. |
| **TC-02: Duplicate Email Guard** | Register with an already existing email address | Server rejects with HTTP 400 and error message | **Passed:** Mongoose duplicate key / controller checks return "User already exists with this email". |
| **TC-03: Protected Route Guard** | Visit `/dashboard` or `/profile` without logging in | Automatically redirected to `/login` | **Passed:** `ProtectedRoute.jsx` checks `isAuthenticated` and redirects to login with return path. |
| **TC-04: Role Authorization** | Logged-in Student attempts to access `/admin` or `/courses/create` | Access forbidden; redirected to student dashboard | **Passed:** `ProtectedRoute` checks `allowedRoles` and redirects to `/dashboard`; backend returns HTTP 403. |
| **TC-05: Course Enrollment** | Student clicks "Enroll Now" on an active course | Enrollment created, progress set to 0%, notification created | **Passed:** Enrollment saved, compound index prevents duplicates, notification bell updates. |
| **TC-06: Lesson Completion** | Student clicks checkmark on a lesson module | Lesson added to completed list; progress percentage recalculated | **Passed:** Progress updates automatically; if all lessons done, status changes to `'completed'`. |
| **TC-07: Gemini AI Assistant** | Submit prompt with mode 'explain-code' | Gemini returns formatted step-by-step code explanation | **Passed:** `@google/generative-ai` responds and chat entry is stored in `AIChat` collection. |
| **TC-08: Community Likes** | Click heart icon on a community post | Like count increments/decrements; author receives alert | **Passed:** User ID toggled in `post.likes`; `Notification` document created for author. |
| **TC-09: Resume PDF Export** | Click "Download PDF" on Resume Builder | Generates clean, styled A4 PDF of current resume | **Passed:** `html2canvas` renders preview DOM node; `jsPDF` exports downloadable file. |
| **TC-10: Theme Persistence** | Toggle theme button in navbar and refresh page | Theme remains dark or light across reloads | **Passed:** `ThemeContext` saves to `localStorage` and adds/removes `dark` class on root HTML. |

---

## 23. Viva Questions and Answers

### A. Basic Project Questions

**Q: What is SkillSphere?**  
**A:** SkillSphere is a full-stack MERN platform combining structured technical courses, a Google Gemini AI learning tutor, productivity tools (projects, tasks, notes), career tools (resume builder), and a community discussion feed.

**Q: What problem does your project solve?**  
**A:** It solves fragmented learning by unifying course syllabus tracking, personalized AI tutoring, developer productivity, and resume creation into a single platform.

**Q: Who are the target users?**  
**A:** Students who want structured learning and career tools, mentors who publish curricula and monitor learners, and administrators who oversee the platform.

**Q: Why did you choose the MERN stack?**  
**A:** Because JavaScript is used across the entire stack (React on frontend, Node/Express on backend, JSON-like BSON in MongoDB), providing high performance, rapid development, and consistent data formats.

---

### B. HTML Questions

**Q: What are semantic HTML elements and where did you use them?**  
**A:** Semantic elements clearly describe their meaning to browsers and screen readers. We used `<nav>` for the navbar, `<aside>` for the sidebar, `<main>` for page content, and `<footer>` for copyright links.

**Q: What is the purpose of `<div id="root"></div>` in `index.html`?**  
**A:** It is the single DOM mounting container where React attaches its Virtual DOM tree using `createRoot()`.

**Q: How do you prevent a form from refreshing the page on submit in HTML/React?**  
**A:** By calling `e.preventDefault()` inside the form's `onSubmit` event handler.

---

### C. CSS Questions

**Q: How does Tailwind CSS work in this project?**  
**A:** Tailwind scans HTML and JSX files for utility classes and generates minimal, optimized CSS on demand during the Vite build process.

**Q: How is Dark Mode implemented?**  
**A:** We use Tailwind's `class` strategy. `ThemeContext` adds or removes the `dark` class on the root `<html>` element, and elements style accordingly using `dark:` variants.

**Q: What is the difference between Flexbox and CSS Grid in your project?**  
**A:** Flexbox is 1-dimensional (used for navbar alignment and stat card rows), while CSS Grid is 2-dimensional (used for responsive course cards and dashboard widgets).

---

### D. JavaScript Questions

**Q: What is the difference between `const` and `let`?**  
**A:** Both are block-scoped. `const` cannot be reassigned after declaration, whereas `let` allows reassignment.

**Q: What does `map()` do and why is it used in React?**  
**A:** `map()` iterates over an array and returns a new array with transformed items. In React, it transforms data arrays into JSX elements.

**Q: What is the purpose of `async` and `await`?**  
**A:** They provide a clean syntax for working with Promises, allowing asynchronous code (like database queries) to be read sequentially.

---

### E. React Questions

**Q: What is the Virtual DOM and how does React use it?**  
**A:** The Virtual DOM is a lightweight memory representation of the real DOM. When state changes, React compares the Virtual DOM with a snapshot (diffing) and updates only the changed elements in the real DOM (reconciliation).

**Q: What is the difference between State and Props?**  
**A:** Props are read-only inputs passed from a parent component to a child; State is internal mutable data managed within the component that triggers re-renders when updated.

**Q: What does `useEffect` do in your project?**  
**A:** It executes side effects (such as fetching courses from the backend or setting polling intervals) after the component renders on the screen.

**Q: What is the purpose of `AuthContext`?**  
**A:** It provides global user session state (`user`, `login`, `logout`) to any component in the application without having to pass props through multiple levels of components.

---

### F. Code-Based Questions

**Q: How does your backend hash passwords securely?**  
**A:** In `models/User.js`, a Mongoose `pre('save')` hook intercepts new or modified passwords and hashes them using `bcrypt.hash()` with 10 salt rounds.

**Q: How does your JWT authentication work on protected routes?**  
**A:** When a user logs in, the backend signs a JWT with their ID and role. The frontend saves it in `localStorage`, and an Axios interceptor attaches it as `Bearer <token>` to requests. The backend `protect` middleware verifies it using `jwt.verify()`.

**Q: Why do you need `express.json()` in `server.js`?**  
**A:** It is a built-in Express middleware that parses incoming requests with JSON payloads and populates `req.body`. Without it, `req.body` is `undefined`.

**Q: How does the course completion percentage get calculated?**  
**A:** In `enrollmentController.js`, we count the total course lessons, check how many are in `completedLessons`, and calculate `Math.round((completed / total) * 100)`.

**Q: How does the Resume Builder export PDFs without a backend?**  
**A:** It uses `html2canvas` to screenshot the preview DOM element as a high-resolution image and passes it into `jsPDF` to generate and download an A4 PDF document directly in the browser.

---

### G. Difficult / Tricky Viva Questions

**Q: Why didn't you store lessons as an array of subdocuments directly inside the Course model?**  
**A:** Storing lessons inside the Course document would risk exceeding MongoDB's 16MB document size limit and cause performance bottlenecks when querying courses without their lesson text. Instead, we use a separate `Lesson` collection and link them via Mongoose virtual populate.

**Q: What happens if a user's JWT expires while they are using the platform?**  
**A:** The backend rejects the request with HTTP 401. Our Axios response interceptor in `api.js` catches this 401, clears `localStorage`, and redirects the user to `/login` to re-authenticate.

**Q: How do you prevent a student from enrolling in the same course multiple times?**  
**A:** We created a compound unique index in Mongoose: `enrollmentSchema.index({ student: 1, course: 1 }, { unique: true })`. If a duplicate request occurs, MongoDB rejects it with error code 11000.

**Q: Why is password select set to `false` in `models/User.js`?**  
**A:** Setting `select: false` prevents the password hash from being included in database query results by default, preventing accidental exposure in API responses.

---

## 25. ⭐ Must-Prepare Topics for Viva

### 1. Most Important (Must Know Inside-Out)
1. **MERN Architecture:** How React (client), Express (server), Node (runtime), and MongoDB (database) communicate via HTTP REST calls.
2. **JWT Authentication Flow:** Token generation on login, storage in browser `localStorage`, injection via Axios interceptor, and verification via `auth.js` middleware.
3. **Password Security:** Salt rounds, bcrypt one-way hashing, and why plain-text passwords should never be stored.
4. **Mongoose Models & Virtual Populate:** How `Course`, `Lesson`, `Enrollment`, and `User` relate to one another.
5. **React State & Hooks:** Understanding `useState`, `useEffect`, `useContext`, and `useRef`.

### 2. Very Important
6. **Role-Based Authorization:** How the backend `authorize('mentor', 'admin')` middleware and frontend `<ProtectedRoute allowedRoles={...}>` work.
7. **Gemini AI Integration:** How `@google/generative-ai` receives mode-engineered prompts and returns structured text.
8. **Lesson Progress Logic:** How toggling module completion calculates percentage and marks course status.
9. **Centralized Error Handling:** How `errorHandler.js` normalizes Mongoose cast, duplicate, and validation errors.
10. **Client-Side Routing:** How `react-router-dom` handles SPAs, nested layouts, and URL parameters (`useParams`).

### 3. Important
11. **Dark Mode Implementation:** Toggling the `dark` class on root HTML via `ThemeContext` and Tailwind's class strategy.
12. **Axios Interceptors:** Automatic token attachment on requests and global 401 logout handling on responses.
13. **Dynamic Form Arrays:** How `react-hook-form`'s `useFieldArray` allows adding/removing resume sections.
14. **PDF Generation Pipeline:** How `html2canvas` converts HTML DOM elements to images for `jsPDF`.
15. **MongoDB Compound Indexes:** How `{ student: 1, course: 1 }` enforces single enrollments at the database level.

### 4. Good to Know
16. **Debouncing:** Why `useDebounce.js` prevents network flooding during live search.
17. **Notification Polling:** Why `NotificationBell.jsx` uses a 30-second interval timer.
18. **Password Reset Token Flow:** Why crypto tokens use SHA-256 hashing and expiration timestamps.
19. **Tailwind Layering:** The purpose of `@layer components` in `index.css`.
20. **Database Seeder:** How `seeder.js` populates realistic mock data with `insertMany`.

---

## 26. 2-Minute Project Presentation Script

> *"Good morning, respected examiners.*
>
> *My project is **SkillSphere**, an AI-Powered Learning and Collaboration Platform built using the full **MERN stack**—MongoDB, Express.js, React, and Node.js—integrated with the **Google Gemini Generative AI API**.*
>
> *Traditional online learning is often fragmented: students study video courses on one site, ask for coding help on forums, manage their study tasks on external boards, and build resumes on separate tools. SkillSphere unifies all these needs into one seamless, responsive workspace.*
>
> *The application implements strict **Role-Based Access Control** for three distinct types of users:*
> 1. *First, **Students**: who can browse courses, track lesson-by-lesson progress, chat with an AI learning assistant for roadmaps and quizzes, manage their projects and tasks, and export a professional resume to PDF.*
> 2. *Second, **Mentors**: who can author comprehensive curricula, publish lesson modules, and monitor student enrollment and completion metrics.*
> 3. *Third, **Administrators**: who manage platform-wide analytics, activate or deactivate accounts, approve mentors, and moderate community content.*
>
> *On the technical side:*
> - *We built secure authentication using **JSON Web Tokens** and **Bcrypt password hashing**.*
> - *We modeled our database with **Mongoose virtual populates** and compound unique indexes to maintain clean, scalable relationships without document bloating.*
> - *Our frontend is built with **Vite**, styled with a custom **Tailwind CSS dark/light theme**, and managed with React's **Context API** and **React Hook Form**.*
> - *Every single feature is connected to live MongoDB collections and a real REST API—there is zero dummy or mock data.*
>
> *In summary, SkillSphere is a complete, scalable, and career-focused learning platform designed for modern developers. Thank you, and I am now ready for your questions."*

---

## 27. Quick Revision Sheet (Read 10 Minutes Before Viva)

* **Project Name:** SkillSphere (AI-Powered Learning & Collaboration Platform)
* **Stack:** MongoDB Atlas, Express.js, React 18 (Vite), Node.js (MERN Stack)
* **AI Provider:** Google Gemini API (`@google/generative-ai`, model: `gemini-1.5-flash`)
* **Styling:** Tailwind CSS (utility-first, custom purple palette, dark mode via `.dark` class)
* **State Management:** React Context API (`AuthContext` for user session, `ThemeContext` for dark mode)
* **Authentication:** Stateless JWT stored in `localStorage` and sent as `Bearer <token>` in HTTP Authorization headers
* **Password Security:** Bcrypt hashing with 10 salt rounds executed in a Mongoose `pre('save')` hook
* **Key Backend Files:** `server.js` (entry), `middleware/auth.js` (JWT & roles), `config/db.js` (MongoDB connection), `models/User.js`, `controllers/courseController.js`
* **Key Frontend Files:** `App.jsx` (routes), `AuthContext.jsx` (session), `StudentDashboard.jsx` (student metrics), `AIAssistant.jsx` (Gemini chat), `ResumeBuilder.jsx` (PDF export)
* **Database Collections:** `users`, `courses`, `lessons`, `enrollments`, `posts`, `comments`, `notifications`, `resumes`, `aichats`

### Top 15 Viva Questions & One-Line Answers

1. **What is MERN stack?**  
   *A full-stack JavaScript architecture using MongoDB for storage, Express and Node for the backend server, and React for the client interface.*
2. **What does JWT stand for and how is it used?**  
   *JSON Web Token; a digitally signed string used to securely verify user identity statelessly on every API call.*
3. **Where is the JWT token stored on the frontend?**  
   *In the browser's `localStorage` under the key `skillsphere_token`.*
4. **How do you protect private routes in Express?**  
   *By using our custom `protect` middleware which verifies the JWT token with `jwt.verify()` before passing control to the controller.*
5. **How are passwords stored in MongoDB?**  
   *As one-way cryptographic hashes generated by bcrypt with 10 salt rounds; plain-text passwords are never saved.*
6. **What is Mongoose Virtual Populate?**  
   *A Mongoose technique that dynamically populates related documents (like lessons on a course) without storing an array of IDs in the course document.*
7. **What happens when a lesson is marked complete?**  
   *Its ID is stored in `enrollment.completedLessons`, and progress is calculated as `(completed / total) * 100`.*
8. **How does the AI Assistant work?**  
   *The backend injects role prompts based on mode (explain code, roadmap, quiz) and calls `model.generateContent()` using the Google Generative AI SDK.*
9. **How does the Resume Builder export PDFs?**  
   *It converts the HTML preview container into an image using `html2canvas` and inserts it into an A4 PDF document using `jsPDF`.*
10. **Why did you use React Context API?**  
    *To share global state like user authentication and dark mode across all components without prop drilling.*
11. **What is the use of `useDebounce` hook in your project?**  
    *To delay course search API calls until the user stops typing for 300-400ms, preventing unnecessary server load.*
12. **How does dark mode toggle in your application?**  
    *`ThemeContext` adds or removes the `dark` class on the `<html>` root element and persists the choice in `localStorage`.*
13. **How do you prevent duplicate course enrollments?**  
    *Using a compound unique index on `{ student: 1, course: 1 }` in the Mongoose Enrollment schema.*
14. **What is the difference between `useEffect` and `useCallback`?**  
    *`useEffect` runs side-effects when dependencies change; `useCallback` returns a memoized function definition to prevent re-creating functions on re-renders.*
15. **What is the purpose of `render.yaml` and `netlify.toml`?**  
    *Configuration files that automate backend cloud deployment on Render.com and SPA routing rewrites on Netlify.*
