// Mock API for testing when backend has issues
// This simulates the backend login endpoints

export const mockLoginAdmin = async (email, password) => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 800))
  
  // Test credentials
  if (email === 'admin@kemkominfo.go.id' && password === 'password123') {
    return {
      success: true,
      token: 'mock-token-admin-' + Date.now(),
      user: {
        id: 1,
        name: 'Admin Test User',
        email: 'admin@kemkominfo.go.id',
        role: 'admin',
        instansi: 'Kementerian Pendidikan Dasar dan Menengah'
      }
    }
  }
  
  throw new Error('Email atau password tidak valid')
}

export const mockLoginPeserta = async (username, password) => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 800))
  
  // Test credentials
  if (username === 'testpeserta' && password === 'password123') {
    return {
      success: true,
      token: 'mock-token-peserta-' + Date.now(),
      user: {
        id: 1,
        name: 'Test Peserta',
        username: 'testpeserta',
        nip: '199005011990051001',
        email: 'peserta@test.com',
        role: 'peserta',
        instansi: 'Test Institution'
      }
    }
  }
  
  throw new Error('Username atau password tidak valid')
}
