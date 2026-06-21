# AMEP Elite 5.0 — Project-Based Learning Hub

> A premium, multi-role EdTech dashboard for managing Project-Based Learning (PBL) across schools, departments, classrooms, and students.

---

## 🌟 Overview

**AMEP Elite 5.0** is a full-featured, single-page React application that simulates a real-world EdTech administration platform. It provides five distinct role-based portals — Student, Parent, Teacher, HOD, and Super Admin — all driven by a persistent `localStorage` mock database with no backend dependency.

The platform is built as a high-fidelity reference implementation for the **AI-Powered Smart Chatbot Hub** PBL project, used to demonstrate how a modern, production-grade web portal would track student performance across six core PBL dimensions.

---

## ✨ Features at a Glance

| Category | Feature |
|---|---|
| **Multi-Role Access** | 5 portals: Student, Parent, Teacher, HOD, Super Admin |
| **PBL Analytics** | 6-dimension radar chart (Research, Teamwork, Presentation, Innovation, Technical, Time Management) |
| **Score History** | Dynamic SVG line chart tracking grade progression across evaluations |
| **Milestone Timeline** | Visual stepper showing project phase completion and task counts |
| **Kanban Task Board** | Click-to-cycle task status (Pending → In Progress → Completed) |
| **AI Chat Mentor** | Keyword-aware PBL advisor chatbot with suggestion quick-replies |
| **PBL Grader** | Drag-slider grading form for teachers; publishes scores to audit trail |
| **Audit Logs** | Live security trail tracking all actions (grading, RLS changes, resets) |
| **RLS Toggle** | Super Admin can enable/disable Row Level Security per school |
| **Dark / Light Mode** | Full theme system persisted in `localStorage` |
| **Toast Notifications** | Animated in-app toast system replacing all `alert()` calls |
| **Responsive Layout** | 12-column CSS grid with mobile breakpoints |
| **Glassmorphism UI** | Premium design with blur panels, gradients, and shimmer animations |

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | React 19 + Vite 8 |
| **Styling** | Vanilla CSS (custom properties, glassmorphism, CSS grid) |
| **Icons** | Lucide React |
| **Fonts** | Plus Jakarta Sans, Outfit (Google Fonts) |
| **Charts** | Hand-crafted SVG (radar, line, bar — no chart library) |
| **State** | React `useState` / `useEffect` / `useCallback` |
| **Persistence** | `localStorage` via custom `mockDb.js` service layer |
| **Build** | Vite (ESM, HMR) |

---

## 📁 Project Structure

```text
portal/
├── index.html               # Entry HTML with SEO meta tags
├── vite.config.js           # Vite configuration
├── package.json
├── src/
│   ├── main.jsx             # React DOM entry point
│   ├── App.jsx              # Main application (all portals, components, logic)
│   ├── App.css              # App-specific styles (radar, cards, chat window)
│   ├── index.css            # Global design system (tokens, layout, utilities)
│   └── mockDb.js            # localStorage mock database + service API
└── reference/               # Original TorjanHorse_ET-5 reference repo (read-only)
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js ≥ 18
- npm ≥ 9

### Installation

```bash
# Clone or navigate to the project directory
cd portal

# Install dependencies
npm install

