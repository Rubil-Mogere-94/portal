import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  Shield, Award, TrendingUp, Users, BookOpen, Settings, CheckSquare, 
  MessageSquare, Calendar, ArrowRight, Search, Database, Activity, 
  FileText, Check, Plus, Trash2, Sun, Moon, RefreshCw, AlertCircle, 
  CheckCircle2, MapPin, Sliders, X, ChevronRight, GraduationCap, Play, Lock, Unlock, HelpCircle,
  Bell, BarChart3, Target, Zap
} from 'lucide-react';
import { dbAPI, resetDb } from './mockDb';
import './App.css';

// ======= TOAST SYSTEM =======
function ToastContainer({ toasts, dismiss }) {
  return (
    <div className="toast-container">
      {toasts.map(t => (
        <div
          key={t.id}
          className={`toast toast-${t.type} ${t.dismissing ? 'dismissing' : ''}`}
          onClick={() => dismiss(t.id)}
        >
          <div className="toast-icon">
            {t.type === 'success' && <CheckCircle2 size={16} />}
            {t.type === 'error' && <AlertCircle size={16} />}
            {t.type === 'info' && <Bell size={16} />}
            {t.type === 'warning' && <AlertCircle size={16} />}
          </div>
          <div style={{ flex: 1 }}>
            <div className="toast-title">{t.title}</div>
            {t.desc && <div className="toast-desc">{t.desc}</div>}
          </div>
          <X size={14} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
        </div>
      ))}
    </div>
  );
}

