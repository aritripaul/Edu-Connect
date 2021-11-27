import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import App from './App'
import { BrowserRouter } from 'react-router-dom'
import { BASE_URL } from './config/routes'
import {
    createTheme,
    ThemeProvider,
    responsiveFontSizes,
} from '@mui/material/styles'
import store from './store'
import { Provider } from 'react-redux'
import reportWebVitals from './reportWebVitals'
import axios from 'axios'

axios.defaults.baseURL = BASE_URL

ReactDOM.render(
    <React.StrictMode>
        <Provider store={store}>
            <BrowserRouter>
                <App />
            </BrowserRouter>
        </Provider>
    </React.StrictMode>,
    document.getElementById('root')
)

reportWebVitals()
