import axios from "axios"

const baseURL = 'https://backend-for-english-app.onrender.com'
const token = localStorage.getItem("token")
const instance = axios.create({
  baseURL: baseURL,
headers: {
  Authorization: 'Bearer ' + token,
}
})

export const httpClient = instance;
