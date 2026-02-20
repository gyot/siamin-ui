<template>
  <div class="flex items-center gap-3">
    <svg class="animate-spin -ml-1 mr-3 h-6 w-6 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
    </svg>
    <div class="text-sm text-slate-700">{{ message }}</div>
  </div>
</template>

<script>
export default {
  name: 'Spinner',
  props: {
    message: {
      type: String,
      default: 'Memuat...'
    }
  }
}
</script>

<style scoped>
.animate-spin { /* fallback if Tailwind not present */
  -webkit-animation: spin 1s linear infinite;
  animation: spin 1s linear infinite;
}
@-webkit-keyframes spin { to { -webkit-transform: rotate(360deg); } }
@keyframes spin { to { transform: rotate(360deg); } }
</style>
