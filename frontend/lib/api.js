import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost/v0'
})

export default api
