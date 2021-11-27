import React from 'react'
import {
    AddCircleOutlineRounded,
    EditOutlined,
    NavigateNext,
    CheckCircleOutlineRounded,
    WarningAmberRounded,
    ScheduleRounded,
    UpcomingRounded,
    UpcomingOutlined,
    AssignmentIndOutlined,
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
    Divider,
    Chip,
    Toolbar,
    CircularProgress,
} from '@mui/material'
import { Link, useNavigate, useParams, Navigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemText from '@mui/material/ListItemText'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'
import Slide from '@mui/material/Slide'
import AdapterDateFns from '@mui/lab/AdapterDateFns'
import LocalizationProvider from '@mui/lab/LocalizationProvider'
import TimePicker from '@mui/lab/TimePicker'
import DateTimePicker from '@mui/lab/DateTimePicker'
import DesktopDatePicker from '@mui/lab/DesktopDatePicker'
import MobileDatePicker from '@mui/lab/MobileDatePicker'
import { setNotification } from '../../../store/notification'
import { setUser, update } from '../../../store/auth'
import { apiInstance } from '../../../config/http_client'
import {
    GET_CLASS,
    LEAVE_CLASS,
    JOIN_CLASS,
    SCHEDULE_CLASS,
    SEND_NOTIFICATION,
    GET_NOTIFICATION,
    DELETE_NOTIFICATION,
} from '../../../config/routes'

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />
})

