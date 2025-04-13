import { defineStore } from 'pinia'
import { useToast } from 'vue-toastification'
import axios from 'axios'
const BASE_URL = import.meta.env.VITE_API_BASE_URL
const toast = useToast()

export const useTodoStore = defineStore('todo', {
  state: () => ({
    list: [],
    selectedTodo: {},
    statuses: ['pending', 'in-progress', 'completed'],
  }),
  actions: {
    async loadTodo() {
      try {
        const res = await axios.get(`${BASE_URL}/tasks`)
        this.list = res.data
      } catch (error) {
        toast.error('Failed to load tasks.')
      }
    },
    async loadTodoById(id) {
      try {
        const res = await axios.get(`${BASE_URL}/tasks/${id}`)
        this.selectedTodo = res.data
      } catch (error) {
        toast.error('Failed to load tasks.')
      }
    },
    async addTodo(todoText) {
      try {
        const resList = await axios.get(`${BASE_URL}/tasks`)
        if (resList.data.length >= 50) {
          return {
            success: false,
            message: 'You’ve reached the limit. Maximum of 50 tasks allowed.',
          }
        }

        const bodyData = {
          name: todoText,
          status: 'pending',
        }

        const res = await axios.post(`${BASE_URL}/tasks`, bodyData)
        this.list.push(res.data)

        return { success: true, message: 'Task added successfully!' }
      } catch (error) {
        return { success: false, message: 'Failed to add task!' }
      }
    },
    async editTodo(todoData, id) {
      try {
        const res = await axios.put(`${BASE_URL}/tasks/${id}`, todoData)
        return { success: true, message: 'Task edited successfully!' }
      } catch (error) {
        return { success: false, message: 'Failed to edit task!' }
      }
    },
    async removeTodo(id) {
      try {
        const res = await axios.delete(`${BASE_URL}/tasks/${id}`)
        return { success: true, message: 'Task deleted successfully!' }
      } catch (error) {
        return { success: false, message: 'Failed to delete task!' }
      }
    },
  },
})
