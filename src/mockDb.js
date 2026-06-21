// State-of-the-art interactive mock database for AMEP Elite PBL Platform
// Persists in localStorage for a full local interactive experience.

const STORAGE_KEY = 'amep_elite_db';

const initialSchools = [
  { id: 'sch-1', name: 'Oakridge Science & Tech Academy', HODs: 3, teachers: 18, students: 245, status: 'Active', region: 'North', RLS: true },
  { id: 'sch-2', name: 'Metro Science High School', HODs: 2, teachers: 12, students: 180, status: 'Active', region: 'East', RLS: true },
  { id: 'sch-3', name: 'St. Augustine International School', HODs: 4, teachers: 22, students: 310, status: 'Maintenance', region: 'West', RLS: false }
];

const initialUsers = [
  // Super Admin
  { id: 'usr-admin', full_name: 'Dev Somaiya', email: 'admin@example.com', role: 'SUPER_ADMIN', avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=admin' },
  // HOD
  { id: 'usr-hod', full_name: 'Dr. Ramesh Soni', email: 'hod@example.com', role: 'HOD', school_id: 'sch-1', department: 'Computer Science', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=ramesh' },
  // Teacher
  { id: 'usr-teacher', full_name: 'Mrs. Ananya Sharma', email: 'teacher@example.com', role: 'TEACHER', school_id: 'sch-1', subject: 'Software Engineering', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=ananya' },
  // Parent
  { id: 'usr-parent', full_name: 'Vrindaa Somaiya', email: 'vrindaa@example.com', role: 'PARENT', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=vrindaa' },
  // Students
  { id: 'usr-aadi', full_name: 'Aadi Somaiya', email: 'aadi@example.com', role: 'STUDENT', parent_id: 'usr-parent', grade: 'Grade 10-A', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=aadi' },
  { id: 'usr-vraj', full_name: 'Vraj Soni', email: 'vraj@example.com', role: 'STUDENT', parent_id: 'usr-parent', grade: 'Grade 10-A', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=vraj' },
  { id: 'usr-sneha', full_name: 'Sneha Reddy', email: 'sneha@example.com', role: 'STUDENT', parent_id: 'usr-parent2', grade: 'Grade 10-A', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sneha' }
];

const initialProjects = [
  { id: 'proj-1', name: 'AI-Powered Smart Chatbot Hub', description: 'Design and build an intelligent RAG-based virtual assistant for customer support operations.', school_id: 'sch-1', department: 'Computer Science' }
];

const initialPblScores = [
  // Aadi's Project 1
  {
    id: 'score-aadi-1',
    student_id: 'usr-aadi',
    project_id: 'proj-1',
    research_score: 88,
    teamwork_score: 92,
    presentation_score: 85,
    innovation_score: 90,
    technical_score: 87,
    time_management_score: 84,
    overall_score: 88,
    teacher_feedback: 'Excellent work on the AI chatbot project! Strong research skills and great team collaboration.',
    ai_feedback: {
      strengths: ['Research & Analysis', 'Teamwork & Collaboration'],
      improvements: ['Presentation & Communication', 'Time Management']
    },
    graded_by: 'usr-teacher',
    graded_at: '2026-06-06T14:30:00Z'
  },
  // Aadi's Project 2 (Historic)
  {
    id: 'score-aadi-2',
    student_id: 'usr-aadi',
    project_id: 'proj-1',
    research_score: 90,
    teamwork_score: 88,
    presentation_score: 93,
    innovation_score: 91,
    technical_score: 89,
    time_management_score: 87,
    overall_score: 90,
    teacher_feedback: 'Outstanding presentation skills! The interactive demo was highly structured and fluid.',
    ai_feedback: {
      strengths: ['Presentation & Communication', 'Innovation & Problem-Solving'],
      improvements: []
    },
    graded_by: 'usr-teacher',
    graded_at: '2026-06-13T10:15:00Z'
  },
  // Aadi's Project 3 (Recent)
  {
    id: 'score-aadi-3',
    student_id: 'usr-aadi',
    project_id: 'proj-1',
    research_score: 92,
    teamwork_score: 90,
    presentation_score: 89,
    innovation_score: 94,
    technical_score: 95,
    time_management_score: 91,
    overall_score: 92,
    teacher_feedback: 'Superb technical execution! Code quality is enterprise-grade, clean modularity, and excellent API endpoints.',
    ai_feedback: {
      strengths: ['Technical Skills', 'Innovation & Problem-Solving'],
      improvements: ['Time Management']
    },
    graded_by: 'usr-teacher',
    graded_at: '2026-06-19T16:45:00Z'
  },
  // Vraj's Project 1
  {
    id: 'score-vraj-1',
    student_id: 'usr-vraj',
    project_id: 'proj-1',
    research_score: 76,
    teamwork_score: 80,
    presentation_score: 72,
    innovation_score: 82,
    technical_score: 78,
    time_management_score: 70,
    overall_score: 76,
    teacher_feedback: 'Good effort! Need to improve milestone adherence and slide presentation layout.',
    ai_feedback: {
      strengths: ['Innovation & Problem-Solving'],
      improvements: ['Time Management', 'Presentation & Communication']
    },
    graded_by: 'usr-teacher',
    graded_at: '2026-06-09T11:00:00Z'
  },
  // Vraj's Project 2 (Recent)
  {
    id: 'score-vraj-2',
    student_id: 'usr-vraj',
    project_id: 'proj-1',
    research_score: 78,
    teamwork_score: 82,
    presentation_score: 75,
    innovation_score: 80,
    technical_score: 76,
    time_management_score: 78,
    overall_score: 78,
    teacher_feedback: 'Significant improvement in meeting due dates and active teamwork updates. Keep this momentum!',
    ai_feedback: {
      strengths: ['Teamwork & Collaboration', 'Time Management'],
      improvements: ['Presentation & Communication']
    },
    graded_by: 'usr-teacher',
    graded_at: '2026-06-16T15:20:00Z'
  },
  // Sneha's Project 1
  {
    id: 'score-sneha-1',
    student_id: 'usr-sneha',
    project_id: 'proj-1',
    research_score: 84,
    teamwork_score: 79,
    presentation_score: 88,
    innovation_score: 77,
    technical_score: 81,
    time_management_score: 85,
    overall_score: 82,
    teacher_feedback: 'Sneha demonstrated excellent communication and presentation quality. Research depth can be further enriched.',
    ai_feedback: {
      strengths: ['Presentation & Communication', 'Time Management'],
      improvements: ['Innovation & Problem-Solving']
    },
    graded_by: 'usr-teacher',
    graded_at: '2026-06-18T09:30:00Z'
  }
];

const initialMilestones = [
  { id: 'ms-1', project_id: 'proj-1', name: 'Research & Planning', description: 'Analyze competitor chatbot assistants, compile specifications, and construct detailed Gantt flow.', order: 1, due_date: '2026-06-01', status: 'COMPLETED', progress: 100 },
  { id: 'ms-2', project_id: 'proj-1', name: 'Design & Prototyping', description: 'Map comprehensive UI flows in Figma and draft SQL schema with database relationships.', order: 2, due_date: '2026-06-10', status: 'COMPLETED', progress: 100 },
  { id: 'ms-3', project_id: 'proj-1', name: 'Development & Core API', description: 'Implement backend router endpoints using FastAPI, build React component hierarchies.', order: 3, due_date: '2026-06-25', status: 'IN_PROGRESS', progress: 75 },
  { id: 'ms-4', project_id: 'proj-1', name: 'Testing & Documentation', description: 'Validate API endpoints, conduct load testing, and write user deployment manuals.', order: 4, due_date: '2026-07-05', status: 'NOT_STARTED', progress: 0 }
];

const initialTasks = [
  { id: 'tsk-1', milestone_id: 'ms-1', name: 'Market Competitor Analysis', description: 'Analyze 5 top AI chatbot engines, noting performance and API architectures.', assigned_to: 'usr-aadi', status: 'COMPLETED', priority: 'HIGH', due_date: '2026-05-25', completed_at: '2026-05-24', est_hours: 8, act_hours: 7.5 },
  { id: 'tsk-2', milestone_id: 'ms-1', name: 'Functional Specification Sheet', description: 'Define core user stories, administrator requirements, and MVP scope.', assigned_to: 'usr-vraj', status: 'COMPLETED', priority: 'HIGH', due_date: '2026-05-28', completed_at: '2026-05-28', est_hours: 6, act_hours: 8 },
  
  { id: 'tsk-3', milestone_id: 'ms-2', name: 'Figma Wireframing', description: 'Design hi-fi dashboards for user chats, logs viewer, and agent parameters.', assigned_to: 'usr-aadi', status: 'COMPLETED', priority: 'MEDIUM', due_date: '2026-06-05', completed_at: '2026-06-04', est_hours: 10, act_hours: 12 },
  { id: 'tsk-4', milestone_id: 'ms-2', name: 'Database ER Schema', description: 'Draft SQL file for tables, security parameters, and index optimizations.', assigned_to: 'usr-vraj', status: 'COMPLETED', priority: 'HIGH', due_date: '2026-06-08', completed_at: '2026-06-08', est_hours: 5, act_hours: 6 },
  
  { id: 'tsk-5', milestone_id: 'ms-3', name: 'FastAPI Backend Router', description: 'Program JWT authentication, chats management endpoints, and local RAG retrieval logic.', assigned_to: 'usr-aadi', status: 'COMPLETED', priority: 'URGENT', due_date: '2026-06-18', completed_at: '2026-06-17', est_hours: 20, act_hours: 18 },
  { id: 'tsk-6', milestone_id: 'ms-3', name: 'React Component Hierarchy', description: 'Develop chatbot window UI, history sidebars, and customizable theme settings.', assigned_to: 'usr-vraj', status: 'IN_PROGRESS', priority: 'URGENT', due_date: '2026-06-23', est_hours: 15, act_hours: null },
  { id: 'tsk-7', milestone_id: 'ms-3', name: 'Frontend API Integration', description: 'Wire client-side services to communicate with backend REST endpoints.', assigned_to: 'usr-aadi', status: 'IN_PROGRESS', priority: 'HIGH', due_date: '2026-06-24', est_hours: 8, act_hours: null },
  
  { id: 'tsk-8', milestone_id: 'ms-4', name: 'Pytest Unit Tests', description: 'Write backend testing suites to validate RAG vectors and router authorizations.', assigned_to: 'usr-vraj', status: 'PENDING', priority: 'MEDIUM', due_date: '2026-06-30', est_hours: 12, act_hours: null },
  { id: 'tsk-9', milestone_id: 'ms-4', name: 'API Reference Manual', description: 'Generate Swagger endpoints descriptions and deployment scripts guide.', assigned_to: 'usr-aadi', status: 'PENDING', priority: 'LOW', due_date: '2026-07-02', est_hours: 6, act_hours: null }
];

const initialLogs = [
  { id: 'log-1', timestamp: '2026-06-21T10:12:00Z', action: 'Security RLS Policy Update', user: 'Dev Somaiya', details: 'Enabled Row Level Security on table `pbl_dimension_scores` for school-1.', status: 'SUCCESS' },
  { id: 'log-2', timestamp: '2026-06-21T11:05:00Z', action: 'Teacher Registration', user: 'Dev Somaiya', details: 'Added new teacher Mrs. Ananya Sharma to school-1 Computer Science.', status: 'SUCCESS' },
  { id: 'log-3', timestamp: '2026-06-21T11:22:00Z', action: 'PBL Score Published', user: 'Mrs. Ananya Sharma', details: 'Published scores for Aadi Somaiya (Project 1 - 92%).', status: 'SUCCESS' }
];

// Initialize DB if not present
export const getDb = () => {
  const data = localStorage.getItem(STORAGE_KEY);
  if (!data) {
    const db = {
      schools: initialSchools,
      users: initialUsers,
      projects: initialProjects,
      pblScores: initialPblScores,
      milestones: initialMilestones,
      tasks: initialTasks,
      logs: initialLogs
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(db));
    return db;
  }
  return JSON.parse(data);
};

export const saveDb = (db) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(db));
};

export const resetDb = () => {
  localStorage.removeItem(STORAGE_KEY);
  return getDb();
};

// Database APIs
export const dbAPI = {
  // Users
  getUsers: () => getDb().users,
  getStudents: () => getDb().users.filter(u => u.role === 'STUDENT'),
  getParents: () => getDb().users.filter(u => u.role === 'PARENT'),
  getTeachers: () => getDb().users.filter(u => u.role === 'TEACHER'),
  
  // Schools
  getSchools: () => getDb().schools,
  updateSchool: (schoolId, updatedFields) => {
    const db = getDb();
    db.schools = db.schools.map(s => s.id === schoolId ? { ...s, ...updatedFields } : s);
    db.logs.unshift({
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString(),
      action: 'School Configuration Changed',
      user: 'Dev Somaiya',
      details: `Updated parameters for school ID: ${schoolId}`,
      status: 'SUCCESS'
    });
    saveDb(db);
    return db.schools;
  },

  // PBL Scores
  getPblScores: (studentId) => {
    const db = getDb();
    return db.pblScores.filter(s => s.student_id === studentId);
  },
  
  savePblScore: (score) => {
    const db = getDb();
    const index = db.pblScores.findIndex(s => s.student_id === score.student_id && s.id === score.id);
    if (index !== -1) {
      db.pblScores[index] = { ...db.pblScores[index], ...score, graded_at: new Date().toISOString() };
    } else {
      db.pblScores.push({
        id: `score-${Date.now()}`,
        graded_at: new Date().toISOString(),
        ...score
      });
    }
    
    // Add audit log
    const student = db.users.find(u => u.id === score.student_id);
    db.logs.unshift({
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString(),
      action: 'PBL Dimension Grading',
      user: 'Mrs. Ananya Sharma',
      details: `Graded PBL scores for student ${student ? student.full_name : score.student_id}. Overall Score: ${score.overall_score}%`,
      status: 'SUCCESS'
    });
    
    saveDb(db);
    return db.pblScores;
  },

  // Milestones
  getMilestones: () => getDb().milestones,
  addMilestone: (milestone) => {
    const db = getDb();
    const newMs = {
      id: `ms-${Date.now()}`,
      project_id: 'proj-1',
      progress: 0,
      status: 'NOT_STARTED',
      order: db.milestones.length + 1,
      ...milestone
    };
    db.milestones.push(newMs);
    saveDb(db);
    return db.milestones;
  },
  
  updateMilestone: (msId, fields) => {
    const db = getDb();
    db.milestones = db.milestones.map(m => m.id === msId ? { ...m, ...fields } : m);
    saveDb(db);
    return db.milestones;
  },

  // Tasks
  getTasks: () => getDb().tasks,
  saveTask: (task) => {
    const db = getDb();
    const index = db.tasks.findIndex(t => t.id === task.id);
    if (index !== -1) {
      // Check if task status changed to completed, log completion date
      let completed_at = db.tasks[index].completed_at;
      if (task.status === 'COMPLETED' && db.tasks[index].status !== 'COMPLETED') {
        completed_at = new Date().toISOString().split('T')[0];
      } else if (task.status !== 'COMPLETED') {
        completed_at = null;
      }
      db.tasks[index] = { ...db.tasks[index], ...task, completed_at };
    } else {
      const newTask = {
        id: `tsk-${Date.now()}`,
        status: 'PENDING',
        act_hours: null,
        ...task
      };
      db.tasks.push(newTask);
    }
    
    // Dynamically recalculate milestone progress
    const allTasks = db.tasks;
    db.milestones = db.milestones.map(m => {
      const msTasks = allTasks.filter(t => t.milestone_id === m.id);
      if (msTasks.length === 0) return m;
      const completed = msTasks.filter(t => t.status === 'COMPLETED').length;
      const progress = Math.round((completed / msTasks.length) * 100);
      let status = 'NOT_STARTED';
      if (progress === 100) status = 'COMPLETED';
      else if (progress > 0) status = 'IN_PROGRESS';
      return { ...m, progress, status };
    });

    saveDb(db);
    return db;
  },
  
  deleteTask: (taskId) => {
    const db = getDb();
    db.tasks = db.tasks.filter(t => t.id !== taskId);
    saveDb(db);
    return db.tasks;
  },

  // Logs
  getLogs: () => getDb().logs,
  addLog: (action, user, details, status = 'SUCCESS') => {
    const db = getDb();
    db.logs.unshift({
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString(),
      action,
      user,
      details,
      status
    });
    saveDb(db);
    return db.logs;
  },

  // AI Mentor Mock Responses
  getAiResponse: (message, studentName) => {
    const text = message.toLowerCase();
    const student = studentName || 'Student';
    
    if (text.includes('research') || text.includes('planning') || text.includes('competitor')) {
      return `Hello ${student}! Regarding your research phase: Ensure you analyze competitor tools using a SWOT table. Break down their data-fetching models, noting how they handle latency. This will elevate your *Research & Analysis* PBL dimension score (currently targetting 90%+).`;
    }
    if (text.includes('database') || text.includes('schema') || text.includes('sql') || text.includes('supabase')) {
      return `Hi ${student}. For your database design: Ensure you specify foreign keys with 'ON DELETE CASCADE' actions to avoid orphan rows. Also, setting up Row Level Security (RLS) is key to protecting data. This addresses the *Technical Skills* and *Innovation* dimensions.`;
    }
    if (text.includes('time') || text.includes('deadline') || text.includes('late') || text.includes('milestone')) {
      return `Hi ${student}. Managing your time: Try breaking tasks into 2-hour sub-tasks. Update your task board daily. Remember, the *Time Management* dimension tracks actual hours vs estimated hours. Try to keep deviations under 15%!`;
    }
    if (text.includes('team') || text.includes('collab') || text.includes('share') || text.includes('github')) {
      return `Greetings ${student}. Collaboration is core to PBL! Ensure you commit features in separate git branches. Perform review approvals before merging. This is highly regarded for your *Teamwork & Collaboration* rating.`;
    }
    if (text.includes('presentation') || text.includes('demo') || text.includes('slides') || text.includes('explain')) {
      return `Hi ${student}! For the presentation milestones: Focus on presenting the user story first before jumping into backend code. Use visual flowcharts for your architecture. This will boost your *Presentation & Communication* score.`;
    }
    if (text.includes('api') || text.includes('fastapi') || text.includes('react') || text.includes('code')) {
      return `Hello ${student}. For code implementation: Keep controllers separate from models. Validate payloads on the endpoint using schemas (like FastAPI Pydantic models). This will ensure your *Technical Skills* remain top tier.`;
    }

    return `Hi ${student}! I am your AI PBL Mentor. I can give you advice to improve your project milestones across our 6 grading dimensions: Research, Teamwork, Presentation, Innovation, Technical, and Time Management. Ask me anything about databases, API coding, slide design, or team coordination!`;
  }
};
