package com.opencritique.data.security

interface EncryptedDatabaseProvider {
    fun databaseName(): String
    fun isEncrypted(): Boolean
}

interface SecureCredentialStore {
    fun save(key: String, value: String)
    fun load(key: String): String?
    fun delete(key: String)
}

interface SecureTransportPolicy {
    fun requiresTls(): Boolean
}
