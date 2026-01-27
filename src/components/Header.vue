<template>
  <header class="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
    <div>
      <h2 class="text-lg font-semibold text-slate-800">{{ title }}</h2>
    </div>
    <div class="flex items-center gap-4">
      <!-- User Profile Menu -->
      <div class="relative">
        <button
          @click="showProfileMenu = !showProfileMenu"
          class="flex items-center gap-3 px-3 py-2 hover:bg-slate-100 rounded-lg transition"
        >
          <div class="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-semibold">
            {{ getUserInitial }}
          </div>
          <div class="hidden sm:block">
            <p class="text-sm font-medium text-slate-800">{{ currentUser?.name || 'Admin' }}</p>
            <p class="text-xs text-slate-500 capitalize">{{ currentUser?.role || 'admin' }}</p>
          </div>
          <svg 
            :class="['w-4 h-4 text-slate-500 transition', showProfileMenu && 'transform rotate-180']"
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"/>
          </svg>
        </button>

        <!-- Dropdown Menu -->
        <transition
          enter-active-class="transition ease-out duration-100"
          enter-from-class="transform opacity-0 scale-95"
          enter-to-class="transform opacity-100 scale-100"
          leave-active-class="transition ease-in duration-75"
          leave-from-class="transform opacity-100 scale-100"
          leave-to-class="transform opacity-0 scale-95"
        >
          <div
            v-if="showProfileMenu"
            @click.stop
            class="absolute right-0 mt-2 w-72 bg-white rounded-lg shadow-xl border border-slate-200 z-50"
          >
            <!-- Profile Header -->
            <div class="px-6 py-4 border-b border-slate-100 bg-gradient-to-r from-blue-50 to-indigo-50">
              <div class="flex items-center gap-4">
                <div class="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white text-xl font-bold">
                  {{ getUserInitial }}
                </div>
                <div class="flex-1">
                  <p class="font-semibold text-slate-800">{{ currentUser?.name || 'Administrator' }}</p>
                  <p class="text-xs text-slate-600">{{ currentUser?.email || 'admin@kemkominfo.go.id' }}</p>
                  <p class="text-xs text-slate-500 mt-1">{{ currentUser?.instansi || 'Kemkominfo' }}</p>
                </div>
              </div>
            </div>

            <!-- Menu Items -->
            <div class="py-2">
              <!-- View Profile -->
              <button
                @click="handleViewProfile"
                class="w-full px-6 py-3 text-left hover:bg-slate-50 transition flex items-center gap-3 text-slate-700"
              >
                <svg class="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                </svg>
                <div class="flex-1 text-sm">
                  <p class="font-medium">Lihat Profil Lengkap</p>
                  <p class="text-xs text-slate-500">Kelola data profil Anda</p>
                </div>
              </button>

              <!-- Settings -->
              <button
                @click="handleSettings"
                class="w-full px-6 py-3 text-left hover:bg-slate-50 transition flex items-center gap-3 text-slate-700"
              >
                <svg class="w-5 h-5 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                </svg>
                <div class="flex-1 text-sm">
                  <p class="font-medium">Pengaturan</p>
                  <p class="text-xs text-slate-500">Ubah preferensi & keamanan</p>
                </div>
              </button>

              <!-- Change Password -->
              <button
                @click="handleChangePassword"
                class="w-full px-6 py-3 text-left hover:bg-slate-50 transition flex items-center gap-3 text-slate-700"
              >
                <svg class="w-5 h-5 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
                </svg>
                <div class="flex-1 text-sm">
                  <p class="font-medium">Ubah Password</p>
                  <p class="text-xs text-slate-500">Perbarui kata sandi Anda</p>
                </div>
              </button>

              <!-- Activity Log -->
              <button
                @click="handleActivityLog"
                class="w-full px-6 py-3 text-left hover:bg-slate-50 transition flex items-center gap-3 text-slate-700"
              >
                <svg class="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                </svg>
                <div class="flex-1 text-sm">
                  <p class="font-medium">Riwayat Aktivitas</p>
                  <p class="text-xs text-slate-500">Lihat log aktivitas Anda</p>
                </div>
              </button>
            </div>

            <!-- Divider -->
            <div class="border-t border-slate-100"></div>

            <!-- Logout -->
            <button
              @click="handleLogout"
              class="w-full px-6 py-3 text-left hover:bg-red-50 transition flex items-center gap-3 text-red-600"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
              </svg>
              <div class="flex-1 text-sm">
                <p class="font-medium">Keluar</p>
                <p class="text-xs text-red-500">Logout dari akun Anda</p>
              </div>
            </button>
          </div>
        </transition>
      </div>
    </div>
  </header>

  <!-- Overlay untuk menutup menu saat klik di luar -->
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
    title: String,
    currentUser: Object
  },
  setup(props) {
    const router = useRouter()
    const authStore = useAuthStore()
    const showProfileMenu = ref(false)

    const getUserInitial = computed(() => {
      if (props.currentUser?.name) {
        return props.currentUser.name
          .split(' ')
          .map(word => word[0])
          .join('')
          .toUpperCase()
          .substring(0, 2)
      }
      return 'A'
    })

    const handleViewProfile = () => {
      showProfileMenu.value = false
      router.push({ name: 'profile' })
    }

    const handleSettings = () => {
      showProfileMenu.value = false
      Swal.fire({
        title: 'Pengaturan',
        text: 'Fitur pengaturan akan segera tersedia',
        icon: 'info',
        confirmButtonText: 'OK'
      })
    }

    const handleChangePassword = () => {
      showProfileMenu.value = false
      Swal.fire({
        title: 'Ubah Password',
        html: `
          <div style="text-align: left;">
            <div style="margin-bottom: 15px;">
              <label style="font-size: 12px; color: #666; display: block; margin-bottom: 5px;"><strong>Password Lama</strong></label>
              <input id="old-password" type="password" placeholder="Masukkan password lama" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px; box-sizing: border-box;"/>
            </div>
            <div style="margin-bottom: 15px;">
              <label style="font-size: 12px; color: #666; display: block; margin-bottom: 5px;"><strong>Password Baru</strong></label>
              <input id="new-password" type="password" placeholder="Masukkan password baru" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px; box-sizing: border-box;"/>
            </div>
            <div>
              <label style="font-size: 12px; color: #666; display: block; margin-bottom: 5px;"><strong>Konfirmasi Password</strong></label>
              <input id="confirm-password" type="password" placeholder="Konfirmasi password baru" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px; box-sizing: border-box;"/>
            </div>
          </div>
        `,
        showCancelButton: true,
        confirmButtonText: 'Ubah',
        cancelButtonText: 'Batal',
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        preConfirm: () => {
          const oldPass = document.getElementById('old-password').value
          const newPass = document.getElementById('new-password').value
          const confirmPass = document.getElementById('confirm-password').value

          if (!oldPass || !newPass || !confirmPass) {
            Swal.showValidationMessage('Semua field harus diisi')
            return false
          }

          if (newPass !== confirmPass) {
            Swal.showValidationMessage('Password baru tidak cocok')
            return false
          }

          if (newPass.length < 6) {
            Swal.showValidationMessage('Password minimal 6 karakter')
            return false
          }

          return true
        }
      }).then((result) => {
        if (result.isConfirmed) {
          Swal.fire({
            title: 'Sukses!',
            text: 'Password berhasil diubah',
            icon: 'success',
            confirmButtonText: 'OK'
          })
        }
      })
    }

    const handleActivityLog = () => {
      showProfileMenu.value = false
      Swal.fire({
        title: 'Riwayat Aktivitas',
        html: `
          <div style="text-align: left; max-height: 300px; overflow-y: auto;">
            <div style="padding: 10px; border-bottom: 1px solid #eee; margin-bottom: 10px;">
              <p style="font-size: 13px; font-weight: bold; color: #333; margin: 0;">Login Berhasil</p>
              <p style="font-size: 12px; color: #666; margin: 5px 0 0 0;">Hari ini, 10:30</p>
            </div>
            <div style="padding: 10px; border-bottom: 1px solid #eee; margin-bottom: 10px;">
              <p style="font-size: 13px; font-weight: bold; color: #333; margin: 0;">Mengubah Profil</p>
              <p style="font-size: 12px; color: #666; margin: 5px 0 0 0;">Kemarin, 15:45</p>
            </div>
            <div style="padding: 10px; border-bottom: 1px solid #eee;">
              <p style="font-size: 13px; font-weight: bold; color: #333; margin: 0;">Membuat Kegiatan Baru</p>
              <p style="font-size: 12px; color: #666; margin: 5px 0 0 0;">2 hari yang lalu, 09:20</p>
            </div>
          </div>
        `,
        icon: 'info',
        confirmButtonText: 'Tutup'
      })
    }

    const handleLogout = () => {
      showProfileMenu.value = false
      Swal.fire({
        title: 'Konfirmasi Keluar',
        text: 'Apakah Anda yakin ingin keluar?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#ef4444',
        cancelButtonColor: '#6b7280',
        confirmButtonText: 'Keluar',
        cancelButtonText: 'Batal'
      }).then((result) => {
        if (result.isConfirmed) {
          authStore.logout()
          router.push('/login')
          Swal.fire({
            title: 'Berhasil Keluar',
            text: 'Anda telah keluar dari sistem',
            icon: 'success',
            confirmButtonText: 'OK'
          })
        }
      })
    }

    return {
      showProfileMenu,
      getUserInitial,
      handleViewProfile,
      handleSettings,
      handleChangePassword,
      handleActivityLog,
      handleLogout
    }
  }
}
</script>
