import axios from 'axios'

import { BASE_URL as API_BASE_URL, REFRESH_TOKEN } from './routes'

const apiConfig = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true,
})

apiConfig.interceptors.request.use(
    async (config) => {
        const access_token = localStorage.getItem('accessToken')
        config.headers = {
            Authorization: access_token ? `Bearer ${access_token}` : null,
            Accept: '*/*',
            'Access-Control-Allow-Credentials': 'true',
            'Content-Type': 'application/json',
        }
        return config
    },
    (error) => {
        Promise.reject(error)
    }
)

apiConfig.interceptors.response.use(
    (response) => {
        return response
    },
    async (error) => {
        const originalRequest = error.config

        try {
            if (
                error.response.status === 401 &&
                !originalRequest._retry &&
                localStorage.getItem('accessToken')
            ) {
                originalRequest._retry = true
                const data = await apiInstance.get(
                    `${API_BASE_URL}${REFRESH_TOKEN}`,
                    {
                        _retry: true,
                    }
                )
                localStorage.setItem('accessToken', data.data.accessToken)
                return apiConfig(originalRequest)
            }
            return Promise.reject(error)
        } catch (err) {
            console.log(err.response)
            return Promise.reject(error)
        }
    }
)

export const apiInstance = apiConfig
