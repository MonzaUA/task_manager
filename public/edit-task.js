const GRAPHQL_URL = '/graphql';

const taskIDDOM = document.querySelector('.task-edit-id');
const taskNameDOM = document.querySelector('.task-edit-name');
const taskCompletedDOM = document.querySelector('.task-edit-completed');
const taskUserDOM = document.querySelector('.task-edit-user');
const editFormDOM = document.querySelector('.single-task-form');
const editBtnDOM = document.querySelector('.task-edit-btn');
const formAlertDOM = document.querySelector('.form-alert');

const params = window.location.search;
const id = new URLSearchParams(params).get('id');
let tempName;

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

const showTask = async () => {
  try {
    const data = await gql(
      `
      query Task($id: ID!) {
        task(id: $id) {
          id
          title
          completed
          user
        }
      }
      `,
      { id }
    );

    const task = data?.task;
    if (!task) throw new Error('Task not found');

    const { id: taskID, completed, title, user } = task;

    taskIDDOM.textContent = taskID;
    taskNameDOM.value = title;
    taskUserDOM.value = user || '';
    tempName = title;
    taskCompletedDOM.checked = completed;
  } catch (error) {
    console.error(error);
  }
};

showTask();

editFormDOM.addEventListener('submit', async (e) => {
  e.preventDefault();
  editBtnDOM.textContent = 'Loading...';

  const title = taskNameDOM.value;
  const completed = taskCompletedDOM.checked;
  const user = taskUserDOM.value;

  try {
    const data = await gql(
      `
      mutation UpdateTask(
        $id: ID!
        $title: String
        $user: String
        $completed: Boolean
      ) {
        updateTask(
          id: $id
          title: $title
          user: $user
          completed: $completed
        ) {
          id
          title
          completed
          user
        }
      }
      `,
      { id, title, user, completed }
    );

    const task = data?.updateTask;
    if (!task) throw new Error('Update failed');

    const { id: taskID, completed: newCompleted, title: newTitle, user: newUser } = task;

    taskIDDOM.textContent = taskID;
    taskNameDOM.value = newTitle;
    taskUserDOM.value = newUser || '';
    taskCompletedDOM.checked = newCompleted;

    formAlertDOM.style.display = 'block';
    formAlertDOM.textContent = `success, edited task`;
    formAlertDOM.classList.add('text-success');
  } catch (error) {
    console.error(error);
    taskNameDOM.value = tempName;

    formAlertDOM.style.display = 'block';
    formAlertDOM.innerHTML = `error, please try again`;
  }

  editBtnDOM.textContent = 'Edit';
  setTimeout(() => {
    formAlertDOM.style.display = 'none';
    formAlertDOM.classList.remove('text-success');
  }, 3000);
});
