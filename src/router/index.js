
import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const AdminLayout = () => import('../layouts/AdminLayout.vue')
const Dashboard = () => import('../pages/Dashboard.vue')
const Kegiatan = () => import('../pages/Kegiatan.vue')
const Peserta = () => import('../pages/Peserta.vue')
const PesertaManagement = () => import('../pages/PesertaManagement.vue')
const KegiatanPeserta = () => import('../pages/KegiatanPeserta.vue')
const Sertifikat = () => import('../pages/Sertifikat.vue')
const PegawaiManagement = () => import('../pages/PegawaiManagement.vue')
const UnitKerjaManagement = () => import('../pages/UnitKerjaManagement.vue')
const AnggotaManagement = () => import('../pages/AnggotaManagement.vue')
const Penugasan = () => import('../pages/Penugasan.vue')
const Profile = () => import('../pages/Profile.vue')
const Landing = () => import('../pages/Landing.vue')
const Login = () => import('../pages/Login.vue')
const LoginPeserta = () => import('../pages/LoginPeserta.vue')
const FormulirPeserta = () => import('../pages/FormulirPeserta.vue')
const DaftarPesertaPublik = () => import('../pages/DaftarPesertaPublik.vue')
const UnduhSertifikatPublik = () => import('../pages/UnduhSertifikatPublik.vue')
const KegiatanDetailPublik = () => import('../pages/KegiatanDetailPublik.vue')
const EvaluasiKegiatan = () => import('../pages/EvaluasiKegiatan.vue')
const LaporanEvaluasi = () => import('../pages/LaporanEvaluasi.vue')
const LihatTandatangan = () => import('../pages/LihatTandatangan.vue')
const DataSyncMonitor = () => import('../pages/DataSyncMonitor.vue')
const TestUjian = () => import('../pages/TestUjian.vue')
const TestLaporan = () => import('../pages/TestLaporan.vue')
const PaketSoal = () => import('../pages/PaketSoal.vue')

