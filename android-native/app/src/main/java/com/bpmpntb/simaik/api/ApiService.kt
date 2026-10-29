package com.bpmpntb.simaik.api

import retrofit2.http.Body
import retrofit2.http.GET
import retrofit2.http.POST
import retrofit2.http.Path

interface ApiService {
    @POST("auth/login")
    suspend fun login(@Body req: LoginRequest): LoginResponse

    @GET("kegiatan")
    suspend fun kegiatan(): KegiatanListResponse

    @GET("kegiatan/{id}")
    suspend fun kegiatanDetail(@Path("id") id: Int): KegiatanResponse

    @POST("push/register")
    suspend fun registerPush(@Body req: PushRegisterRequest): OkResponse
}
