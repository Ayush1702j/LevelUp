# LevelUp 🚀
> **Small habits. Better communication. Stronger you.**

LevelUp is a modern, production-style personal growth web application designed to help users elevate their English communication, speaking confidence, vocabulary, grammar, daily productivity, and personal habits through simple daily challenges, measurable streaks, and visual analytics.

---

## 🌟 Features Overview

### 1. 🎤 Impromptu Speaking Challenge
* Timed 60-second continuous speech prompts (JS countdown timer).
* Dynamic topic switching across technology, lifestyle, storytelling, and problem-solving prompts.
* Speaking tips (STAR structure, strategic pauses, clear enunciation).
* Awards +20 XP and increments daily streaks upon completion.

### 2. 📚 Vocabulary Power & Flashcards
* Word of the Day with IPA pronunciation, meaning, and contextual sentence examples.
* 4-option interactive definition quiz with instant feedback.
* Performance tracker with attempted, correct, and accuracy scores.
* Searchable and filterable vocabulary bank.

### 3. ✍️ Grammar Precision Exercises
* Instant challenge evaluating subject-verb agreement, confusing words, dangling modifiers, and verb tenses.
* Comprehensive pedagogical explanations for each rule.
* Live accuracy and mastery statistics.

### 4. ✅ Daily Tasks Planner (Full CRUD)
* Priority categorization (High, Medium, Low).
* Filter by status (All, Pending, Completed) and priority.
* Check off goals for +5 XP per completed task.
* Complete database persistence using MongoDB.

### 5. 🔥 Habit Tracker
* 7-day visual consistency grid (Mon–Sun).
* Daily toggle with duplicate protection.
* Dynamic calculation of current streak and longest historical streak.
* Weekly completion rate analytics.

### 6. 🧠 Thought of the Day
* Daily reflective questions targeting mindset, gratitude, and goal orientation.
* History log of previous answers.
* Awards +10 XP for daily reflections.

### 7. 📊 Progress & Visual Analytics (Recharts)
* Overall level tier progress indicator.
* Pillar-by-pillar performance breakdown (Speaking, Vocabulary, Grammar, Productivity, Habits).
* Weekly activity bar chart.
* Daily XP growth velocity line chart.
* Category distribution pie chart powered by MongoDB records.

### 8. 🏆 Gamification & Achievement Engine
* **XP System**: Speaking (+20 XP), Vocabulary (+10 XP), Grammar (+10 XP), Tasks (+5 XP), Habits (+5 XP), Thought (+10 XP).
* **Level Progression**: Beginner (0–199 XP) ➔ Explorer (200–499 XP) ➔ Consistent (500–999 XP) ➔ Achiever (1000–1999 XP) ➔ LevelUp Master (2000+ XP).
* **Trophy Badges**: 11+ unlockable achievements with visual status differentiation (locked vs. unlocked glow) and auto-award triggers.

### 9. 💡 Rule-Based Recommendation Engine
* Evaluates user completion frequency across pillars over the last 7 days.
* Detects lowest performance area and surfaces high-priority challenge cards right on the dashboard.

### 10. 👤 Profile & ⚙️ Settings
* Edit profile name, bio, and avatar.
* Notification preference toggles.
* Live Light/Dark mode switch.
* Secure password updating with bcrypt hashing.

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 18, Vite, React Router v6, Axios, Tailwind CSS, Lucide React icons, Recharts |
| **Backend** | Node.js, Express.js, REST API architecture |
| **Database** | MongoDB, Mongoose ODM |
| **Authentication** | JSON Web Tokens (JWT), bcryptjs password hashing |
| **Environment** | dotenv, CORS middleware |

---

## 🏛️ Project Architecture

```text
React Frontend (Vite + Tailwind)
       │
       ▼ (Axios with JWT Bearer Interceptors)
Express REST API (CORS, Auth & Error Middlewares)
       │
       ▼
Controllers & Business Logic (Streaks, Gamification & Recommendation Engine)
       │
       ▼
Mongoose Models (User, Challenge, Progress, Task, Habit, Vocab, Grammar, Thought, Achievement)
       │
       ▼
MongoDB Server (27017)
```

---

## 📂 Folder Structure

