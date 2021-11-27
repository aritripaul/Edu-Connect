import * as React from 'react'
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
import { Link, useNavigate } from 'react-router-dom'
import { PASSWORD_RESET_REQUEST } from '../../config/routes'
import { DataSaverOff } from '@mui/icons-material'
import { useDispatch, useSelector } from 'react-redux'
import { setNotification } from '../../store/notification'
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
    const user = useSelector((state) => state.auth.user)
    const [loading, setLoading] = React.useState(false)
    const navigate = useNavigate()
    const handleSubmit = async (event) => {
        event.preventDefault()
        const data = new FormData(event.currentTarget)
        setLoading(true)
        const body = {
            username: data.get('username'),
        }

        try {
            const { data } = await apiInstance.post(
                PASSWORD_RESET_REQUEST,
                body
            )
            setLoading(false)
            dispatch(
                setNotification({
                    message:
                        'Password reset link sent to your registered email',
                    severity: 'success',
                })
            )
            navigate('/auth/login')
        } catch (err) {
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
                    <Link to={user ? '/dashboard/profile' : '/auth/login'}>
                        <MUILink color="primary" variant="button">
                            {user ? 'Profile' : 'Login'}
                        </MUILink>
                    </Link>
                </Box>
                <Box style={{ width: '100%', display: 'flex' }}>
                    <Box style={{ display: 'flex', flex: '1' }}>
                        <Typography
                            component="h1"
                            variant="h3"
                            sx={{ fontWeight: '600', textAlign: 'left' }}>
                            Recover
                        </Typography>
                    </Box>
                    <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                        <LockOutlinedIcon />
                    </Avatar>
                </Box>
                <Container sx={{ padding: '50px 2px 40px 2px' }}>
                    <Typography variant="body1">
                        Please enter your registered email address. We will send
                        you a password reset link to that email.
                    </Typography>
                </Container>
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
                        defaultValue={user ? user.email : ''}
                        label="Username / Email Address"
                        name="username"
                        autoComplete="email"
                        autoFocus
                    />
                    <Button
                        type="submit"
                        fullWidth
                        disabled={loading}
                        variant="contained"
                        sx={{ position: 'relative', mt: 3, mb: 2 }}>
                        Send Reset Link
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
                </Box>
            </Box>
            <Container maxWidth="sm" sx={{ paddingBottom: '50px' }}>
                <Copyright sx={{ mt: 8 }} />
            </Container>
        </Container>
    )
}
