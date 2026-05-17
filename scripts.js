if (typeof AOS !== "undefined") {
  AOS.init();
}

const taskInput = document.getElementById('taskInput');
const priorityInput = document.getElementById('priorityInput');
const categoryInput = document.getElementById('categoryInput');
const dateInput = document.getElementById('dateInput');
const addTaskBtn = document.getElementById('addTaskBtn');
const taskList = document.getElementById('taskList');
const searchInput = document.getElementById('searchInput');
const emptyState = document.getElementById('emptyState');

let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
let currentFilter = 'all';

function saveTasks() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

function showToast(message) {
  document.getElementById('toastMessage').innerText = message;
  const toast = new bootstrap.Toast(document.getElementById('liveToast'));
  toast.show();
}

function updateStats() {
  const total = tasks.length;
  const completed = tasks.filter(t => t.completed).length;
  const pending = total - completed;

  document.getElementById('totalTasks').innerText = total;
  document.getElementById('completedTasks').innerText = completed;
  document.getElementById('pendingTasks').innerText = pending;

  let percent = total === 0 ? 0 : Math.round((completed / total) * 100);

  document.getElementById('progressBar').style.width = percent + '%';
  document.getElementById('progressText').innerText = percent + '%';
}

function renderTasks() {

  taskList.innerHTML = '';

  let filteredTasks = tasks.filter(task => {

    if (currentFilter === 'completed') return task.completed;
    if (currentFilter === 'pending') return !task.completed;

    return true;

  });

  filteredTasks = filteredTasks.filter(task =>
    task.text.toLowerCase().includes(searchInput.value.toLowerCase())
  );

  if (filteredTasks.length === 0) {
    emptyState.style.display = 'block';
  } else {
    emptyState.style.display = 'none';
  }

  filteredTasks.forEach((task) => {

    const realIndex = tasks.indexOf(task);
    const taskCard = document.createElement('div');
    taskCard.className = `task-card ${task.completed ? 'completed-task' : ''}`;
    taskCard.setAttribute('data-aos', 'fade-up');

    taskCard.innerHTML = `

      <div class="task-info">

      <h5>${task.text}</h5>

        <div class="d-flex flex-wrap gap-2 mt-2">
          <span class="priority ${task.priority.toLowerCase()}">
            ${task.priority}
          </span>

          <span class="badge bg-primary">
            ${task.category}
          </span>

          <span class="badge bg-dark">
            ${task.date || 'No Date'}
          </span>
        </div>
      </div>

      <div class="task-actions">

  <button class="complete-btn" onclick="toggleComplete(${realIndex})">
    <i class="bi bi-check-lg"></i>
  </button>

  <button class="edit-btn" onclick="editTask(${realIndex})">
    <i class="bi bi-pencil-fill"></i>
  </button>

  <button class="delete-btn" onclick="deleteTask(${realIndex})">
    <i class="bi bi-trash3"></i>
  </button>

</div>

    `;

    taskList.appendChild(taskCard);
  });

  updateStats();
  saveTasks();
}

function addTask() {

  const text = taskInput.value.trim();

  if (text === '') {
    showToast('Please enter a task');
    return;
  }

  tasks.unshift({
    text,
    priority: priorityInput.value,
    category: categoryInput.value,
    date: dateInput.value,
    completed: false
  });

  taskInput.value = '';
  dateInput.value = '';

  showToast('Task Added Successfully');

  renderTasks();
}

function toggleComplete(index) {

  tasks[index].completed = !tasks[index].completed;

  if (tasks[index].completed) {

    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });

    showToast('Task Completed');
  }

  renderTasks();
}

function deleteTask(index) {

  tasks.splice(index, 1);

  showToast('Task Deleted');

  renderTasks();
}

addTaskBtn.addEventListener('click', addTask);

searchInput.addEventListener('input', renderTasks);

window.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') addTask();
});

const filterButtons = document.querySelectorAll('.filter-btn');

filterButtons.forEach(button => {

  button.addEventListener('click', () => {

    filterButtons.forEach(btn => btn.classList.remove('active'));

    button.classList.add('active');

    currentFilter = button.dataset.filter;

    renderTasks();
  });
});

const themeToggle = document.getElementById("themeToggle");

themeToggle.addEventListener("click", () => {

  document.body.classList.toggle("light-mode");

  console.log("Toggle Working");

  if (document.body.classList.contains("light-mode")) {

    themeToggle.innerHTML =
      '<i class="bi bi-sun-fill"></i>';

  } else {

    themeToggle.innerHTML =
      '<i class="bi bi-moon-stars-fill"></i>';
  }
});

if (typeof Sortable !== "undefined") {

  new Sortable(taskList, {
    animation: 200
  });

}

renderTasks();