export default function App() {
  // Theme state
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('theme');
    return saved || 'dark';
  });

  // Toast notification state
  const [toasts, setToasts] = useState([]);
  const toastTimers = useRef({});

  const showToast = useCallback((title, desc = '', type = 'success') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, title, desc, type, dismissing: false }]);
    toastTimers.current[id] = setTimeout(() => dismissToast(id), 4000);
  }, []);

  const dismissToast = useCallback((id) => {
    clearTimeout(toastTimers.current[id]);
    setToasts(prev => prev.map(t => t.id === id ? { ...t, dismissing: true } : t));
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 350);
  }, []);

  // DB state
  const [db, setDb] = useState(dbAPI.getSchools); // trigger reload
  const [logs, setLogs] = useState([]);
  const [users, setUsers] = useState([]);
  const [schools, setSchools] = useState([]);
  
  // Navigation state
  const [activeRole, setActiveRole] = useState('STUDENT');
  const [activeTab, setActiveTab] = useState('dashboard');
  
  // Selection states
  const [selectedStudentId, setSelectedStudentId] = useState('usr-aadi');
  const [selectedSchoolId, setSelectedSchoolId] = useState('sch-1');
  const [selectedClassroom, setSelectedClassroom] = useState('Computer Science');
  
  // Form and chat inputs
  const [chatMessage, setChatMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([
    { sender: 'bot', text: 'Welcome to AMEP Elite Chat! I am your AI PBL Mentor. Ask me questions about database schemas, API architecture, teamwork workflows, or presentation layouts to get tips on boosting your PBL scores.' }
  ]);
  
  // Grading form state
  const [gradingStudent, setGradingStudent] = useState('usr-aadi');
  const [researchScore, setResearchScore] = useState(85);
  const [teamworkScore, setTeamworkScore] = useState(85);
  const [presentationScore, setPresentationScore] = useState(85);
  const [innovationScore, setInnovationScore] = useState(85);
  const [technicalScore, setTechnicalScore] = useState(85);
  const [timeMgmtScore, setTimeMgmtScore] = useState(85);
  const [teacherFeedbackText, setTeacherFeedbackText] = useState('');

  // Milestone / Task form state
  const [newMilestoneName, setNewMilestoneName] = useState('');
  const [newMilestoneDesc, setNewMilestoneDesc] = useState('');
  const [newTaskName, setNewTaskName] = useState('');
  const [newTaskDesc, setNewTaskDesc] = useState('');
  const [newTaskAssignee, setNewTaskAssignee] = useState('usr-aadi');
  const [newTaskMilestoneId, setNewTaskMilestoneId] = useState('ms-3');
  const [newTaskPriority, setNewTaskPriority] = useState('MEDIUM');
  
  // Search query for HOD
  const [hodSearchQuery, setHodSearchQuery] = useState('');

  // Auto-scroll chat window
  const chatEndRef = useRef(null);

  // Sync theme
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Load and refresh DB values
  const refreshLocalState = () => {
    setLogs(dbAPI.getLogs());
    setUsers(dbAPI.getUsers());
    setSchools(dbAPI.getSchools());
    setDb(dbAPI.getSchools()); // arbitrary trigger
  };

  useEffect(() => {
    refreshLocalState();
  }, []);

  // Update tabs when role changes
  useEffect(() => {
    if (activeRole === 'STUDENT') setActiveTab('dashboard');
    else if (activeRole === 'PARENT') setActiveTab('dashboard');
    else if (activeRole === 'TEACHER') setActiveTab('classroom');
    else if (activeRole === 'HOD') setActiveTab('analytics');
    else if (activeRole === 'SUPER_ADMIN') setActiveTab('schools');
  }, [activeRole]);

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatHistory]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  const handleResetDb = () => {
    resetDb();
    refreshLocalState();
    dbAPI.addLog('Database Reset', 'System', 'Restored default dataset for demo presentation.', 'SUCCESS');
    refreshLocalState();
    showToast('Database Reset', 'All data restored to defaults.', 'info');
  };

  // Submit Chat Message
  const handleSendMessage = (e, textOverride = '') => {
    if (e) e.preventDefault();
    const queryText = textOverride || chatMessage;
    if (!queryText.trim()) return;

    const student = users.find(u => u.id === selectedStudentId);
    const studentName = student ? student.full_name : 'Student';

    const userMsg = { sender: 'user', text: queryText };
    setChatHistory(prev => [...prev, userMsg]);
    setChatMessage('');

    // Simulate AI thinking and reply
    setTimeout(() => {
      const responseText = dbAPI.getAiResponse(queryText, studentName);
      setChatHistory(prev => [...prev, { sender: 'bot', text: responseText }]);
      dbAPI.addLog('AI Chatbot Query', studentName, `Inquired about: "${queryText.substring(0, 30)}..."`, 'SUCCESS');
      refreshLocalState();
    }, 600);
  };

  // Submit Grade
  const handlePublishGrade = (e) => {
    e.preventDefault();
    const overall = Math.round(
      (researchScore + teamworkScore + presentationScore + innovationScore + technicalScore + timeMgmtScore) / 6
    );

    const strengths = [];
    const improvements = [];

    const scoresMap = {
      'Research & Analysis': researchScore,
      'Teamwork & Collaboration': teamworkScore,
      'Presentation & Communication': presentationScore,
      'Innovation & Problem-Solving': innovationScore,
      'Technical Skills': technicalScore,
      'Time Management': timeMgmtScore
    };

    Object.entries(scoresMap).forEach(([name, val]) => {
      if (val >= 88) strengths.push(name);
      if (val < 78) improvements.push(name);
    });

    const newScore = {
      student_id: gradingStudent,
      project_id: 'proj-1',
      research_score: researchScore,
      teamwork_score: teamworkScore,
      presentation_score: presentationScore,
      innovation_score: innovationScore,
      technical_score: technicalScore,
      time_management_score: timeMgmtScore,
      overall_score: overall,
      teacher_feedback: teacherFeedbackText || 'Performance evaluated across all standard project domains.',
      ai_feedback: { strengths, improvements }
    };

    dbAPI.savePblScore(newScore);
    setTeacherFeedbackText('');
    refreshLocalState();
    showToast('Scores Published!', `PBL evaluation for student logged to audit trails.`, 'success');
  };

  // Add Milestone
  const handleAddMilestone = (e) => {
    e.preventDefault();
    if (!newMilestoneName) return;

    dbAPI.addMilestone({
      name: newMilestoneName,
      description: newMilestoneDesc || 'No description provided'
    });
    setNewMilestoneName('');
    setNewMilestoneDesc('');
    refreshLocalState();
    showToast('Milestone Created', `"${newMilestoneName}" added to project.`, 'success');
  };

  // Add Task
  const handleAddTask = (e) => {
    e.preventDefault();
    if (!newTaskName) return;

    dbAPI.saveTask({
      milestone_id: newTaskMilestoneId,
      name: newTaskName,
      description: newTaskDesc || 'No description provided',
      assigned_to: newTaskAssignee,
      priority: newTaskPriority,
      due_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      est_hours: 8
    });

    setNewTaskName('');
    setNewTaskDesc('');
    refreshLocalState();
    showToast('Task Assigned', `"${newTaskName}" added to student board.`, 'success');
  };

  // Move Task Status
  const handleToggleTaskStatus = (task) => {
    let nextStatus = 'PENDING';
    if (task.status === 'PENDING') nextStatus = 'IN_PROGRESS';
    else if (task.status === 'IN_PROGRESS') nextStatus = 'COMPLETED';
    else nextStatus = 'PENDING';

    dbAPI.saveTask({ ...task, status: nextStatus });
    refreshLocalState();
  };

  // Delete Task
  const handleDeleteTask = (taskId) => {
    dbAPI.deleteTask(taskId);
    refreshLocalState();
  };

  // Toggle RLS
  const handleToggleRLS = (schoolId, currentStatus) => {
    dbAPI.updateSchool(schoolId, { RLS: !currentStatus });
    refreshLocalState();
  };

  // RADAR CHART COMPONENT (SVG-Based for maximum design control and reactivity)
  const RadarChart = ({ scores }) => {
    if (!scores) return null;
    const dimensions = [
      { name: 'Research', val: scores.research_score },
      { name: 'Teamwork', val: scores.teamwork_score },
      { name: 'Presentation', val: scores.presentation_score },
      { name: 'Innovation', val: scores.innovation_score },
      { name: 'Technical', val: scores.technical_score },
      { name: 'Time Mgmt', val: scores.time_management_score }
    ];

    const width = 300;
    const height = 300;
    const cx = width / 2;
    const cy = height / 2;
    const r = 95; // max radius

    // Generate grid rings (20%, 40%, 60%, 80%, 100%)
    const rings = [0.2, 0.4, 0.6, 0.8, 1];
    const ringPolygons = rings.map(scale => {
      return dimensions.map((d, i) => {
        const angle = i * (Math.PI / 3);
        const x = cx + r * scale * Math.sin(angle);
        const y = cy - r * scale * Math.cos(angle);
        return `${x},${y}`;
      }).join(' ');
    });

    // Score polygon
    const scorePoints = dimensions.map((d, i) => {
      const angle = i * (Math.PI / 3);
      const valScale = Math.max(10, d.val) / 100;
      const x = cx + r * valScale * Math.sin(angle);
      const y = cy - r * valScale * Math.cos(angle);
      return `${x},${y}`;
    }).join(' ');

    return (
      <div className="radar-chart-container animate-fade">
        <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
          <defs>
            <radialGradient id="radarGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.4" />
              <stop offset="100%" stopColor="var(--primary)" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Grid Rings */}
          {ringPolygons.map((points, idx) => (
            <polygon 
              key={idx} 
              points={points} 
              fill="none" 
              stroke="var(--border-color)" 
              strokeWidth="1" 
              strokeDasharray={idx < 4 ? "3,3" : "none"}
            />
          ))}

          {/* Web Lines (axes) */}
          {dimensions.map((d, i) => {
            const angle = i * (Math.PI / 3);
            const x = cx + r * Math.sin(angle);
            const y = cy - r * Math.cos(angle);
            return (
              <line 
                key={i} 
                x1={cx} 
                y1={cy} 
                x2={x} 
                y2={y} 
                stroke="var(--border-color)" 
                strokeWidth="1" 
              />
            );
          })}

          {/* Filled Score Area */}
          <polygon 
            points={scorePoints} 
            fill="url(#radarGlow)" 
            stroke="var(--primary)" 
            strokeWidth="3" 
          />

          {/* Data Points */}
          {dimensions.map((d, i) => {
            const angle = i * (Math.PI / 3);
            const valScale = Math.max(10, d.val) / 100;
            const x = cx + r * valScale * Math.sin(angle);
            const y = cy - r * valScale * Math.cos(angle);
            return (
              <circle 
                key={i} 
                cx={x} 
                cy={y} 
                r="4.5" 
                fill="var(--secondary)" 
                stroke="var(--bg-sidebar)" 
                strokeWidth="1.5" 
              />
            );
          })}

          {/* Text Labels */}
          {dimensions.map((d, i) => {
            const angle = i * (Math.PI / 3);
            // push text outward slightly
            const offset = 19;
            const labelX = cx + (r + offset) * Math.sin(angle);
            const labelY = cy - (r + offset) * Math.cos(angle) + 4;
            
            // Text alignment calculations
            let textAnchor = "middle";
            if (angle > 0.1 && angle < Math.PI - 0.1) textAnchor = "start";
            if (angle > Math.PI + 0.1 && angle < 2 * Math.PI - 0.1) textAnchor = "end";

            return (
              <g key={i}>
                <text 
                  x={labelX} 
                  y={labelY - 5} 
                  textAnchor={textAnchor}
                  className="radar-label"
                >
                  {d.name}
                </text>
                <text 
                  x={labelX} 
                  y={labelY + 7} 
                  textAnchor={textAnchor}
                  className="radar-value"
                >
                  {d.val}%
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    );
  };

  // Helper variables for dashboards
  const activeStudent = users.find(u => u.id === selectedStudentId);
  const activeStudentScoresList = dbAPI.getPblScores(selectedStudentId);
  const activeStudentLatestScore = activeStudentScoresList.length > 0 
    ? activeStudentScoresList[activeStudentScoresList.length - 1] 
    : { research_score: 50, teamwork_score: 50, presentation_score: 50, innovation_score: 50, technical_score: 50, time_management_score: 50, overall_score: 50, teacher_feedback: 'No scores yet.' };

  const currentTasks = dbAPI.getTasks();
  const currentMilestones = dbAPI.getMilestones();
  const allStudentScores = dbAPI.getPblScores(selectedStudentId);

  // ======= MILESTONE TIMELINE COMPONENT =======
  const MilestoneTimeline = () => (
    <div className="milestone-stepper">
      {currentMilestones.map((ms, idx) => {
        const statusClass = ms.status === 'COMPLETED' ? 'completed' : ms.status === 'IN_PROGRESS' ? 'in-progress' : 'not-started';
        const msTasks = currentTasks.filter(t => t.milestone_id === ms.id);
        const completedTasks = msTasks.filter(t => t.status === 'COMPLETED').length;
        return (
          <div key={ms.id} className={`milestone-step ${statusClass}`}>
            <div className={`milestone-dot ${statusClass}`}>
              {ms.status === 'COMPLETED' ? <Check size={14} /> : <span>{idx + 1}</span>}
            </div>
            <div className="milestone-content">
              <div className="flex justify-between align-center" style={{ flexWrap: 'wrap', gap: '4px' }}>
                <h4>{ms.name}</h4>
                <span className={`badge ${
                  ms.status === 'COMPLETED' ? 'badge-success' : 
                  ms.status === 'IN_PROGRESS' ? 'badge-primary' : 'badge-warning'
                }`} style={{ fontSize: '10px' }}>
                  {ms.status.replace('_', ' ')}
                </span>
              </div>
              <p>{ms.description}</p>
              <div className="flex align-center gap-2">
                <div className="progress-container" style={{ flex: 1, height: '6px' }}>
                  <div className="progress-bar" style={{ 
                    width: `${ms.progress}%`, 
                    background: ms.status === 'COMPLETED' ? 'var(--success)' : 'var(--primary)'
                  }} />
                </div>
                <span style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
                  {completedTasks}/{msTasks.length} tasks • Due {ms.due_date}
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );

  // ======= SCORE HISTORY LINE CHART =======
  const ScoreHistoryChart = ({ scores }) => {
    if (!scores || scores.length === 0) return (
      <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '40px', fontSize: '13px' }}>
        No historical scores yet
      </div>
    );

    const svgW = 420, svgH = 180;
    const padL = 44, padR = 16, padT = 20, padB = 40;
    const chartW = svgW - padL - padR;
    const chartH = svgH - padT - padB;
    const minScore = 50, maxScore = 100;

    const getX = (i) => padL + (i / Math.max(scores.length - 1, 1)) * chartW;
    const getY = (val) => padT + chartH - ((val - minScore) / (maxScore - minScore)) * chartH;

    const linePoints = scores.map((s, i) => `${getX(i)},${getY(s.overall_score)}`).join(' ');
    const areaPoints = [
      `${getX(0)},${padT + chartH}`,
      ...scores.map((s, i) => `${getX(i)},${getY(s.overall_score)}`),
      `${getX(scores.length - 1)},${padT + chartH}`
    ].join(' ');

    const labels = ['60%', '70%', '80%', '90%', '100%'];

    return (
      <svg viewBox={`0 0 ${svgW} ${svgH}`} width="100%" height={svgH} style={{ overflow: 'visible' }}>
        <defs>
          <linearGradient id="scoreAreaGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.3" />
            <stop offset="100%" stopColor="var(--primary)" stopOpacity="0" />
          </linearGradient>
        </defs>
        {/* Y Grid lines */}
        {labels.map((lbl, i) => {
          const y = getY(60 + i * 10);
          return (
            <g key={i}>
              <line x1={padL} y1={y} x2={svgW - padR} y2={y} stroke="var(--border-color)" strokeWidth="1" strokeDasharray={i < 4 ? '3,3' : 'none'} />
              <text x={padL - 6} y={y + 4} fill="var(--text-muted)" fontSize="9" fontWeight="600" textAnchor="end">{lbl}</text>
            </g>
          );
        })}
        {/* Area fill */}
        <polygon points={areaPoints} fill="url(#scoreAreaGrad)" />
        {/* Line */}
        <polyline points={linePoints} fill="none" stroke="var(--primary)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        {/* Dots + Labels */}
        {scores.map((s, i) => (
          <g key={i}>
            <circle className="score-dot" cx={getX(i)} cy={getY(s.overall_score)} r="5" fill="var(--secondary)" stroke="var(--bg-sidebar)" strokeWidth="2" />
            <text x={getX(i)} y={getY(s.overall_score) - 10} fill="var(--text-main)" fontSize="10" fontWeight="800" textAnchor="middle">{s.overall_score}%</text>
            <text x={getX(i)} y={svgH - 8} fill="var(--text-muted)" fontSize="9" fontWeight="600" textAnchor="middle">Eval {i + 1}</text>
          </g>
        ))}
      </svg>
    );
  };

  return (
    <div className="app-container">
      {/* 1. STATE-OF-THE-ART APP HEADER */}
      <header className="glass-panel" style={{ borderRadius: 0, borderBottom: '1px solid var(--border-color)', sticky: 'top', zIndex: 50 }}>
        <div className="main-content" style={{ padding: '12px 24px', display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          
          {/* Logo Title */}
          <div className="flex align-center gap-3">
            <div style={{ padding: '8px', background: 'var(--primary)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <GraduationCap size={24} color="white" />
            </div>
            <div>
              <h1 style={{ fontSize: '18px', fontWeight: '800', margin: 0, letterSpacing: '-0.02em', display: 'flex', alignItems: 'center', gap: '8px' }}>
                AMEP <span style={{ color: 'var(--primary)', fontSize: '13px', padding: '2px 8px', background: 'var(--primary-light)', borderRadius: '99px' }}>ELITE 5.0</span>
              </h1>
              <p style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Project-Based Learning Hub</p>
            </div>
          </div>

          {/* Role Switcher Toolbar */}
          <div className="flex align-center gap-2" style={{ background: 'var(--border-color)', padding: '4px', borderRadius: '12px' }}>
            <span style={{ fontSize: '10px', fontWeight: '800', textTransform: 'uppercase', color: 'var(--text-muted)', padding: '0 8px' }}>
              Role:
            </span>
            {[
              { id: 'SUPER_ADMIN', label: 'Super Admin', icon: Shield },
              { id: 'HOD', label: 'HOD', icon: Users },
              { id: 'TEACHER', label: 'Teacher', icon: Sliders },
              { id: 'STUDENT', label: 'Student', icon: BookOpen },
              { id: 'PARENT', label: 'Parent', icon: Award }
            ].map(role => {
              const Icon = role.icon;
              return (
                <button
                  key={role.id}
                  onClick={() => {
                    setActiveRole(role.id);
                    refreshLocalState();
                  }}
                  className="flex align-center gap-1"
                  style={{
                    border: 'none',
                    background: activeRole === role.id ? 'var(--bg-sidebar)' : 'transparent',
                    color: activeRole === role.id ? 'var(--primary)' : 'var(--text-muted)',
                    padding: '6px 12px',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '12px',
                    fontWeight: '700',
                    boxShadow: activeRole === role.id ? 'var(--shadow-sm)' : 'none',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <Icon size={14} />
                  <span className="hide-mobile">{role.label}</span>
                </button>
              );
            })}
          </div>

          {/* Utility Buttons */}
          <div className="flex align-center gap-3">
            <button 
              onClick={handleResetDb}
              title="Reset Database to default"
              className="flex align-center justify-center"
              style={{
                border: '1px solid var(--border-color)',
                background: 'transparent',
                color: 'var(--text-muted)',
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                cursor: 'pointer'
              }}
            >
              <RefreshCw size={16} />
            </button>
            
            <button 
              onClick={toggleTheme}
              className="flex align-center justify-center"
              style={{
                border: '1px solid var(--border-color)',
                background: 'transparent',
                color: 'var(--text-muted)',
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                cursor: 'pointer'
              }}
            >
              {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
            </button>
          </div>

        </div>
      </header>

      {/* 2. DYNAMIC WORKSPACE PORTALS */}
      <main className="main-content">
        
        {/* ==================== PORTAL A: STUDENT PORTAL ==================== */}
        {activeRole === 'STUDENT' && (
          <div className="dashboard-grid animate-fade">
            
            {/* Left Sidebar student info */}
            <div className="col-3 flex flex-col gap-4">
              <div className="glass-card" style={{ padding: '24px', textAlign: 'center' }}>
                <div style={{ position: 'relative', width: '90px', height: '90px', margin: '0 auto 16px' }}>
                  <img 
                    src={activeStudent?.avatar} 
                    alt="Student Avatar" 
                    style={{ width: '100%', height: '100%', borderRadius: '50%', background: 'var(--border-color)' }}
                  />
                  <span className="badge badge-success" style={{ position: 'absolute', bottom: 0, right: 0, border: '2px solid var(--bg-sidebar)' }}>
                    ONLINE
                  </span>
                </div>
                <h2 style={{ fontSize: '20px', fontWeight: '800' }}>{activeStudent?.full_name}</h2>
                <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '16px' }}>{activeStudent?.grade} • Computer Science</p>
                
                <div className="tab-list flex-col" style={{ background: 'transparent', gap: '6px' }}>
                  <button 
                    onClick={() => setActiveTab('dashboard')} 
                    className={`tab-btn ${activeTab === 'dashboard' ? 'active' : ''}`}
                    style={{ textAlign: 'left', justifyContent: 'flex-start' }}
                  >
                    <Award size={16} /> Dashboard
                  </button>
                  <button 
                    onClick={() => setActiveTab('tasks')} 
                    className={`tab-btn ${activeTab === 'tasks' ? 'active' : ''}`}
                    style={{ textAlign: 'left', justifyContent: 'flex-start' }}
                  >
                    <CheckSquare size={16} /> Task board
                  </button>
                  <button 
                    onClick={() => setActiveTab('chat')} 
                    className={`tab-btn ${activeTab === 'chat' ? 'active' : ''}`}
                    style={{ textAlign: 'left', justifyContent: 'flex-start' }}
                  >
                    <MessageSquare size={16} /> AI Chat Mentor
                  </button>
                </div>
              </div>

              {/* Student Switcher (Quick Demo) */}
              <div className="glass-panel" style={{ padding: '16px' }}>
                <p style={{ fontSize: '11px', fontWeight: '800', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '8px' }}>
                  Switch demo student:
                </p>
                <div className="flex flex-col gap-2">
                  {users.filter(u => u.role === 'STUDENT').map(stu => (
                    <button
                      key={stu.id}
                      onClick={() => {
                        setSelectedStudentId(stu.id);
                        if (gradingStudent === activeStudent.id) setGradingStudent(stu.id);
                      }}
                      className="flex align-center justify-between"
                      style={{
                        border: '1px solid var(--border-color)',
                        background: selectedStudentId === stu.id ? 'var(--primary-light)' : 'var(--bg-sidebar)',
                        color: selectedStudentId === stu.id ? 'var(--primary)' : 'var(--text-main)',
                        padding: '8px 12px',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontSize: '13px',
                        fontWeight: '600'
                      }}
                    >
                      <span>{stu.full_name}</span>
                      <ChevronRight size={14} />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Main Student content */}
            <div className="col-9 flex flex-col gap-4">
              
              {/* TAB: DASHBOARD */}
              {activeTab === 'dashboard' && (
                <>
                  {/* Top Stats Banner */}
                  <div className="dashboard-grid">
                    <div className="col-4 glass-card stat-card" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
                      <div style={{ padding: '12px', background: 'var(--primary-light)', borderRadius: '12px', color: 'var(--primary)' }}>
                        <Award size={24} />
                      </div>
                      <div>
                        <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>PBL Overall Avg</p>
                        <h3 style={{ fontSize: '28px', fontWeight: '800', color: 'var(--primary)' }}>{activeStudentLatestScore.overall_score}<span style={{ fontSize: '16px' }}>%</span></h3>
                        <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>{allStudentScores.length} evaluation{allStudentScores.length !== 1 ? 's' : ''} recorded</p>
                      </div>
                    </div>
                    <div className="col-4 glass-card stat-card" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
                      <div style={{ padding: '12px', background: 'hsl(var(--success-hue), 80%, 94%)', borderRadius: '12px', color: 'var(--success)' }}>
                        <Target size={24} />
                      </div>
                      <div>
                        <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Tasks Completed</p>
                        <h3 style={{ fontSize: '28px', fontWeight: '800', color: 'var(--success)' }}>
                          {currentTasks.filter(t => t.assigned_to === selectedStudentId && t.status === 'COMPLETED').length}<span style={{ fontSize: '16px', color: 'var(--text-muted)', fontWeight: '500' }}> / {currentTasks.filter(t => t.assigned_to === selectedStudentId).length}</span>
                        </h3>
                        <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>Across {currentMilestones.length} milestones</p>
                      </div>
                    </div>
                    <div className="col-4 glass-card stat-card" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
                      <div style={{ padding: '12px', background: 'hsl(var(--warning-hue), 90%, 94%)', borderRadius: '12px', color: 'var(--warning)' }}>
                        <Zap size={24} />
                      </div>
                      <div>
                        <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Next Deadline</p>
                        <h3 style={{ fontSize: '16px', fontWeight: '800', marginTop: '4px', color: 'var(--warning)' }}>2026-06-25</h3>
                        <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>Milestone 3 • Dev Phase</p>
                      </div>
                    </div>
                  </div>

                  {/* Radar Analysis & Progress */}
                  <div className="dashboard-grid">
                    {/* SVG Radar Chart */}
                    <div className="col-6 glass-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                      <h3 style={{ fontSize: '16px', alignSelf: 'flex-start', marginBottom: '12px' }}>PBL Dimension Analysis</h3>
                      <RadarChart scores={activeStudentLatestScore} />
                    </div>

                    {/* Progress details */}
                    <div className="col-6 glass-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                      <h3 style={{ fontSize: '16px' }}>Dimension Progress Breakdown</h3>
                      {[
                        { label: '🔬 Research & Analysis', val: activeStudentLatestScore.research_score, color: 'var(--primary)' },
                        { label: '🤝 Teamwork & Collaboration', val: activeStudentLatestScore.teamwork_score, color: 'var(--secondary)' },
                        { label: '🎤 Presentation & Communication', val: activeStudentLatestScore.presentation_score, color: 'var(--success)' },
                        { label: '💡 Innovation & Problem-Solving', val: activeStudentLatestScore.innovation_score, color: 'var(--warning)' },
                        { label: '⚙️ Technical Skills', val: activeStudentLatestScore.technical_score, color: 'var(--danger)' },
                        { label: '⏰ Time Management', val: activeStudentLatestScore.time_management_score, color: '#aa3bff' }
                      ].map((dim, idx) => (
                        <div key={idx} className="flex flex-col gap-1">
                          <div className="flex justify-between" style={{ fontSize: '13px', fontWeight: '600' }}>
                            <span>{dim.label}</span>
                            <span style={{ color: dim.color }}>{dim.val}%</span>
                          </div>
                          <div className="progress-container">
                            <div className="progress-bar" style={{ width: `${dim.val}%`, background: dim.color }} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Score History Chart + Milestone Timeline */}
                  <div className="dashboard-grid">
                    <div className="col-6 glass-card" style={{ padding: '24px' }}>
                      <div className="flex align-center gap-2" style={{ marginBottom: '16px' }}>
                        <BarChart3 size={18} color="var(--primary)" />
                        <h3 style={{ fontSize: '16px' }}>Score Progression History</h3>
                      </div>
                      <ScoreHistoryChart scores={allStudentScores} />
                      {allStudentScores.length > 1 && (
                        <div className="flex justify-between" style={{ marginTop: '8px', fontSize: '12px' }}>
                          <span style={{ color: 'var(--text-muted)' }}>First: <strong>{allStudentScores[0].overall_score}%</strong></span>
                          <span style={{ color: allStudentScores[allStudentScores.length-1].overall_score >= allStudentScores[0].overall_score ? 'var(--success)' : 'var(--danger)' }}>
                            {allStudentScores[allStudentScores.length-1].overall_score >= allStudentScores[0].overall_score ? '▲' : '▼'} {Math.abs(allStudentScores[allStudentScores.length-1].overall_score - allStudentScores[0].overall_score)}% change
                          </span>
                          <span style={{ color: 'var(--text-muted)' }}>Latest: <strong style={{ color: 'var(--primary)' }}>{allStudentScores[allStudentScores.length-1].overall_score}%</strong></span>
                        </div>
                      )}
                    </div>

                    <div className="col-6 glass-card" style={{ padding: '24px' }}>
                      <div className="flex align-center gap-2" style={{ marginBottom: '16px' }}>
                        <Target size={18} color="var(--primary)" />
                        <h3 style={{ fontSize: '16px' }}>Project Milestone Timeline</h3>
                      </div>
                      <MilestoneTimeline />
                    </div>
                  </div>

                  {/* Feedback Panel */}
                  <div className="glass-panel" style={{ padding: '24px' }}>
                    <div className="flex align-center gap-2 mb-3">
                      <Award size={20} color="var(--primary)" />
                      <h3 style={{ fontSize: '16px' }}>Teacher Evaluation Feedback</h3>
                    </div>
                    <blockquote style={{ padding: '16px', background: 'var(--border-color)', borderRadius: '12px', borderLeft: '4px solid var(--primary)', fontStyle: 'italic', fontSize: '14px', marginBottom: '16px' }}>
                      "{activeStudentLatestScore.teacher_feedback}"
                    </blockquote>
                    <div className="flex gap-4">
                      {activeStudentLatestScore.ai_feedback?.strengths?.length > 0 && (
                        <div style={{ flex: 1, padding: '12px', background: 'hsl(var(--success-hue), 80%, 95%)', borderRadius: '10px', color: 'var(--success)' }}>
                          <span style={{ fontSize: '12px', fontWeight: '800', textTransform: 'uppercase' }}>Strengths:</span>
                          <ul style={{ paddingLeft: '20px', fontSize: '13px', marginTop: '6px' }}>
                            {activeStudentLatestScore.ai_feedback.strengths.map((s, i) => <li key={i}>{s}</li>)}
                          </ul>
                        </div>
                      )}
                      {activeStudentLatestScore.ai_feedback?.improvements?.length > 0 && (
                        <div style={{ flex: 1, padding: '12px', background: 'hsl(var(--warning-hue), 90%, 94%)', borderRadius: '10px', color: 'hsl(var(--warning-hue), 90%, 35%)' }}>
                          <span style={{ fontSize: '12px', fontWeight: '800', textTransform: 'uppercase' }}>Improvements:</span>
                          <ul style={{ paddingLeft: '20px', fontSize: '13px', marginTop: '6px' }}>
                            {activeStudentLatestScore.ai_feedback.improvements.map((im, i) => <li key={i}>{im}</li>)}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                </>
              )}

              {/* TAB: TASKS */}
              {activeTab === 'tasks' && (
                <div className="flex flex-col gap-4 animate-fade">
                  <div className="flex justify-between align-center">
                    <div>
                      <h2 style={{ fontSize: '20px' }}>Project Kanban Board</h2>
                      <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Click a task to cycle status: Pending ➔ In Progress ➔ Completed</p>
                    </div>
                    <div className="flex align-center gap-2">
                      <span className="badge badge-primary">AI Chatbot Hub Project</span>
                    </div>
                  </div>

                  <div className="dashboard-grid">
                    {[
                      { status: 'PENDING', title: 'Pending Tasks', color: 'var(--text-muted)' },
                      { status: 'IN_PROGRESS', title: 'In Progress', color: 'var(--warning)' },
                      { status: 'COMPLETED', title: 'Completed', color: 'var(--success)' }
                    ].map(col => {
                      const tasksInCol = currentTasks.filter(t => t.assigned_to === selectedStudentId && t.status === col.status);
                      return (
                        <div key={col.status} className="col-4 glass-panel" style={{ padding: '16px', minHeight: '400px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                          <div className="flex align-center justify-between" style={{ paddingBottom: '8px', borderBottom: '2px solid var(--border-color)' }}>
                            <h3 style={{ fontSize: '14px', fontWeight: '800', color: col.color }}>{col.title}</h3>
                            <span style={{ fontSize: '12px', padding: '2px 8px', background: 'var(--border-color)', borderRadius: '99px', fontWeight: '700' }}>
                              {tasksInCol.length}
                            </span>
                          </div>
                          
                          <div className="flex flex-col gap-3 custom-scroll" style={{ flex: 1, overflowY: 'auto' }}>
                            {tasksInCol.map(task => (
                              <div 
                                key={task.id} 
                                className="glass-card" 
                                style={{ padding: '14px', cursor: 'pointer', borderLeft: task.priority === 'HIGH' || task.priority === 'URGENT' ? '4px solid var(--danger)' : '1px solid var(--border-color)' }}
                                onClick={() => handleToggleTaskStatus(task)}
                              >
                                <div className="flex justify-between align-center mb-1">
                                  <span style={{ fontSize: '10px', padding: '1px 6px', borderRadius: '4px', background: task.priority === 'URGENT' ? 'var(--danger)' : task.priority === 'HIGH' ? 'hsl(var(--warning-hue), 90%, 90%)' : 'var(--primary-light)', color: task.priority === 'URGENT' ? 'white' : 'var(--text-main)', fontWeight: '800' }}>
                                    {task.priority}
                                  </span>
                                  <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Due: {task.due_date}</span>
                                </div>
                                <h4 style={{ fontSize: '13px', fontWeight: '700', marginBottom: '4px' }}>{task.name}</h4>
                                <p style={{ fontSize: '11px', color: 'var(--text-muted)', lineHeight: '1.3' }}>{task.description}</p>
                                
                                <div className="flex justify-between align-center mt-3" style={{ fontSize: '10px', color: 'var(--text-muted)' }}>
                                  <span>Hours: {task.est_hours} est</span>
                                  <span style={{ textDecoration: 'underline', color: 'var(--primary)', fontWeight: '700' }}>Cycle Status</span>
                                </div>
                              </div>
                            ))}
                            {tasksInCol.length === 0 && (
                              <div style={{ textAlign: 'center', py: '20px', color: 'var(--text-muted)', fontSize: '12px', marginTop: '20px' }}>
                                No tasks
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* TAB: CHAT */}
              {activeTab === 'chat' && (
                <div className="glass-card flex flex-col animate-fade" style={{ height: '520px', overflow: 'hidden' }}>
                  
                  {/* Chat header */}
                  <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div className="flex align-center gap-2">
                      <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: 'var(--success)' }} />
                      <div>
                        <h3 style={{ fontSize: '14px' }}>AI PBL Project Mentor</h3>
                        <p style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Tailored feedback based on 6 core scores</p>
                      </div>
                    </div>
                    <span className="badge badge-primary">Model Active</span>
                  </div>

                  {/* Suggestion tags */}
                  <div style={{ padding: '8px 16px', display: 'flex', gap: '8px', overflowX: 'auto', background: 'var(--border-color)' }}>
                    {[
                      'How to improve Research Score?',
                      'Best practices for database schema',
                      'Tips for Milestone 3 development',
                      'How to improve Presentation slide designs?'
                    ].map((sug, i) => (
                      <button
                        key={i}
                        onClick={() => handleSendMessage(null, sug)}
                        style={{
                          border: '1px solid var(--primary-hover)',
                          borderRadius: '8px',
                          padding: '6px 12px',
                          background: 'var(--bg-sidebar)',
                          color: 'var(--primary)',
                          fontSize: '11px',
                          fontWeight: '700',
                          whiteSpace: 'nowrap',
                          cursor: 'pointer'
                        }}
                      >
                        {sug}
                      </button>
                    ))}
                  </div>

                  {/* Message body */}
                  <div className="chat-messages custom-scroll" style={{ flex: 1, overflowY: 'auto' }}>
                    {chatHistory.map((msg, i) => (
                      <div key={i} className={`chat-bubble ${msg.sender}`}>
                        {msg.text}
                      </div>
                    ))}
                    <div ref={chatEndRef} />
                  </div>

                  {/* Message Input */}
                  <form onSubmit={handleSendMessage} style={{ padding: '16px', borderTop: '1px solid var(--border-color)', display: 'flex', gap: '8px', background: 'var(--bg-sidebar)' }}>
                    <input
                      type="text"
                      value={chatMessage}
                      onChange={(e) => setChatMessage(e.target.value)}
                      placeholder="Ask the AI mentor about coding, databases, slides, or time management..."
                      className="input-field"
                      style={{ flex: 1 }}
                    />
                    <button
                      type="submit"
                      style={{
                        padding: '10px 20px',
                        background: 'var(--primary)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '10px',
                        fontWeight: '700',
                        cursor: 'pointer'
                      }}
                    >
                      Send
                    </button>
                  </form>

                </div>
              )}

            </div>
          </div>
        )}


        {/* ==================== PORTAL B: PARENT PORTAL ==================== */}
        {activeRole === 'PARENT' && (
          <div className="flex flex-col gap-6 animate-fade">
            
            {/* Header Greeting & Kid Selector */}
            <div className="glass-card" style={{ padding: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
              <div>
                <h2 style={{ fontSize: '24px', fontWeight: '800' }}>Parent Dashboard 👋</h2>
                <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>
                  Monitoring educational progress for <strong>Vrindaa Somaiya</strong>
                </p>
              </div>

              {/* Children Selector */}
              <div className="flex align-center gap-2" style={{ background: 'var(--border-color)', padding: '4px', borderRadius: '12px' }}>
                {users.filter(u => u.parent_id === 'usr-parent').map(kid => (
                  <button
                    key={kid.id}
                    onClick={() => setSelectedStudentId(kid.id)}
                    className="flex align-center gap-2"
                    style={{
                      border: 'none',
                      background: selectedStudentId === kid.id ? 'var(--bg-sidebar)' : 'transparent',
                      color: selectedStudentId === kid.id ? 'var(--primary)' : 'var(--text-muted)',
                      padding: '8px 16px',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontWeight: '700',
                      fontSize: '13px'
                    }}
                  >
                    <img src={kid.avatar} style={{ width: '20px', height: '20px', borderRadius: '50%' }} />
                    {kid.full_name.split(' ')[0]}
                  </button>
                ))}
              </div>
            </div>

            {/* Core statistics */}
            <div className="dashboard-grid">
              
              <div className="col-4 glass-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div className="flex justify-between align-center">
                  <span style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-muted)' }}>Class Attendance</span>
                  <span className="badge badge-success">96%</span>
                </div>
                <div style={{ fontSize: '24px', fontWeight: '800' }}>Active Presence</div>
                <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Missed 1 lecture in Chemistry this month.</p>
              </div>

              <div className="col-4 glass-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div className="flex justify-between align-center">
                  <span style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-muted)' }}>Milestone Adherence</span>
                  <span className="badge badge-primary">High</span>
                </div>
                <div style={{ fontSize: '24px', fontWeight: '800' }}>
                  {currentTasks.filter(t => t.assigned_to === selectedStudentId && t.status === 'COMPLETED').length} Tasks Completed
                </div>
                <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Estimated hours match actual hours with 92% efficiency.</p>
              </div>

              <div className="col-4 glass-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div className="flex justify-between align-center">
                  <span style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-muted)' }}>Overall PBL Rating</span>
                  <span className="badge badge-primary">{activeStudentLatestScore.overall_score}%</span>
                </div>
                <div style={{ fontSize: '24px', fontWeight: '800' }}>Grade Average</div>
                <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Ranks top 10% in computer science department.</p>
              </div>

            </div>

            {/* In-depth Dimensions analysis & Line Trend */}
            <div className="dashboard-grid">
              
              <div className="col-6 glass-card" style={{ padding: '24px' }}>
                <h3 style={{ fontSize: '16px', marginBottom: '16px' }}>PBL Dimension Ratings</h3>
                <div className="flex flex-col gap-4">
                  {[
                    { label: '🔬 Research & Analysis', val: activeStudentLatestScore.research_score, color: 'var(--primary)' },
                    { label: '🤝 Teamwork & Collaboration', val: activeStudentLatestScore.teamwork_score, color: 'var(--secondary)' },
                    { label: '🎤 Presentation & Communication', val: activeStudentLatestScore.presentation_score, color: 'var(--success)' },
                    { label: '💡 Innovation & Problem-Solving', val: activeStudentLatestScore.innovation_score, color: 'var(--warning)' },
                    { label: '⚙️ Technical Skills', val: activeStudentLatestScore.technical_score, color: 'var(--danger)' },
                    { label: '⏰ Time Management', val: activeStudentLatestScore.time_management_score, color: '#aa3bff' }
                  ].map((dim, idx) => (
                    <div key={idx} className="flex flex-col gap-1">
                      <div className="flex justify-between" style={{ fontSize: '13px', fontWeight: '600' }}>
                        <span>{dim.label}</span>
                        <span>{dim.val}%</span>
                      </div>
                      <div className="progress-container">
                        <div className="progress-bar" style={{ width: `${dim.val}%`, background: dim.color }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Historic Scores Chart – dynamic via ScoreHistoryChart */}
              <div className="col-6 glass-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div className="flex align-center gap-2">
                  <BarChart3 size={18} color="var(--primary)" />
                  <h3 style={{ fontSize: '16px' }}>Project Evaluation History</h3>
                </div>
                <ScoreHistoryChart scores={allStudentScores} />
                {allStudentScores.length > 1 && (
                  <div className="flex justify-between" style={{ fontSize: '12px' }}>
                    <span style={{ color: 'var(--text-muted)' }}>First: <strong>{allStudentScores[0].overall_score}%</strong></span>
                    <span style={{ color: allStudentScores[allStudentScores.length-1].overall_score >= allStudentScores[0].overall_score ? 'var(--success)' : 'var(--danger)' }}>
                      {allStudentScores[allStudentScores.length-1].overall_score >= allStudentScores[0].overall_score ? '▲' : '▼'} {Math.abs(allStudentScores[allStudentScores.length-1].overall_score - allStudentScores[0].overall_score)}% change
                    </span>
                    <span style={{ color: 'var(--text-muted)' }}>Latest: <strong style={{ color: 'var(--primary)' }}>{allStudentScores[allStudentScores.length-1].overall_score}%</strong></span>
                  </div>
                )}
              </div>

            </div>

            {/* Teacher Feedback Banner */}
            <div className="glass-panel" style={{ padding: '24px' }}>
              <h3 style={{ fontSize: '16px', marginBottom: '12px' }}>Latest Teacher Assessment Comments</h3>
              <blockquote style={{ padding: '16px', background: 'var(--border-color)', borderRadius: '12px', borderLeft: '4px solid var(--primary)', fontStyle: 'italic', fontSize: '14px', marginBottom: '16px' }}>
                "{activeStudentLatestScore.teacher_feedback}"
              </blockquote>
              <div className="flex gap-4">
                {activeStudentLatestScore.ai_feedback?.strengths?.length > 0 && (
                  <div style={{ flex: 1, padding: '12px', background: 'hsl(var(--success-hue), 80%, 95%)', borderRadius: '10px', color: 'var(--success)' }}>
                    <span style={{ fontSize: '12px', fontWeight: '800', textTransform: 'uppercase' }}>Identified Strengths:</span>
                    <ul style={{ paddingLeft: '20px', fontSize: '13px', marginTop: '6px' }}>
                      {activeStudentLatestScore.ai_feedback.strengths.map((s, i) => <li key={i}>{s}</li>)}
                    </ul>
                  </div>
                )}
                {activeStudentLatestScore.ai_feedback?.improvements?.length > 0 && (
                  <div style={{ flex: 1, padding: '12px', background: 'hsl(var(--warning-hue), 90%, 94%)', borderRadius: '10px', color: 'hsl(var(--warning-hue), 90%, 35%)' }}>
                    <span style={{ fontSize: '12px', fontWeight: '800', textTransform: 'uppercase' }}>Focus Areas for Improvement:</span>
                    <ul style={{ paddingLeft: '20px', fontSize: '13px', marginTop: '6px' }}>
                      {activeStudentLatestScore.ai_feedback.improvements.map((im, i) => <li key={i}>{im}</li>)}
                    </ul>
                  </div>
                )}
              </div>
            </div>

          </div>
        )}


        {/* ==================== PORTAL C: TEACHER PORTAL ==================== */}
        {activeRole === 'TEACHER' && (
          <div className="dashboard-grid animate-fade">
            
            {/* Left menu for teacher actions */}
            <div className="col-3 flex flex-col gap-4">
              <div className="glass-card" style={{ padding: '20px' }}>
                <h3 style={{ fontSize: '16px', marginBottom: '12px' }}>Mrs. Ananya Sharma</h3>
                <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '16px' }}>Grade 10 Lead • Computer Science</p>
                
                <div className="tab-list flex-col" style={{ background: 'transparent', gap: '6px' }}>
                  <button 
                    onClick={() => setActiveTab('classroom')} 
                    className={`tab-btn ${activeTab === 'classroom' ? 'active' : ''}`}
                    style={{ textAlign: 'left', justifyContent: 'flex-start' }}
                  >
                    <Users size={16} /> Classroom overview
                  </button>
                  <button 
                    onClick={() => setActiveTab('grading')} 
                    className={`tab-btn ${activeTab === 'grading' ? 'active' : ''}`}
                    style={{ textAlign: 'left', justifyContent: 'flex-start' }}
                  >
                    <Sliders size={16} /> PBL dimension grader
                  </button>
                  <button 
                    onClick={() => setActiveTab('projects')} 
                    className={`tab-btn ${activeTab === 'projects' ? 'active' : ''}`}
                    style={{ textAlign: 'left', justifyContent: 'flex-start' }}
                  >
                    <Plus size={16} /> Add tasks / milestones
                  </button>
                </div>
              </div>

              {/* Quick Class Selection info */}
              <div className="glass-panel" style={{ padding: '16px' }}>
                <h4 style={{ fontSize: '12px', fontWeight: '800', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '8px' }}>
                  Active Subject:
                </h4>
                <div className="flex align-center gap-2" style={{ padding: '8px 12px', background: 'var(--bg-sidebar)', borderRadius: '8px', border: '1px solid var(--border-color)', fontSize: '13px', fontWeight: '700' }}>
                  <BookOpen size={16} color="var(--primary)" />
                  <span>Software Engineering</span>
                </div>
              </div>
            </div>

            {/* Right main area */}
            <div className="col-9 flex flex-col gap-6">
              
              {/* TAB: CLASSROOM OVERVIEW */}
              {activeTab === 'classroom' && (
                <>
                  <div className="flex justify-between align-center">
                    <div>
                      <h2 style={{ fontSize: '20px' }}>Software Engineering Class (Grade 10-A)</h2>
                      <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Classroom performance and task metrics overview.</p>
                    </div>
                  </div>

                  {/* Student list grid */}
                  <div className="dashboard-grid">
                    {users.filter(u => u.role === 'STUDENT').map(student => {
                      const scores = dbAPI.getPblScores(student.id);
                      const latestScore = scores.length > 0 ? scores[scores.length - 1].overall_score : 'N/A';
                      const completed = currentTasks.filter(t => t.assigned_to === student.id && t.status === 'COMPLETED').length;
                      const total = currentTasks.filter(t => t.assigned_to === student.id).length;

                      return (
                        <div key={student.id} className="col-6 glass-card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                          <div className="flex align-center justify-between">
                            <div className="flex align-center gap-3">
                              <img src={student.avatar} style={{ width: '40px', height: '40px', borderRadius: '50%' }} />
                              <div>
                                <h4 style={{ fontSize: '15px' }}>{student.full_name}</h4>
                                <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{student.email}</span>
                              </div>
                            </div>
                            <span className="badge badge-primary">
                              PBL Avg: {latestScore}%
                            </span>
                          </div>

                          <div className="flex justify-between align-center" style={{ fontSize: '12px', borderTop: '1px solid var(--border-color)', paddingTop: '12px' }}>
                            <span>Task Progress:</span>
                            <strong>{completed} / {total} Completed</strong>
                          </div>

                          <div className="flex gap-2">
                            <button
                              onClick={() => {
                                setGradingStudent(student.id);
                                if (scores.length > 0) {
                                  const s = scores[scores.length - 1];
                                  setResearchScore(s.research_score);
                                  setTeamworkScore(s.teamwork_score);
                                  setPresentationScore(s.presentation_score);
                                  setInnovationScore(s.innovation_score);
                                  setTechnicalScore(s.technical_score);
                                  setTimeMgmtScore(s.time_management_score);
                                }
                                setActiveTab('grading');
                              }}
                              style={{
                                flex: 1,
                                padding: '8px 12px',
                                background: 'var(--primary)',
                                color: 'white',
                                border: 'none',
                                borderRadius: '8px',
                                fontSize: '12px',
                                fontWeight: '700',
                                cursor: 'pointer'
                              }}
                            >
                              Grade dimensions
                            </button>
                            <button
                              onClick={() => {
                                setSelectedStudentId(student.id);
                                setActiveRole('STUDENT');
                                setActiveTab('dashboard');
                              }}
                              style={{
                                flex: 1,
                                padding: '8px 12px',
                                background: 'transparent',
                                border: '1px solid var(--border-color)',
                                color: 'var(--text-main)',
                                borderRadius: '8px',
                                fontSize: '12px',
                                fontWeight: '700',
                                cursor: 'pointer'
                              }}
                            >
                              View student dashboard
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </>
              )}

              {/* TAB: GRADING */}
              {activeTab === 'grading' && (
                <form onSubmit={handlePublishGrade} className="glass-panel animate-fade" style={{ padding: '28px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  <div>
                    <h2 style={{ fontSize: '20px' }}>PBL Dimension Evaluation Grader</h2>
                    <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Publish scores to update student radar charts, parent feeds, and audit logs.</p>
                  </div>

                  <div className="flex flex-col gap-2">
                    <label style={{ fontSize: '13px', fontWeight: '800' }}>Select student to grade:</label>
                    <select
                      value={gradingStudent}
                      onChange={(e) => {
                        const id = e.target.value;
                        setGradingStudent(id);
                        const scores = dbAPI.getPblScores(id);
                        if (scores.length > 0) {
                          const s = scores[scores.length - 1];
                          setResearchScore(s.research_score);
                          setTeamworkScore(s.teamwork_score);
                          setPresentationScore(s.presentation_score);
                          setInnovationScore(s.innovation_score);
                          setTechnicalScore(s.technical_score);
                          setTimeMgmtScore(s.time_management_score);
                        }
                      }}
                      className="input-field"
                    >
                      {users.filter(u => u.role === 'STUDENT').map(s => (
                        <option key={s.id} value={s.id}>{s.full_name} ({s.grade})</option>
                      ))}
                    </select>
                  </div>

                  {/* 6 Dimension sliders */}
                  <div className="dashboard-grid" style={{ gap: '20px' }}>
                    {[
                      { label: '🔬 Research & Analysis', val: researchScore, set: setResearchScore },
                      { label: '🤝 Teamwork & Collaboration', val: teamworkScore, set: setTeamworkScore },
                      { label: '🎤 Presentation & Communication', val: presentationScore, set: setPresentationScore },
                      { label: '💡 Innovation & Problem-Solving', val: innovationScore, set: setInnovationScore },
                      { label: '⚙️ Technical Skills', val: technicalScore, set: setTechnicalScore },
                      { label: '⏰ Time Management', val: timeMgmtScore, set: setTimeMgmtScore }
                    ].map((slider, idx) => (
                      <div key={idx} className="col-6 flex flex-col gap-2" style={{ padding: '12px', background: 'var(--bg-page)', borderRadius: '12px' }}>
                        <div className="flex justify-between align-center" style={{ fontSize: '13px', fontWeight: '700' }}>
                          <span>{slider.label}</span>
                          <span style={{ color: 'var(--primary)' }}>{slider.val}%</span>
                        </div>
                        <input
                          type="range"
                          min="30"
                          max="100"
                          value={slider.val}
                          onChange={(e) => slider.set(Number(e.target.value))}
                          style={{ accentColor: 'var(--primary)', cursor: 'pointer', width: '100%' }}
                        />
                      </div>
                    ))}
                  </div>

                  {/* Feedback Comments */}
                  <div className="flex flex-col gap-2">
                    <label style={{ fontSize: '13px', fontWeight: '800' }}>Teacher Remarks & Feedback:</label>
                    <textarea
                      value={teacherFeedbackText}
                      onChange={(e) => setTeacherFeedbackText(e.target.value)}
                      placeholder="Write educational comments on student project achievements..."
                      className="input-field"
                      style={{ minHeight: '80px', resize: 'vertical' }}
                    />
                  </div>

                  <button
                    type="submit"
                    style={{
                      padding: '12px',
                      background: 'var(--primary)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '10px',
                      fontWeight: '700',
                      cursor: 'pointer',
                      fontSize: '14px'
                    }}
                  >
                    Publish Grades & Sync Stakeholders
                  </button>
                </form>
              )}

              {/* TAB: PROJECTS, TASK CREATION */}
              {activeTab === 'projects' && (
                <div className="dashboard-grid animate-fade">
                  {/* Create Milestone */}
                  <div className="col-6 glass-panel" style={{ padding: '24px' }}>
                    <h3 style={{ fontSize: '16px', marginBottom: '16px' }}>Create Project Milestone</h3>
                    <form onSubmit={handleAddMilestone} className="flex flex-col gap-4">
                      <div className="flex flex-col gap-2">
                        <label style={{ fontSize: '12px', fontWeight: '700' }}>Milestone Name:</label>
                        <input
                          type="text"
                          value={newMilestoneName}
                          onChange={(e) => setNewMilestoneName(e.target.value)}
                          placeholder="e.g. System Integration Testing"
                          className="input-field"
                          required
                        />
                      </div>
                      <div className="flex flex-col gap-2">
                        <label style={{ fontSize: '12px', fontWeight: '700' }}>Milestone Description:</label>
                        <textarea
                          value={newMilestoneDesc}
                          onChange={(e) => setNewMilestoneDesc(e.target.value)}
                          placeholder="Brief description of requirements"
                          className="input-field"
                          style={{ minHeight: '60px' }}
                        />
                      </div>
                      <button
                        type="submit"
                        style={{
                          padding: '10px',
                          background: 'var(--primary)',
                          color: 'white',
                          border: 'none',
                          borderRadius: '8px',
                          fontWeight: '700',
                          cursor: 'pointer'
                        }}
                      >
                        Create Milestone
                      </button>
                    </form>

                    <h4 style={{ fontSize: '13px', marginTop: '24px', marginBottom: '12px' }}>Current Milestones:</h4>
                    <div className="flex flex-col gap-2">
                      {currentMilestones.map(ms => (
                        <div key={ms.id} className="flex justify-between align-center" style={{ padding: '8px 12px', background: 'var(--bg-page)', borderRadius: '8px', fontSize: '12px' }}>
                          <span>{ms.name}</span>
                          <span className={`badge ${ms.status === 'COMPLETED' ? 'badge-success' : 'badge-warning'}`}>{ms.status}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Create / Assign Task */}
                  <div className="col-6 glass-panel" style={{ padding: '24px' }}>
                    <h3 style={{ fontSize: '16px', marginBottom: '16px' }}>Assign Student Task</h3>
                    <form onSubmit={handleAddTask} className="flex flex-col gap-4">
                      <div className="flex flex-col gap-2">
                        <label style={{ fontSize: '12px', fontWeight: '700' }}>Task Name:</label>
                        <input
                          type="text"
                          value={newTaskName}
                          onChange={(e) => setNewTaskName(e.target.value)}
                          placeholder="e.g. Write database migrations file"
                          className="input-field"
                          required
                        />
                      </div>
                      <div className="flex flex-col gap-2">
                        <label style={{ fontSize: '12px', fontWeight: '700' }}>Task Description:</label>
                        <textarea
                          value={newTaskDesc}
                          onChange={(e) => setNewTaskDesc(e.target.value)}
                          placeholder="Instructions for the student"
                          className="input-field"
                          style={{ minHeight: '60px' }}
                        />
                      </div>
                      
                      <div className="dashboard-grid" style={{ gap: '12px' }}>
                        <div className="col-6 flex flex-col gap-1">
                          <label style={{ fontSize: '11px', fontWeight: '700' }}>Assignee:</label>
                          <select
                            value={newTaskAssignee}
                            onChange={(e) => setNewTaskAssignee(e.target.value)}
                            className="input-field"
                          >
                            {users.filter(u => u.role === 'STUDENT').map(s => (
                              <option key={s.id} value={s.id}>{s.full_name}</option>
                            ))}
                          </select>
                        </div>
                        <div className="col-6 flex flex-col gap-1">
                          <label style={{ fontSize: '11px', fontWeight: '700' }}>Milestone Group:</label>
                          <select
                            value={newTaskMilestoneId}
                            onChange={(e) => setNewTaskMilestoneId(e.target.value)}
                            className="input-field"
                          >
                            {currentMilestones.map(m => (
                              <option key={m.id} value={m.id}>{m.name}</option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div className="flex flex-col gap-1">
                        <label style={{ fontSize: '11px', fontWeight: '700' }}>Priority:</label>
                        <select
                          value={newTaskPriority}
                          onChange={(e) => setNewTaskPriority(e.target.value)}
                          className="input-field"
                        >
                          <option value="LOW">LOW</option>
                          <option value="MEDIUM">MEDIUM</option>
                          <option value="HIGH">HIGH</option>
                          <option value="URGENT">URGENT</option>
                        </select>
                      </div>

                      <button
                        type="submit"
                        style={{
                          padding: '10px',
                          background: 'var(--primary)',
                          color: 'white',
                          border: 'none',
                          borderRadius: '8px',
                          fontWeight: '700',
                          cursor: 'pointer'
                        }}
                      >
                        Assign Task
                      </button>
                    </form>
                  </div>
                </div>
              )}

            </div>
          </div>
        )}


        {/* ==================== PORTAL D: HOD PORTAL ==================== */}
        {activeRole === 'HOD' && (
          <div className="flex flex-col gap-6 animate-fade">
            
            {/* Header / School Selector */}
            <div className="glass-card" style={{ padding: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
              <div>
                <h2 style={{ fontSize: '24px', fontWeight: '800' }}>Department Head Analytics Panel</h2>
                <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>
                  Reviewing Department: <strong>Computer Science</strong>
                </p>
              </div>

              <div className="flex align-center gap-2">
                <MapPin size={16} color="var(--primary)" />
                <span style={{ fontSize: '13px', fontWeight: '700' }}>Oakridge Science & Tech Academy</span>
              </div>
            </div>

            {/* TAB Navigation */}
            <div className="tab-list">
              <button 
                onClick={() => setActiveTab('analytics')} 
                className={`tab-btn ${activeTab === 'analytics' ? 'active' : ''}`}
              >
                <Activity size={16} /> Department metrics
              </button>
              <button 
                onClick={() => setActiveTab('teachers')} 
                className={`tab-btn ${activeTab === 'teachers' ? 'active' : ''}`}
              >
                <Users size={16} /> Teacher ratings
              </button>
              <button 
                onClick={() => setActiveTab('students')} 
                className={`tab-btn ${activeTab === 'students' ? 'active' : ''}`}
              >
                <Search size={16} /> Students search index
              </button>
            </div>

            {/* TAB CONTENT: METRICS */}
            {activeTab === 'analytics' && (
              <div className="dashboard-grid">
                
                {/* Stats */}
                <div className="col-4 glass-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <span style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-muted)' }}>Department Overall Avg</span>
                  <div style={{ fontSize: '32px', fontWeight: '800', color: 'var(--primary)' }}>85.2%</div>
                  <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Calculated across 3 current active project teams.</p>
                </div>
                
                <div className="col-4 glass-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <span style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-muted)' }}>Total Faculty Members</span>
                  <div style={{ fontSize: '32px', fontWeight: '800' }}>18 Teachers</div>
                  <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Computer Science & Software Development department.</p>
                </div>

                <div className="col-4 glass-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <span style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-muted)' }}>Task Milestone Status</span>
                  <div style={{ fontSize: '32px', fontWeight: '800', color: 'var(--success)' }}>91% Completed</div>
                  <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Outstanding milestone adherence rates.</p>
                </div>

                {/* SVG Comparison chart */}
                <div className="col-12 glass-card" style={{ padding: '24px' }}>
                  <h3 style={{ fontSize: '16px', marginBottom: '16px' }}>Project Grade Progressions (By Classroom Sector)</h3>
                  
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '220px' }}>
                    <svg viewBox="0 0 500 200" width="100%" height="200" style={{ overflow: 'visible' }}>
                      {/* Grid Lines */}
                      <line x1="40" y1="20" x2="480" y2="20" stroke="var(--border-color)" strokeWidth="1" strokeDasharray="3,3" />
                      <line x1="40" y1="80" x2="480" y2="80" stroke="var(--border-color)" strokeWidth="1" strokeDasharray="3,3" />
                      <line x1="40" y1="140" x2="480" y2="140" stroke="var(--border-color)" strokeWidth="1" strokeDasharray="3,3" />
                      <line x1="40" y1="170" x2="480" y2="170" stroke="var(--border-color)" strokeWidth="1" />

                      <text x="15" y="25" fill="var(--text-muted)" fontSize="10" fontWeight="600">100%</text>
                      <text x="15" y="85" fill="var(--text-muted)" fontSize="10" fontWeight="600">80%</text>
                      <text x="15" y="145" fill="var(--text-muted)" fontSize="10" fontWeight="600">60%</text>

                      {/* Bar Charts for Classrooms: CS, Robotics, Data Science */}
                      {/* CS: 88%, Robotics: 74%, Data Science: 82% */}
                      
                      {/* CS Bar */}
                      <rect x="80" y="44" width="40" height="126" fill="var(--primary)" rx="4" />
                      <text x="100" y="34" fill="var(--text-main)" fontSize="11" fontWeight="800" textAnchor="middle">88%</text>
                      
                      {/* Robotics Bar */}
                      <rect x="230" y="72" width="40" height="98" fill="var(--secondary)" rx="4" />
                      <text x="250" y="62" fill="var(--text-main)" fontSize="11" fontWeight="800" textAnchor="middle">74%</text>
                      
                      {/* Data Science Bar */}
                      <rect x="380" y="56" width="40" height="114" fill="#aa3bff" rx="4" />
                      <text x="400" y="46" fill="var(--text-main)" fontSize="11" fontWeight="800" textAnchor="middle">82%</text>

                      {/* Labels */}
                      <text x="100" y="190" fill="var(--text-muted)" fontSize="10" fontWeight="700" textAnchor="middle">Software Eng.</text>
                      <text x="250" y="190" fill="var(--text-muted)" fontSize="10" fontWeight="700" textAnchor="middle">Robotics Core</text>
                      <text x="400" y="190" fill="var(--text-muted)" fontSize="10" fontWeight="700" textAnchor="middle">Data Analytics</text>
                    </svg>
                  </div>
                </div>

              </div>
            )}

            {/* TAB CONTENT: TEACHERS */}
            {activeTab === 'teachers' && (
              <div className="glass-panel" style={{ padding: '24px' }}>
                <h3 style={{ fontSize: '16px', marginBottom: '16px' }}>Department Teacher Roster</h3>
                <div className="flex flex-col gap-4">
                  {[
                    { name: 'Mrs. Ananya Sharma', subject: 'Software Engineering', rate: 'Excellent', ratings: '9.4/10', count: 18, feedback: 32 },
                    { name: 'Mr. Rajesh Kumar', subject: 'Robotics Core', rate: 'Very Good', ratings: '8.6/10', count: 12, feedback: 19 },
                    { name: 'Dr. Sarah Collins', subject: 'Data Science & ML', rate: 'Excellent', ratings: '9.2/10', count: 15, feedback: 25 }
                  ].map((teacher, i) => (
                    <div key={i} className="flex justify-between align-center" style={{ padding: '16px', background: 'var(--bg-page)', borderRadius: '12px', border: '1px solid var(--border-color)', flexWrap: 'wrap', gap: '16px' }}>
                      <div className="flex align-center gap-3">
                        <div style={{ width: '40px', height: '40px', background: 'var(--primary-light)', color: 'var(--primary)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800' }}>
                          {teacher.name.split(' ')[1][0]}
                        </div>
                        <div>
                          <h4 style={{ fontSize: '15px' }}>{teacher.name}</h4>
                          <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{teacher.subject}</span>
                        </div>
                      </div>

                      <div className="flex gap-6">
                        <div style={{ textAlign: 'center' }}>
                          <span style={{ fontSize: '10px', color: 'var(--text-muted)', display: 'block' }}>Students Graded</span>
                          <strong style={{ fontSize: '13px' }}>{teacher.feedback} / 40</strong>
                        </div>
                        <div style={{ textAlign: 'center' }}>
                          <span style={{ fontSize: '10px', color: 'var(--text-muted)', display: 'block' }}>HOD Rating</span>
                          <span className="badge badge-success">{teacher.ratings}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB CONTENT: STUDENTS */}
            {activeTab === 'students' && (
              <div className="glass-panel flex flex-col gap-4" style={{ padding: '24px' }}>
                <div className="flex justify-between align-center flex-wrap gap-4">
                  <h3 style={{ fontSize: '16px' }}>Search Student Database Registry</h3>
                  
                  {/* Search Bar */}
                  <div className="flex align-center gap-2" style={{ position: 'relative', width: '320px' }}>
                    <Search size={16} style={{ position: 'absolute', left: '12px', color: 'var(--text-muted)' }} />
                    <input
                      type="text"
                      value={hodSearchQuery}
                      onChange={(e) => setHodSearchQuery(e.target.value)}
                      placeholder="Type student name to search..."
                      className="input-field"
                      style={{ paddingLeft: '36px' }}
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-3">
                  {users
                    .filter(u => u.role === 'STUDENT' && u.full_name.toLowerCase().includes(hodSearchQuery.toLowerCase()))
                    .map(student => {
                      const scoresList = dbAPI.getPblScores(student.id);
                      const latestScore = scoresList.length > 0 ? scoresList[scoresList.length - 1] : null;

                      return (
                        <div key={student.id} className="flex justify-between align-center" style={{ padding: '16px', background: 'var(--bg-page)', borderRadius: '12px', border: '1px solid var(--border-color)', flexWrap: 'wrap', gap: '16px' }}>
                          <div className="flex align-center gap-3">
                            <img src={student.avatar} style={{ width: '40px', height: '40px', borderRadius: '50%' }} />
                            <div>
                              <h4 style={{ fontSize: '14px' }}>{student.full_name}</h4>
                              <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{student.grade} • ID: {student.id}</p>
                            </div>
                          </div>

                          <div className="flex align-center gap-4">
                            {latestScore ? (
                              <div style={{ textAlign: 'right' }}>
                                <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Latest Overall PBL Score</span>
                                <div style={{ fontSize: '15px', fontWeight: '800', color: 'var(--primary)' }}>{latestScore.overall_score}%</div>
                              </div>
                            ) : (
                              <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>No score recorded</span>
                            )}
                            
                            <button
                              onClick={() => {
                                setSelectedStudentId(student.id);
                                setActiveRole('STUDENT');
                                setActiveTab('dashboard');
                              }}
                              style={{
                                border: '1px solid var(--border-color)',
                                background: 'var(--bg-sidebar)',
                                padding: '6px 12px',
                                borderRadius: '8px',
                                fontSize: '12px',
                                fontWeight: '700',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '4px'
                              }}
                            >
                              Inspect Details <ArrowRight size={12} />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>
            )}

          </div>
        )}


        {/* ==================== PORTAL E: SUPER ADMIN PORTAL ==================== */}
        {activeRole === 'SUPER_ADMIN' && (
          <div className="flex flex-col gap-6 animate-fade">
            
            {/* Header Greeting */}
            <div className="glass-card" style={{ padding: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
              <div>
                <h2 style={{ fontSize: '24px', fontWeight: '800' }}>Super Admin Settings Panel</h2>
                <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>
                  Logged in: <strong>Dev Somaiya</strong> (System Administrator)
                </p>
              </div>

              <div className="flex align-center gap-2">
                <Database size={16} color="var(--primary)" />
                <span style={{ fontSize: '12px', fontWeight: '800', padding: '4px 10px', background: 'var(--primary-light)', color: 'var(--primary)', borderRadius: '99px' }}>
                  Supabase DB Synced
                </span>
              </div>
            </div>

            {/* TAB Navigation */}
            <div className="tab-list">
              <button 
                onClick={() => setActiveTab('schools')} 
                className={`tab-btn ${activeTab === 'schools' ? 'active' : ''}`}
              >
                <Database size={16} /> Schools & Security
              </button>
              <button 
                onClick={() => setActiveTab('logs')} 
                className={`tab-btn ${activeTab === 'logs' ? 'active' : ''}`}
              >
                <Activity size={16} /> Audit Trails & Logs
              </button>
            </div>

            {/* TAB CONTENT: SCHOOLS & SECURITY */}
            {activeTab === 'schools' && (
              <div className="dashboard-grid">
                
                {/* System Stats */}
                <div className="col-4 glass-card" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{ padding: '12px', background: 'hsl(var(--success-hue), 80%, 94%)', borderRadius: '12px', color: 'var(--success)' }}>
                    <CheckCircle2 size={24} />
                  </div>
                  <div>
                    <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>System Status</p>
                    <h3 style={{ fontSize: '20px', fontWeight: '800' }}>All Operational</h3>
                  </div>
                </div>

                <div className="col-4 glass-card" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{ padding: '12px', background: 'var(--primary-light)', borderRadius: '12px', color: 'var(--primary)' }}>
                    <Shield size={24} />
                  </div>
                  <div>
                    <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Active Security Policies</p>
                    <h3 style={{ fontSize: '20px', fontWeight: '800' }}>Row Level RLS Enabled</h3>
                  </div>
                </div>

                <div className="col-4 glass-card" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{ padding: '12px', background: 'hsl(var(--warning-hue), 90%, 94%)', borderRadius: '12px', color: 'var(--warning)' }}>
                    <Activity size={24} />
                  </div>
                  <div>
                    <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>API Request Rate</p>
                    <h3 style={{ fontSize: '20px', fontWeight: '800' }}>14.2 req/s</h3>
                  </div>
                </div>

                {/* Schools Grid */}
                <div className="col-8 glass-panel flex flex-col gap-4" style={{ padding: '24px' }}>
                  <h3 style={{ fontSize: '16px' }}>Active School Districts</h3>
                  <div className="flex flex-col gap-3">
                    {schools.map(school => (
                      <div key={school.id} className="glass-card" style={{ padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
                        <div>
                          <h4 style={{ fontSize: '15px' }}>{school.name}</h4>
                          <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                            Region: {school.region} • Teachers: {school.teachers} • Students: {school.students}
                          </span>
                        </div>

                        <div className="flex align-center gap-3">
                          <button
                            onClick={() => handleToggleRLS(school.id, school.RLS)}
                            style={{
                              border: 'none',
                              background: school.RLS ? 'hsl(var(--success-hue), 80%, 94%)' : 'hsl(var(--danger-hue), 85%, 95%)',
                              color: school.RLS ? 'var(--success)' : 'var(--danger)',
                              padding: '6px 12px',
                              borderRadius: '8px',
                              cursor: 'pointer',
                              fontSize: '11px',
                              fontWeight: '800',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '4px'
                            }}
                          >
                            {school.RLS ? <Lock size={12} /> : <Unlock size={12} />}
                            {school.RLS ? 'RLS Policy Active' : 'RLS Disabled'}
                          </button>
                          
                          <span className={`badge ${school.status === 'Active' ? 'badge-success' : 'badge-warning'}`}>
                            {school.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Global Security Policy configuration */}
                <div className="col-4 glass-panel flex flex-col gap-4" style={{ padding: '24px' }}>
                  <h3 style={{ fontSize: '16px' }}>API Firewall Settings</h3>
                  
                  <div className="flex flex-col gap-1">
                    <label style={{ fontSize: '12px', fontWeight: '800' }}>CORS Headers Rule:</label>
                    <textarea 
                      defaultValue={`{"allow_origins": ["http://localhost:5173", "http://localhost:3000"], "allow_methods": ["GET", "POST", "OPTIONS"]}`}
                      className="input-field"
                      style={{ fontSize: '11px', minHeight: '90px', fontFamily: 'monospace' }}
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <div className="flex justify-between" style={{ fontSize: '12px' }}>
                      <span>SSL handshake enforcement:</span>
                      <strong style={{ color: 'var(--success)' }}>ACTIVE</strong>
                    </div>
                    <div className="flex justify-between" style={{ fontSize: '12px' }}>
                      <span>SQL Injection Filter:</span>
                      <strong style={{ color: 'var(--success)' }}>ACTIVE</strong>
                    </div>
                    <div className="flex justify-between" style={{ fontSize: '12px' }}>
                      <span>Rate limiting max-burst:</span>
                      <strong>60/min</strong>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      dbAPI.addLog('Firewall Config Updated', 'Dev Somaiya', 'Modified CORS allowed origins rules.', 'SUCCESS');
                      refreshLocalState();
                      alert('CORS configuration rules updated and applied to network endpoints.');
                    }}
                    style={{
                      padding: '10px',
                      background: 'var(--primary)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      fontWeight: '700',
                      cursor: 'pointer',
                      fontSize: '12px'
                    }}
                  >
                    Save firewall policy
                  </button>
                </div>

              </div>
            )}

            {/* TAB CONTENT: AUDIT LOGS */}
            {activeTab === 'logs' && (
              <div className="glass-panel" style={{ padding: '24px' }}>
                <div className="flex justify-between align-center mb-4">
                  <div>
                    <h3 style={{ fontSize: '16px' }}>Live Security Audit Trails</h3>
                    <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Tracking database queries, CORS headers, RLS overrides, and academic grading logs.</p>
                  </div>
                  <span className="badge badge-success">Live Tracking</span>
                </div>

                <div className="flex flex-col gap-2 custom-scroll" style={{ maxHeight: '420px', overflowY: 'auto' }}>
                  {logs.map((log) => (
                    <div key={log.id} className="flex justify-between align-center" style={{ padding: '12px 16px', background: 'var(--bg-page)', borderRadius: '10px', border: '1px solid var(--border-color)', fontSize: '12px', flexWrap: 'wrap', gap: '8px' }}>
                      <div className="flex align-center gap-3">
                        <Activity size={14} color="var(--primary)" />
                        <div>
                          <strong>{log.action}</strong>
                          <span style={{ color: 'var(--text-muted)', marginLeft: '8px' }}>({log.details})</span>
                        </div>
                      </div>

                      <div className="flex align-center gap-4">
                        <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>By: {log.user}</span>
                        <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{new Date(log.timestamp).toLocaleTimeString()}</span>
                        <span className="badge badge-success" style={{ fontSize: '9px', padding: '1px 6px' }}>{log.status}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        )}

      </main>

      {/* 3. FOOTER */}
      <footer style={{ marginTop: 'auto', borderTop: '1px solid var(--border-color)', padding: '20px', background: 'var(--bg-sidebar)', textAlign: 'center', fontSize: '12px', color: 'var(--text-muted)' }}>
        <p>© 2026 AMEP Elite Platform • Project-Based Learning Administration System. All rights reserved.</p>
      </footer>
    </div>
  );
}
