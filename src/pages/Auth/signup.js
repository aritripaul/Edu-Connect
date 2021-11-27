import * as React from 'react'

import Avatar from '@mui/material/Avatar'
import Button from '@mui/material/Button'
import CssBaseline from '@mui/material/CssBaseline'
import TextField from '@mui/material/TextField'
import FormControlLabel from '@mui/material/FormControlLabel'
import Checkbox from '@mui/material/Checkbox'
import { Link as MUILink, LinearProgress } from '@mui/material/'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import Select from '@mui/material/Select'
import Grid from '@mui/material/Grid'
import Box from '@mui/material/Box'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import Typography from '@mui/material/Typography'
import Container from '@mui/material/Container'
import LeftIcon from '@mui/icons-material/KeyboardArrowLeft'
import { createTheme } from '@mui/material/styles'
import { WEBSITE_NAME } from '../../config/consts'
import { Link, Navigate } from 'react-router-dom'
import { apiInstance } from '../../config/http_client'
import { PROFILE, SIGNUP } from '../../config/routes'
import { setUser } from '../../store/auth'
import { useDispatch, useSelector } from 'react-redux'
import { setNotification } from '../../store/notification'
function Copyright(props) {
    return (
        <Typography
            variant="body2"
            color="text.secondary"
            align="center"
            sx={{ marginBottom: '100px' }}
            {...props}>
            {'Copyright © '}
            <MUILink color="text.secondary">
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

export default function SignUp() {
    const [employee_id, setEmployeeId] = React.useState('')
    const [role, setRole] = React.useState('student')
    const dispatch = useDispatch()
    const [loading, setLoading] = React.useState(false)
    const handleSubmit = async (event) => {
        event.preventDefault()
        setLoading(true)
        const data = new FormData(event.currentTarget)

        const body = {
            email: data.get('email'),
            role: role,
            last_name: data.get('last_name'),
            first_name: data.get('first_name'),
            username: data.get('username'),
            confirm_password: data.get('confirm_password'),
            password: data.get('password'),
            organization: data.get('organization'),
        }

        if (role !== 'student') {
            body['employee_id'] = employee_id
        }

        try {
            const { data } = await apiInstance.post(SIGNUP, body)
            localStorage.setItem('accessToken', data.accessToken)

            const user = await apiInstance.get(PROFILE)
            setLoading(false)
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

    const handleRoleChange = (event) => {
        setEmployeeId('')
        setRole(event.target.value)
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
                            Sign up
                        </Typography>
                    </Box>
                    <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                        <LockOutlinedIcon />
                    </Avatar>
                </Box>
                <Box
                    component="form"
                    noValidate
                    onSubmit={handleSubmit}
                    sx={{ mt: 3 }}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                autoComplete="given-name"
                                name="first_name"
                                required
                                disabled={loading}
                                fullWidth
                                id="firstName"
                                label="First Name"
                                autoFocus
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                required
                                fullWidth
                                id="lastName"
                                disabled={loading}
                                label="Last Name"
                                name="last_name"
                                autoComplete="family-name"
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                required
                                fullWidth
                                disabled={loading}
                                id="organization"
                                label="Organization"
                                name="organization"
                                autoComplete="organization"
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                required
                                disabled={loading}
                                fullWidth
                                id="username"
                                label="Username"
                                name="username"
                                autoComplete="username"
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <FormControl disabled={loading} fullWidth>
                                <InputLabel id="demo-simple-select-label">
                                    Role
                                </InputLabel>
                                <Select
                                    fullWidth
                                    required
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    value={role}
                                    label="Age"
                                    onChange={handleRoleChange}>
                                    <MenuItem value={'student'}>
                                        Student
                                    </MenuItem>
                                    <MenuItem value={'teacher'}>
                                        Teacher
                                    </MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                required={role !== 'student'}
                                fullWidth
                                value={employee_id}
                                onChange={(event) =>
                                    setEmployeeId(event.target.value)
                                }
                                disabled={loading || role === 'student'}
                                id="employee_id"
                                label="Employee Id"
                                name="employee_id"
                                autoComplete="employee-id"
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                required
                                fullWidth
                                disabled={loading}
                                id="email"
                                label="Email Address"
                                name="email"
                                autoComplete="email"
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                required
                                disabled={loading}
                                fullWidth
                                name="password"
                                label="Password"
                                type="password"
                                id="password"
                                autoComplete="new-password"
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                required
                                disabled={loading}
                                fullWidth
                                name="confirm_password"
                                label="Confirm Password"
                                type="password"
                                id="confirm_password"
                                autoComplete="confirm-password"
                            />
                        </Grid>
                    </Grid>
                    <Button
                        type="submit"
                        fullWidth
                        disabled={loading}
                        variant="contained"
                        sx={{ position: 'relative', mt: 3, mb: 2 }}>
                        Sign Up
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
                    <Grid container justifyContent="center">
                        <Grid item>
                            <MUILink variant="body2">
                                <Link
                                    to="/auth/login"
                                    style={{ color: 'inherit' }}>
                                    Already have an account? Log in
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
