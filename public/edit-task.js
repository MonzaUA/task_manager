const taskIDDOM = document.querySelector('.task-edit-id')
const taskNameDOM = document.querySelector('.task-edit-name')
const taskCompletedDOM = document.querySelector('.task-edit-completed')
const taskUserDOM = document.querySelector('.task-edit-user')
const taskDeadlineDOM = document.querySelector('.task-edit-deadline')
const editFormDOM = document.querySelector('.single-task-form')
const editBtnDOM = document.querySelector('.task-edit-btn')
const formAlertDOM = document.querySelector('.form-alert')
const params = window.location.search
const id = new URLSearchParams(params).get('id')
let tempName

const showTask = async () => {
  try {
    const {
      data: { task },
    } = await axios.get(`/api/v1/tasks/${id}`)
    const { id: taskID, completed, title, user, deadline } = task

    taskIDDOM.textContent = taskID
    taskNameDOM.value = title
    taskUserDOM.value = user || ''
    taskDeadlineDOM.value = deadline ? new Date(deadline).toISOString().slice(0, 10) : ''
    tempName = title
    taskCompletedDOM.checked = completed
  } catch (error) {
    console.log(error)
  }
}

showTask()

editFormDOM.addEventListener('submit', async (e) => {
  e.preventDefault()
  editBtnDOM.textContent = 'Loading...'

  const taskName = taskNameDOM.value
  const taskCompleted = taskCompletedDOM.checked
  const taskUser = taskUserDOM.value
  const taskDeadline = taskDeadlineDOM.value ? new Date(taskDeadlineDOM.value).toISOString() : null

  try {
    const {
      data: { task },
    } = await axios.patch(`/api/v1/tasks/${id}`, {
      title: taskName,
      completed: taskCompleted,
      user: taskUser,
      deadline: taskDeadline,
    })

    const { id: taskID, completed, title, user, deadline } = task

    taskIDDOM.textContent = taskID
    taskNameDOM.value = title
    taskUserDOM.value = user || ''
    taskDeadlineDOM.value = deadline ? new Date(deadline).toISOString().slice(0, 10) : ''
    taskCompletedDOM.checked = completed

    formAlertDOM.style.display = 'block'
    formAlertDOM.textContent = `success, edited task`
    formAlertDOM.classList.add('text-success')
  } catch (error) {
    console.error(error)
    taskNameDOM.value = tempName
    formAlertDOM.style.display = 'block'
    formAlertDOM.innerHTML = `error, please try again`
  }

  editBtnDOM.textContent = 'Edit'
  setTimeout(() => {
    formAlertDOM.style.display = 'none'
    formAlertDOM.classList.remove('text-success')
  }, 3000)
})
