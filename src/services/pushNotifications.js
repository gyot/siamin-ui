import { PushNotifications } from '@capacitor/push-notifications'
import { Capacitor } from '@capacitor/core'
import { fetchAPI, postAPI } from '@/services/api'

let isRegistered = false

export const initPushNotifications = async (idPegawai) => {
  if (!Capacitor.isNativePlatform()) {
    console.log('[Push] Bukan platform native, skip push notifications')
    return
  }

  try {
    // 1. Request permission
    const permission = await PushNotifications.requestPermissions()
    if (permission.receive !== 'granted') {
      console.log('[Push] Permission ditolak')
      return
    }

    // 2. Register with FCM
    await PushNotifications.register()
    isRegistered = true

    // 3. Listen for registration (device token)
    PushNotifications.addListener('registration', (token) => {
      console.log('[Push] Device token:', token.value)
      if (idPegawai && token.value) {
        registerToken(token.value, idPegawai)
      }
    })

    // 4. Listen for push notifications (foreground)
    PushNotifications.addListener('pushNotificationReceived', (notification) => {
      console.log('[Push] Notification received:', notification)
    })

    // 5. Listen for notification tap (background/killed)
    PushNotifications.addListener('pushNotificationActionPerformed', (action) => {
      console.log('[Push] Notification action:', action)
      const data = action.notification?.data
      if (data?.type === 'penugasan' && data?.id_kegiatan) {
        // Redirect to kegiatan detail
        window.location.href = `/admin/kegiatan/${data.id_kegiatan}/peserta`
      }
    })

    console.log('[Push] Push notifications initialized')
  } catch (e) {
    console.error('[Push] Gagal init push notifications:', e)
  }
}

export const registerToken = async (token, idPegawai) => {
  try {
    await postAPI('push/register', {
      id_pegawai: idPegawai,
      token: token,
      device_type: 'android'
    })
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
