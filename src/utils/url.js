const ABSOLUTE_URL_PATTERN = /^(https?:\/\/|data:|mailto:|tel:)/i

const trimTrailingSlash = (value = '') => String(value || '').replace(/\/+$/, '')

export const isAbsoluteUrl = (value = '') => ABSOLUTE_URL_PATTERN.test(String(value || '').trim())

export const getAppBaseUrl = () => {
  const basePath = String(import.meta.env.BASE_URL || '/')

  if (typeof window !== 'undefined' && window.location?.origin) {
    return trimTrailingSlash(new URL(basePath, `${window.location.origin}/`).href)
  }

  return trimTrailingSlash(basePath === '/' ? '' : basePath)
}

export const buildPublicUrl = (path = '') => {
  const value = String(path || '').trim()
  if (!value) return getAppBaseUrl()
  if (isAbsoluteUrl(value)) return value

  const base = getAppBaseUrl()
  const normalizedPath = value.replace(/^\/+/, '')

  return base ? `${base}/${normalizedPath}` : `/${normalizedPath}`
}

export const getApiHostBase = () => {
  const apiBase = String(import.meta.env.VITE_API_BASE_URL || '').trim()
  return trimTrailingSlash(
    apiBase
      .replace(/\/api\/v\d+\/?$/, '')
      .replace(/\/api\/?$/, '')
  )
}

export const buildStorageUrl = (path = '') => {
  const value = String(path || '').trim()
  if (!value) return ''
  if (isAbsoluteUrl(value)) return value

  const normalizedPath = value.replace(/^\/+/, '')
  const apiHostBase = getApiHostBase()

  if (apiHostBase) {
    return `${apiHostBase}/storage/${normalizedPath}`
  }

  return buildPublicUrl(`storage/${normalizedPath}`)
}
