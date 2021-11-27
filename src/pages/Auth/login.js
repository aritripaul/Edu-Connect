import * as React from 'react'

import { useDispatch } from 'react-redux'
import { setUser } from '../../store/auth'
import { setNotification } from '../../store/notification'
import Avatar from '@mui/material/Avatar'
import Button from '@mui/material/Button'
import CssBaseline from '@mui/material/CssBaseline'
import TextField from '@mui/material/TextField'
import { Link as MUILink, LinearProgress } from '@mui/material/'
import Grid from '@mui/material/Grid'
import Box from '@mui/material/Box'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import Typography from '@mui/material/Typography'
import Container from '@mui/material/Container'
import LeftIcon from '@mui/icons-material/KeyboardArrowLeft'
import { createTheme } from '@mui/material/styles'
import { WEBSITE_NAME } from '../../config/consts'
import { Link } from 'react-router-dom'
import { LOGIN, PROFILE } from '../../config/routes'
import { apiInstance } from '../../config/http_client'
function Copyright(props) {
    return (
        <Typography
            variant="body2"
            color="text.secondary"
            align="center"
            {...props}>
            {'Copyright © '}
            <MUILink color="text.secondary" gutterBottom>
                <Link to="/" style={{ color: 'inherit' }}>
                    {WEBSITE_NAME}
                </Link>
            </MUILink>{' '}
            {new Date().getFullYear()}
            {'.'}
        </Typography>
    )
}

const theme = createTheme()

export default function SignIn() {
    const dispatch = useDispatch()

    const [loading, setLoading] = React.useState(false)

    const handleSubmit = async (event) => {
        event.preventDefault()
        const data = new FormData(event.currentTarget)
        setLoading(true)
        const body = {
            username: data.get('username'),
            password: data.get('password'),
        }

        try {
            const { data } = await apiInstance.post(LOGIN, body)
            localStorage.setItem('accessToken', data.accessToken)

            const user = await apiInstance.get(PROFILE)

            dispatch(setUser(user.data))
            dispatch(
                setNotification({
                    message: 'Welcome ' + user.data.username + ' !',
                    severity: 'success',
                })
            )
        } catch (err) {
            dispatch(setUser(null))
            setLoading(false)
            dispatch(
                setNotification({
                    message: err.response
                        ? err.response.data.message
                        : 'Network error',
                    severity: 'error',
                })
            )
        }
    }

    return (
        <Container component="main" maxWidth="xs">
            <CssBaseline />
            <Box
                sx={{
                    marginTop: 8,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}>
                <Box style={{ width: '100%', display: 'flex' }}>
                    <LeftIcon color="primary" />
                    <Link to="/">
                        <MUILink color="primary" variant="button">
                            Home
                        </MUILink>
                    </Link>
                </Box>

                <Box style={{ width: '100%', display: 'flex' }}>
                    <Box style={{ display: 'flex', flex: '1' }}>
                        <Typography
                            component="h1"
                            variant="h3"
                            sx={{ fontWeight: '600', textAlign: 'left' }}>
                            Log In
                        </Typography>
                    </Box>
                    <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                        <LockOutlinedIcon />
                    </Avatar>
                </Box>
                <Box
                    component="form"
                    onSubmit={handleSubmit}
                    noValidate
                    sx={{ mt: 1 }}>
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        disabled={loading}
                        id="username"
                        label="Username / Email Address"
                        name="username"
                        autoComplete="email"
                        autoFocus
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        disabled={loading}
                        name="password"
                        label="Password"
                        type="password"
                        id="password"
                        autoComplete="current-password"
                    />
                    <Button
                        type="submit"
                        fullWidth
                        disabled={loading}
                        variant="contained"
                        sx={{ position: 'relative', mt: 3, mb: 2 }}>
                        Log In
                        {loading && (
                            <LinearProgress
                                color="secondary"
                                sx={{
                                    height: '3px',
                                    width: '100%',
                                    bottom: '0',
                                    position: 'absolute',
                                }}
                            />
                        )}
                    </Button>
                    <Grid container>
                        <Grid item xs>
                            <MUILink variant="body2">
                                <Link
                                    to="/auth/forget_password"
                                    style={{ color: 'inherit' }}>
                                    Forgot password?
                                </Link>
                            </MUILink>
                        </Grid>
                        <Grid item>
                            <MUILink variant="body2">
                                <Link
                                    to="/auth/signup"
                                    style={{ color: 'inherit' }}>
                                    {"Don't have an account? Sign Up"}
                                </Link>
                            </MUILink>
                        </Grid>
                    </Grid>
                </Box>
            </Box>
            <Container maxWidth="sm" sx={{ paddingBottom: '50px' }}>
                <Copyright sx={{ mt: 8 }} />
            </Container>
        </Container>
    )
}
