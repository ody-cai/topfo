package com.topfo.app.data.local

import android.content.Context
import android.content.SharedPreferences
import androidx.security.crypto.EncryptedSharedPreferences
import androidx.security.crypto.MasterKey

class PreferencesManager(context: Context) {
    private val prefs: SharedPreferences = run {
        try {
            val masterKey = MasterKey.Builder(context)
                .setKeyScheme(MasterKey.KeyScheme.AES256_GCM)
                .build()
            EncryptedSharedPreferences.create(
                context, "topfo_secure_prefs", masterKey,
                EncryptedSharedPreferences.PrefKeyEncryptionScheme.AES256_SIV,
                EncryptedSharedPreferences.PrefValueEncryptionScheme.AES256_GCM
            )
        } catch (e: Exception) {
            context.getSharedPreferences("topfo_prefs", Context.MODE_PRIVATE)
        }
    }

    fun saveToken(token: String) = prefs.edit().putString("jwt_token", token).apply()
    fun getToken(): String = prefs.getString("jwt_token", "") ?: ""
    fun saveUsername(name: String) = prefs.edit().putString("username", name).apply()
    fun getUsername(): String = prefs.getString("username", "") ?: ""
    fun saveDarkTheme(isDark: Boolean) = prefs.edit().putBoolean("dark_theme", isDark).apply()
    fun isDarkTheme(): Boolean = prefs.getBoolean("dark_theme", false)
    fun clear() = prefs.edit().clear().apply()
}
