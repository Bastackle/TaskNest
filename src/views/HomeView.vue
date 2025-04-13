<template>
  <div class="container mx-auto pl-8 pr-8 pt-1 pb-1">
    <div class="relative w-full h-screen">
      <div class="mt-5 mb-5">
        <h1 class="text-5xl font-black subpixel-antialiased text-center fill-white">
          TaskNest
        </h1>
      </div>
      <div class="flex">
        <input
          class="input input-bordered w-full"
          type="text"
          v-model="todoText"
          placeholder="What do you need to do?..."
          @keyup.enter="addTodo()"
        />
        <button class="btn btn-primary w-32 ml-3" @click="addTodo()">Add</button>
      </div>
      <div>
        <p class="text-sm text-gray-500 mt-2">
          *** You can add up to 50 tasks. Please remove some before adding more. ***
        </p>
      </div>

      <Loading v-if="isLoading" />

      <div role="tablist" class="tabs tabs-boxed mt-5 mb-5">
        <a
          role="tab"
          :class="selectedStatus === 'all' ? 'tab tab-active' : 'tab'"
          @click="changeSelectedStatus('all')"
        >
          All
        </a>
        <a
          v-for="status in todoStore.statuses"
          :key="status.id"
          role="tab"
          :class="status === selectedStatus ? 'tab tab-active' : 'tab'"
          @click="changeSelectedStatus(status)"
        >
          {{ status }}
        </a>
      </div>

      <div
        class="flex items-center justify-between mt-5"
        v-for="task in filterTodoList"
        :key="task.id"
      >
        <input
          type="checkbox"
          :checked="task.status === 'completed'"
          class="checkbox"
          @change="changeStatus($event, task.id)"
        />
        <div :class="task.status === 'completed' ? 'line-through' : ''">
          {{ task.name }}
          <span v-if="task.status === 'in-progress'"> ({{ task.status }})</span>
        </div>
        <div>
          <RouterLink :to="{ name: 'todo-edit', params: { id: task.id } }">
            <button class="btn btn-square btn-outline btn-success">
              <svg
                class="fill-success"
                xmlns="http://www.w3.org/2000/svg"
                height="1em"
                viewBox="0 0 512 512"
              >
                <path
                  d="M471.6 21.7c-21.9-21.9-57.3-21.9-79.2 0L362.3 51.7l97.9 97.9 30.1-30.1c21.9-21.9 21.9-57.3 0-79.2L471.6 21.7zm-299.2 220c-6.1 6.1-10.8 13.6-13.5 21.9l-29.6 88.8c-2.9 8.6-.6 18.1 5.8 24.6s15.9 8.7 24.6 5.8l88.8-29.6c8.2-2.7 15.7-7.4 21.9-13.5L437.7 172.3 339.7 74.3 172.4 241.7zM96 64C43 64 0 107 0 160L0 416c0 53 43 96 96 96l256 0c53 0 96-43 96-96l0-96c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 96c0 17.7-14.3 32-32 32L96 448c-17.7 0-32-14.3-32-32l0-256c0-17.7 14.3-32 32-32l96 0c17.7 0 32-14.3 32-32s-14.3-32-32-32L96 64z"
                />
              </svg>
            </button>
          </RouterLink>
          <button @click="deleteTodo(task.id)" class="btn btn-square btn-outline btn-accent ml-3">
            <svg
              class="fill-accent"
              xmlns="http://www.w3.org/2000/svg"
              height="1em"
              viewBox="0 0 512 512"
            >
              <path
                d="M135.2 17.7L128 32 32 32C14.3 32 0 46.3 0 64S14.3 96 32 96l384 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-96 0-7.2-14.3C307.4 6.8 296.3 0 284.2 0L163.8 0c-12.1 0-23.2 6.8-28.6 17.7zM416 128L32 128 53.2 467c1.6 25.3 22.6 45 47.9 45l245.8 0c25.3 0 46.3-19.7 47.9-45L416 128z"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, computed } from 'vue'
import { useTodoStore } from '../stores/todo'
import { RouterLink } from 'vue-router'
import Loading from '@/components/Loading.vue'
import { useToast } from 'vue-toastification'

const todoStore = useTodoStore()

const toast = useToast()

const todoText = ref('')

const isLoading = ref(false)

const selectedStatus = ref('all')

const filterTodoList = computed(() => {
  let sortedList = [...todoStore.list]
  sortedList.sort((a, b) => {
    const statusOrder = ['pending', 'in-progress', 'completed']
    const statusComparison = statusOrder.indexOf(a.status) - statusOrder.indexOf(b.status)
    if (statusComparison !== 0) return statusComparison
    if (a.status === 'pending' && b.status === 'pending') {
      return b.id - a.id
    }
    return a.id - b.id
  })
  if (selectedStatus.value === 'all') return sortedList
  return sortedList.filter((task) => task.status === selectedStatus.value)
})

onMounted(async () => {
  isLoading.value = true
  await todoStore.loadTodo()
  isLoading.value = false
})

const addTodo = async () => {
  if (!todoText.value.trim()) return

  try {
    isLoading.value = true
    const res = await todoStore.addTodo(todoText.value)

    if (res.success) {
      toast.success(res.message)
      todoText.value = ''
    } else {
      toast.error(res.message)
    }
  } catch (error) {
    toast.error('Something went wrong.')
  } finally {
    isLoading.value = false
  }
}

const changeStatus = async (event, todoId) => {
  isLoading.value = true
  try {
    if (event.target.checked) {
      const res = await todoStore.editTodo({ status: 'completed' }, todoId)
      if (res.success) {
        toast.success('Task marked as completed!')
      } else {
        toast.error(res.message)
      }
    } else {
      const res = await todoStore.editTodo({ status: 'in-progress' }, todoId)
      if (res.success) {
        toast.info('Task status reverted!')
      } else {
        toast.error(res.message)
      }
    }
    await todoStore.loadTodo()
  } catch (error) {
    toast.error('Something went wrong.')
  }
  isLoading.value = false
}

const deleteTodo = async (todoId) => {
  try {
    isLoading.value = true
    const res = await todoStore.removeTodo(todoId)
    await todoStore.loadTodo()
    isLoading.value = false

    if (res.success) {
      toast.success(res.message)
    } else {
      toast.error(res.message)
    }
  } catch (error) {
    toast.error('Something went wrong.')
  }
}

const changeSelectedStatus = async (status) => {
  selectedStatus.value = status
}
</script>
