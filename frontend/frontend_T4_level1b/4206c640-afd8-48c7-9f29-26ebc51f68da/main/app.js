class TaskManager {
    constructor() {
        this.tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        this.taskList = document.getElementById('task-list');
        this.taskModal = document.getElementById('task-modal');
        this.taskForm = document.getElementById('task-form');
        this.modalTitle = document.getElementById('modal-title');
        this.modalCloseBtn = document.getElementById('modal-close');
        this.addTaskBtn = document.querySelector('.task-add-btn');
        this.filterButtons = document.querySelectorAll('.filter-btn');
        this.currentEditTaskId = null;

        this.initEventListeners();
        this.renderTasks();
    }

    initEventListeners() {
        this.addTaskBtn.addEventListener('click', () => this.openModal());
        this.modalCloseBtn.addEventListener('click', () => this.closeModal());
        this.taskForm.addEventListener('submit', (e) => this.handleTaskSubmit(e));
        this.filterButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                this.filterButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.filterTasks(btn.dataset.filter);
            });
        });

        // Mobile menu toggle
        const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
        const navLinks = document.querySelector('.nav-links');
        mobileMenuToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });
    }

    openModal(task = null) {
        this.taskModal.style.display = 'flex';
        this.taskModal.setAttribute('aria-hidden', 'false');

        if (task) {
            this.modalTitle.textContent = 'Edit Task';
            this.currentEditTaskId = task.id;
            document.getElementById('task-title').value = task.title;
            document.getElementById('task-description').value = task.description;
            document.getElementById('task-status').value = task.status;
        } else {
            this.modalTitle.textContent = 'Add New Task';
            this.currentEditTaskId = null;
            this.taskForm.reset();
        }
    }

    closeModal() {
        this.taskModal.style.display = 'none';
        this.taskModal.setAttribute('aria-hidden', 'true');
        this.currentEditTaskId = null;
    }

    handleTaskSubmit(e) {
        e.preventDefault();
        const title = document.getElementById('task-title').value;
        const description = document.getElementById('task-description').value;
        const status = document.getElementById('task-status').value;

        if (this.currentEditTaskId) {
            this.updateTask(this.currentEditTaskId, { title, description, status });
        } else {
            this.addTask({ title, description, status });
        }

        this.closeModal();
    }

    addTask(taskData) {
        const newTask = {
            id: Date.now(),
            ...taskData,
            createdAt: new Date().toISOString()
        };

        this.tasks.push(newTask);
        this.saveTasks();
        this.renderTasks();
    }

    updateTask(taskId, updatedData) {
        const taskIndex = this.tasks.findIndex(task => task.id === taskId);
        if (taskIndex !== -1) {
            this.tasks[taskIndex] = { ...this.tasks[taskIndex], ...updatedData };
            this.saveTasks();
            this.renderTasks();
        }
    }

    deleteTask(taskId) {
        this.tasks = this.tasks.filter(task => task.id !== taskId);
        this.saveTasks();
        this.renderTasks();
    }

    filterTasks(filter) {
        const taskElements = this.taskList.querySelectorAll('.task-item');
        taskElements.forEach(taskEl => {
            const status = taskEl.dataset.status.toLowerCase();
            const show = filter === 'all' || status === filter;
            taskEl.style.display = show ? 'flex' : 'none';
        });
    }

    renderTasks() {
        this.taskList.innerHTML = '';
        this.tasks.forEach(task => {
            const taskElement = document.createElement('div');
            taskElement.classList.add('task-item');
            taskElement.dataset.status = task.status.toLowerCase();
            taskElement.innerHTML = `
                <div>
                    <h3>${task.title}</h3>
                    <p>${task.description || ''}</p>
                    <span class="status-badge">${task.status}</span>
                </div>
                <div class="task-actions">
                    <button class="task-edit-btn" aria-label="Edit Task">✏️</button>
                    <button class="task-delete-btn" aria-label="Delete Task">🗑️</button>
                </div>
            `;

            const editBtn = taskElement.querySelector('.task-edit-btn');
            const deleteBtn = taskElement.querySelector('.task-delete-btn');

            editBtn.addEventListener('click', () => this.openModal(task));
            deleteBtn.addEventListener('click', () => {
                if (confirm('Are you sure you want to delete this task?')) {
                    this.deleteTask(task.id);
                }
            });

            this.taskList.appendChild(taskElement);
        });
    }

    saveTasks() {
        localStorage.setItem('tasks', JSON.stringify(this.tasks));
    }
}

// Initialize the app
document.addEventListener('DOMContentLoaded', () => {
    new TaskManager();
});