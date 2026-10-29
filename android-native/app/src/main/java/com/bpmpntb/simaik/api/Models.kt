package com.bpmpntb.simaik.api

import kotlinx.serialization.KSerializer
import kotlinx.serialization.Serializable
import kotlinx.serialization.descriptors.PrimitiveKind
import kotlinx.serialization.descriptors.PrimitiveSerialDescriptor
import kotlinx.serialization.encoding.Decoder
import kotlinx.serialization.encoding.Encoder
import kotlinx.serialization.json.JsonDecoder
import kotlinx.serialization.json.JsonPrimitive
import kotlinx.serialization.json.intOrNull

// PHP kadang mengirim angka sebagai string atau number -> terima keduanya.
object LenientIntSerializer : KSerializer<Int?> {
    override val descriptor = PrimitiveSerialDescriptor("LenientInt", PrimitiveKind.INT)
    override fun deserialize(decoder: Decoder): Int? {
        val input = decoder as? JsonDecoder ?: return decoder.decodeInt()
        val prim = input.decodeJsonElement() as? JsonPrimitive ?: return null
        return prim.intOrNull ?: prim.content.toIntOrNull()
    }
    override fun serialize(encoder: Encoder, value: Int?) {
        if (value == null) encoder.encodeNull() else encoder.encodeInt(value)
    }
}

@Serializable
data class LoginRequest(val identitas: String, val password: String)

@Serializable
data class UserObj(
    @Serializable(with = LenientIntSerializer::class) val id_pegawai: Int? = null,
    @Serializable(with = LenientIntSerializer::class) val id_user: Int? = null,
    val nama: String? = null,
    val name: String? = null,
    val user: String? = null,
    val email: String? = null,
)

@Serializable
data class LoginData(
    val login_as: String? = null,
    val token: String? = null,
    val token_type: String? = null,
    val user: UserObj? = null,
)

@Serializable
data class LoginResponse(
    val success: Boolean? = null,
    val message: String? = null,
    val data: LoginData? = null,
)

@Serializable
data class Kegiatan(
    val id_kegiatan: Int,
    val nama_kegiatan: String? = null,
    val deskripsi: String? = null,
    val rincian_kegiatan: String? = null,
    val tanggal_mulai: String? = null,
    val tanggal_selesai: String? = null,
    val status: String? = null,
    val flyer: String? = null,
    val metode_pelaksanaan: String? = null,
)

@Serializable
data class KegiatanListResponse(
    val success: Boolean? = null,
    val data: List<Kegiatan>? = null,
)

@Serializable
data class KegiatanResponse(
    val success: Boolean? = null,
    val data: Kegiatan? = null,
    val message: String? = null,
)

@Serializable
data class PushRegisterRequest(
    val id_pegawai: Int? = null,
    val token: String,
    val device_type: String = "android",
)

@Serializable
data class OkResponse(val success: Boolean? = null, val message: String? = null)
