import React from 'react'
import {
    AddCircleOutlineRounded,
    EditOutlined,
    NavigateNext,
} from '@mui/icons-material'
import {
    Fab,
    Box,
    Typography,
    Container,
    Hidden,
    Breadcrumbs,
    Link as MUILink,
    IconButton,
    Grid,
    LinearProgress,
} from '@mui/material'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'
import Slide from '@mui/material/Slide'
import { setNotification } from '../../../store/notification'
import { setUser, update } from '../../../store/auth'
import { apiInstance } from '../../../config/http_client'
import { UPDATE } from '../../../config/routes'

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />
})

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1)
}

function Page(props) {
    const user = useSelector((state) => state.auth.user)
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const [open, setOpen] = React.useState(false)
    const [loading, setLoading] = React.useState(false)
    const handleClickOpen = () => {
        setOpen(true)
    }

    const handleSubmit = async (event) => {
        event.preventDefault()
        setLoading(true)
        const data = new FormData(event.currentTarget)

        const body = {
            last_name: data.get('last_name'),
            first_name: data.get('first_name'),

            organization: data.get('organization'),
        }
        try {
            const { data } = await apiInstance.put(UPDATE, body)

            setLoading(false)
            handleClose()
            dispatch(update(data))

            dispatch(
                setNotification({
                    message: 'Profile Updated Successfully !',
                    severity: 'success',
                })
            )
        } catch (err) {
            console.log(err)
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

    const handleClose = () => {
        setOpen(false)
    }
    function handleClick(event) {
        event.preventDefault()
        console.info('You clicked a breadcrumb.')
    }

    const breadcrumbs = [
        <Typography variant="body1" color="primary">
            Profile
        </Typography>,
    ]

    return (
        <Container component="main" maxWidth="xl" sx={{ position: 'relative' }}>
            <Breadcrumbs
                separator={<NavigateNext fontSize="small" />}
                aria-label="breadcrumb">
                {breadcrumbs}
            </Breadcrumbs>

            <Container component="main" sx={{ display: 'flex', flex: '1' }}>
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        textAlign: 'left',
                        paddingTop: '20px',
                    }}>
                    <Typography
                        variant="h6"
                        sx={{ mt: 3, mb: 1, fontWeight: '600' }}>
                        Name
                    </Typography>
                    <Typography
                        variant="h6"
                        sx={{ mt: 1, mb: 1, fontWeight: '600' }}>
                        Username
                    </Typography>
                    <Typography
                        variant="h6"
                        sx={{ mt: 1, mb: 1, fontWeight: '600' }}>
                        Email
                    </Typography>
                    <Typography
                        variant="h6"
                        sx={{ mt: 1, mb: 1, fontWeight: '600' }}>
                        Role
                    </Typography>
                    {user.role === 'teacher' && (
                        <Typography
                            variant="h6"
                            sx={{ mt: 1, mb: 1, fontWeight: '600' }}>
                            Employee ID
                        </Typography>
                    )}
                    <Typography
                        variant="h6"
                        sx={{ mt: 1, mb: 1, fontWeight: '600' }}>
                        Organization
                    </Typography>
                    <Typography
                        variant="h6"
                        sx={{ mt: 1, mb: 1, fontWeight: '600' }}>
                        Password
                    </Typography>
                </Box>
                <Box
                    sx={{
                        display: 'flex',
                        flex: '1',
                        flexDirection: 'column',
                        textAlign: 'left',
                        paddingTop: '20px',
                        paddingLeft: '20px',
                    }}>
                    <Typography
                        variant="h6"
                        sx={{
                            mt: 3,
                            mb: 1,
                            fontWeight: '300',
                        }}>{`: ${user.first_name} ${user.last_name}`}</Typography>
                    <Typography
                        variant="h6"
                        sx={{
                            mt: 1,
                            mb: 1,
                            fontWeight: '300',
                        }}>{`: ${user.username}`}</Typography>
                    <Typography
                        variant="h6"
                        sx={{
                            mt: 1,
                            mb: 1,
                            fontWeight: '300',
                        }}>{`: ${user.email}`}</Typography>
                    <Typography
                        variant="h6"
                        sx={{
                            mt: 1,
                            mb: 1,
                            fontWeight: '300',
                        }}>{`: ${capitalizeFirstLetter(
                        user.role
                    )}`}</Typography>
                    {user.role === 'teacher' && (
                        <Typography
                            variant="h6"
                            sx={{
                                mt: 1,
                                mb: 1,
                                fontWeight: '300',
                            }}>{`:  ${user.employee_id}`}</Typography>
                    )}
                    <Typography
                        variant="h6"
                        sx={{
                            mt: 1,
                            mb: 1,
                            fontWeight: '300',
                        }}>{`: ${user.organization}`}</Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Typography
                            variant="h6"
                            sx={{
                                mt: 1,
                                mb: 1,
                                fontWeight: '300',
                            }}>{`: ***********`}</Typography>
                        <IconButton
                            onClick={() => navigate('/auth/forget_password')}
                            sx={{ ml: 2 }}>
                            <EditOutlined
                                color="secondary"
                                sx={{ cursor: 'pointer' }}
                            />
                        </IconButton>
                    </Box>
                </Box>
            </Container>

            <Hidden smDown>
                {
                    <Fab
                        sx={{ position: 'fixed', right: 50, bottom: 40 }}
                        onClick={handleClickOpen}
                        variant="extended"
                        color="secondary">
                        <EditOutlined sx={{ ml: 1, color: 'white', mr: 1 }} />
                        <Typography
                            color="inherit"
                            variant="button"
                            sx={{ color: 'white' }}>
                            Edit
                        </Typography>
                    </Fab>
                }
            </Hidden>
            <Hidden smUp>
                {
                    <Fab
                        sx={{ position: 'fixed', right: 60, bottom: 50 }}
                        onClick={handleClickOpen}
                        color="secondary">
                        <EditOutlined sx={{ ml: 1, color: 'white', mr: 1 }} />
                    </Fab>
                }
            </Hidden>
            <Dialog
                TransitionComponent={Transition}
                keepMounted
                open={open}
                onClose={handleClose}>
                <DialogTitle>Update Profile</DialogTitle>
                <DialogContent>
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
                                    variant="standard"
                                    disabled={loading}
                                    fullWidth
                                    defaultValue={user.first_name}
                                    id="firstName"
                                    label="First Name"
                                    autoFocus
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    required
                                    variant="standard"
                                    fullWidth
                                    defaultValue={user.last_name}
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
                                    variant="standard"
                                    fullWidth
                                    defaultValue={user.organization}
                                    id="organization"
                                    disabled={loading}
                                    label="Organization"
                                    name="organization"
                                    autoComplete="family-name"
                                />
                            </Grid>
                        </Grid>
                        <DialogActions sx={{ mt: 3 }}>
                            <Button
                                disabled={loading}
                                color="secondary"
                                onClick={handleClose}>
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                disabled={loading}
                                variant="contained"
                                sx={{ position: 'relative' }}>
                                Update
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
                        </DialogActions>
                    </Box>
                </DialogContent>
            </Dialog>
        </Container>
    )
}

export default Page
