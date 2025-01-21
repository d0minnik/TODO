const mockTasks = [
  { id: 1, title: "Przyk³adowe zadanie pierwsze", is_completed: getRandomBoolean() },
  { id: 2, title: "Przyk³adowe zadanie drugie", is_completed: getRandomBoolean() },
  { id: 3, title: "Przyk³adowe zadanie trzecie", is_completed: getRandomBoolean() },
  { id: 4, title: "Przyk³adowe zadanie czwarte", is_completed: getRandomBoolean() },
  { id: 5, title: "Przyk³adowe zadanie pi±te", is_completed: getRandomBoolean() },
];

function getRandomBoolean() {
  return Math.random() >= 0.5;
}

function mockApi(endpoint, method, body) {
  return new Promise((resolve) => {
      setTimeout(() => {
          if (endpoint === '/api/tasks' && method === 'GET') {
              resolve(mockTasks);
          } else if (endpoint === '/api/tasks' && method === 'POST') {
              const newTask = { id: Date.now(), title: body.title, is_completed: false }; 
              mockTasks.push(newTask);
              resolve(newTask);
          } else if (endpoint.startsWith('/api/tasks/') && method === 'PATCH') {
              const id = parseInt(endpoint.split('/').pop());
              const task = mockTasks.find(task => task.id === id);
              if (task) {
                  task.is_completed = body.is_completed;
                  resolve(task);
              }
          } else if (endpoint.startsWith('/api/tasks/') && method === 'DELETE') {
              const id = parseInt(endpoint.split('/').pop());
              const index = mockTasks.findIndex(task => task.id === id);
              if (index > -1) {
                  mockTasks.splice(index, 1);
                  resolve({ success: true });
              }
          }
      }, 500);
  });
}

function getTasks() {
  return mockApi('/api/tasks', 'GET');
}

function addTask(title) {
  return mockApi('/api/tasks', 'POST', { title });
}

function updateTaskStatus(id, is_completed) {
  return mockApi(`/api/tasks/${id}`, 'PATCH', { is_completed });
}

function deleteTask(id) {
  return mockApi(`/api/tasks/${id}`, 'DELETE');
}
