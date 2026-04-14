
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
import KegiatanDetailPublik from '../pages/KegiatanDetailPublik.vue'
import EvaluasiKegiatan from '../pages/EvaluasiKegiatan.vue'
import LaporanEvaluasi from '../pages/LaporanEvaluasi.vue'
import LihatTandatangan from '../pages/LihatTandatangan.vue'
import DataSyncMonitor from '../pages/DataSyncMonitor.vue'
import { fetchAPI } from '@/services/api'
import database from '@/data/index.js'

const APP_NAME = 'SIMAIK'
const DEFAULT_TITLE = `${APP_NAME} - Sistem Manajemen Informasi Kegiatan`
const DEFAULT_DESCRIPTION = 'Platform manajemen kegiatan, peserta, dan sertifikat.'

const router = createRouter({
 history:createWebHistory(),
 routes:[
  {
    path:'/',
    component:Landing,
    meta:{
      title: 'Beranda',
      description: 'Halaman utama dan daftar kegiatan SIMAIK.'
    }
  },
  {
    path:'/laman-masuk',
    component:Login,
    meta:{
      title: 'Login Admin',
      description: 'Masuk ke dashboard admin SIMAIK.'
    }
  },
  {
    path:'/login-peserta',
    component:LoginPeserta,
    meta:{
      title: 'Login Peserta',
      description: 'Masuk sebagai peserta kegiatan.'
    }
  },
  {
    path:'/formulir/:kode/:peran/:slugJudul',
    component:FormulirPeserta,
    meta:{
      title: (to) => `Formulir ${to.params.peran || 'Peserta'} - ${to.params.slugJudul || ''}`,
      description: (to) => `Formulir pendaftaran kegiatan ${to.params.slugJudul || ''}.`
    }
  },
  {
    path:'/daftar-peserta/:kode/:slugJudul?',
    component:DaftarPesertaPublik,
    meta:{
      title: 'Daftar Pengisi Biodata',
      description: 'Daftar pengisi biodata kegiatan yang sudah mengisi formulir.'
    }
  },
  {
    path:'/kegiatan/:kode/:slugJudul?',
    component:KegiatanDetailPublik,
    meta:{
      title: 'Detail Kegiatan',
      description: 'Informasi detail kegiatan publik.'
    }
  },
  {
    path:'/evaluasi/:kode/:slugJudul?',
    component:EvaluasiKegiatan,
    meta:{
      title: 'Evaluasi Kegiatan',
      description: 'Formulir evaluasi kegiatan untuk peserta.'
    }
  },
  {
    path:'/laporan-evaluasi/:kode/:slugJudul?',
    component:LaporanEvaluasi,
    meta:{
      title: 'Laporan Evaluasi Kegiatan',
      description: 'Laporan dan statistik hasil evaluasi kegiatan.'
    }
  },
  {
    path:'/lihat-tandatangan/:id',
    component:LihatTandatangan,
    meta:{
      title: 'Lihat Tandatangan',
      description: 'Preview tandatangan peserta.'
    }
  },
  {
    path:'/data-sync',
    component:DataSyncMonitor,
    meta:{
      title: 'Data Sync Monitor',
      description: 'Pantau status sinkronisasi data SIMAIK.'
    }
  },
 {path:'/admin',component:AdminLayout,meta:{requiresAuth:true,requiresAdmin:true},children:[
    {path:'dashboard',name:'dashboard',component:Dashboard,meta:{title:'Dashboard',description:'Ringkasan data utama SIMAIK.'}},
    {path:'kegiatan',name:'kegiatan',component:Kegiatan,meta:{title:'Manajemen Kegiatan',description:'Kelola seluruh kegiatan.'}},
    {path:'kegiatan/:id/peserta',name:'kegiatan-peserta',component:KegiatanPeserta,meta:{title:'Peserta Kegiatan',description:'Kelola peserta per kegiatan.'}},
    {path:'peserta',name:'peserta',component:PesertaManagement,meta:{title:'Manajemen Peserta',description:'Kelola data peserta kegiatan.'}},
    {path:'surat-tugas',name:'surat-tugas',component:SuratTugasManagement,meta:{title:'Surat Tugas',description:'Kelola surat tugas kegiatan.'}},
    {path:'sertifikat',name:'sertifikat',component:Sertifikat,meta:{title:'Sertifikat',description:'Kelola sertifikat peserta.'}},
    {path:'pegawai',name:'pegawai',component:PegawaiManagement,meta:{title:'Pegawai',description:'Kelola data pegawai.'}},
    {path:'unit-kerja',name:'unit-kerja',component:UnitKerjaManagement,meta:{title:'Unit Kerja',description:'Kelola unit kerja.'}},
    {path:'anggota',name:'anggota',component:AnggotaManagement,meta:{title:'Keanggotaan Tim',description:'Kelola anggota tim kerja.'}},
    {path:'profile',name:'profile',component:Profile,meta:{title:'Profil',description:'Kelola profil pengguna.'}}
  ]}
 ]
})

