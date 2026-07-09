package com.topfo.app.data.repository

import android.app.DownloadManager
import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.content.IntentFilter
import android.database.Cursor
import android.net.Uri
import android.os.Build
import android.os.Environment
import androidx.core.content.FileProvider
import com.topfo.app.BuildConfig
import com.topfo.app.data.remote.TopfoApi
import com.topfo.app.data.remote.dto.VersionCheckResponse
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.suspendCancellableCoroutine
import kotlinx.coroutines.withContext
import java.io.File
import kotlin.coroutines.resume

class VersionRepository(
    private val api: TopfoApi,
    private val context: Context
) {
    suspend fun checkUpdate(): Result<VersionCheckResponse> = withContext(Dispatchers.IO) {
        try {
            val response = api.checkVersion()
            if (response.versionCode > BuildConfig.VERSION_CODE) {
                Result.success(response)
            } else {
                Result.failure(Exception("已是最新版本"))
            }
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    /**
     * Download APK using system DownloadManager and return the downloaded file URI.
     * Suspends until the download completes (success or failure).
     */
    suspend fun downloadApk(versionInfo: VersionCheckResponse): Result<Uri> =
        withContext(Dispatchers.IO) {
            try {
                val downloadManager = context.getSystemService(Context.DOWNLOAD_SERVICE) as DownloadManager
                val fileName = "TopFO-v${versionInfo.versionName}.apk"

                // Remove any previous download with the same name
                context.getExternalFilesDir(Environment.DIRECTORY_DOWNLOADS)?.let { dir ->
                    File(dir, fileName).delete()
                }

                val request = DownloadManager.Request(Uri.parse(versionInfo.apkUrl)).apply {
                    setTitle("TopFO 更新")
                    setDescription("正在下载 v${versionInfo.versionName}")
                    setNotificationVisibility(DownloadManager.Request.VISIBILITY_VISIBLE)
                    setDestinationInExternalFilesDir(
                        context,
                        Environment.DIRECTORY_DOWNLOADS,
                        fileName
                    )
                    setAllowedOverMetered(true)
                    setAllowedOverRoaming(true)
                }

                val downloadId = downloadManager.enqueue(request)

                suspendCancellableCoroutine { cont ->
                    val receiver = object : BroadcastReceiver() {
                        override fun onReceive(ctx: Context?, intent: Intent?) {
                            val id = intent?.getLongExtra(DownloadManager.EXTRA_DOWNLOAD_ID, -1) ?: -1
                            if (id == downloadId) {
                                context.unregisterReceiver(this)

                                val cursor: Cursor = downloadManager.query(
                                    DownloadManager.Query().setFilterById(downloadId)
                                )
                                cursor.use {
                                    if (it.moveToFirst()) {
                                        val status = it.getInt(
                                            it.getColumnIndexOrThrow(DownloadManager.COLUMN_STATUS)
                                        )
                                        if (status == DownloadManager.STATUS_SUCCESSFUL) {
                                            val uriIndex = it.getColumnIndex(
                                                DownloadManager.COLUMN_LOCAL_URI
                                            )
                                            val uriStr = if (uriIndex >= 0) it.getString(uriIndex) else null
                                            if (uriStr != null) {
                                                cont.resume(Result.success(Uri.parse(uriStr)))
                                            } else {
                                                cont.resume(Result.failure(Exception("下载成功但无法获取文件路径")))
                                            }
                                        } else {
                                            cont.resume(Result.failure(Exception("下载失败")))
                                        }
                                    } else {
                                        cont.resume(Result.failure(Exception("下载失败")))
                                    }
                                }
                            }
                        }
                    }

                    context.registerReceiver(
                        receiver,
                        IntentFilter(DownloadManager.ACTION_DOWNLOAD_COMPLETE)
                    )

                    cont.invokeOnCancellation {
                        try {
                            context.unregisterReceiver(receiver)
                        } catch (_: Exception) {
                        }
                    }
                }
            } catch (e: Exception) {
                Result.failure(e)
            }
        }

    /**
     * Trigger system installer for the downloaded APK.
     * Converts the DownloadManager file URI to a FileProvider content URI
     * required for Android 7+ (API 24+).
     */
    fun installApk(apkUri: Uri) {
        val file = File(apkUri.path ?: return)
        val authority = "${context.packageName}.fileprovider"
        val contentUri = FileProvider.getUriForFile(context, authority, file)

        val intent = Intent(Intent.ACTION_VIEW).apply {
            setDataAndType(contentUri, "application/vnd.android.package-archive")
            addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION)
            addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
        }
        context.startActivity(intent)
    }
}
