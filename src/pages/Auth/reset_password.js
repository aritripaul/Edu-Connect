import * as React from 'react'
import Avatar from '@mui/material/Avatar'
import Button from '@mui/material/Button'
import CssBaseline from '@mui/material/CssBaseline'
import TextField from '@mui/material/TextField'
import { Link as MUILink, LinearProgress } from '@mui/material/'
import Grid from '@mui/material/Grid'
import Box from '@mui/material/Box'
import { setNotification } from '../../store/notification'
import LeftIcon from '@mui/icons-material/KeyboardArrowLeft'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import Typography from '@mui/material/Typography'
import Container from '@mui/material/Container'
import { createTheme } from '@mui/material/styles'
import { WEBSITE_NAME } from '../../config/consts'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { RESET_PASSWORD } from '../../config/routes'
import { useDispatch } from 'react-redux'
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
    const { id } = useParams()
    const [loading, setLoading] = React.useState(false)
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const handleSubmit = async (event) => {
        event.preventDefault()
        const data = new FormData(event.currentTarget)
        setLoading(true)
        const body = {
            token: id,
            confirm_password: data.get('confirm_password'),
            password: data.get('password'),
        }

        try {
            const { data } = await apiInstance.put(RESET_PASSWORD, body)
            setLoading(false)
            dispatch(
                setNotification({
                    message: 'Password reset successfully',
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
                    <Link to="/dashboard/profile">
                        <MUILink color="primary" variant="button">
                            Profile
                        </MUILink>
                    </Link>
                </Box>
                <Box style={{ width: '100%', display: 'flex' }}>
                    <Box style={{ display: 'flex', flex: '1' }}>
                        <Typography
                            component="h1"
                            variant="h3"
                            sx={{ fontWeight: '600', textAlign: 'left' }}>
                            Reset
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
                        name="password"
                        disabled={loading}
                        label="Password"
                        type="password"
                        id="password"
                        autoComplete="current-password"
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        disabled={loading}
                        name="confirm_password"
                        label="Confirm Password"
                        type="password"
                        id="confirm_password"
                        autoComplete="confirm-password"
                    />

                    <Button
                        type="submit"
                        fullWidth
                        disabled={loading}
                        variant="contained"
                        sx={{ position: 'relative', mt: 3, mb: 2 }}>
                        Reset Password
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
