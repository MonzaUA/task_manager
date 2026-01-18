const tasksDOM = document.querySelector('.tasks')
const loadingDOM = document.querySelector('.loading-text')
const formDOM = document.querySelector('.task-form')
const taskInputDOM = document.querySelector('.task-input')
const taskUserDOM = document.querySelector('.task-user-input')
const taskDeadlineDOM = document.querySelector('.task-deadline-input')
const formAlertDOM = document.querySelector('.form-alert')

// Load tasks from /api/tasks
const showTasks = async () => {
  loadingDOM.style.visibility = 'visible'
  try {
    const {
      data: { tasks },
    } = await axios.get('/api/v1/tasks')
    if (tasks.length < 1) {
      tasksDOM.innerHTML = '<h5 class="empty-list">No tasks in your list</h5>'
      loadingDOM.style.visibility = 'hidden'
      return
    }
    const allTasks = tasks
      .map((task) => {
        const { completed, id: taskID, title, user, deadline } = task
        const deadlineText = deadline ? new Date(deadline).toLocaleDateString() : ''
        return `<div class="single-task ${completed && 'task-completed'}">
  <h5><span><i class="far fa-check-circle"></i></span>${title} ${user ? '- ' + user : ''} ${deadlineText ? '- ' + deadlineText : ''}</h5>
  <div class="task-links">
    <a href="task.html?id=${taskID}" class="edit-link"><i class="fas fa-edit"></i></a>
    <button type="button" class="delete-btn" data-id="${taskID}"><i class="fas fa-trash"></i></button>
  </div>
</div>`
      })
      .join('')
    tasksDOM.innerHTML = allTasks
  } catch (error) {
    tasksDOM.innerHTML =
      '<h5 class="empty-list">There was an error, please try later....</h5>'
  }
  loadingDOM.style.visibility = 'hidden'
}

showTasks()

// Delete task
tasksDOM.addEventListener('click', async (e) => {
  const el = e.target
  if (el.parentElement.classList.contains('delete-btn')) {
    loadingDOM.style.visibility = 'visible'
    const id = el.parentElement.dataset.id
    try {
      await axios.delete(`/api/v1/tasks/${id}`)
      showTasks()
    } catch (error) {
      console.log(error)
    }
    loadingDOM.style.visibility = 'hidden'
  }
})

// Form submit
formDOM.addEventListener('submit', async (e) => {
  e.preventDefault()
  const title = taskInputDOM.value
  const user = taskUserDOM.value
  const deadline = taskDeadlineDOM.value ? new Date(taskDeadlineDOM.value).toISOString() : null

  try {
    await axios.post('/api/v1/tasks', { title, user, deadline })
    showTasks()
    taskInputDOM.value = ''
    taskUserDOM.value = ''
    taskDeadlineDOM.value = ''
    formAlertDOM.style.display = 'block'
    formAlertDOM.textContent = `success, task added`
    formAlertDOM.classList.add('text-success')
  } catch (error) {
    formAlertDOM.style.display = 'block'
    formAlertDOM.innerHTML = `error, please try again`
  }
  setTimeout(() => {
    formAlertDOM.style.display = 'none'
    formAlertDOM.classList.remove('text-success')
  }, 3000)
})