```text
LevelUp/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js
│   │   ├── controllers/
│   │   │   ├── achievementController.js
│   │   │   ├── authController.js
│   │   │   ├── challengeController.js
│   │   │   ├── grammarController.js
│   │   │   ├── habitController.js
│   │   │   ├── progressController.js
│   │   │   ├── taskController.js
│   │   │   ├── thoughtController.js
│   │   │   └── vocabularyController.js
│   │   ├── middleware/
│   │   │   ├── authMiddleware.js
│   │   │   └── errorMiddleware.js
│   │   ├── models/
│   │   │   ├── Achievement.js
│   │   │   ├── Challenge.js
│   │   │   ├── Grammar.js
│   │   │   ├── Habit.js
│   │   │   ├── Progress.js
│   │   │   ├── Task.js
│   │   │   ├── Thought.js
│   │   │   ├── User.js
│   │   │   ├── UserAchievement.js
│   │   │   └── Vocabulary.js
│   │   ├── routes/
│   │   │   ├── achievementRoutes.js
│   │   │   ├── authRoutes.js
│   │   │   ├── challengeRoutes.js
│   │   │   ├── grammarRoutes.js
│   │   │   ├── habitRoutes.js
│   │   │   ├── progressRoutes.js
│   │   │   ├── taskRoutes.js
│   │   │   ├── thoughtRoutes.js
│   │   │   └── vocabularyRoutes.js
│   │   ├── seed/
│   │   │   └── seedData.js
│   │   ├── utils/
│   │   │   ├── gamification.js
│   │   │   └── streakHelper.js
│   │   └── server.js
│   ├── .env.example
│   ├── .env
│   └── package.json
│
├── frontend/
│   ├── public/
│   │   └── favicon.svg
│   ├── src/
│   │   ├── components/
│   │   │   ├── achievements/
│   │   │   │   └── AchievementCard.jsx
│   │   │   ├── challenges/
│   │   │   │   └── ChallengeCard.jsx
│   │   │   ├── common/
│   │   │   │   ├── Modal.jsx
│   │   │   │   ├── ProgressBar.jsx
│   │   │   │   ├── ProtectedRoute.jsx
│   │   │   │   ├── SkeletonLoader.jsx
│   │   │   │   ├── StatCard.jsx
│   │   │   │   └── Toast.jsx
│   │   │   ├── habits/
│   │   │   │   ├── HabitCard.jsx
│   │   │   │   └── HabitModal.jsx
│   │   │   ├── layout/
│   │   │   │   ├── AppLayout.jsx
│   │   │   │   ├── Navbar.jsx
│   │   │   │   └── Sidebar.jsx
│   │   │   └── tasks/
│   │   │       ├── TaskItem.jsx
│   │   │       └── TaskModal.jsx
│   │   ├── context/
│   │   │   ├── AuthContext.jsx
│   │   │   └── ToastContext.jsx
│   │   ├── pages/
│   │   │   ├── Achievements.jsx
│   │   │   ├── Challenges.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Grammar.jsx
│   │   │   ├── Habits.jsx
│   │   │   ├── Landing.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Profile.jsx
│   │   │   ├── Progress.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── Settings.jsx
│   │   │   ├── Speaking.jsx
│   │   │   ├── Tasks.jsx
│   │   │   └── Vocabulary.jsx
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   ├── index.html
│   ├── postcss.config.js
│   ├── tailwind.config.js
│   ├── vite.config.js
│   └── package.json
│
└── README.md
```

---

## ⚡ Quick Start & Local Setup

### 1. Prerequisites
* Node.js >= 18.x
* MongoDB running locally (port `27017`) or a MongoDB Atlas connection string.

### 2. Configure Backend Environment
Create or review `backend/.env`:
```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/levelup
JWT_SECRET=levelup_super_secret_dev_key_2026
NODE_ENV=development
CLIENT_URL=http://localhost:5173
```

### 3. Install Dependencies & Seed Database
From the root directory:

```bash
# 1. Install and seed backend
cd backend
npm install
npm run seed

# 2. Install frontend
cd ../frontend
npm install
```

### 4. Run Development Servers

**Terminal 1 (Backend):**
```bash
cd backend
npm run dev
# Server will run at http://localhost:5000
```

**Terminal 2 (Frontend):**
```bash
cd frontend
npm run dev
# Vite client will run at http://localhost:5173
```

Navigate to `http://localhost:5173` in your web browser.

---

## 🔑 Demo Account Credentials

For quick testing and grading, a realistic account with 7-day streak history, unlocked achievements, and sample tasks is pre-seeded:

* **Email:** `demo@levelup.com`
* **Password:** `Password123!`

*(You can also click the "Fill Demo" button on the Login page for 1-click credential population).*

---

## 📡 REST API Reference

### Authentication
* `POST /api/auth/register` — Register a new account
* `POST /api/auth/login` — Sign in and receive JWT
* `GET  /api/auth/me` — Retrieve current authenticated user profile
* `PUT  /api/auth/profile` — Update bio, name, or preferences
* `PUT  /api/auth/password` — Change password

### Challenges
* `GET  /api/challenges` — List challenges with status & filters
* `GET  /api/challenges/today` — Curated daily set for dashboard
* `GET  /api/challenges/:id` — Challenge details
* `POST /api/challenges/:id/complete` — Mark completed & award XP

### Tasks
* `GET    /api/tasks` — Fetch user tasks
* `POST   /api/tasks` — Create task
* `PUT    /api/tasks/:id` — Update or toggle task completion (+5 XP)
* `DELETE /api/tasks/:id` — Delete task

### Habits
* `GET    /api/habits` — Fetch habits with 7-day status grid
* `POST   /api/habits` — Create new habit
* `PUT    /api/habits/:id` — Update habit
* `DELETE /api/habits/:id` — Delete habit
* `POST   /api/habits/:id/toggle` — Toggle completion for date (+5 XP)

### Vocabulary & Grammar
* `GET  /api/vocabulary` — List vocabulary words with pagination
* `GET  /api/vocabulary/random` — Random word of the day flashcard
* `POST /api/vocabulary/:id/answer` — Validate quiz answer & award XP
* `GET  /api/grammar` — List grammar exercises
* `POST /api/grammar/:id/answer` — Submit answer, get explanation & XP

### Progress & Analytics
* `GET /api/progress` — Overall metrics, today's targets, category summary
* `GET /api/progress/weekly` — 7-day activity & XP chart data
* `GET /api/progress/category` — Category distribution for pie charts

### Achievements & Thoughts
* `GET  /api/achievements` — All achievements with locked/unlocked state
* `GET  /api/achievements/user` — User's unlocked achievement list
* `GET  /api/thoughts/today` — Today's prompt & submitted response
* `POST /api/thoughts` — Submit reflection (+10 XP)
* `GET  /api/thoughts/history` — List reflection logs

---

## 🚀 Future Improvements
* Web Speech API integration for real-time speech-to-text transcript analysis.
* Peer-to-peer speaking partner practice rooms via WebRTC.
* Push notification worker for browser morning reminders.
* Daily export of habits and tasks to PDF/CSV.

---

## 👤 Author
LevelUp Platform — Built with React, Express, MongoDB, and Tailwind CSS.
