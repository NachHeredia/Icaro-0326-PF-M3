import { useEffect, useRef } from 'react'
import { useTaskStore } from '../store/useTaskStore'

const API_URL = 'https://api.restful-api.dev/objects'
const JSON_HEADERS = { 'Content-Type': 'application/json' }
const SEED_KEY = 'todo-seeded' 

const dayStr = (offset) => {
  const d = new Date()
  d.setDate(d.getDate() + offset)
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${d.getFullYear()}-${month}-${day}`
}

const buildSampleTasks = () => [
  {
    titulo: 'Armar el store con Zustand',
    descripcion: 'Definir el estado global de las tareas y sus acciones.',
    fechaInicio: dayStr(-7),
    fechaFin: dayStr(-5),
    estado: 'Completadas',
  },
  {
    titulo: 'Diseñar las columnas del tablero',
    descripcion: 'Estilos con Material UI, modo claro y oscuro.',
    fechaInicio: dayStr(-2),
    fechaFin: dayStr(3),
    estado: 'En curso',
  },
  {
    titulo: 'Escribir el README del proyecto',
    descripcion: 'Explicar cómo correr la app y qué tecnologías usa.',
    fechaInicio: dayStr(1),
    fechaFin: dayStr(5),
    estado: 'Nueva tarea',
  },
  {
    titulo: 'Subir el proyecto a Vercel',
    descripcion: 'Publicar la app cuando el tablero esté terminado.',
    fechaInicio: dayStr(6),
    fechaFin: dayStr(8),
    estado: 'Stand By',
  },
]

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

export default function useTaskApi() {
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

  const seedStarted = useRef(false)

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
    if (seedStarted.current) return
    seedStarted.current = true

    let alreadySeeded = false
    try {
      alreadySeeded = localStorage.getItem(SEED_KEY) === '1'
    } catch {
      // sin acceso a localStorage se sigue igual
    }
    if (alreadySeeded || useTaskStore.getState().tasks.length > 0) return

    const seed = async () => {
      setLoading(true)
      setError(null)
      try {
        for (const sample of buildSampleTasks()) {
          const created = await request(API_URL, {
            method: 'POST',
            headers: JSON_HEADERS,
            body: JSON.stringify(toApi(sample)),
          })
          addTask({ ...sample, id: created.id })
        }
        try {
          localStorage.setItem(SEED_KEY, '1')
        } catch {
          // sin acceso a localStorage se sigue igual
        }
      } catch (e) {
        setError(e.message)
      } finally {
        setLoading(false)
      }
    }

    seed()
  }, [addTask, setLoading, setError])

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