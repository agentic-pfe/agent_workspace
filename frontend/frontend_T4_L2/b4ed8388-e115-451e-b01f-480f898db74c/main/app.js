class TaskManager {
    constructor() {
        this.taskInput = document.getElementById('taskInput');
        this.addTaskBtn = document.getElementById('addTaskBtn');
        this.taskList = document.getElementById('taskList');
        this.filterButtons = document.querySelectorAll('.filter-btn');

        this.tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        this.currentFilter = 'all';

        this.initEventListeners();
        this.renderTasks();
    }

    initEventListeners() {
        this.addTaskBtn.addEventListener('click', () => this.addTask());
        this.taskInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.addTask();
        });

        this.taskList.addEventListener('click', (e) => {
            const taskItem = e.target.closest('.task-item');
            if (!taskItem) return;

            const taskId = taskItem.dataset.id;
            
            if (e.target.classList.contains('complete-btn')) {
                this.toggleTaskCompletion(taskId);
            } else if (e.target.classList.contains('delete-btn')) {
                this.deleteTask(taskId);
            }
        });

        this.filterButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                this.currentFilter = btn.dataset.filter;
                this.updateFilterButtons();
                this.renderTasks();
            });
        });

        // Drag and Drop Event Listeners
        this.taskList.addEventListener('dragstart', this.handleDragStart.bind(this));
        this.taskList.addEventListener('dragover', this.handleDragOver.bind(this));
        this.taskList.addEventListener('drop', this.handleDrop.bind(this));
        this.taskList.addEventListener('dragend', this.handleDragEnd.bind(this));
    }

    addTask() {
        const taskText = this.taskInput.value.trim();
        if (!taskText) return;

        const newTask = {
            id: Date.now().toString(),
            text: taskText,
            completed: false
        };

        this.tasks.push(newTask);
        this.saveTasksToLocalStorage();
        this.renderTasks();
        this.taskInput.value = '';
    }

    renderTasks() {
        this.taskList.innerHTML = '';
        const filteredTasks = this.filterTasks();

        filteredTasks.forEach(task => {
            const taskItem = document.createElement('li');
            taskItem.classList.add('task-item');
            taskItem.dataset.id = task.id;
            taskItem.setAttribute('draggable', 'true');

            if (task.completed) {
                taskItem.classList.add('completed');
            }

            taskItem.innerHTML = `
                <span class="task-text">${task.text}</span>
                <div class="task-actions">
                    <button class="task-btn complete-btn" aria-label="Toggle task completion">
                        ${task.completed ? '↩️' : '✔️'}
                    </button>
                    <button class="task-btn delete-btn" aria-label="Delete task">🗑️</button>
                </div>
            `;

            this.taskList.appendChild(taskItem);
        });
    }

    filterTasks() {
        switch (this.currentFilter) {
            case 'active':
                return this.tasks.filter(task => !task.completed);
            case 'completed':
                return this.tasks.filter(task => task.completed);
            default:
                return this.tasks;
        }
    }

    updateFilterButtons() {
        this.filterButtons.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.filter === this.currentFilter);
        });
    }

    toggleTaskCompletion(taskId) {
        const task = this.tasks.find(t => t.id === taskId);
        if (task) {
            task.completed = !task.completed;
            this.saveTasksToLocalStorage();
            this.renderTasks();
        }
    }

    deleteTask(taskId) {
        this.tasks = this.tasks.filter(task => task.id !== taskId);
        this.saveTasksToLocalStorage();
        this.renderTasks();
    }

    saveTasksToLocalStorage() {
        localStorage.setItem('tasks', JSON.stringify(this.tasks));
    }

    // Drag and Drop Methods
    handleDragStart(e) {
        if (!e.target.classList.contains('task-item')) return;
        e.target.classList.add('dragging');
        e.dataTransfer.setData('text/plain', e.target.dataset.id);
    }

    handleDragOver(e) {
        e.preventDefault();
        const draggingItem = document.querySelector('.dragging');
        const siblings = [...this.taskList.querySelectorAll('.task-item')].filter(
            sibling => sibling !== draggingItem
        );

        let nextSibling = siblings.find(sibling => {
            return e.clientY <= sibling.offsetTop + sibling.offsetHeight / 2;
        });

        this.taskList.insertBefore(draggingItem, nextSibling);
    }

    handleDrop(e) {
        e.preventDefault();
        const draggedTaskId = e.dataTransfer.getData('text/plain');
        const draggedTask = this.tasks.find(task => task.id === draggedTaskId);

        // Reorder tasks based on new DOM order
        const taskItems = Array.from(this.taskList.children);
        const newTaskOrder = taskItems.map(item => item.dataset.id);
        
        this.tasks = newTaskOrder.map(id => 
            this.tasks.find(task => task.id === id)
        );

        this.saveTasksToLocalStorage();
    }

    handleDragEnd(e) {
        e.target.classList.remove('dragging');
    }
}

// Initialize the Task Manager when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    new TaskManager();
});