document.addEventListener('DOMContentLoaded', () => {
    const taskForm = document.getElementById('task-form');
    const taskInput = document.getElementById('new-task');
    const taskList = document.getElementById('task-list');
    const emptyState = document.getElementById('task-list-empty-state');
    const filterButtons = document.querySelectorAll('.filter-btn');

    // Task data model
    class TaskManager {
        constructor() {
            this.tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        }

        addTask(text) {
            const task = {
                id: Date.now(),
                text: text.trim(),
                completed: false,
                order: this.tasks.length
            };
            this.tasks.push(task);
            this.saveTasks();
            return task;
        }

        updateTask(id, updates) {
            const taskIndex = this.tasks.findIndex(task => task.id === id);
            if (taskIndex !== -1) {
                this.tasks[taskIndex] = { ...this.tasks[taskIndex], ...updates };
                this.saveTasks();
            }
        }

        deleteTask(id) {
            this.tasks = this.tasks.filter(task => task.id !== id);
            this.saveTasks();
        }

        saveTasks() {
            localStorage.setItem('tasks', JSON.stringify(this.tasks));
            this.renderTasks();
        }

        renderTasks(filter = 'all') {
            // Clear existing tasks
            taskList.innerHTML = '';

            // Filter tasks based on current filter
            const filteredTasks = this.tasks.filter(task => {
                switch(filter) {
                    case 'active': return !task.completed;
                    case 'completed': return task.completed;
                    default: return true;
                }
            }).sort((a, b) => a.order - b.order);

            // Render tasks or show empty state
            if (filteredTasks.length === 0) {
                emptyState.style.display = 'block';
                taskList.style.display = 'none';
            } else {
                emptyState.style.display = 'none';
                taskList.style.display = 'block';

                filteredTasks.forEach(task => {
                    const li = document.createElement('li');
                    li.classList.add('task-item');
                    li.setAttribute('draggable', 'true');
                    li.dataset.taskId = task.id;

                    li.innerHTML = `
                        <div class="task-content ${task.completed ? 'completed' : ''}">
                            <input 
                                type="checkbox" 
                                class="task-checkbox" 
                                ${task.completed ? 'checked' : ''}
                            >
                            <span class="task-text">${task.text}</span>
                            <div class="task-actions">
                                <button class="edit-task-btn" aria-label="Edit task">
                                    ✏️
                                </button>
                                <button class="delete-task-btn" aria-label="Delete task">
                                    🗑️
                                </button>
                            </div>
                        </div>
                    `;

                    // Checkbox toggle
                    const checkbox = li.querySelector('.task-checkbox');
                    checkbox.addEventListener('change', () => {
                        const taskContent = checkbox.closest('.task-content');
                        taskContent.classList.toggle('completed', checkbox.checked);
                        this.updateTask(task.id, { completed: checkbox.checked });
                    });

                    // Edit task
                    const editBtn = li.querySelector('.edit-task-btn');
                    editBtn.addEventListener('click', () => this.editTask(task.id, li));

                    // Delete task
                    const deleteBtn = li.querySelector('.delete-task-btn');
                    deleteBtn.addEventListener('click', () => this.deleteTask(task.id));

                    // Drag and drop
                    li.addEventListener('dragstart', this.handleDragStart.bind(this));
                    li.addEventListener('dragover', this.handleDragOver);
                    li.addEventListener('drop', this.handleDrop.bind(this));
                    li.addEventListener('dragend', this.handleDragEnd.bind(this));

                    taskList.appendChild(li);
                });
            }
        }

        editTask(id, taskElement) {
            const task = this.tasks.find(t => t.id === id);
            const taskText = taskElement.querySelector('.task-text');
            const currentText = task.text;

            // Create editable input
            const editInput = document.createElement('input');
            editInput.type = 'text';
            editInput.value = currentText;
            editInput.classList.add('edit-task-input');
            editInput.setAttribute('aria-label', 'Edit task text');

            // Replace text with input
            taskText.replaceWith(editInput);
            editInput.focus();

            // Save or cancel edit on blur/enter/escape
            editInput.addEventListener('blur', saveEdit);
            editInput.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') saveEdit();
                if (e.key === 'Escape') cancelEdit();
            });

            function saveEdit() {
                const newText = editInput.value.trim();
                if (newText && newText !== currentText) {
                    taskText.textContent = newText;
                    this.updateTask(id, { text: newText });
                }
                editInput.replaceWith(taskText);
            }

            function cancelEdit() {
                editInput.replaceWith(taskText);
            }
        }

        // Drag and Drop Methods
        handleDragStart(e) {
            e.dataTransfer.setData('text/plain', e.target.dataset.taskId);
            e.target.classList.add('dragging');
        }

        handleDragOver(e) {
            e.preventDefault();
            e.dataTransfer.dropEffect = 'move';
        }

        handleDrop(e) {
            e.preventDefault();
            const draggedTaskId = parseInt(e.dataTransfer.getData('text/plain'));
            const dropTargetTaskId = parseInt(e.target.closest('li').dataset.taskId);

            if (draggedTaskId !== dropTargetTaskId) {
                const draggedTaskIndex = this.tasks.findIndex(t => t.id === draggedTaskId);
                const dropTargetTaskIndex = this.tasks.findIndex(t => t.id === dropTargetTaskId);

                // Swap order
                const temp = this.tasks[draggedTaskIndex].order;
                this.tasks[draggedTaskIndex].order = this.tasks[dropTargetTaskIndex].order;
                this.tasks[dropTargetTaskIndex].order = temp;

                this.saveTasks();
            }
        }

        handleDragEnd(e) {
            e.target.classList.remove('dragging');
        }
    }

    // Initialize task manager
    const taskManager = new TaskManager();

    // Add task form submission
    taskForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const taskText = taskInput.value.trim();
        if (taskText) {
            taskManager.addTask(taskText);
            taskInput.value = '';
        }
    });

    // Filter tasks
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active state from all buttons
            filterButtons.forEach(btn => {
                btn.classList.remove('active');
                btn.setAttribute('aria-pressed', 'false');
            });

            // Set current button as active
            button.classList.add('active');
            button.setAttribute('aria-pressed', 'true');

            // Render tasks with selected filter
            const filter = button.dataset.filter;
            taskManager.renderTasks(filter);
        });
    });

    // Initial render
    taskManager.renderTasks();
});