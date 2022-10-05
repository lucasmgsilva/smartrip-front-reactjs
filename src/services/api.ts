import axios from 'axios'

const baseURL = 'http://localhost:3001/api'
// const baseURL = 'http://192.168.0.101:3001/api'

export const api = axios.create({
  baseURL,
})
