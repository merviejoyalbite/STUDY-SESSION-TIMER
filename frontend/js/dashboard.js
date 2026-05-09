let timerInterval = null;
let isRunning = false;
let currentSessionIndex = 0;
let sessions = [];
let isStudyPhase = true;
let timeRemaining = 0;
let totalTime = 0;

const API_BASE_URL = 'http://localhost:5001/api';
const TIMER_CIRCUMFERENCE = 879.645;

document.addEventListener('DOMContentLoaded', async () => {
  await initializeDashboard();
  attachEventListeners();
});

async function initializeDashboard() {
  try {
    const user = await window.checkAuthentication();
    if (!user) {
      window.location.href = '/frontend/views/login.html';
      return;
    }

    document.getElementById('username').textContent = user.username;

    await loadSessions();

    const studyTopic = localStorage.getItem('currentStudyTopic') || 'General Study';
    document.getElementById('currentTopic').textContent = studyTopic;

    if (sessions.length > 0) {
      loadSession(0);
    } else {
      updateDashboardStats();
      updateTimerDisplay();
    }
  } catch (error) {
    console.error('Dashboard initialization error:', error);
  }
}

async function loadSessions() {
  try {
    const response = await fetch(`${API_BASE_URL}/sessions`, {
      method: 'GET',
      credentials: 'include'
    });

    const data = await response.json();

    if (data.success) {
      sessions = data.sessions;
      renderSessionsList();
      updateDashboardStats();
    }
  } catch (error) {
    console.error('Error loading sessions:', error);
  }
}

function renderSessionsList() {
  const sessionsList = document.getElementById('sessionsList');
  const sessionCount = document.getElementById('sessionCount');
  sessionsList.innerHTML = '';
  sessionCount.textContent = sessions.length;

  if (sessions.length === 0) {
    sessionsList.innerHTML = '<li class="empty-message">No sessions yet. Add one to get started.</li>';
    return;
  }

  sessions.forEach((session, index) => {
    const li = document.createElement('li');
    li.className = 'session-item';
    li.classList.toggle('active', index === currentSessionIndex);

    li.innerHTML = `
      <div class="session-item-content">
        <span class="session-name">${session.title}</span>
        <span class="session-time">${session.study_time}m study / ${session.break_time}m break</span>
      </div>
      <div class="session-item-actions">
        <button class="btn-small btn-edit" data-id="${session.id}" aria-label="Edit ${session.title}">Edit</button>
        <button class="btn-small btn-delete" data-id="${session.id}" aria-label="Delete ${session.title}">Del</button>
      </div>
    `;

    li.addEventListener('click', (event) => {
      if (!event.target.classList.contains('btn-edit') && !event.target.classList.contains('btn-delete')) {
        stopTimer();
        loadSession(index);
      }
    });

    li.querySelector('.btn-edit').addEventListener('click', (event) => {
      event.stopPropagation();
      editSession(session);
    });

    li.querySelector('.btn-delete').addEventListener('click', (event) => {
      event.stopPropagation();
      deleteSession(session.id);
    });

    sessionsList.appendChild(li);
  });
}

function loadSession(index) {
  if (index < 0 || index >= sessions.length) {
    return;
  }

  currentSessionIndex = index;
  isStudyPhase = true;

  totalTime = Number(sessions[index].study_time) * 60;
  timeRemaining = totalTime;

  updateTimerDisplay();
  updateLabel('Study');
  renderSessionsList();
}

function attachEventListeners() {
  document.getElementById('toggleSidebarBtn').addEventListener('click', toggleSidebar);
  document.getElementById('closeSidebarBtn').addEventListener('click', closeSidebar);
  document.getElementById('playBtn').addEventListener('click', startTimer);
  document.getElementById('pauseBtn').addEventListener('click', pauseTimer);
  document.getElementById('nextBtn').addEventListener('click', nextSession);
  document.getElementById('addSessionForm').addEventListener('submit', handleAddSession);
  document.getElementById('logoutBtn').addEventListener('click', handleLogout);
}

function toggleSidebar() {
  document.getElementById('sidebar').classList.toggle('open');
}

function closeSidebar() {
  document.getElementById('sidebar').classList.remove('open');
}

function startTimer() {
  if (isRunning || sessions.length === 0) {
    document.getElementById('timerInfo').textContent = 'Add a session before starting the timer.';
    return;
  }

  isRunning = true;
  document.getElementById('playBtn').disabled = true;
  document.getElementById('pauseBtn').disabled = false;
  document.getElementById('timerInfo').textContent = isStudyPhase ? 'Focus time is running.' : 'Break time is running.';

  timerInterval = setInterval(() => {
    timeRemaining--;

    if (timeRemaining <= 0) {
      switchPhase();
    }

    updateTimerDisplay();
  }, 1000);
}

function pauseTimer() {
  clearInterval(timerInterval);
  isRunning = false;

  document.getElementById('playBtn').disabled = false;
  document.getElementById('pauseBtn').disabled = true;
  document.getElementById('timerInfo').textContent = 'Timer paused.';
}

