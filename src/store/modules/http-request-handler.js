// // Axios is a great http client library.
// // It uses promises by default and runs on both the client and the server (which makes it appropriate for fetching data during server-side rendering).
import axios from 'axios'

const HTTP = axios.create({
  baseURL: 'https://s3-ap-southeast-1.amazonaws.com/he-public-data/long_game_tree77fa4dd.json',
  headers: {
    'Access-Control-Allow-Origin': true,
    'x-no-cache': 1
  }
})

HTTP.interceptors.response.use(
  response => {
    return Promise.resolve(response)
  },
  error => {
    return Promise.reject(error)
  }
)
export default HTTP
