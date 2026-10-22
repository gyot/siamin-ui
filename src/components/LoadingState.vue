<template>
  <div :class="containerClass">
    <div v-if="state === 'loading'" class="flex flex-col items-center justify-center py-10">
      <div class="relative">
        <div class="w-12 h-12 rounded-full border-4 border-[#E4E6E9] border-t-[#1877F2] animate-spin"></div>
      </div>
      <p class="mt-4 text-sm text-[#65676B] font-medium">{{ message || 'Memuat data...' }}</p>
    </div>

    <div v-else-if="state === 'error'" class="flex flex-col items-center justify-center py-10 px-4">
      <div class="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mb-4">
        <svg class="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      <p class="text-[15px] font-semibold text-[#050505] text-center">{{ errorTitle || 'Server Tidak Terhubung' }}</p>
      <p class="mt-1 text-sm text-[#65676B] text-center">{{ errorMessage || 'Periksa koneksi internet Anda dan coba lagi.' }}</p>
      <button v-if="onRetry" @click="onRetry"
        class="mt-4 px-5 py-2 bg-[#1877F2] text-white rounded-lg text-sm font-semibold hover:bg-[#166FE5] transition">
        Coba Lagi
      </button>
    </div>

    <div v-else-if="state === 'empty'" class="flex flex-col items-center justify-center py-10 px-4">
      <div class="w-16 h-16 rounded-full bg-[#F0F2F5] flex items-center justify-center mb-4">
        <svg class="w-8 h-8 text-[#65676B]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
        </svg>
      </div>
      <p class="text-[15px] font-semibold text-[#050505] text-center">{{ emptyTitle || 'Tidak Ada Data' }}</p>
      <p class="mt-1 text-sm text-[#65676B] text-center">{{ emptyMessage || 'Belum ada data yang tersedia.' }}</p>
    </div>

    <slot v-else />
  </div>
</template>

<script>
export default {
  name: 'LoadingState',
  props: {
    state: {
      type: String,
      default: 'ready', // 'loading' | 'error' | 'empty' | 'ready'
      validator: v => ['loading', 'error', 'empty', 'ready'].includes(v)
    },
    message: String,
    errorTitle: String,
    errorMessage: String,
    emptyTitle: String,
    emptyMessage: String,
    onRetry: Function,
    containerClass: {
      type: String,
      default: ''
    }
  }
}
</script>
