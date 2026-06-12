document.addEventListener('DOMContentLoaded', () => {
    const taskInput = document.querySelector('.task-input');
    const addTaskBtn = document.querySelector('.btn-add-task');
    const taskList = document.querySelector('.task-list');
    const filterButtons = document.querySelectorAll('.filter-btn');
    const emptyState = document.querySelector('.empty-state');

    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

    function saveTasks() {
        localStorage.setItem('tasks', JSON.stringify(tasks));
        updateEmptyState();
    }

    function updateEmptyState() {
        emptyState.style.display = tasks.length === 0 ? 'block' : 'none';
    }

    function createTaskElement(task) {
        const li = document.createElement('li');
        li.classList.add('task-item');
        li.setAttribute('draggable', 'true');
        li.dataset.id = task.id;
        li.dataset.completed = task.completed;

        li.innerHTML = `
            <div class="task-content ${task.completed ? 'completed' : ''}">
                <span class="task-text">${task.text}</span>
                <div class="task-actions">
                    <button class="btn-edit" aria-label="Edit task">✏️</button>
                    <button class="btn-delete" aria-label="Delete task">🗑️</button>
                </div>
            </div>
            <input type="checkbox" class="task-checkbox" ${task.completed ? 'checked' : ''}>
        `;

        return li;
    }

    function renderTasks(filter = 'all') {
        taskList.innerHTML = '';
        const filteredTasks = tasks.filter(task => {
            if (filter === 'active') return !task.completed;
            if (filter === 'completed') return task.completed;
            return true;
        });

        filteredTasks.forEach(task => {
            const taskElement = createTaskElement(task);
            taskList.appendChild(taskElement);
        });

        updateEmptyState();
    }

    function addTask(text) {
        if (text.trim() === '') return;

        const newTask = {
            id: Date.now(),
            text: text.trim(),
            completed: false
        };

        tasks.push(newTask);
        saveTasks();
        renderTasks();
        taskInput.value = '';
    }

    function editTask(taskElement, newText) {
        const taskId = parseInt(taskElement.dataset.id);
        const task = tasks.find(t => t.id === taskId);
        
        if (task && newText.trim() !== '') {
            task.text = newText.trim();
            saveTasks();
            renderTasks();
        }
    }

    function deleteTask(taskElement) {
        const taskId = parseInt(taskElement.dataset.id);
        tasks = tasks.filter(task => task.id !== taskId);
        saveTasks();
        renderTasks();
    }

    function toggleTaskCompletion(taskElement) {
        const taskId = parseInt(taskElement.dataset.id);
        const task = tasks.find(t => t.id === taskId);
        
        if (task) {
            task.completed = !task.completed;
            saveTasks();
            renderTasks();
        }
    }

    // Event Delegation
    taskList.addEventListener('click', (e) => {
        const taskItem = e.target.closest('.task-item');
        
        if (e.target.classList.contains('btn-delete')) {
            deleteTask(taskItem);
        }

        if (e.target.classList.contains('btn-edit')) {
            const taskText = taskItem.querySelector('.task-text');
            const currentText = taskText.textContent;
            const newText = prompt('Edit task:', currentText);
            
            if (newText !== null) {
                editTask(taskItem, newText);
            }
        }

        if (e.target.classList.contains('task-checkbox')) {
            toggleTaskCompletion(taskItem);
        }
    });

    // Add Task Event Listeners
    addTaskBtn.addEventListener('click', () => addTask(taskInput.value));
    taskInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') addTask(taskInput.value);
    });

    // Filter Event Listeners
    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            if (btn.classList.contains('filter-btn-all')) renderTasks('all');
            if (btn.classList.contains('filter-btn-active')) renderTasks('active');
            if (btn.classList.contains('filter-btn-completed')) renderTasks('completed');
        });
    });

    // Drag and Drop Functionality
    let draggedItem = null;

    taskList.addEventListener('dragstart', (e) => {
        draggedItem = e.target.closest('.task-item');
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/html', draggedItem.innerHTML);
        draggedItem.classList.add('dragging');
    });

    taskList.addEventListener('dragover', (e) => {
        e.preventDefault();
        const afterElement = getDragAfterElement(taskList, e.clientY);
        if (afterElement == null) {
            taskList.appendChild(draggedItem);
        } else {
            taskList.insertBefore(draggedItem, afterElement);
        }
    });

    taskList.addEventListener('dragend', (e) => {
        draggedItem.classList.remove('dragging');
        updateTaskOrder();
        draggedItem = null;
    });

    function getDragAfterElement(container, y) {
        const draggableElements = [...container.querySelectorAll('.task-item:not(.dragging)')];

        return draggableElements.reduce((closest, child) => {
            const box = child.getBoundingClientRect();
            const offset = y - box.top - box.height / 2;
            
            if (offset < 0 && offset > closest.offset) {
                return { offset: offset, element: child };
            } else {
                return closest;
            }
        }, { offset: Number.NEGATIVE_INFINITY }).element;
    }

    function updateTaskOrder() {
        const updatedTasks = [];
        taskList.querySelectorAll('.task-item').forEach(taskElement => {
            const taskId = parseInt(taskElement.dataset.id);
            const task = tasks.find(t => t.id === taskId);
            if (task) updatedTasks.push(task);
        });
        tasks = updatedTasks;
        saveTasks();
    }

    // Initial render
    renderTasks();
});