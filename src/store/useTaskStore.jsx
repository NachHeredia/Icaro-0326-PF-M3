import { create } from 'zustand'
import { persist } from 'zustand/middleware'


export const  states = [
    'Nueva tarea',
    'En curso',
    'Stand by' ,
    'Completada',
    'Cancelada',
]

export const ESTADOS = [
  'Nueva tarea',
  'En curso',
  'Stand By',
  'Completadas',
  'Canceladas',
]
 
export const useTaskStore = create(
  persist((set) => ({
      tasks: [],
      loading: false,
      error: null,

      setLoading: (loading) => set({ loading }),
      setError: (error) => set({ error }),
      setTasks: (tasks) => set({ tasks }),
 
      addTask: (data) =>
        set((state) => ({
          tasks: [
            ...state.tasks,
            { id: crypto.randomUUID(), estado: 'Nueva tarea', ...data },
          ],
        })),
 
      updateTask: (id, changes) =>
        set((state) => ({
          tasks: state.tasks.map((t) => (t.id === id ? { ...t, ...changes } : t)),
        })),
 
      changeStatus: (id, estado) =>
        set((state) => ({
          tasks: state.tasks.map((t) => (t.id === id ? { ...t, estado } : t)),
        })),
 
      deleteTask: (id) =>
        set((state) => ({ tasks: state.tasks.filter((t) => t.id !== id) })),
    }),
    {
      name: 'todo-tasks',
      partialize: (state) => ({ tasks: state.tasks }),
    }
  )
)