function Page(props) {
    const user = useSelector((state) => state.auth.user)
    const { id } = useParams()
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const [classData, setClass] = React.useState(null)
    const [fetching, setFetching] = React.useState(true)
    const [open, setOpen] = React.useState(false)
    const [schedule_dialog, setScheduleDialog] = React.useState(false)
    const [isMember, setIsMember] = React.useState(false)
    const [loading, setLoading] = React.useState(false)
    const [value, setValue] = React.useState(new Date())
    const [notifications, setNotifications] = React.useState([])
    const [fetchingNotification, setNotificationFetching] = React.useState(true)
    const handleClickOpen = () => {
        setOpen(true)
    }

    const fetchNotification = async () => {
        setNotificationFetching(true)
        try {
            const { data } = await apiInstance.get(GET_NOTIFICATION + id + '/')
            setNotifications(data)
            setNotificationFetching(false)
        } catch (err) {
            setNotificationFetching(false)
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

    const fetch = async () => {
        setFetching(true)
        try {
            const { data } = await apiInstance.get(GET_CLASS + `${id}/`)
            const { classroom, member } = data
            setClass(classroom)
            if (member === 'true') {
                setIsMember(true)
            } else {
                setIsMember(false)
            }

            setFetching(false)
        } catch (err) {
            setFetching(false)
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
    React.useEffect(() => {
        fetch()
        fetchNotification()
    }, [])

    const handleSubmitJoin = async () => {
        if (classData === null) return
        setLoading(true)

        const body = {
            subject: classData.subject,
        }
        try {
            const { data } = await apiInstance.post(JOIN_CLASS, body)
            setLoading(false)
            handleClose()
            fetch()
            dispatch(
                setNotification({
                    message: 'Class Joined Successfully !',
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

    const handleLeave = async () => {
        setLoading(true)
        try {
            const { data } = await apiInstance.delete(LEAVE_CLASS + id + '/')
            dispatch(
                setNotification({
                    message: 'Class Left Successfully !',
                    severity: 'success',
                })
            )
            handleClose()

            navigate('/dashboard/')
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

    const scheduleClass = async (event) => {
        event.preventDefault()
        setLoading(true)
        const data = new FormData(event.currentTarget)

        const body = {
            topic: data.get('topic'),
            offline_strength: data.get('offline_strength'),
            start_time: value,
        }

        try {
            const { data } = await apiInstance.post(
                SCHEDULE_CLASS + id + '/',
                body
            )
            setLoading(false)

            handleCloseScheduleClass()
            dispatch(
                setNotification({
                    message: 'Class Scheduled Successfully !',
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

    const handleNotificationSent = async (event) => {
        event.preventDefault()
        setLoading(true)
        const data = new FormData(event.currentTarget)

        const body = {
            message: data.get('message'),
        }
        try {
            const { data } = await apiInstance.post(
                SEND_NOTIFICATION + id + '/',
                body
            )
            setLoading(false)
            fetchNotification()
            dispatch(
                setNotification({
                    message: 'Posted Successfully !',
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

    const handleNotificationDelete = async (notification_id) => {
        setLoading(true)
        try {
            const { data } = await apiInstance.delete(
                DELETE_NOTIFICATION + notification_id + '/'
            )
            setLoading(false)
            fetchNotification()
            dispatch(
                setNotification({
                    message: 'Posted Deleted Successfully !',
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

    const handleCloseScheduleClass = () => {
        setScheduleDialog(false)
    }
    function handleClick(event) {
        event.preventDefault()
        console.info('You clicked a breadcrumb.')
    }

    const breadcrumbs = [
        <MUILink color="primary">
            <Link to="/dashboard/" style={{ color: 'primary' }}>
                My Classes
            </Link>
        </MUILink>,
        <Typography variant="body1" color="primary">
            {classData ? classData.subject : 'Loading...'}
        </Typography>,
    ]

    return (
        <Container component="main" maxWidth="xl" sx={{ position: 'relative' }}>
            <Breadcrumbs
                separator={<NavigateNext fontSize="small" />}
                aria-label="breadcrumb">
                {breadcrumbs}
            </Breadcrumbs>

            {fetching === false && (
                <Toolbar sx={{ display: 'flex' }}>
                    <Typography
                        variant="h3"
                        sx={{
                            fontWeight: '600',
                            textAlign: 'left',
                            justifyContent: 'center',
                            mt: 3,
                            flexGrow: '1',
                        }}
                        color="text.secondary">
                        {classData.subject}
                    </Typography>
                    {user.role === 'student' && isMember && (
                        <Button
                            onClick={handleClickOpen}
                            color="error"
                            variant="contained">
                            {classData.verified
                                ? 'Leave Class'
                                : 'Withdraw Request'}
                        </Button>
                    )}
                    {user.role === 'student' && isMember === false && (
                        <Button
                            onClick={handleClickOpen}
                            color="success"
                            variant="contained">
                            Join Class
                        </Button>
                    )}
                </Toolbar>
            )}
            {fetching ? (
                <CircularProgress
                    color="secondary"
                    sx={{ mt: '30vh', width: '60px' }}
                    thickness={6}
                    size="4rem"
                />
            ) : classData ? (
                <React.Fragment>
                    <Container
                        component="main"
                        sx={{ display: 'flex', flex: '1' }}>
                        <Box
                            sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                textAlign: 'left',
                                paddingTop: '10px',
                            }}>
                            <Typography
                                variant="h6"
                                sx={{ mt: 1, mb: 1, fontWeight: '600' }}>
                                Tutor Name
                            </Typography>
                            <Typography
                                variant="h6"
                                sx={{ mb: 1, fontWeight: '600' }}>
                                Username
                            </Typography>
                            <Typography
                                variant="h6"
                                sx={{ mb: 1, fontWeight: '600' }}>
                                Organization
                            </Typography>
                            {user.role !== 'teacher' && (
                                <Typography
                                    variant="h6"
                                    sx={{ mb: 1, fontWeight: '600' }}>
                                    Status
                                </Typography>
                            )}
                        </Box>
                        <Box
                            sx={{
                                display: 'flex',
                                flex: '1',
                                flexDirection: 'column',
                                textAlign: 'left',
                                paddingTop: '10px',
                                paddingLeft: '20px',
                            }}>
                            <Typography
                                variant="h6"
                                sx={{
                                    mt: 1,
                                    mb: 1,
                                    fontWeight: '300',
                                }}>{`: ${classData.teacher_first_name} ${classData.teacher_last_name}`}</Typography>
                            <Typography
                                variant="h6"
                                sx={{
                                    mb: 1,
                                    fontWeight: '300',
                                }}>{`: ${classData.created_by}`}</Typography>
                            <Typography
                                variant="h6"
                                sx={{
                                    mb: 1,
                                    fontWeight: '300',
                                }}>{`: ${classData.teacher_organization}`}</Typography>
                            {user.role !== 'teacher' && (
                                <Typography
                                    variant="h6"
                                    sx={{ mb: 1, fontWeight: '300' }}>{`: ${
                                    isMember
                                        ? classData.verified
                                            ? 'Joined'
                                            : 'Requested'
                                        : 'Not Joined'
                                }`}</Typography>
                            )}
                        </Box>
                    </Container>
                    <Divider sx={{ mt: 3 }} width="100%" />
                    {user.role === 'teacher' && (
                        <Toolbar
                            sx={{
                                pt: 2,
                                pb: 2,
                                width: '100%',
                                display: 'flex',
                                flexWrap: 'wrap',
                                overflow: 'hidden',
                            }}>
                            <Chip
                                color={'warning'}
                                sx={{ m: 1 }}
                                onClick={() => {
                                    navigate('requests')
                                }}
                                variant={'filled'}
                                label="Requests"
                                deleteIcon={<WarningAmberRounded />}
                                onDelete={() => {
                                    navigate('requests')
                                }}
                            />
                            <Chip
                                color={'success'}
                                sx={{ m: 1 }}
                                onClick={() => {
                                    navigate('students')
                                }}
                                variant={'filled'}
                                label="Students"
                                deleteIcon={<CheckCircleOutlineRounded />}
                                onDelete={() => {
                                    navigate('students')
                                }}
                            />
                            <Chip
                                color={'info'}
                                sx={{ m: 1 }}
                                onClick={() => {
                                    setScheduleDialog(true)
                                }}
                                variant={'filled'}
                                label="Schedule Class"
                                deleteIcon={<ScheduleRounded />}
                                onDelete={() => {
                                    setScheduleDialog(true)
                                }}
                            />
                            <Chip
                                color={'info'}
                                sx={{ m: 1 }}
                                onClick={() => {
                                    navigate(
                                        `/dashboard/class/${id}/upcoming_classes/`
                                    )
                                }}
                                variant={'filled'}
                                label="Scheduled Classes"
                                deleteIcon={<UpcomingOutlined />}
                                onDelete={() => {
                                    navigate(
                                        `/dashboard/class/${id}/upcoming_classes/`
                                    )
                                }}
                            />
                            <Chip
                                color={'info'}
                                sx={{ m: 1 }}
                                onClick={() => {
                                    navigate(
                                        `/dashboard/class/${id}/assignments/`
                                    )
                                }}
                                variant={'filled'}
                                label="Assignments"
                                deleteIcon={<AssignmentIndOutlined />}
                                onDelete={() => {
                                    navigate(
                                        `/dashboard/class/${id}/assignments/`
                                    )
                                }}
                            />
                        </Toolbar>
                    )}

                    <Box
                        component="form"
                        onSubmit={handleNotificationSent}
                        sx={{
                            display: 'flex',
                            mt: 3,
                            flexDirection: 'column',
                        }}>
                        <TextField
                            multiline
                            name="message"
                            id="message"
                            rows={3}
                            disabled={loading}
                            placeholder="Post Something To Class...."
                            fullWidth></TextField>
                        <Button
                            sx={{ mt: 2, width: 'fit-content' }}
                            color="primary"
                            type="submit"
                            disabled={loading}
                            variant="contained">
                            Send Message
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
                    <Typography
                        variant="h5"
                        sx={{ textAlign: 'left', mt: 4, fontWeight: '600' }}>
                        Notifications
                    </Typography>
                    {fetchingNotification ? (
                        <CircularProgress
                            color="secondary"
                            sx={{ mt: 3 }}
                            size="2rem"
                        />
                    ) : notifications.length === 0 ? (
                        <Typography
                            variant="h6"
                            color="text.secondary"
                            sx={{ mt: 6, mb: 6 }}>
                            No Notifications
                        </Typography>
                    ) : (
                        <List
                            sx={{
                                width: '100%',
                                bgcolor: 'background.paper',
                            }}>
                            {notifications.map((value) => (
                                <React.Fragment>
                                    <ListItem alignItems="flex-start">
                                        <ListItemText
                                            primary={
                                                value.username +
                                                (value.username ===
                                                user.username
                                                    ? ' (You)'
                                                    : '')
                                            }
                                            secondary={
                                                <Box
                                                    sx={{
                                                        display: 'flex',
                                                        flexDirection: 'column',
                                                    }}>
                                                    <Typography
                                                        sx={{ mt: 1, mb: 1 }}
                                                        variant="body2"
                                                        color="text.primary">
                                                        {value.message}
                                                    </Typography>
                                                    <Typography variant="caption">{`Posted on: ${new Date(
                                                        value.posted_on
                                                    ).toDateString()} `}</Typography>
                                                    <br />
                                                    <Typography variant="caption">{`At: ${new Date(
                                                        value.posted_on
                                                    ).toTimeString()} `}</Typography>
                                                    {value.username ===
                                                        user.username && (
                                                        <Button
                                                            disabled={loading}
                                                            sx={{
                                                                width: 'fit-content',
                                                                mt: 1,
                                                            }}
                                                            onClick={() => {
                                                                handleNotificationDelete(
                                                                    value.notification_id
                                                                )
                                                            }}
                                                            variant="outlined"
                                                            color="error">
                                                            Delete Post
                                                        </Button>
                                                    )}
                                                </Box>
                                            }
                                        />
                                    </ListItem>
                                    <Divider component="li" />
                                </React.Fragment>
                            ))}
                        </List>
                    )}
                </React.Fragment>
            ) : (
                <Navigate to="/dashboard/"></Navigate>
            )}

            <Dialog
                TransitionComponent={Transition}
                keepMounted
                open={open}
                onClose={handleClose}>
                <DialogTitle>
                    {isMember
                        ? classData && classData.verified
                            ? 'Leave Class'
                            : 'Withdraw Request'
                        : 'Join Class'}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        {isMember
                            ? classData && classData.verified
                                ? 'Are you sure want to leave this class ?'
                                : 'Are you sure want to withdraw request from this class ?'
                            : 'Are you sure you want to join this class ?'}
                    </DialogContentText>
                </DialogContent>
                <DialogActions sx={{ mt: 3 }}>
                    <Button
                        disabled={loading}
                        color="secondary"
                        onClick={handleClose}>
                        Cancel
                    </Button>
                    <Button
                        onClick={isMember ? handleLeave : handleSubmitJoin}
                        disabled={loading}
                        variant="contained"
                        sx={{ position: 'relative' }}>
                        {isMember
                            ? classData && classData.verified
                                ? 'Leave'
                                : 'Withdraw'
                            : 'Join'}
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
            </Dialog>

            <Dialog
                TransitionComponent={Transition}
                keepMounted
                open={schedule_dialog}
                onClose={handleCloseScheduleClass}>
                <DialogTitle>Schedule Class</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Provide the below details to schedule your class.
                    </DialogContentText>
                    <Box
                        component="form"
                        noValidate
                        onSubmit={scheduleClass}
                        sx={{ mt: 3 }}>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <TextField
                                    autoComplete="given-name"
                                    name="topic"
                                    required
                                    variant="outlined"
                                    disabled={loading}
                                    fullWidth
                                    id="topic"
                                    label="Topic"
                                    autoFocus
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    required
                                    variant="outlined"
                                    fullWidth
                                    type={'number'}
                                    id="offline_strength"
                                    disabled={loading}
                                    label="Offline Strength"
                                    name="offline_strength"
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <LocalizationProvider
                                    dateAdapter={AdapterDateFns}>
                                    <DateTimePicker
                                        label="Date&Time picker"
                                        required
                                        id="offline_strength"
                                        fullWidth
                                        value={value}
                                        onChange={(newValue) => {
                                            setValue(newValue)
                                        }}
                                        variant="standard"
                                        name="start_time"
                                        minDateTime={new Date()}
                                        disabled={loading}
                                        renderInput={(params) => (
                                            <TextField {...params} />
                                        )}
                                    />
                                </LocalizationProvider>
                            </Grid>
                        </Grid>
                        <DialogActions sx={{ mt: 3 }}>
                            <Button
                                disabled={loading}
                                color="secondary"
                                onClick={handleCloseScheduleClass}>
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                disabled={loading}
                                variant="contained"
                                sx={{ position: 'relative' }}>
                                Schedule
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
