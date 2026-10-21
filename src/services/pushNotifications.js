import { PushNotifications } from '@capacitor/push-notifications'
import { LocalNotifications } from '@capacitor/local-notifications'
import { Capacitor } from '@capacitor/core'
import { postAPI } from '@/services/api'

let isRegistered = false

export const initPushNotifications = async (userId) => {
  console.log('[Push] Memulai init push notifications, userId:', userId)

  if (!Capacitor.isNativePlatform()) {
    console.log('[Push] Bukan platform native, skip push notifications')
    return
  }

  try {
    // 1. Request permission
    const permission = await PushNotifications.requestPermissions()
    console.log('[Push] Permission result:', JSON.stringify(permission))
    if (permission.receive !== 'granted') {
      console.log('[Push] Permission ditolak')
      return
    }

    // 2. Register listeners SEBELUM register() agar token tidak hilang
    PushNotifications.addListener('registration', async (token) => {
      console.log('[Push] Device token diterima:', token.value?.substring(0, 20) + '...')
      if (userId && token.value) {
        await registerToken(token.value, userId)
      }

      // Test local notification untuk verifikasi
      try {
        await LocalNotifications.schedule({
          notifications: [{
            title: 'SIMAIK',
            body: 'Push notification aktif!',
            id: 1,
            schedule: { at: new Date(Date.now() + 1000) },
          }],
        })
        console.log('[Push] Test local notification terkirim')
      } catch (e) {
        console.error('[Push] Gagal test notification:', e)
      }
    })

    PushNotifications.addListener('pushNotificationReceived', (notification) => {
      console.log('[Push] Notification received:', JSON.stringify(notification))
    })

    PushNotifications.addListener('pushNotificationActionPerformed', (action) => {
      console.log('[Push] Notification action:', JSON.stringify(action))
      const data = action.notification?.data
      if (data?.type === 'penugasan' && data?.id_kegiatan) {
        window.location.href = `/admin/kegiatan/${data.id_kegiatan}/peserta`
      }
    })

    // 3. Register with FCM (setelah listener terdaftar)
    await PushNotifications.register()
    isRegistered = true
    console.log('[Push] Register berhasil')

    console.log('[Push] Push notifications initialized')
  } catch (e) {
    console.error('[Push] Gagal init push notifications:', e)
  }
}

export const registerToken = async (token, userId) => {
  try {
    const payload = { token, device_type: 'android' }
    // Jika user adalah pegawai (admin), gunakan id_pegawai
    // Jika user adalah peserta, gunakan id_akun_peserta
    const authStore = await import('@/stores/auth')
    const userType = authStore.useAuthStore()?.userType || localStorage.getItem('user_type')
    if (userType === 'peserta') {
      payload.id_akun_peserta = userId
    } else {
      payload.id_pegawai = userId
    }
    await postAPI('push/register', payload)
    console.log('[Push] Token terdaftar di backend')
  } catch (e) {
    console.error('[Push] Gagal daftar token:', e)
  }
}

export const removeToken = async (token) => {
  try {
    await postAPI('push/remove', { token })
  } catch (e) {
    console.error('[Push] Gagal hapus token:', e)
  }
}

export const unregisterPush = async () => {
  if (!Capacitor.isNativePlatform() || !isRegistered) return
  try {
    await PushNotifications.unregister()
    isRegistered = false
  } catch (e) {
    console.error('[Push] Gagal unregister:', e)
  }
}

export default {
  initPushNotifications,
  registerToken,
  removeToken,
  unregisterPush,
}