let fetchAPI = null
let database = null
const loadRouterDeps = async () => {
  if (!fetchAPI) {
    const mod = await import('@/services/api')
    fetchAPI = mod.fetchAPI
  }
  if (!database) {
    const mod = await import('@/data/index.js')
    database = mod.default || mod
  }
}

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
    path:'/formulir/:kode/:peran/:idTpk/:slugJudul',
    component:FormulirPeserta,
    meta:{
      title: (to) => `Formulir ${to.params.peran || 'Peserta'} - ${to.params.slugJudul || ''}`,
      description: (to) => `Formulir pendaftaran kegiatan ${to.params.slugJudul || ''}.`
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
    path:'/unduh-sertifikat/:kode/:slugJudul?',
    component:UnduhSertifikatPublik,
    meta:{
      title: 'Unduh Sertifikat',
      description: 'Unduh sertifikat peserta kegiatan.'
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
    path:'/evaluasi/:kode/:idTpk?/:slugJudul?',
    component:EvaluasiKegiatan,
    meta:{
      title: 'Evaluasi Kegiatan',
      description: 'Formulir evaluasi kegiatan untuk peserta.'
    }
  },
  {
    path:'/laporan-evaluasi/:kode/:idTpk?/:slugJudul?',
    component:LaporanEvaluasi,
    meta:{
      title: 'Laporan Evaluasi Kegiatan',
      description: 'Laporan dan statistik hasil evaluasi kegiatan.'
    }
  },
  {
    path:'/test/:kode/:idTpk?/:slugJudul?',
    component:TestUjian,
    meta:{
      title: 'Ujian Online',
      description: 'Kerjakan soal ujian kegiatan.'
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
    {path:'kegiatan/:id/test-laporan',name:'test-laporan',component:TestLaporan,meta:{title:'Laporan Test',description:'Laporan hasil test kegiatan.'}},
    {path:'paket-soal',name:'paket-soal',component:PaketSoal,meta:{title:'Paket Soal',description:'Kelola paket soal dan soal ujian.'}},
    {path:'peserta',name:'peserta',component:PesertaManagement,meta:{title:'Manajemen Peserta',description:'Kelola data peserta kegiatan.'}},
    {path:'sertifikat',name:'sertifikat',component:Sertifikat,meta:{title:'Sertifikat',description:'Kelola sertifikat peserta.'}},
    {path:'pegawai',name:'pegawai',component:PegawaiManagement,meta:{title:'Pegawai',description:'Kelola data pegawai.'}},
    {path:'unit-kerja',name:'unit-kerja',component:UnitKerjaManagement,meta:{title:'Unit Kerja',description:'Kelola unit kerja.'}},
    {path:'anggota',name:'anggota',component:AnggotaManagement,meta:{title:'Keanggotaan Tim',description:'Kelola anggota tim kerja.'}},
    {path:'penugasan',name:'penugasan',component:Penugasan,meta:{title:'Penugasan Pegawai',description:'Lihat dan filter penugasan pegawai.'}},
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

let kegiatanListResolved = false

const loadKegiatanList = async () => {
  if (kegiatanListResolved && Array.isArray(kegiatanListCache) && kegiatanListCache.length > 0) {
    return kegiatanListCache
  }

  if (!database) await loadRouterDeps()
  kegiatanListCache = database.kegiatan || []

  if (!kegiatanListFetchPromise) {
    kegiatanListFetchPromise = (async () => {
      try {
        const data = await fetchAPI('kegiatan')
        const resolved = Array.isArray(data)
          ? data
          : (Array.isArray(data?.data) ? data.data : [])
        if (resolved.length > 0) {
          kegiatanListCache = resolved
        }
      } catch {
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
      } finally {
        kegiatanListResolved = true
      }
    })()
  }

  await kegiatanListFetchPromise
  return kegiatanListCache
}

const findKegiatanByKode = async (kode) => {
  const list = await loadKegiatanList()
  return list.find((item) => normalize(item.id_kegiatan) === normalize(kode)) || null
}

// Route guards
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()

  // Sync restore from localStorage (instant, no network)
  if (!authStore.hasRestoredSession) {
    authStore.restoreAuth({ revalidate: false })
  }

  // Defer revalidation to background (non-blocking)
  if (to.meta.requiresAuth && authStore.token && !authStore.hasRevalidatedSession) {
    authStore.fetchMe().catch(() => {})
  }

  let routeTitle = resolveMetaValue(to.meta?.title, to)
  let routeDescription = resolveMetaValue(to.meta?.description, to)

  if (to.path.startsWith('/formulir/') || to.path.startsWith('/daftar-peserta/') || to.path.startsWith('/unduh-sertifikat/') || to.path.startsWith('/kegiatan/') || to.path.startsWith('/test/')) {
    // Resolve kegiatan name in background, use slugify fallback immediately
    const namaKegiatan = unslugify(to.params.slugJudul)

    if (to.path.startsWith('/formulir/')) {
      routeTitle = `Formulir ${to.params.peran || 'Peserta'} - ${namaKegiatan || 'Kegiatan'}`
      routeDescription = `Formulir pendaftaran kegiatan ${namaKegiatan || ''}.`
    } else if (to.path.startsWith('/daftar-peserta/')) {
      routeTitle = `Daftar Peserta - ${namaKegiatan || 'Kegiatan'}`
      routeDescription = `Daftar peserta kegiatan ${namaKegiatan || ''}.`
    } else if (to.path.startsWith('/unduh-sertifikat/')) {
      routeTitle = `Unduh Sertifikat - ${namaKegiatan || 'Kegiatan'}`
      routeDescription = `Unduh sertifikat peserta kegiatan ${namaKegiatan || ''}.`
    } else if (to.path.startsWith('/kegiatan/')) {
      routeTitle = `Detail Kegiatan - ${namaKegiatan || 'Kegiatan'}`
      routeDescription = `Informasi detail kegiatan ${namaKegiatan || ''}.`
    } else if (to.path.startsWith('/test/')) {
      routeTitle = `Ujian Online - ${namaKegiatan || 'Kegiatan'}`
      routeDescription = `Ujian online kegiatan ${namaKegiatan || ''}.`
    }

    // Refine title from API in background
    loadRouterDeps().then(() => findKegiatanByKode(to.params.kode)).then((kegiatan) => {
      if (kegiatan?.nama_kegiatan) {
        const refined = kegiatan.nama_kegiatan
        if (to.path.startsWith('/formulir/')) {
          document.title = `Formulir ${to.params.peran || 'Peserta'} - ${refined} | ${APP_NAME}`
        } else if (to.path.startsWith('/daftar-peserta/')) {
          document.title = `Daftar Peserta - ${refined} | ${APP_NAME}`
        } else if (to.path.startsWith('/unduh-sertifikat/')) {
          document.title = `Unduh Sertifikat - ${refined} | ${APP_NAME}`
        } else if (to.path.startsWith('/kegiatan/')) {
          document.title = `Detail Kegiatan - ${refined} | ${APP_NAME}`
        } else if (to.path.startsWith('/test/')) {
          document.title = `Ujian Online - ${refined} | ${APP_NAME}`
        }
      }
    }).catch(() => {})
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
