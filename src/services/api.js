import axios from 'axios'

export const API_URL = `https://boxhome.herokuapp.com`
// export const API_URL = `http://localhost:3333`

const api = axios.create({
	baseURL: API_URL
})

export default api