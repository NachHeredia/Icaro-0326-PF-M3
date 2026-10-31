import { useEffect } from 'react'
import { useTaskStore } from '../store/useTaskStore'

const API_URL = 'https://api.restful-api.dev/objects'
const JSON_HEADERS = { 'Content-Type': 'application/json' }

const toApi = ({ titulo, descripcion, fechaInicio, fechaFin, estado }) => ({
  name: titulo,
  data: { descripcion, fechaInicio, fechaFin, estado },
})

const fromApi = (obj) => ({
  id: obj.id,
  titulo: obj.name,
  ...obj.data,
})

async function request(url, options) {
  const response = await fetch(url, options)
  if (!response.ok) {
    const error = new Error(`Error ${response.status}: ${response.statusText}`)
    error.status = response.status
    throw error
  }
  return response.json()
}

export default function useTasksApi() {
  const tasks = useTaskStore((state) => state.tasks)
  const loading = useTaskStore((state) => state.loading)
  const error = useTaskStore((state) => state.error)

  const setTasks = useTaskStore((state) => state.setTasks)
  const setLoading = useTaskStore((state) => state.setLoading)
  const setError = useTaskStore((state) => state.setError)
  const addTask = useTaskStore((state) => state.addTask)
  const updateTask = useTaskStore((state) => state.updateTask)
  const changeStatus = useTaskStore((state) => state.changeStatus)
  const deleteTask = useTaskStore((state) => state.deleteTask)

  const run = async (action) => {
    setLoading(true)
    setError(null)
    try {
      await action()
      return true
    } catch (e) {
      setError(e.message)
      return false
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const ids = useTaskStore.getState().tasks.map((t) => t.id)
    if (ids.length === 0) return

    const load = async () => {
      setLoading(true)
      setError(null)
      try {
        const query = ids.map((id) => `id=${id}`).join('&')
        const remote = await request(`${API_URL}?${query}`)
        const remoteById = Object.fromEntries(
          remote.map((obj) => [obj.id, fromApi(obj)])
        )
        const local = useTaskStore.getState().tasks
        setTasks(local.map((t) => remoteById[t.id] ?? t))
      } catch (e) {
        setError(e.message)
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [setTasks, setLoading, setError])

  const createTask = (values) =>
    run(async () => {
      const newTask = { ...values, estado: 'Nueva tarea' }
      const created = await request(API_URL, {
        method: 'POST',
        headers: JSON_HEADERS,
        body: JSON.stringify(toApi(newTask)),
      })
      addTask({ ...newTask, id: created.id })
    })

  const changeTaskStatus = (id, estado) =>
    run(async () => {
      const task = useTaskStore.getState().tasks.find((t) => t.id === id)
      await request(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: JSON_HEADERS,
        body: JSON.stringify(toApi({ ...task, estado })),
      })
      changeStatus(id, estado)
    })

  const editTask = (id, changes) =>
    run(async () => {
      const task = useTaskStore.getState().tasks.find((t) => t.id === id)
      await request(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: JSON_HEADERS,
        body: JSON.stringify(toApi({ ...task, ...changes })),
      })
      updateTask(id, changes)
    })

  const removeTask = (id) =>
    run(async () => {
      try {
        await request(`${API_URL}/${id}`, { method: 'DELETE' })
      } catch (e) {
        if (e.status !== 404) throw e
      }
      deleteTask(id)
    })

  return {
    tasks,
    loading,
    error,
    createTask,
    changeTaskStatus,
    editTask,
    removeTask,
  }
}