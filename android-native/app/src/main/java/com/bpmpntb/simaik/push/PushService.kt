package com.bpmpntb.simaik.push

import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.PendingIntent
import android.content.Context
import android.content.Intent
import android.os.Build
import androidx.core.app.NotificationCompat
import com.bpmpntb.simaik.MainActivity
import com.bpmpntb.simaik.R
import com.google.firebase.messaging.FirebaseMessagingService
import com.google.firebase.messaging.RemoteMessage

class PushService : FirebaseMessagingService() {

    override fun onNewToken(token: String) {
        // Simpan ke server via layar login nanti; token terbaru selalu bisa dikirim ulang.
        val prefs = getSharedPreferences("simaik_session", Context.MODE_PRIVATE)
        prefs.edit().putString("fcm_token", token).apply()
    }

    override fun onMessageReceived(message: RemoteMessage) {
        val title = message.notification?.title
            ?: message.data["title"] ?: "SIMAIK"
        val body = message.notification?.body
            ?: message.data["body"] ?: ""
        val idKegiatan = message.data["id_kegiatan"]?.toIntOrNull() ?: -1

        showNotification(title, body, idKegiatan)
    }

    private fun showNotification(title: String, body: String, idKegiatan: Int) {
        val manager = getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager
        val channelId = "simaik_notifications"

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            val channel = NotificationChannel(
                channelId, "Notifikasi SIMAIK", NotificationManager.IMPORTANCE_HIGH
            )
            manager.createNotificationChannel(channel)
        }

        // Deep link: buka MainActivity -> layar detail kegiatan
        val intent = Intent(this, MainActivity::class.java).apply {
            action = "OPEN_KEGIATAN"
            putExtra("id_kegiatan", idKegiatan)
            flags = Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TOP
        }
        val pendingIntent = PendingIntent.getActivity(
            this, if (idKegiatan > 0) idKegiatan else 0, intent,
            PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
        )

        val notification = NotificationCompat.Builder(this, channelId)
            .setSmallIcon(R.mipmap.ic_launcher)
            .setContentTitle(title)
            .setContentText(body)
            .setStyle(NotificationCompat.BigTextStyle().bigText(body))
            .setAutoCancel(true)
            .setContentIntent(pendingIntent)
            .setPriority(NotificationCompat.PRIORITY_HIGH)
            .build()

        manager.notify(if (idKegiatan > 0) idKegiatan else System.currentTimeMillis().toInt(), notification)
    }
}