function switchPhase() {
  clearInterval(timerInterval);
  isRunning = false;

  if (isStudyPhase) {
    isStudyPhase = false;
    totalTime = Number(sessions[currentSessionIndex].break_time) * 60;
    timeRemaining = totalTime;
    updateLabel('Break');
    document.getElementById('timerInfo').textContent = 'Time for a break.';
  } else {
    currentSessionIndex = (currentSessionIndex + 1) % sessions.length;
    isStudyPhase = true;
    totalTime = Number(sessions[currentSessionIndex].study_time) * 60;
    timeRemaining = totalTime;
    updateLabel('Study');
    document.getElementById('timerInfo').textContent = 'Ready for the next session.';
    renderSessionsList();
  }

  document.getElementById('playBtn').disabled = false;
  document.getElementById('pauseBtn').disabled = true;
  updateTimerDisplay();
}

function nextSession() {
  stopTimer();

  if (sessions.length === 0) {
    document.getElementById('timerInfo').textContent = 'Add a session to build your study plan.';
    return;
  }

  currentSessionIndex = (currentSessionIndex + 1) % sessions.length;
  loadSession(currentSessionIndex);
  document.getElementById('timerInfo').textContent = 'Ready to start studying.';
}

function stopTimer() {
  clearInterval(timerInterval);
  isRunning = false;
  document.getElementById('playBtn').disabled = false;
  document.getElementById('pauseBtn').disabled = true;
}

function updateTimerDisplay() {
  const minutes = Math.floor(timeRemaining / 60);
  const seconds = timeRemaining % 60;

  document.getElementById('timerMinutes').textContent = String(minutes).padStart(2, '0');
  document.getElementById('timerSeconds').textContent = String(seconds).padStart(2, '0');

  const progress = totalTime > 0 ? (totalTime - timeRemaining) / totalTime : 0;
  const dashOffset = TIMER_CIRCUMFERENCE * (1 - progress);
  document.getElementById('progressCircle').style.strokeDashoffset = dashOffset;
}

function updateLabel(label) {
  document.getElementById('timerLabel').textContent = label;
  document.getElementById('currentMode').textContent = label;
}

function updateDashboardStats() {
  const totalStudyMinutes = sessions.reduce((total, session) => {
    return total + Number(session.study_time || 0);
  }, 0);

  document.getElementById('totalSessions').textContent = sessions.length;
  document.getElementById('totalStudyMinutes').textContent = totalStudyMinutes;
}

async function handleAddSession(event) {
  event.preventDefault();

  const sessionName = document.getElementById('sessionName').value.trim();
  const studyTime = parseInt(document.getElementById('studyTime').value, 10);
  const breakTime = parseInt(document.getElementById('breakTime').value, 10);

  if (!sessionName || !studyTime || !breakTime) {
    alert('Please fill in all fields.');
    return;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/sessions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify({
        title: sessionName,
        studyTime,
        breakTime
      })
    });

    const data = await response.json();

    if (data.success) {
      document.getElementById('addSessionForm').reset();
      await loadSessions();

      if (sessions.length === 1) {
        loadSession(0);
      }

      document.getElementById('timerInfo').textContent = 'Session added successfully.';
    } else {
      alert(data.message || 'Failed to add session.');
    }
  } catch (error) {
    console.error('Add session error:', error);
    alert('An error occurred. Please try again.');
  }
}

function editSession(session) {
  const newTitle = prompt('Edit session name:', session.title);
  if (newTitle === null) return;

  const newStudyTime = prompt('Edit study time (minutes):', session.study_time);
  if (newStudyTime === null) return;

  const newBreakTime = prompt('Edit break time (minutes):', session.break_time);
  if (newBreakTime === null) return;

  updateSession(session.id, newTitle, parseInt(newStudyTime, 10), parseInt(newBreakTime, 10));
}

async function updateSession(id, title, studyTime, breakTime) {
  try {
    const response = await fetch(`${API_BASE_URL}/sessions/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify({
        title,
        studyTime,
        breakTime
      })
    });

    const data = await response.json();

    if (data.success) {
      await loadSessions();
      loadSession(Math.min(currentSessionIndex, sessions.length - 1));
      document.getElementById('timerInfo').textContent = 'Session updated successfully.';
    } else {
      alert(data.message || 'Failed to update session.');
    }
  } catch (error) {
    console.error('Update session error:', error);
    alert('An error occurred. Please try again.');
  }
}

async function deleteSession(id) {
  if (!confirm('Are you sure you want to delete this session?')) {
    return;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/sessions/${id}`, {
      method: 'DELETE',
      credentials: 'include'
    });

    const data = await response.json();

    if (data.success) {
      await loadSessions();

      if (sessions.length > 0) {
        currentSessionIndex = Math.min(currentSessionIndex, sessions.length - 1);
        loadSession(currentSessionIndex);
      } else {
        currentSessionIndex = 0;
        totalTime = 0;
        timeRemaining = 0;
        updateTimerDisplay();
      }

      document.getElementById('timerInfo').textContent = 'Session deleted successfully.';
    } else {
      alert(data.message || 'Failed to delete session.');
    }
  } catch (error) {
    console.error('Delete session error:', error);
    alert('An error occurred. Please try again.');
  }
}

async function handleLogout() {
  try {
    const response = await fetch(`${API_BASE_URL}/logout`, {
      method: 'GET',
      credentials: 'include'
    });

    const data = await response.json();

    if (data.success) {
      localStorage.removeItem('onboardingCompleted');
      localStorage.removeItem('currentStudyTopic');
      window.location.href = '/frontend/views/login.html';
    }
  } catch (error) {
    console.error('Logout error:', error);
    alert('An error occurred while logging out.');
  }
}
