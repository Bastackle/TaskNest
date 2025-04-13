<template>
  <div class="container p-5">
    <div class="relative w-full h-screen">
      <div class="mt-5 mb-5">
        <h1 class="text-5xl font-black subpixel-antialiased text-center fill-white">Edit Task</h1>
      </div>

      <div v-if="isLoaded" class="w-1/2 mx-auto">
        <div class="form-control w-full">
          <label class="label">
            <span class="label-text">ID</span>
          </label>
          <input type="text" v-model="todoId" class="input input-bordered w-full" disabled />
        </div>

        <div class="form-control w-full">
          <label class="label">
            <span class="label-text">Task</span>
          </label>
          <input
            type="text"
            placeholder="Task's Name"
            class="input input-bordered w-full"
            v-model="todoStore.selectedTodo.name"
          />
        </div>

        <div class="form-control w-full">
          <label class="label">
            <span class="label-text">Status</span>
          </label>
          <select class="select select-bordered w-full" v-model="todoStore.selectedTodo.status">
            <option disabled selected>Select Status</option>
            <option v-for="status in todoStore.statuses" :key="status.id" :value="status">
              {{ status }}
            </option>
          </select>
        </div>

        <div class="flex gap-2">
          <span class="w-1/2">
            <button class="btn btn-success w-full mt-5" @click="editTodo(todoStore.selectedTodo)">
              Save
            </button>
          </span>
          <span class="w-1/2">
            <RouterLink :to="{ name: 'todo-list' }">
              <button class="btn btn-accent w-full mt-5">Back</button>
            </RouterLink>
          </span>
        </div>
      </div>

      <Loading v-else />
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useTodoStore } from '../stores/todo'
import { RouterLink, useRoute } from 'vue-router'
import Loading from '@/components/Loading.vue'
import { useToast } from 'vue-toastification'

const todoStore = useTodoStore()

const route = useRoute()

const toast = useToast()

const todoId = ref(-1)
const isLoaded = ref(false)

onMounted(async () => {
  await todoStore.loadTodoById(route.params.id)
  todoId.value = parseInt(route.params.id)
  isLoaded.value = true
})

const editTodo = async (selectedTodo) => {
  try {
    const bodyData = {
      name: selectedTodo.name,
      status: selectedTodo.status,
    }
    const res = await todoStore.editTodo(bodyData, todoId.value)
    if (res.success) {
      toast.success(res.message)
    } else {
      toast.error(res.message)
    }
  } catch (errror) {
    toast.error('Something went wrong.')
  }
}
</script>
