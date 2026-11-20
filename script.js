const AI_SUGGESTIONS = [
  { title: 'Take a break from MJOLO', priority: 'High' },
  { title: 'Go clubing with the BigBoiz', priority: 'Medium' },
  { title: 'Go for a swim once in a while', priority: 'Low' }
];

let tasks = JSON.parse(localStorage.getItem('pristia_tasks')) || [];

const taskListEl = document.getElementById('task-list');
const addTaskForm = document.getElementById('add-task-form');
const newTaskInput = document.getElementById('new-task-input');
const newTaskPriority = document.getElementById('new-task-priority');
const toggleAddBtn = document.getElementById('toggle-add-btn');
const cancelAddBtn = document.getElementById('cancel-add-btn');
const focusModeBtn = document.getElementById('focus-mode-btn');
const aiAssistBtn = document.getElementById('ai-assist-btn');
const finishBtn = document.getElementById('finish-btn');
const impactScoreEl = document.getElementById('impact-score');
const sessionLengthEl = document.getElementById('session-length');

function saveTasks() {
  localStorage.setItem('pristia_tasks', JSON.stringify(tasks));
}

function renderTasks() {
  taskListEl.innerHTML = '';

  tasks.forEach((task) => {
    const li = document.createElement('li');
    li.className = `task-item ${task.completed ? 'completed' : ''}`;

    li.innerHTML = `
      <label class="task-left">
        <input type="checkbox" class="custom-checkbox" ${task.completed ? 'checked' : ''} />
        <span class="task-title">${escapeHTML(task.title)}</span>
      </label>

      <div class="task-right">
        <div class="priority-wrapper priority-${task.priority}">
          <span class="priority-dot"></span>
          <select class="priority-select" aria-label="Change priority">
            <option value="High" ${task.priority === 'High' ? 'selected' : ''}>High</option>
            <option value="Medium" ${task.priority === 'Medium' ? 'selected' : ''}>Medium</option>
            <option value="Low" ${task.priority === 'Low' ? 'selected' : ''}>Low</option>
          </select>
          <span class="priority-chevron">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
          </span>
        </div>

        <button type="button" class="delete-btn" aria-label="Delete task" title="Delete task">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="3 6 5 6 21 6"></polyline>
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
          </svg>
        </button>
      </div>
    `;

    // Toggle completion
    const checkbox = li.querySelector('.custom-checkbox');
    checkbox.addEventListener('change', () => {
      task.completed = checkbox.checked;
      saveTasks();
      renderTasks();
    });

    // Change priority badge
    const select = li.querySelector('.priority-select');
    select.addEventListener('change', (e) => {
      task.priority = e.target.value;
      saveTasks();
      renderTasks();
    });

    // Delete task
    const deleteBtn = li.querySelector('.delete-btn');
    deleteBtn.addEventListener('click', () => {
      tasks = tasks.filter((t) => t.id !== task.id);
      saveTasks();
      renderTasks();
    });

    taskListEl.appendChild(li);
  });
}

function escapeHTML(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

// Show/hide inline Add Task form
toggleAddBtn.addEventListener('click', () => {
  addTaskForm.classList.remove('hidden');
  newTaskInput.focus();
});

cancelAddBtn.addEventListener('click', () => {
  addTaskForm.classList.add('hidden');
  addTaskForm.reset();
});

// Add new task
addTaskForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const title = newTaskInput.value.trim();
  if (!title) return;

  tasks.push({
    id: Date.now(),
    title,
    priority: newTaskPriority.value,
    completed: false
  });

  saveTasks();
  renderTasks();
  addTaskForm.reset();
  addTaskForm.classList.add('hidden');
});

// Toggle Focus Mode
focusModeBtn.addEventListener('click', () => {
  document.body.classList.toggle('focus-active');
  focusModeBtn.classList.toggle('active');
});

// AI Assist adds a suggested design task
aiAssistBtn.addEventListener('click', () => {
  const randomTask = AI_SUGGESTIONS[Math.floor(Math.random() * AI_SUGGESTIONS.length)];
  tasks.push({
    id: Date.now(),
    title: randomTask.title,
    priority: randomTask.priority,
    completed: false
  });
  saveTasks();
  renderTasks();
});

// Finish updates the middle card metrics based on completed tasks
finishBtn.addEventListener('click', () => {
  const completedCount = tasks.filter((t) => t.completed).length;
  const score = completedCount > 0 ? Math.min(100, completedCount * 32) : 0;
  impactScoreEl.textContent = `${score} / 100`;
  sessionLengthEl.textContent = `${Math.max(25, completedCount * 25)} mins`;
});

// Initial render
renderTasks();
