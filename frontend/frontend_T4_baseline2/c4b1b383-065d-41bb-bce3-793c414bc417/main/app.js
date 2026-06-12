document.addEventListener('DOMContentLoaded', () => {
    const taskForm = document.getElementById('task-form');
    const taskInput = document.getElementById('task-input');
    const taskList = document.getElementById('task-list');
    const filterButtons = document.querySelectorAll('.filter-btn');

    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

    function saveTasks() {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    function renderTasks(filter = 'all') {
        taskList.innerHTML = '';
        const filteredTasks = tasks.filter(task => {
            if (filter === 'active') return !task.completed;
            if (filter === 'completed') return task.completed;
            return true;
        });

        filteredTasks.forEach((task, index) => {
            const li = document.createElement('li');
            li.className = 'task-item';
            li.setAttribute('draggable', true);
            li.dataset.index = index;

            li.innerHTML = `
                <span class="task-text ${task.completed ? 'completed' : ''}">${task.text}</span>
                <div class="task-actions">
                    <button class="task-btn complete-btn" aria-label="Complete task">
                        ${task.completed ? '↩️' : '✓'}
                    </button>
                    <button class="task-btn edit-btn" aria-label="Edit task">✏️</button>
                    <button class="task-btn delete-btn" aria-label="Delete task">🗑️</button>
                </div>
            `;

            // Complete task
            li.querySelector('.complete-btn').addEventListener('click', () => {
                task.completed = !task.completed;
                saveTasks();
                renderTasks(getCurrentFilter());
            });

            // Edit task
            li.querySelector('.edit-btn').addEventListener('click', () => {
                const newText = prompt('Edit task:', task.text);
                if (newText !== null && newText.trim() !== '') {
                    task.text = newText.trim();
                    saveTasks();
                    renderTasks(getCurrentFilter());
                }
            });

            // Delete task
            li.querySelector('.delete-btn').addEventListener('click', () => {
                tasks.splice(index, 1);
                saveTasks();
                renderTasks(getCurrentFilter());
            });

            // Drag and drop functionality
            li.addEventListener('dragstart', dragStart);
            li.addEventListener('dragover', dragOver);
            li.addEventListener('drop', drop);
            li.addEventListener('dragend', dragEnd);

            taskList.appendChild(li);
        });
    }

    function getCurrentFilter() {
        const activeFilter = document.querySelector('.filter-btn.active');
        return activeFilter ? activeFilter.dataset.filter : 'all';
    }

    // Drag and drop handlers
    let draggedItem = null;

    function dragStart(e) {
        draggedItem = e.target.closest('.task-item');
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/html', draggedItem.innerHTML);
    }

    function dragOver(e) {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
    }

    function drop(e) {
        e.preventDefault();
        const dropTarget = e.target.closest('.task-item');
        
        if (dropTarget && draggedItem !== dropTarget) {
            const dragIndex = parseInt(draggedItem.dataset.index);
            const dropIndex = parseInt(dropTarget.dataset.index);

            // Swap tasks in the array
            const temp = tasks[dragIndex];
            tasks[dragIndex] = tasks[dropIndex];
            tasks[dropIndex] = temp;

            saveTasks();
            renderTasks(getCurrentFilter());
        }
    }

    function dragEnd() {
        draggedItem = null;
    }

    // Add new task
    taskForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const taskText = taskInput.value.trim();
        
        if (taskText) {
            tasks.push({ text: taskText, completed: false });
            saveTasks();
            taskInput.value = '';
            renderTasks(getCurrentFilter());
        }
    });

    // Filter tasks
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            renderTasks(button.dataset.filter);
        });
    });

    // Initial render
    renderTasks();
});