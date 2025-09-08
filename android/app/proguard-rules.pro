# Add project specific ProGuard rules here.
# By default, the flags in this file are appended to flags specified
# in /usr/local/Cellar/android-sdk/24.3.3/tools/proguard/proguard-android.txt
# You can edit the include path and order by changing the proguardFiles
# directive in build.gradle.
#
# For more details, see
#   http://developer.android.com/guide/developing/tools/proguard.html

# react-native-reanimated
-keep class com.swmansion.reanimated.** { *; }
-keep class com.facebook.react.turbomodule.** { *; }

# Add any project specific keep options here:

# React Native core (avoid obfuscation of critical classes)
-keep class com.facebook.react.** { *; }
-keep class com.facebook.hermes.** { *; }
-keep class com.facebook.jni.** { *; }

# Keep annotations used by RN & libs
-keepattributes *Annotation*

# Expo modules
-keep class expo.modules.** { *; }

# Gesture Handler / WebView
-keep class com.swmansion.gesturehandler.** { *; }
-keep class com.reactnativecommunity.webview.** { *; }

# Firebase & Play Services (consumer rules usually suffice, kept as safeguard)
-keep class com.google.firebase.** { *; }
-keep class com.google.android.gms.** { *; }

# Networking
-keep class okhttp3.** { *; }
-keep class okio.** { *; }

# SoLoader
-keep class com.facebook.soloader.** { *; }