const resolveMetaValue = (value, to) => (typeof value === 'function' ? value(to) : value)

const setMetaTag = (name, content) => {
  if (!content) return
  let tag = document.querySelector(`meta[name="${name}"]`)
  if (!tag) {
    tag = document.createElement('meta')
    tag.setAttribute('name', name)
    document.head.appendChild(tag)
  }
  tag.setAttribute('content', content)
}

let kegiatanListCache = null
let kegiatanListFetchPromise = null

const normalize = (value) => String(value || '').toLowerCase().trim()

const unslugify = (value) => String(value || '')
  .replace(/-/g, ' ')
  .trim()

const loadKegiatanList = async () => {
  if (Array.isArray(kegiatanListCache) && kegiatanListCache.length > 0) {
    return kegiatanListCache
  }

  kegiatanListCache = database.kegiatan || []

  if (!kegiatanListFetchPromise) {
    kegiatanListFetchPromise = fetchAPI('kegiatan')
      .then((data) => {
        const resolved = Array.isArray(data)
          ? data
          : (Array.isArray(data?.data) ? data.data : [])
        if (resolved.length > 0) {
          kegiatanListCache = resolved
        }
      })
      .catch(async () => {
        try {
          const data = await fetchAPI('kegiatan/all')
          const resolved = Array.isArray(data)
            ? data
            : (Array.isArray(data?.data) ? data.data : [])
          if (resolved.length > 0) {
            kegiatanListCache = resolved
          }
        } catch {
          // keep local fallback cache
        }
      })
      .finally(() => {
        kegiatanListFetchPromise = null
      })
  }

  return kegiatanListCache
}

const findKegiatanByKode = async (kode) => {
  const list = await loadKegiatanList()
  return list.find((item) => normalize(item.id_kegiatan) === normalize(kode)) || null
}

// Route guards
router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()
  authStore.restoreAuth() // hydrate sekali, revalidasi berjalan di background

  let routeTitle = resolveMetaValue(to.meta?.title, to)
  let routeDescription = resolveMetaValue(to.meta?.description, to)

  if (to.path.startsWith('/formulir/') || to.path.startsWith('/daftar-peserta/') || to.path.startsWith('/kegiatan/')) {
    const kegiatan = await findKegiatanByKode(to.params.kode)
    const namaKegiatan = kegiatan?.nama_kegiatan || unslugify(to.params.slugJudul)

    if (to.path.startsWith('/formulir/')) {
      routeTitle = `Formulir ${to.params.peran || 'Peserta'} - ${namaKegiatan || 'Kegiatan'}`
      routeDescription = `Formulir pendaftaran kegiatan ${namaKegiatan || ''}.`
    } else if (to.path.startsWith('/daftar-peserta/')) {
      routeTitle = `Daftar Peserta - ${namaKegiatan || 'Kegiatan'}`
      routeDescription = `Daftar peserta kegiatan ${namaKegiatan || ''}.`
    } else if (to.path.startsWith('/kegiatan/')) {
      routeTitle = `Detail Kegiatan - ${namaKegiatan || 'Kegiatan'}`
      routeDescription = `Informasi detail kegiatan ${namaKegiatan || ''}.`
    }
  }

  document.title = routeTitle ? `${routeTitle} | ${APP_NAME}` : DEFAULT_TITLE
  setMetaTag('description', routeDescription || DEFAULT_DESCRIPTION)

  if (to.meta.requiresAuth) {
    if (!authStore.isAuthenticated) {
      next('/laman-masuk')
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
