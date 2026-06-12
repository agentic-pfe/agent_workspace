// Taskr: Interactive Task Management Application

class TaskManager {
    constructor() {
        // Core task management elements
        this.taskForm = document.querySelector('#task-form');
        this.taskInput = document.querySelector('#task-input');
        this.taskList = document.querySelector('#task-list');
        this.filterButtons = document.querySelectorAll('.filter-btn');
        this.emptyState = document.querySelector('.empty-state');

        // Bind methods to maintain correct context
        this.addTask = this.addTask.bind(this);
        this.deleteTask = this.deleteTask.bind(this);
        this.toggleTaskCompletion = this.toggleTaskCompletion.bind(this);
        this.filterTasks = this.filterTasks.bind(this);
        this.editTask = this.editTask.bind(this);
        this.initDragAndDrop = this.initDragAndDrop.bind(this);

        // Initialize event listeners and load tasks
        this.initEventListeners();
        this.loadTasks();
    }

    initEventListeners() {
        // Form submission for adding tasks
        this.taskForm.addEventListener('submit', (e) => {
            e.preventDefault();
            this.addTask(this.taskInput.value.trim());
            this.taskInput.value = '';
        });

        // Filter button event delegation
        this.filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                this.filterButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                this.filterTasks(button.dataset.filter);
            });
        });

        // Delegate events for task list interactions
        this.taskList.addEventListener('click', (e) => {
            const taskItem = e.target.closest('.task-item');
            if (!taskItem) return;

            if (e.target.matches('.delete-btn')) {
                this.deleteTask(taskItem.dataset.id);
            } else if (e.target.matches('.task-checkbox')) {
                this.toggleTaskCompletion(taskItem.dataset.id);
            } else if (e.target.matches('.task-text')) {
                this.editTask(taskItem);
            }
        });
    }

    generateUniqueId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }

    addTask(taskText) {
        if (!taskText) return;

        const task = {
            id: this.generateUniqueId(),
            text: taskText,
            completed: false,
            order: this.getTasks().length
        };

        const tasks = this.getTasks();
        tasks.push(task);
        this.saveTasks(tasks);
        this.renderTasks();
    }

    deleteTask(taskId) {
        const tasks = this.getTasks().filter(task => task.id !== taskId);
        this.saveTasks(tasks);
        this.renderTasks();
    }

    toggleTaskCompletion(taskId) {
        const tasks = this.getTasks().map(task => 
            task.id === taskId ? { ...task, completed: !task.completed } : task
        );
        this.saveTasks(tasks);
        this.renderTasks();
    }

    editTask(taskItem) {
        const taskText = taskItem.querySelector('.task-text');
        const currentText = taskText.textContent;
        
        // Create an input for inline editing
        const editInput = document.createElement('input');
        editInput.type = 'text';
        editInput.value = currentText;
        editInput.classList.add('task-edit-input');
        
        editInput.addEventListener('blur', () => {
            const newText = editInput.value.trim();
            if (newText && newText !== currentText) {
                const tasks = this.getTasks().map(task => 
                    task.id === taskItem.dataset.id ? { ...task, text: newText } : task
                );
                this.saveTasks(tasks);
                this.renderTasks();
            } else {
                taskText.textContent = currentText;
            }
        });

        editInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') editInput.blur();
            if (e.key === 'Escape') {
                taskText.textContent = currentText;
                taskItem.focus();
            }
        });

        taskText.replaceWith(editInput);
        editInput.focus();
    }

    filterTasks(filter) {
        const tasks = this.getTasks();
        const filteredTasks = tasks.filter(task => {
            switch(filter) {
                case 'active': return !task.completed;
                case 'completed': return task.completed;
                default: return true;
            }
        });
        this.renderTasks(filteredTasks);
    }

    initDragAndDrop() {
        const taskItems = this.taskList.querySelectorAll('.task-item');
        
        taskItems.forEach(taskItem => {
            taskItem.setAttribute('draggable', true);
            
            taskItem.addEventListener('dragstart', (e) => {
                e.dataTransfer.setData('text/plain', taskItem.dataset.id);
                taskItem.classList.add('dragging');
            });

            taskItem.addEventListener('dragend', () => {
                taskItem.classList.remove('dragging');
            });

            taskItem.addEventListener('dragover', (e) => {
                e.preventDefault();
                const draggingItem = document.querySelector('.dragging');
                const siblings = [...this.taskList.querySelectorAll('.task-item:not(.dragging)')];
                
                let nextSibling = siblings.find(sibling => {
                    return e.clientY <= sibling.offsetTop + sibling.offsetHeight / 2;
                });
                
                this.taskList.insertBefore(draggingItem, nextSibling);
            });
        });
    }

    renderTasks(tasksToRender = null) {
        const tasks = tasksToRender || this.getTasks();
        
        // Sort tasks by order
        tasks.sort((a, b) => a.order - b.order);
        
        this.taskList.innerHTML = '';
        
        if (tasks.length === 0) {
            this.emptyState.classList.remove('hidden');
            return;
        }
        
        this.emptyState.classList.add('hidden');
        
        tasks.forEach(task => {
            const taskItem = document.createElement('li');
            taskItem.classList.add('task-item');
            taskItem.dataset.id = task.id;
            taskItem.innerHTML = `
                <input type="checkbox" class="task-checkbox" ${task.completed ? 'checked' : ''}>
                <span class="task-text ${task.completed ? 'completed' : ''}">${task.text}</span>
                <button class="delete-btn" aria-label="Delete task">✕</button>
            `;
            this.taskList.appendChild(taskItem);
        });

        // Update task order in localStorage after rendering
        const updatedTasks = Array.from(this.taskList.children).map((taskItem, index) => {
            const task = tasks.find(t => t.id === taskItem.dataset.id);
            return { ...task, order: index };
        });
        this.saveTasks(updatedTasks);

        this.initDragAndDrop();
    }

    getTasks() {
        return JSON.parse(localStorage.getItem('tasks') || '[]');
    }

    saveTasks(tasks) {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    loadTasks() {
        this.renderTasks();
    }
}

// Initialize the TaskManager when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    new TaskManager();
});