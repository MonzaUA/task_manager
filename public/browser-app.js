const GRAPHQL_URL = '/graphql';

const tasksDOM = document.querySelector('.tasks');
const loadingDOM = document.querySelector('.loading-text');
const formDOM = document.querySelector('.task-form');
const taskInputDOM = document.querySelector('.task-input');
const taskUserDOM = document.querySelector('.task-user-input');
const formAlertDOM = document.querySelector('.form-alert');

async function gql(query, variables = {}) {
  const res = await fetch(GRAPHQL_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, variables }),
  });

  const json = await res.json().catch(() => ({}));

  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  if (json.errors?.length) throw new Error(json.errors.map((e) => e.message).join('\n'));

  return json.data;
}

// Load tasks
const showTasks = async () => {
  loadingDOM.style.visibility = 'visible';

  try {
    const data = await gql(`
      query Tasks {
        tasks {
          id
          title
          completed
          user
        }
      }
    `);

    const tasks = data?.tasks ?? [];

    if (tasks.length < 1) {
      tasksDOM.innerHTML = '<h5 class="empty-list">No tasks in your list</h5>';
      loadingDOM.style.visibility = 'hidden';
      return;
    }

    const allTasks = tasks
      .map((task) => {
        const { completed, id: taskID, title, user } = task;

        return `<div class="single-task ${completed ? 'task-completed' : ''}">
  <h5><span><i class="far fa-check-circle"></i></span>${title}${user ? ' - ' + user : ''}</h5>
  <div class="task-links">
    <a href="task.html?id=${taskID}" class="edit-link"><i class="fas fa-edit"></i></a>
    <button type="button" class="delete-btn" data-id="${taskID}"><i class="fas fa-trash"></i></button>
  </div>
</div>`;
      })
      .join('');

    tasksDOM.innerHTML = allTasks;
  } catch (error) {
    console.error(error);
    tasksDOM.innerHTML =
      '<h5 class="empty-list">There was an error, please try later....</h5>';
  }

  loadingDOM.style.visibility = 'hidden';
};

showTasks();

// Delete task
tasksDOM.addEventListener('click', async (e) => {
  const el = e.target;

  if (el?.parentElement?.classList?.contains('delete-btn')) {
    loadingDOM.style.visibility = 'visible';
    const id = el.parentElement.dataset.id;

    try {
      await gql(
        `
        mutation DeleteTask($id: ID!) {
          deleteTask(id: $id) { id }
        }
        `,
        { id }
      );
      await showTasks();
    } catch (error) {
      console.error(error);
    }

    loadingDOM.style.visibility = 'hidden';
  }
});

// Form submit (create)
formDOM.addEventListener('submit', async (e) => {
  e.preventDefault();

  const title = taskInputDOM.value;
  const user = taskUserDOM.value;

  try {
    await gql(
      `
      mutation CreateTask($title: String!, $user: String!, $completed: Boolean) {
        createTask(title: $title, user: $user, completed: $completed) {
          id
          title
          completed
          user
        }
      }
      `,
      { title, user, completed: false }
    );

    await showTasks();

    taskInputDOM.value = '';
    taskUserDOM.value = '';

    formAlertDOM.style.display = 'block';
    formAlertDOM.textContent = `success, task added`;
    formAlertDOM.classList.add('text-success');
  } catch (error) {
    console.error(error);
    formAlertDOM.style.display = 'block';
    formAlertDOM.innerHTML = `error, please try again`;
  }

  setTimeout(() => {
    formAlertDOM.style.display = 'none';
    formAlertDOM.classList.remove('text-success');
  }, 3000);
});
