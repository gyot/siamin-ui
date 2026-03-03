
import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import AdminLayout from '../layouts/AdminLayout.vue'
import Dashboard from '../pages/Dashboard.vue'
import Kegiatan from '../pages/Kegiatan.vue'
import Peserta from '../pages/Peserta.vue'
import PesertaManagement from '../pages/PesertaManagement.vue'
import KegiatanPeserta from '../pages/KegiatanPeserta.vue'
import Sertifikat from '../pages/Sertifikat.vue'
import PegawaiManagement from '../pages/PegawaiManagement.vue'
import UnitKerjaManagement from '../pages/UnitKerjaManagement.vue'
import AnggotaManagement from '../pages/AnggotaManagement.vue'
import SuratTugasManagement from '../pages/SuratTugasManagement.vue'
import Profile from '../pages/Profile.vue'
import Landing from '../pages/Landing.vue'
import Login from '../pages/Login.vue'
import LoginPeserta from '../pages/LoginPeserta.vue'
import FormulirPeserta from '../pages/FormulirPeserta.vue'
import DaftarPesertaPublik from '../pages/DaftarPesertaPublik.vue'
import LihatTandatangan from '../pages/LihatTandatangan.vue'
import DataSyncMonitor from '../pages/DataSyncMonitor.vue'

const router = createRouter({
 history:createWebHistory(),
 routes:[
  {path:'/',component:Landing},
  {path:'/laman-masuk',component:Login},
  {path:'/login-peserta',component:LoginPeserta},
  {path:'/formulir/:kode/:peran/:slugJudul',component:FormulirPeserta},
  {path:'/daftar-peserta/:kode/:slugJudul?',component:DaftarPesertaPublik},
  {path:'/lihat-tandatangan/:id',component:LihatTandatangan},
  {path:'/data-sync',component:DataSyncMonitor},
 {path:'/admin',component:AdminLayout,meta:{requiresAuth:true,requiresAdmin:true},children:[
    {path:'dashboard',name:'dashboard',component:Dashboard},
    {path:'kegiatan',name:'kegiatan',component:Kegiatan},
    {path:'kegiatan/:id/peserta',name:'kegiatan-peserta',component:KegiatanPeserta},
    {path:'peserta',name:'peserta',component:PesertaManagement},
    {path:'surat-tugas',name:'surat-tugas',component:SuratTugasManagement},
    {path:'sertifikat',name:'sertifikat',component:Sertifikat},
    {path:'pegawai',name:'pegawai',component:PegawaiManagement},
    {path:'unit-kerja',name:'unit-kerja',component:UnitKerjaManagement},
    {path:'anggota',name:'anggota',component:AnggotaManagement},
    {path:'profile',name:'profile',component:Profile}
  ]}
 ]
})

// Route guards
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  authStore.restoreAuth() // Restore session saat page reload

  if (to.meta.requiresAuth) {
    if (!authStore.isAuthenticated) {
      next('/login')
    } else if (to.meta.requiresAdmin && !authStore.isAdmin) {
      next('/login-peserta')
    } else {
      next()
    }
  } else {
    next()
  }
})

export default router
