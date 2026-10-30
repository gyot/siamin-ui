package com.bpmpntb.simaik.api

import retrofit2.http.Body
import retrofit2.http.DELETE
import retrofit2.http.Field
import retrofit2.http.FormUrlEncoded
import retrofit2.http.GET
import retrofit2.http.PATCH
import retrofit2.http.POST
import retrofit2.http.PUT
import retrofit2.http.Path
import retrofit2.http.Query

interface ApiService {
    @POST("auth/login")
    suspend fun login(@Body req: LoginRequest): LoginResponse

    @GET("kegiatan/all")
    suspend fun kegiatanAll(@Query("per_page") per_page: Int = 200): KegiatanListResponse

    @GET("kegiatan/tim-saya")
    suspend fun kegiatanTimSaya(): KegiatanListResponse

    @GET("kegiatan/{id}")
    suspend fun kegiatanDetail(@Path("id") id: Int): KegiatanResponse

    @POST("kegiatan")
    suspend fun storeKegiatan(@Body req: KegiatanPayload): KegiatanResponse

    @PUT("kegiatan/{id}")
    suspend fun updateKegiatan(@Path("id") id: Int, @Body req: KegiatanPayload): KegiatanResponse

    @DELETE("kegiatan/{id}")
    suspend fun deleteKegiatan(@Path("id") id: Int): OkResponse

    @GET("dashboard/stats")
    suspend fun dashboardStats(): DashboardStats

    @GET("pegawai")
    suspend fun pegawai(): PegawaiListResponse

    @GET("penugasan-pegawai-detailed")
    suspend fun penugasan(): PenugasanListResponse

    @GET("laporan/{id_kegiatan}/jadwal")
    suspend fun getJadwal(@Path("id_kegiatan") id: Int): JadwalResponse

    @POST("laporan/{id_kegiatan}/jadwal")
    suspend fun saveJadwal(@Path("id_kegiatan") id: Int, @Body req: JadwalSaveRequest): OkResponse

    @POST("penugasan-pegawai")
    suspend fun storePenugasan(@Body req: PenugasanPayload): OkResponse

    @PUT("penugasan-pegawai/{id}")
    suspend fun updatePenugasan(@Path("id") id: Int, @Body req: PenugasanPayload): OkResponse

    @DELETE("penugasan-pegawai/{id}")
    suspend fun deletePenugasan(@Path("id") id: Int): OkResponse

    @GET("sertifikat-batch")
    suspend fun sertifikat(): SertifikatListResponse

    @GET("peserta")
    suspend fun peserta(@Query("kegiatan_id") kegiatanId: Int? = null, @Query("per_page") perPage: Int = 500): PesertaListResponse

    @GET("kegiatan/{id}/peserta-sertifikat")
    suspend fun pesertaSertifikat(@Path("id") id: Int): SertifikatStatusListResponse

    @GET("kelas/{id_kegiatan}")
    suspend fun kelas(@Path("id_kegiatan") id: Int): KelasListResponse

    @POST("kelas")
    suspend fun storeKelas(@Body req: KelasPayload): OkResponse

    @FormUrlEncoded
    @POST("kelas/{id_kelas}/anggota")
    suspend fun addKelasAnggota(@Path("id_kelas") id: Int, @Field("id_peserta") idPeserta: Int): OkResponse

    @GET("sertifikat")
    suspend fun sertifikatRecords(): SertifikatStatusListResponse

    @FormUrlEncoded
    @PATCH("sertifikat/update-status")
    suspend fun updateSertifikatStatus(
        @Field("id_peserta") idPeserta: Int,
        @Field("id_kegiatan") idKegiatan: Int,
        @Field("status") status: String,
    ): OkResponse

    @POST("peserta")
    suspend fun storePeserta(@Body req: PesertaPayload): OkResponse

    @PUT("peserta/{id}")
    suspend fun updatePeserta(@Path("id") id: Int, @Body req: PesertaPayload): OkResponse

    @DELETE("peserta/{id}")
    suspend fun deletePeserta(@Path("id") id: Int): OkResponse

    @GET("sertifikat/cek/{kode}")
    suspend fun cekSertifikat(@Path("kode") kode: String): okhttp3.ResponseBody

    @POST("push/register")
    suspend fun registerPush(@Body req: PushRegisterRequest): OkResponse
}
