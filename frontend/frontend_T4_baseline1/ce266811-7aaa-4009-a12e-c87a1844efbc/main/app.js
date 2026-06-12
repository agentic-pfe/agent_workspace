document.addEventListener('DOMContentLoaded', () => {
    const taskForm = document.getElementById('task-form');
    const taskInput = document.getElementById('task-input');
    const taskList = document.getElementById('task-list');
    const filterButtons = document.querySelectorAll('.filter-btn');
    const emptyState = document.getElementById('empty-state');
    const taskTemplate = document.getElementById('task-template');

    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

    function saveTasksToLocalStorage() {
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
            const taskElement = taskTemplate.content.cloneNode(true);
            const taskItem = taskElement.querySelector('.task-item');
            const taskText = taskItem.querySelector('.task-text');
            const completeToggle = taskItem.querySelector('.task-complete-toggle');
            const editButton = taskItem.querySelector('.btn-edit');
            const deleteButton = taskItem.querySelector('.btn-delete');

            taskItem.dataset.taskId = task.id;
            taskText.textContent = task.text;
            completeToggle.checked = task.completed;

            if (task.completed) {
                taskText.classList.add('completed');
            }

            completeToggle.addEventListener('change', () => {
                task.completed = completeToggle.checked;
                taskText.classList.toggle('completed');
                saveTasksToLocalStorage();
                renderTasks(getCurrentFilter());
            });

            editButton.addEventListener('click', () => {
                taskText.focus();
                taskText.setAttribute('contenteditable', 'true');
            });

            taskText.addEventListener('blur', () => {
                task.text = taskText.textContent.trim();
                saveTasksToLocalStorage();
                renderTasks(getCurrentFilter());
            });

            deleteButton.addEventListener('click', () => {
                tasks = tasks.filter(t => t.id !== task.id);
                saveTasksToLocalStorage();
                renderTasks(getCurrentFilter());
            });

            // Drag and Drop
            taskItem.addEventListener('dragstart', dragStart);
            taskItem.addEventListener('dragover', dragOver);
            taskItem.addEventListener('drop', drop);
            taskItem.addEventListener('dragenter', dragEnter);
            taskItem.addEventListener('dragleave', dragLeave);

            taskList.appendChild(taskItem);
        });

        toggleEmptyState();
    }

    function toggleEmptyState() {
        emptyState.style.display = tasks.length === 0 ? 'block' : 'none';
    }

    function addTask(text) {
        const newTask = {
            id: Date.now(),
            text: text,
            completed: false
        };
        tasks.push(newTask);
        saveTasksToLocalStorage();
        renderTasks(getCurrentFilter());
    }

    function getCurrentFilter() {
        const activeFilter = document.querySelector('.filter-btn.active');
        return activeFilter.dataset.filter;
    }

    taskForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const taskText = taskInput.value.trim();
        if (taskText) {
            addTask(taskText);
            taskInput.value = '';
        }
    });

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            renderTasks(button.dataset.filter);
        });
    });

    // Drag and Drop Handlers
    let draggedTask = null;

    function dragStart(e) {
        draggedTask = e.target;
        e.dataTransfer.effectAllowed = 'move';
        e.target.classList.add('dragging');
    }

    function dragOver(e) {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
    }

    function drop(e) {
        e.preventDefault();
        if (draggedTask !== e.target) {
            const draggedIndex = tasks.findIndex(task => task.id === parseInt(draggedTask.dataset.taskId));
            const targetIndex = tasks.findIndex(task => task.id === parseInt(e.target.closest('.task-item').dataset.taskId));

            // Swap tasks in the array
            [tasks[draggedIndex], tasks[targetIndex]] = [tasks[targetIndex], tasks[draggedIndex]];
            saveTasksToLocalStorage();
            renderTasks(getCurrentFilter());
        }
        e.target.closest('.task-item').classList.remove('drag-over');
    }

    function dragEnter(e) {
        e.target.closest('.task-item').classList.add('drag-over');
    }

    function dragLeave(e) {
        e.target.closest('.task-item').classList.remove('drag-over');
    }

    // Initial render
    renderTasks();
});