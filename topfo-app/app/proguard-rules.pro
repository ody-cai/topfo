# Retrofit + Kotlinx Serialization
-keepattributes *Annotation*, InnerClasses
-dontnote kotlinx.serialization.AnnotationsKt
-keepclassmembers class kotlinx.serialization.json.** { *** Companion; }
-keepclasseswithmembers class kotlinx.serialization.json.** { kotlinx.serialization.KSerializer serializer(...); }
-keep,includedescriptorclasses class com.topfo.app.**$$serializer { *; }
-keepclassmembers class com.topfo.app.** { *** Companion; }
-keepclasseswithmembers class com.topfo.app.** { kotlinx.serialization.KSerializer serializer(...); }

# Room
-keep class * extends androidx.room.RoomDatabase
-dontwarn androidx.room.paging.**

# OkHttp
-dontwarn okhttp3.**
-dontwarn okio.**

# JWT Decode
-keep class com.auth0.android.jwt.** { *; }

# ErrorProne annotations (referenced by Tink/crypto library)
-dontwarn com.google.errorprone.annotations.**

# Tink (used by EncryptedSharedPreferences)
-keep class com.google.crypto.tink.** { *; }
-dontwarn com.google.api.client.http.**
-dontwarn com.google.api.client.json.**
-dontwarn org.joda.time.**
