const AUTH_KEYS = ['auth_token', 'user_data', 'user_type', 'unit_kerja_id', 'unit_kerja']

let preloadPromise = null

export const preloadNativeAuth = async () => {
  if (preloadPromise) return preloadPromise
  preloadPromise = Promise.resolve()
  return preloadPromise
}

export const storageSet = (key, value) => {
  try {
    localStorage.setItem(key, value)
  } catch {
    // silent
  }
}

export const storageGet = (key) => {
  try {
    return localStorage.getItem(key)
  } catch {
    return null
  }
}

export const storageRemove = (key) => {
  try {
    localStorage.removeItem(key)
  } catch {
    // silent
  }
}

export const storageRemoveAll = (keys = AUTH_KEYS) => {
  keys.forEach((key) => storageRemove(key))
}
