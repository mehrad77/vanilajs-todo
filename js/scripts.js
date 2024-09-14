document.addEventListener('DOMContentLoaded', function () {
    // Define elements
    const taskForm = document.getElementById('taskForm');
    const taskList = document.getElementById('taskList');
    const filterButtons = document.querySelectorAll('.nav-link');

    // Define tasks array
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

    // Add task event
    taskForm
        .addEventListener('submit', (event) => {
            // 1. prevent form submission
            event.preventDefault();
            // 2. get task text
            const taskText = document.getElementById('addTaskInput').value.trim();
            // 3. if task text is not empty
            if (taskText) {
                // 4. create tasks and push it to tasks array
                const task = { id: Date.now(), text: taskText, completed: false };
                tasks.push(task);
                // 5. clear input field 
                document.getElementById('addTaskInput').value = '';
                saveAndRenderTasks();
            }
        });

    // Toggle task checkbox
    taskList
        .addEventListener('click', (event) => {
            // 1. if clicked element is checkbox
            if (event.target.type === 'checkbox') {
                // 2. get task id
                const taskId = event.target.getAttribute('data-id');
                /**
                 * 3. toggle task completed in tasks array
                 * Do you know about the spread operator, dear asal? 
                 * you can read more about it here:
                 * @see https://www.joshwcomeau.com/operator-lookup?match=restspread
                 */
                tasks = tasks.map((task) =>
                    task.id == taskId ? { ...task, completed: !task.completed } : task
                );
                // 4. save and render tasks
                saveAndRenderTasks();
            }
        });

    // Filter active or completed tasks
    filterButtons.forEach((tab) => {
        // 1. add click event to each tab of different filterButtons
        tab.addEventListener('click', (event) => {
            // 2. remove active class from each tab that has it
            document.querySelector('.nav-link.active').classList.remove('active');
            // 3. add active class to clicked tab
            event.target.classList.add('active');
            // 4. render only tasks that match the filter ('all', 'active', 'completed')
            const activeFilter = event.target.getAttribute('data-filter');
            renderTasks(activeFilter);
        });
    });

    // Save to localStorage and render tasks
    function saveAndRenderTasks() {
        // 1. write tasks to localStorage with `tasks` key
        localStorage.setItem('tasks', JSON.stringify(tasks));
        // 2. render tasks
        const activeNavLink = document.querySelector('.nav-link.active');
        const activeFilter = activeNavLink.getAttribute('data-filter');
        renderTasks(activeFilter);
    }

    // Main function to render tasks array
    function renderTasks(activeFilter = 'all') {
        // 1. clear taskList content
        taskList.innerHTML = '';
        // 2. filter tasks that match the active filter
        const filteredTasks = tasks
            .filter((task) => {
                if (activeFilter === 'active') return !task.completed;
                else if (activeFilter === 'completed') return task.completed;
                else return true;
            });
        // 3. create `li` element for each task and append it to taskList
        filteredTasks.forEach((task) => {
            const li = document.createElement('li');
            li.className = `list-group-item `;
            li.innerHTML = `
            <input type="checkbox" class="form-check-input" data-id="${task.id}" ${task.completed ? 'checked' : ''} />
            <span class="${task.completed ? 'text-decoration-line-through' : ''}">${task.text}</span>
        `;
            taskList.appendChild(li);
        });
    }

    // Initial render
    renderTasks();
});
