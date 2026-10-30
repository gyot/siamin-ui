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

// Terima string ATAU number sebagai String (PHP sering ganti-ganti tipe).
object LenientStringSerializer : KSerializer<String?> {
    override val descriptor = PrimitiveSerialDescriptor("LenientString", PrimitiveKind.STRING)
    override fun deserialize(decoder: Decoder): String? {
        val input = decoder as? JsonDecoder ?: return decoder.decodeString()
        val prim = input.decodeJsonElement() as? JsonPrimitive ?: return null
        return prim.content
    }
    override fun serialize(encoder: Encoder, value: String?) {
        if (value == null) encoder.encodeNull() else encoder.encodeString(value)
    }
}

@Serializable
data class LoginRequest(val email: String, val password: String)

@Serializable
data class UserObj(
    @Serializable(with = LenientIntSerializer::class) val id_pegawai: Int? = null,
    @Serializable(with = LenientIntSerializer::class) val id_user: Int? = null,
    val nama: String? = null,
    val name: String? = null,
    val user: String? = null,
    val email: String? = null,
    val role: String? = null,
    val pegawai: PegawaiItem? = null,
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
    val lokasi: String? = null,
    val kabupaten_kota: String? = null,
    val unit_kerja: String? = null,
    @Serializable(with = LenientIntSerializer::class) val total_peserta: Int? = null,
    @Serializable(with = LenientIntSerializer::class) val id_pegawai: Int? = null,
    @Serializable(with = LenientIntSerializer::class) val created_by: Int? = null,
    @Serializable(with = LenientIntSerializer::class) val unit_kerja_id: Int? = null,
    val metode_pembayaran: String? = null,
    val daftar_tpk: List<TpkItem>? = null,
    val daftar_atk: List<AtkItem>? = null,
    val peserta_ringkasan: String? = null,
    val dokumentasi_url: String? = null,
    val materi_url: String? = null,
    val panduan_url: String? = null,
    val laporan_url: String? = null,
    val surat_menyurat_url: String? = null,
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

@Serializable
data class DashboardStats(
    val total_kegiatan: Int? = null,
    val kegiatan_berjalan: Int? = null,
    val total_peserta: Int? = null,
    val total_sertifikat_terbit: Int? = null,
    val available_tahun: List<String>? = null,
    val available_unit_kerja: List<String>? = null,
)

@Serializable
data class PegawaiItem(
    @Serializable(with = LenientIntSerializer::class) val id_pegawai: Int? = null,
    @Serializable(with = LenientStringSerializer::class) val nip: String? = null,
    val nama: String? = null,
    val nama_jabatan: String? = null,
    val pangkat: String? = null,
    val golongan: String? = null,
    val status: String? = null,
    val unit_kerja: String? = null,
    val tempat_lahir: String? = null,
    val tanggal_lahir: String? = null,
    val pendidikan_terakhir: String? = null,
    val jurusan: String? = null,
    val tempat_pendidikan: String? = null,
    val tahun_lulus: String? = null,
    val status_kepegawaian: String? = null,
    val pdm_detail: String? = null,
)

@Serializable
data class PegawaiListResponse(val success: Boolean? = null, val data: List<PegawaiItem>? = null)

@Serializable
data class PenugasanItem(
    @Serializable(with = LenientIntSerializer::class) val id: Int? = null,
    @Serializable(with = LenientIntSerializer::class) val id_kegiatan: Int? = null,
    @Serializable(with = LenientIntSerializer::class) val id_pegawai: Int? = null,
    val peran: String? = null,
    val nama_kegiatan: String? = null,
    val nama_pegawai: String? = null,
    val tanggal_mulai: String? = null,
    val tanggal_selesai: String? = null,
    val kab_kota: String? = null,
    val lokasi: String? = null,
)

@Serializable
data class PenugasanListResponse(val success: Boolean? = null, val data: List<PenugasanItem>? = null)

@Serializable
data class PenugasanPayload(
    val id_kegiatan: Int,
    val id_pegawai: Int,
    val peran: String,
)

@Serializable
data class SertifikatBatchItem(
    @Serializable(with = LenientIntSerializer::class) val id_batch: Int? = null,
    @Serializable(with = LenientIntSerializer::class) val id_kegiatan: Int? = null,
    val nomor_sertifikat: String? = null,
    val tanggal_ttd: String? = null,
)

@Serializable
data class SertifikatListResponse(val success: Boolean? = null, val data: List<SertifikatBatchItem>? = null)

@Serializable
data class TpkItem(
    @Serializable(with = LenientIntSerializer::class) val id_tpk: Int? = null,
    val lokasi: String = "",
    val kabupaten_kota: String? = null,
)

@Serializable
data class AtkItem(
    val nama_barang: String = "",
    val spesifikasi: String? = null,
    @Serializable(with = LenientIntSerializer::class) val jumlah: Int? = null,
    val satuan: String? = null,
    val keterangan: String? = null,
)

@Serializable
data class JadwalItem(
    val waktu: String? = null,
    val kegiatan: String? = null,
    val pj: String? = null,
    val tipe: String? = null,
    @Serializable(with = LenientStringSerializer::class) val jp: String? = null,
)

@Serializable
data class JadwalDay(
    val hari: String = "",
    val tanggal: String = "",
    val items: List<JadwalItem>? = null,
    val urutan: Int? = null,
)

@Serializable
data class JadwalSaveRequest(val jadwal: List<JadwalDay>)

@Serializable
data class JadwalResponse(
    val success: Boolean? = null,
    val data: JadwalData? = null,
)

@Serializable
data class JadwalData(
    val jadwal_harian: List<JadwalDay>? = null,
)

@Serializable
data class KegiatanPayload(
    val nama_kegiatan: String,
    val deskripsi: String? = null,
    val tanggal_mulai: String,
    val tanggal_selesai: String,
    val status: String? = null,
    val metode_pelaksanaan: String? = null,
    val id_pegawai: Int? = null,
    val rincian_kegiatan: String? = null,
    @Serializable(with = LenientIntSerializer::class) val unit_kerja_id: Int? = null,
    @Serializable(with = LenientIntSerializer::class) val total_peserta: Int? = null,
    val metode_pembayaran: String? = null,
    val daftar_tpk: List<TpkItem>? = null,
    val daftar_atk: List<AtkItem>? = null,
    val dokumentasi_url: String? = null,
    val materi_url: String? = null,
    val panduan_url: String? = null,
    val laporan_url: String? = null,
    val surat_menyurat_url: String? = null,
)

@Serializable
data class PesertaKegiatanRef(
    @Serializable(with = LenientIntSerializer::class) val id_kegiatan: Int? = null,
    val nama_kegiatan: String? = null,
)

@Serializable
data class PesertaItem(
    @Serializable(with = LenientIntSerializer::class) val id_peserta: Int? = null,
    @Serializable(with = LenientIntSerializer::class) val id_kegiatan: Int? = null,
    val nama_lengkap: String? = null,
    @Serializable(with = LenientStringSerializer::class) val nip: String? = null,
    val jabatan: String? = null,
    val peran: String? = null,
    val no_hp: String? = null,
    val email: String? = null,
    val nama_instansi: String? = null,
    val kab_kota: String? = null,
    val jenis_kelamin: String? = null,
    val kegiatan: PesertaKegiatanRef? = null,
)

@Serializable
data class PesertaListResponse(val success: Boolean? = null, val data: List<PesertaItem>? = null)

@Serializable
data class SertifikatStatusItem(
    @Serializable(with = LenientIntSerializer::class) val id_peserta: Int? = null,
    @Serializable(with = LenientIntSerializer::class) val id_kegiatan: Int? = null,
    @Serializable(with = LenientIntSerializer::class) val id_sertifikat: Int? = null,
    val status: String? = null,
)

@Serializable
data class SertifikatStatusListResponse(val success: Boolean? = null, val data: List<SertifikatStatusItem>? = null)

@Serializable
data class PesertaPayload(
    val id_kegiatan: Int,
    val nama_lengkap: String,
    val nip: String? = null,
    val jabatan: String? = null,
    val peran: String? = null,
    val no_hp: String? = null,
    val email: String? = null,
    val nama_instansi: String? = null,
    val kab_kota: String? = null,
    val jenis_kelamin: String? = null,
)
