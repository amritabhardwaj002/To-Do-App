document.addEventListener('DOMContentLoaded', loadTasksFromLocalStorage);

const taskInput = document.getElementById('taskInput');
const addTaskBtn = document.getElementById('addTaskBtn');
const taskList = document.getElementById('task-list');

addTaskBtn.addEventListener('click', addTask);

function addTask() {
    const taskText = taskInput.value.trim();
    if (taskText !== '') {
        const task = createTaskElement(taskText);
        taskList.appendChild(task);
        taskInput.value = '';
        saveTasksLocally();
    }
}

function createTaskElement(taskText, priority = 'low', completed = false) {
    const task = document.createElement('li');
    task.classList.add('task');

    const priorityIndicator = document.createElement('div');
    priorityIndicator.classList.add('priority', priority);

    const taskSpan = document.createElement('span');
    taskSpan.textContent = taskText;
    if (completed) {
        taskSpan.classList.add('completed');
    }

    const editButton = document.createElement('button');
    editButton.textContent = 'Edit';
    editButton.classList.add('edit-btn');

    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.classList.add('delete-btn');

    const completeButton = document.createElement('button');
    completeButton.textContent = 'Complete';
    completeButton.classList.add('complete-btn');

    task.appendChild(priorityIndicator);
    task.appendChild(taskSpan);
    task.appendChild(completeButton);
    task.appendChild(editButton);
    task.appendChild(deleteButton);

    priorityIndicator.addEventListener('click', () => changePriority(priorityIndicator));
    editButton.addEventListener('click', () => editTask(task));
    deleteButton.addEventListener('click', () => deleteTask(task));
    completeButton.addEventListener('click', () => completeTask(taskSpan));

    return task;
}

function changePriority(priorityIndicator) {
    const currentPriority = priorityIndicator.classList[1];
    const priorities = ['low', 'medium', 'high'];
    const nextPriority = priorities[(priorities.indexOf(currentPriority) + 1) % priorities.length];
    priorityIndicator.className = 'priority ' + nextPriority;
    saveTasksLocally();
}

function editTask(task) {
    const taskSpan = task.querySelector('span');
    const newText = prompt('Edit task:', taskSpan.textContent);
    if (newText !== null && newText.trim() !== '') {
        taskSpan.textContent = newText.trim();
        saveTasksLocally();
    }
}

function deleteTask(task) {
    task.remove();
    saveTasksLocally();
}

function completeTask(taskSpan) {
    taskSpan.classList.toggle('completed');
    saveTasksLocally();
}

function saveTasksLocally() {
    const tasks = [];
    taskList.querySelectorAll('.task').forEach(task => {
        const taskSpan = task.querySelector('span');
        const priority = task.querySelector('.priority').classList[1];
        const completed = taskSpan.classList.contains('completed');
        tasks.push({ text: taskSpan.textContent, priority, completed });
    });
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function loadTasksFromLocalStorage() {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.forEach(task => {
        const taskElement = createTaskElement(task.text, task.priority, task.completed);
        taskList.appendChild(taskElement);
    });
}
