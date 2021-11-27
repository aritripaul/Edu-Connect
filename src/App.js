import React, { useEffect, useState } from 'react'
import './App.css'
import useMediaQuery from '@mui/material/useMediaQuery'
import { makeStyles } from '@mui/styles'
import { useSelector, useDispatch } from 'react-redux'
import { authLoading, setUser } from './store/auth'
import { closeNotification } from './store/notification'
import { apiInstance } from './config/http_client'
import { PROFILE } from './config/routes'
import {
    createTheme,
    ThemeProvider,
    responsiveFontSizes,
} from '@mui/material/styles'
import Stack from '@mui/material/Stack'
import Snackbar from '@mui/material/Snackbar'
import MuiAlert from '@mui/material/Alert'
import ScrollTop from './components/ScrollToTop'
import Pages from './Routes/'
import SplashScreen from './pages/Splash'

//import asyncImportLoader from './hoc/asynComponentLoader'

// Async Loading Components, Must only be used for heavy components
// const VideoContent = asyncImportLoader(() =>
//     import('')
// )

const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />
})

// App Component
function App(props) {
    let [screenWidth, setWidth] = useState(window.innerWidth)
    const [footer, setFooter] = useState(true)
    let mode = useSelector((state) => state.settings.mode)
    const userLoading = useSelector((state) => state.auth.loading)
    const user = useSelector((state) => state.auth.user)
    const theme = React.useMemo(
        () =>
            responsiveFontSizes(
                createTheme({
                    palette: {
                        primary: {
                            main: '#8e99f3',
                            dark: '#26418f',
                            contrastText: '#fff',
                        },
                        secondary: {
                            main: '#ff8a50',
                            dark: '#c41c00',
                        },
                        mode: mode,
                    },
                    typography: {
                        h1: {
                            fontFamily:
                                '""PlusJakartaSans-ExtraBold",-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol""',
                        },
                        h2: {
                            fontFamily:
                                '""PlusJakartaSans-ExtraBold",-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol""',
                        },
                        fontFamily:
                            '"IBM Plex Sans",-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol"',
                    },
                })
            ),
        [mode]
    )

    const notification = useSelector((state) => ({
        message: state.notification.message,
        severity: state.notification.severity,
        open: state.notification.open,
    }))
    const dispatch = useDispatch()

    const fetchUser = () => {
        if (!localStorage.getItem('accessToken')) {
            dispatch(setUser(null))
            return
        }
        apiInstance
            .get(PROFILE)
            .then((res) => {
                dispatch(setUser(res.data))
            })
            .catch(() => {
                dispatch(authLoading(false))
                dispatch(setUser(null))
            })
    }

    useEffect(() => {
        // if ('scrollRestoration' in window.history) {
        //     window.history.scrollRestoration = 'manual'
        // }

        fetchUser()
    }, [])

    const handleNotificationClose = () => {
        dispatch(closeNotification())
    }

    return (
        <ThemeProvider theme={theme}>
            <div className="App">
                <Snackbar
                    open={notification.open}
                    key={notification.message}
                    autoHideDuration={3000}
                    onClose={handleNotificationClose}>
                    <Alert
                        onClose={handleNotificationClose}
                        severity={notification.severity}
                        sx={{ width: '100%' }}>
                        {notification.message}
                    </Alert>
                </Snackbar>

                <ScrollTop></ScrollTop>
                {userLoading ? <SplashScreen /> : <Pages user={user} />}
            </div>
        </ThemeProvider>
    )
}

export default App
