package com.opencritique.data.local

interface LocalStorageContract {
    val databaseName: String
    val storageRoot: String
    fun isReady(): Boolean
}

object LocalFirstPolicy {
    const val USER_DATA_REMAINS_LOCAL = true
    const val CLOUD_ONLY_ACCOUNT_METADATA = true
}
