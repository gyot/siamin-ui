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

    var email: String?
        get() = prefs.getString("email", null)
        set(v) { prefs.edit().putString("email", v).apply() }

    var username: String?
        get() = prefs.getString("username", null)
        set(v) { prefs.edit().putString("username", v).apply() }

    var role: String?
        get() = prefs.getString("role", null)
        set(v) { prefs.edit().putString("role", v).apply() }

    var nip: String?
        get() = prefs.getString("nip", null)
        set(v) { prefs.edit().putString("nip", v).apply() }

    var jabatan: String?
        get() = prefs.getString("jabatan", null)
        set(v) { prefs.edit().putString("jabatan", v).apply() }

    var golongan: String?
        get() = prefs.getString("golongan", null)
        set(v) { prefs.edit().putString("golongan", v).apply() }

    var unitKerja: String?
        get() = prefs.getString("unit_kerja", null)
        set(v) { prefs.edit().putString("unit_kerja", v).apply() }

    val isLoggedIn: Boolean get() = !token.isNullOrEmpty()

    fun clear() { prefs.edit().clear().apply() }
}
