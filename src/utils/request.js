import axios from 'axios'

const authAxiosInstance = axios.create({ baseURL: process.env.REACT_APP_GRAPHQL_API })

export default authAxiosInstance