# Start the development server
npm run dev
```

The app will be available at **http://localhost:5173**.

### Build for Production

```bash
npm run build
# Output is in dist/
```

### Preview Production Build

```bash
npm run preview
```

---

## 🎭 Role Portals

### 🎓 Student Portal
Switch between demo students (Aadi, Vraj, Sneha) using the sidebar switcher.

- **Dashboard** — Stat cards (PBL avg, tasks completed, next deadline), SVG radar chart, dimension progress bars, score progression line chart, milestone timeline stepper, teacher feedback with AI-identified strengths and improvement areas
- **Task Board** — Kanban view of all assigned tasks filtered by selected student; click any card to cycle its status
- **AI Chat Mentor** — Conversational assistant with contextual keyword responses across all 6 PBL dimensions; quick-reply suggestion chips included

### 👪 Parent Portal
- Monitors any child linked by `parent_id`; switch between children via the top selector
- Shows attendance status, milestone adherence, overall PBL rating
- Dimension progress bars and dynamic score history chart
- Latest teacher assessment comments with identified strengths and focus areas

### 👩‍🏫 Teacher Portal
Three tabbed sections accessible from the sidebar:

- **Classroom Overview** — Student roster cards showing latest PBL average and task completion; one-click jump to grade or view student dashboard
- **PBL Dimension Grader** — Select student, adjust 6 sliders (30–100%), write remarks, publish scores; triggers audit log entry and toast confirmation
- **Add Tasks / Milestones** — Create new project milestones or assign tasks to any student with priority, milestone group, and deadline

### 🏫 HOD Portal
Department Head analytics panel with three tabs:

- **Department Metrics** — Department-wide PBL average, faculty count, milestone status; SVG bar chart comparing grades across subject areas
- **Teacher Ratings** — Roster of teachers with grading counts and HOD performance ratings
- **Student Search** — Live-search index of all students with latest scores and inspect links

### 🛡️ Super Admin Portal
Two tabbed sections:

- **Schools & Security** — System status cards, list of all school districts with RLS toggle (Row Level Security on/off per school), CORS firewall configuration editor
- **Audit Trails** — Scrollable real-time log of all platform events with timestamps, action types, and status badges

---

## 💾 Mock Database (`mockDb.js`)

The `mockDb.js` module provides a complete service layer over `localStorage`. It seeds initial data on first load and persists all mutations across page refreshes.

### Seeded Data

| Entity | Count | Details |
|---|---|---|
| **Schools** | 3 | Oakridge (Active, RLS on), Metro (Active, RLS on), St. Augustine (Maintenance, RLS off) |
| **Users** | 7 | 1 Super Admin, 1 HOD, 1 Teacher, 1 Parent, 3 Students |
| **Projects** | 1 | AI-Powered Smart Chatbot Hub |
| **PBL Scores** | 6 | 3 evaluations for Aadi, 2 for Vraj, 1 for Sneha |
| **Milestones** | 4 | Research → Design → Development → Testing |
| **Tasks** | 9 | Spread across all milestones and students |
| **Audit Logs** | 3 | Pre-seeded system events |

### API Methods

```javascript
dbAPI.getUsers()
dbAPI.getSchools()
dbAPI.updateSchool(id, fields)
dbAPI.getPblScores(studentId)
dbAPI.savePblScore(score)
dbAPI.getMilestones()
dbAPI.addMilestone(milestone)
dbAPI.getTasks()
dbAPI.saveTask(task)        // creates if no id match, updates if found
dbAPI.deleteTask(taskId)
dbAPI.getLogs()
dbAPI.addLog(action, user, details, status)
dbAPI.getAiResponse(message, studentName)
```

### Reset Database
Click the **↺** (refresh icon) button in the top-right of the header to wipe `localStorage` and reload all seed data.

---

## 🎨 Design System

The design is defined entirely through CSS custom properties in `index.css`.

### Color Tokens

```css
--primary:   hsl(250, 85%, 60%)   /* Deep Indigo */
--secondary: hsl(180, 90%, 45%)   /* Cyber Teal */
--success:   hsl(145, 80%, 42%)
--warning:   hsl(38,  90%, 50%)
--danger:    hsl(355, 85%, 55%)
```

### Theme Modes
Dark mode is the default. Toggle via the sun/moon button in the header. The selected theme is persisted in `localStorage`.

### Key CSS Classes

| Class | Purpose |
|---|---|
| `.glass-panel` | Frosted glass container with backdrop-filter blur |
| `.glass-card` | Card with hover lift animation and border glow |
| `.stat-card` | Extends glass-card with CSS shimmer sweep animation |
| `.dashboard-grid` | 12-column CSS grid system |
| `.tab-btn` | Tab navigation buttons |
| `.progress-bar` | Animated progress bars |
| `.chat-bubble` | Chat message bubbles |
| `.milestone-step` | Vertical timeline stepper row |
| `.toast` | Slide-in toast notification system |
| `.animate-fade` | Portal entry animations |

---

## 📈 SVG Charts

All charts are hand-crafted SVGs — no chart library is used.

| Chart | Location | Description |
|---|---|---|
| **Radar Chart** | Student Dashboard | 6-axis polygon rendered via trigonometry; filled area with glow gradient |
| **Score Line Chart**| Student & Parent Portals| Dynamic polyline + area fill; adapts to any number of evaluations |
| **Bar Chart** | HOD Analytics | Fixed 3-bar comparison across subject areas |

---

## 🤖 AI Chat Mentor

The AI Mentor (`dbAPI.getAiResponse`) uses keyword matching to return contextual advice across all 6 PBL dimensions:

| Keywords | Response Topic |
|---|---|
| `research`, `planning`, `competitor` | Research & Analysis strategies |
| `database`, `schema`, `sql` | Technical schema and RLS guidance |
| `time`, `deadline`, `milestone` | Time Management best practices |
| `team`, `collab`, `github` | Teamwork & Collaboration advice |
| `presentation`, `demo`, `slides` | Presentation & Communication tips |
| `api`, `fastapi`, `react`, `code`| Technical Skills implementation |

---

## 📚 Reference

This platform was built as a superior alternative to the [TorjanHorse_ET-5](https://github.com/AadiGS/TorjanHorse_ET-5) reference project. The `/reference` directory contains the original repo (cloned during scaffolding) for architectural comparison.

---

## 📄 License

Private — AMEP Elite PBL Platform © 2026. All rights reserved.
