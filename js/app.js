$(document).ready(function () {
    const taskList = $("#taskList");

    function loadTasks() {
        return getTasks().then((tasks) => {
            return tasks;
        });
    }

    function renderTasks(filter = "all") {
        loadTasks().then((tasks) => {
            taskList.empty();

            tasks
                .filter((task) => {
                    if (filter === "active") return !task.is_completed;
                    if (filter === "completed") return task.is_completed;
                    return true;
                })
                .forEach((task) => {
                    const taskItem = $(`
                    <div class="task-item ${task.is_completed ? 'completed' : ''}" data-id="${task.id}">
                        <div class="task-checkbox">
                            ${task.is_completed ? '<span class="checkmark"></span>' : '<span class="circle"></span>'}
                        </div>
                        <span class="task-title">${task.title}</span>
                        <div>
                            <button class="delete-task" data-id="${task.id}">Usuñ</button>
                        </div>
                    </div>
                `);
                    taskList.append(taskItem);
                });
        });
    }

    taskList.on("click", ".task-checkbox", function () {
        const taskItem = $(this).closest(".task-item");
        const taskId = taskItem.data("id");

        getTasks().then((tasks) => {
            const task = tasks.find(t => t.id === taskId);
            if (task) {
                task.is_completed = !task.is_completed;
                updateTaskStatus(taskId, task.is_completed).then(() => {
                    renderTasks($('.filter-btn.active').data('filter'));
                });
            }
        });
    });

    taskList.on("click", ".delete-task", function (event) {
        event.stopPropagation();
        const taskId = $(this).data("id");

        const confirmed = confirm("Czy na pewno chcesz usun±æ to zadanie?");
        if (confirmed) {
            deleteTask(taskId).then(() => {
                renderTasks($('.filter-btn.active').data('filter'));
            });
        }
    });

    $('.filter-btn').on('click', function () {
        $('.filter-btn').removeClass('active');
        $(this).addClass('active');
        const filter = $(this).data('filter');
        renderTasks(filter);
    });

    $("#addTaskBtn").on("click", function () {
        const taskTitle = $("#taskInput").val();
        if (taskTitle) {
            addTask(taskTitle).then(() => {
                $("#taskInput").val("");
                renderTasks($('.filter-btn.active').data('filter'));
            });
        }
    });

    renderTasks();
});
