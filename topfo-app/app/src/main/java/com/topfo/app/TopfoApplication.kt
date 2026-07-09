package com.topfo.app

import android.app.Application
import com.topfo.app.data.local.AppDatabase
import com.topfo.app.data.local.PreferencesManager
import com.topfo.app.data.remote.TopfoApi
import com.topfo.app.data.remote.AuthInterceptor
import com.topfo.app.data.repository.AuthRepository
import com.topfo.app.data.repository.ChatRepository
import com.topfo.app.data.repository.SchoolRepository
import com.topfo.app.data.repository.RankingRepository
import com.topfo.app.data.repository.VersionRepository
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.SupervisorJob
import kotlinx.coroutines.launch
import kotlinx.serialization.json.Json
import okhttp3.MediaType.Companion.toMediaType
import okhttp3.OkHttpClient
import retrofit2.Retrofit
import com.jakewharton.retrofit2.converter.kotlinx.serialization.asConverterFactory
import java.util.concurrent.TimeUnit

class TopfoApplication : Application() {
    lateinit var prefs: PreferencesManager
    lateinit var authRepo: AuthRepository
    lateinit var chatRepo: ChatRepository
    lateinit var schoolRepo: SchoolRepository
    lateinit var rankingRepo: RankingRepository
    lateinit var versionRepo: VersionRepository
    lateinit var api: TopfoApi

    private val appScope = CoroutineScope(SupervisorJob() + Dispatchers.IO)

    override fun onCreate() {
        super.onCreate()
        instance = this

        prefs = PreferencesManager(this)

        val authInterceptor = AuthInterceptor(prefs)
        val client = OkHttpClient.Builder()
            .addInterceptor(authInterceptor)
            .connectTimeout(15, TimeUnit.SECONDS)
            .readTimeout(30, TimeUnit.SECONDS)
            .build()

        val json = Json { ignoreUnknownKeys = true; isLenient = true }
        val retrofit = Retrofit.Builder()
            .baseUrl("https://topfo.pages.dev/")
            .client(client)
            .addConverterFactory(json.asConverterFactory("application/json".toMediaType()))
            .build()

        api = retrofit.create(TopfoApi::class.java)
        authRepo = AuthRepository(api)
        chatRepo = ChatRepository(api)
        schoolRepo = SchoolRepository.getInstance(this, api)
        rankingRepo = RankingRepository.getInstance(this, api)
        versionRepo = VersionRepository(api, this)

        // Restore saved session so all ViewModels start in sync
        val savedToken = prefs.getToken()
        val savedUsername = prefs.getUsername()
        if (savedToken.isNotEmpty() && savedUsername.isNotEmpty()) {
            authRepo.restoreSession(savedToken, savedUsername)
        }

        // Pre-load static data
        appScope.launch {
            schoolRepo.ensureDataLoaded()
        }
    }

    companion object {
        lateinit var instance: TopfoApplication
            private set
    }
}
