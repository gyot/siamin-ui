// Example: How to use API in Vue Components

// Option 1: Using Database Module (Recommended for most cases)
// ============================================================
import database from '@/data/index.js'

export default {
  name: 'ExampleComponent1',
  setup() {
    const users = database.users
    const peserta = database.peserta
    
    return {
      users,
      peserta
    }
  }
}

// Option 2: Using useData Composable (With loading states)
// ========================================================
import { useData } from '@/composables/useData.js'

export default {
  name: 'ExampleComponent2',
  setup() {
    const { data: users, loading, error } = useData('users')
    
    return {
      users,
      isLoading: loading,
      errorMessage: error
    }
  }
}

// Option 3: Direct API Service (For manual control)
// ==================================================
import { fetchAPI, postAPI, updateAPI, deleteAPI } from '@/services/api'

export default {
  name: 'ExampleComponent3',
  setup() {
    const users = ref([])
    const loading = ref(false)

    const loadUsers = async () => {
      loading.value = true
      try {
        const data = await fetchAPI('users')
        users.value = data
      } catch (error) {
        console.error('Failed to load users:', error)
      } finally {
        loading.value = false
      }
    }

    const addUser = async (userData) => {
      try {
        const newUser = await postAPI('users', userData)
        users.value.push(newUser)
      } catch (error) {
        console.error('Failed to add user:', error)
      }
    }

    const updateUser = async (userId, userData) => {
      try {
        const updated = await updateAPI('users', userId, userData)
        const index = users.value.findIndex(u => u.id_user === userId)
        if (index !== -1) {
          users.value[index] = updated
        }
      } catch (error) {
        console.error('Failed to update user:', error)
      }
    }

    const deleteUser = async (userId) => {
      try {
        await deleteAPI('users', userId)
        users.value = users.value.filter(u => u.id_user !== userId)
      } catch (error) {
        console.error('Failed to delete user:', error)
      }
    }

    onMounted(() => {
      loadUsers()
    })

    return {
      users,
      loading,
      loadUsers,
      addUser,
      updateUser,
      deleteUser
    }
  }
}

// Option 4: Combined approach (Hybrid)
// ====================================
import { ref, onMounted } from 'vue'
import database, { loadDataFromAPI } from '@/data/index.js'
import { postAPI } from '@/services/api'

export default {
  name: 'ExampleComponent4',
  setup() {
    const kegiatan = ref(database.kegiatan)
    const loading = ref(false)

    // Load fresh data from API on mount
    const refreshData = async () => {
      loading.value = true
      try {
        const freshKegiatan = await loadDataFromAPI('kegiatan')
        kegiatan.value = freshKegiatan
      } catch (error) {
        console.warn('Failed to refresh kegiatan from API, using local data')
      } finally {
        loading.value = false
      }
    }

    // Create new kegiatan
    const createKegiatan = async (data) => {
      try {
        const newKegiatan = await postAPI('kegiatan', data)
        kegiatan.value.push(newKegiatan)
        return newKegiatan
      } catch (error) {
        console.error('Failed to create kegiatan:', error)
        throw error
      }
    }

    onMounted(() => {
      refreshData()
    })

    return {
      kegiatan,
      loading,
      refreshData,
      createKegiatan
    }
  }
}
