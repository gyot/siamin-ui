package com.bpmpntb.simaik.api

import retrofit2.http.Body
import retrofit2.http.DELETE
import retrofit2.http.GET
import retrofit2.http.POST
import retrofit2.http.PUT
import retrofit2.http.Path

interface ApiService {
    @POST("auth/login")
    suspend fun login(@Body req: LoginRequest): LoginResponse

    @GET("kegiatan")
    suspend fun kegiatan(): KegiatanListResponse

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

    @GET("sertifikat-batch")
    suspend fun sertifikat(): SertifikatListResponse

    @POST("push/register")
    suspend fun registerPush(@Body req: PushRegisterRequest): OkResponse
}
