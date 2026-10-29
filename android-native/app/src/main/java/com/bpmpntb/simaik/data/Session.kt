package com.bpmpntb.simaik.data

import android.content.Context
import android.content.SharedPreferences

class Session(context: Context) {
    private val prefs: SharedPreferences =
        context.getSharedPreferences("simaik_session", Context.MODE_PRIVATE)

    var token: String?
        get() = prefs.getString("token", null)
        set(v) { prefs.edit().putString("token", v).apply() }

    var idPegawai: Int
        get() = prefs.getInt("id_pegawai", -1)
        set(v) { prefs.edit().putInt("id_pegawai", v).apply() }

    var nama: String?
        get() = prefs.getString("nama", null)
        set(v) { prefs.edit().putString("nama", v).apply() }

    val isLoggedIn: Boolean get() = !token.isNullOrEmpty()

    fun clear() { prefs.edit().clear().apply() }
}
