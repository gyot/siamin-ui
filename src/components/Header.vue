<template>
  <header
    class="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between"
  >
    <h2 class="text-lg font-semibold text-slate-800">
      {{ title }}
    </h2>

    <!-- USER MENU -->
    <div class="relative" v-if="user">
      <button
        @click="showProfileMenu = !showProfileMenu"
        class="flex items-center gap-3 px-3 py-2 hover:bg-slate-100 rounded-lg transition"
      >
        <!-- Avatar -->
        <div
          class="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-semibold"
        >
          {{ userInitial }}
        </div>

        <!-- Info -->
        <div class="hidden sm:block text-left">
          <p class="text-sm font-medium text-slate-800">
            {{ user.name }}
          </p>
          <p class="text-xs text-slate-500 capitalize">
            {{ user.role }}
          </p>
        </div>

        <!-- Arrow -->
        <svg
          :class="[
            'w-4 h-4 text-slate-500 transition',
            showProfileMenu && 'rotate-180'
          ]"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M19 14l-7 7m0 0l-7-7m7 7V3"
          />
        </svg>
      </button>

      <!-- DROPDOWN -->
      <transition
        enter-active-class="transition ease-out duration-100"
        enter-from-class="opacity-0 scale-95"
        enter-to-class="opacity-100 scale-100"
        leave-active-class="transition ease-in duration-75"
        leave-from-class="opacity-100 scale-100"
        leave-to-class="opacity-0 scale-95"
      >
        <div
          v-if="showProfileMenu"
          class="absolute right-0 mt-2 w-72 bg-white rounded-lg shadow-xl border z-50"
        >
          <!-- PROFILE HEADER -->
          <div class="px-6 py-4 border-b bg-slate-50">
            <p class="font-semibold text-slate-800">
              {{ user.name }}
            </p>
            <div class="mt-2 flex flex-wrap gap-1.5">
              <span
                v-for="(unit, idx) in userUnitKerjaList"
                :key="`${unit.unit_kerja_id || idx}-${unit.kode_unit || ''}`"
                class="inline-flex items-center px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 text-[11px]"
              >
                {{ unit.kode_unit || unit.unit_kerja_id }} - {{ unit.nama_unit || 'Unit Kerja' }}
              </span>
              <span
                v-for="(unitId, idx) in userUnitKerjaIdList"
                :key="`id-${unitId || idx}`"
                class="inline-flex items-center px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[11px]"
              >
                ID {{ unitId }}
              </span>
              <span v-if="userUnitKerjaList.length === 0 && userUnitKerjaIdList.length === 0" class="text-xs text-slate-600">-</span>
            </div>
            <p class="text-xs text-slate-500 mt-1">
              {{ user.instansi || '-' }}
            </p>
          </div>

          <!-- MENU -->
          <div class="py-2">
            <router-link
              to="/admin/profile"
              class="block px-6 py-3 hover:bg-slate-50 text-sm"
              @click="showProfileMenu = false"
            >
              👤 Profil Saya
            </router-link>
            <button
              @click="handleShowUserData"
              class="w-full px-6 py-3 text-left hover:bg-slate-50 text-sm"
            >
              Lihat Data User (Debug)
            </button>
          </div>

          <div class="border-t"></div>

          <!-- LOGOUT -->
          <button
            @click="handleLogout"
            class="w-full px-6 py-3 text-left hover:bg-red-50 text-red-600 text-sm"
          >
            Keluar
          </button>
        </div>
      </transition>
    </div>
  </header>

  <!-- Overlay -->
  <div
    v-if="showProfileMenu"
    @click="showProfileMenu = false"
    class="fixed inset-0 z-40"
  ></div>
</template>

<script>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import Swal from 'sweetalert2'
import { useAuthStore } from '@/stores/auth'

export default {
  name: 'Header',
  props: {
    title: String
  },
  setup() {
    const router = useRouter()
    const authStore = useAuthStore()
    const showProfileMenu = ref(false)

    /** =========================
     * USER DATA (AMAN)
     * ========================= */
    const user = computed(() => authStore.currentUser)
    const userUnitKerjaList = computed(() => {
      const fromStore = Array.isArray(authStore.unit_kerja) ? authStore.unit_kerja : []
      if (fromStore.length > 0) return fromStore
      const fromUser = Array.isArray(user.value?.unit_kerja) ? user.value.unit_kerja : []
      return fromUser
    })
    const userUnitKerjaIdList = computed(() => {
      const fromStore = Array.isArray(authStore.unit_kerja_id) ? authStore.unit_kerja_id : []
      if (fromStore.length > 0) return fromStore
      return Array.isArray(user.value?.unit_kerja_id) ? user.value.unit_kerja_id : []
    })

    const userInitial = computed(() => {
      if (!user.value?.name) return 'A'
      return user.value.name
        .split(' ')
        .map(w => w[0])
        .join('')
        .substring(0, 2)
        .toUpperCase()
    })

    const handleShowUserData = () => {
      Swal.fire({
        title: 'Data User',
        html: `<pre style="text-align:left">${JSON.stringify(
          user.value,
          null,
          2
        )}</pre>`,
        width: 700
      })
      showProfileMenu.value = false
    }

    const handleLogout = () => {
      showProfileMenu.value = false
      Swal.fire({
        title: 'Keluar?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Keluar'
      }).then(r => {
        if (r.isConfirmed) {
          authStore.logout()
          router.push('/laman-masuk')
        }
      })
    }

    return {
      showProfileMenu,
      user,
      userUnitKerjaList,
      userUnitKerjaIdList,
      userInitial,
      handleLogout,
      handleShowUserData
    }
  }
}
</script>
