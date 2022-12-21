import axios from 'axios'

const verificationApi = axios.create({
    baseURL: import.meta.env.VITE_VERIFICATION_URL + '/api',
    timeout: 600000,
})

export function verifyImage(formData) {
  // return { data: { valid: true } }
  return verificationApi.post('/image', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
}
