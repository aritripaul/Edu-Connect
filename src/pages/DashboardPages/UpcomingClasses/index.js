import React from 'react'
import {
    AddCircleOutlineRounded,
    NavigateNext,
    AllInclusiveRounded,
    CheckCircleOutlineRounded,
    PendingActionsRounded,
    UploadFileRounded,
    DownloadRounded,
    ContactSupportOutlined,
} from '@mui/icons-material'
import {
    Toolbar,
    Button,
    Fab,
    Box,
    Typography,
    Card,
    Chip,
    CardActionArea,
    CardMedia,
    CardActions,
    CardContent,
    Grid,
    Container,
    Hidden,
    Breadcrumbs,
    LinearProgress,
    Link as MUILink,
    CircularProgress,
} from '@mui/material'
import { DataGrid } from '@mui/x-data-grid'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'
import Slide from '@mui/material/Slide'
import { useNavigate, useParams } from 'react-router-dom'
import { Link } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { setNotification } from '../../../store/notification'
import { apiInstance } from '../../../config/http_client'
import {
    DELETE_SCHEDULED_CLASS,
    GET_CLASS,
    GET_ATTENDANCE,
    GET_SCHEDULED_CLASS,
    ATTEND_CLASS,
    REMOVE_ATTENDANCE,
} from '../../../config/routes'

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />
})

const CardItemTeacher = (props) => (
    <Card onClick={props.handleClick} sx={{ maxWidth: 340, m: 2 }}>
        <CardContent>
            <Typography
                sx={{ textAlign: 'left' }}
                className="description-text1small"
                variant="caption"
                color="text.secondary">
                {`Topic: ${props.topic}`}
            </Typography>
            <Typography
                sx={{ textAlign: 'left' }}
                className="description-text1small"
                variant="caption"
                color="text.secondary">
                {`Start Date: ${new Date(props.start_time).toDateString()}`}
            </Typography>
            <Typography
                sx={{ textAlign: 'left' }}
                className="description-text1small"
                variant="caption"
                color="text.secondary">
                {`Start Time: ${new Date(props.start_time).toTimeString()}`}
            </Typography>
        </CardContent>
        <CardActions>
            <Button
                disabled={props.loading}
                onClick={() => {
                    props.route(`/dashboard/meet/${props.of}/${props.class_id}`)
                }}>
                Start Now
            </Button>
            <Button
                onClick={() => {
                    props.handleAction(props.topic, props.class_id)
                }}
                disabled={props.loading}>
                Cancel Class
            </Button>
            <Button
                onClick={() => {
                    props.route(
                        `/dashboard/class/${props.of}/upcoming_classes/attendance/${props.class_id}/`
                    )
                }}
                disabled={props.loading}>
                More
            </Button>
        </CardActions>
    </Card>
)

const CardItemStudent = (props) => (
    <Card onClick={props.handleClick} sx={{ maxWidth: 340, m: 2 }}>
        <CardContent>
            <Typography
                sx={{ textAlign: 'left' }}
                className="description-text1small"
                variant="caption"
                color="text.secondary">
                {`Topic: ${props.topic}`}
            </Typography>
            <Typography
                sx={{ textAlign: 'left' }}
                className="description-text1small"
                variant="caption"
                color="text.secondary">
                {`Start Date: ${new Date(props.start_time).toDateString()}`}
            </Typography>
            <Typography
                sx={{ textAlign: 'left' }}
                className="description-text1small"
                variant="caption"
                color="text.secondary">
                {`Start Time: ${new Date(props.start_time).toTimeString()}`}
            </Typography>
        </CardContent>
        <CardActions>
            <Button
                disabled={props.loading}
                onClick={() => {
                    props.route(`/dashboard/meet/${props.of}/${props.class_id}`)
                }}>
                Start Now
            </Button>
            {props.attending_offline ? (
                <Button
                    onClick={() => {
                        props.handleActionDelete(props.class_id)
                    }}
                    disabled={props.loading}>
                    Cancel Offline Attendance
                </Button>
            ) : (
                <Button
                    onClick={() => {
                        props.handleAction(props.class_id, props.of)
                    }}
                    disabled={props.loading}>
                    Attend Offline
                </Button>
            )}
        </CardActions>
    </Card>
)

function Page(props) {
    const user = useSelector((state) => state.auth.user)
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [fetching, setFetching] = React.useState(true)
    const [loading, setLoading] = React.useState(false)
    const [open, setOpen] = React.useState(false)
    const [remaining, setRemaining] = React.useState(0)
    const [selected, setSelect] = React.useState({
        class_id: null,
        schedule_id: null,
    })
    const [classes, setClasses] = React.useState([])
    const fetch = async () => {
        setFetching(true)
        try {
            const res = await apiInstance.get(GET_SCHEDULED_CLASS)

            setClasses(res.data.scheduled_classes)

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
    }, [])

    const route = (to) => {
        navigate(to)
    }

    const handleClose = () => {
        setOpen(false)
    }

    const fetch_availability = async (schedule_id, class_id) => {
        setLoading(true)
        try {
            const { data } = await apiInstance.get(GET_ATTENDANCE + schedule_id)
            const remain = data.offline_availability

            setRemaining(remain)
            setLoading(false)
        } catch (err) {
            setLoading(false)
            handleClose()
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

    const selectItem = (schedule_id, class_id) => {
        setSelect({ schedule_id, class_id })
        handleClickOpen()
        fetch_availability(schedule_id, class_id)
    }
    const handleClickOpen = () => {
        setOpen(true)
    }

    const handleAction = async (topic, class_id) => {
        setLoading(true)

        try {
            const { data } = await apiInstance.delete(
                DELETE_SCHEDULED_CLASS + class_id + '/'
            )

            const res = await apiInstance.get(GET_SCHEDULED_CLASS)

            setClasses(res.data.scheduled_classes)
            setLoading(false)
            dispatch(
                setNotification({
                    message: `${topic} removed successfully`,
                    severity: 'success',
                })
            )
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

    const handleAttendance = async () => {
        setLoading(true)
        try {
            const { data } = await apiInstance.post(
                ATTEND_CLASS + selected.schedule_id + '/'
            )
            const res = await apiInstance.get(GET_SCHEDULED_CLASS)
            setClasses(res.data.scheduled_classes)
            setLoading(false)
            handleClose()
            dispatch(
                setNotification({
                    message: `Attendance marked successfully`,
                    severity: 'success',
                })
            )
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

    const handleRemoveAttendance = async (schedule_id) => {
        setLoading(true)
        try {
            const { data } = await apiInstance.delete(
                REMOVE_ATTENDANCE + schedule_id + '/'
            )

            const res = await apiInstance.get(GET_SCHEDULED_CLASS)

            setClasses(res.data.scheduled_classes)
            setLoading(false)

            dispatch(
                setNotification({
                    message: `Attendance removed successfully`,
                    severity: 'success',
                })
            )
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

    const breadcrumbs = [
        <Typography variant="body1" color="primary">
            Upcoming Classes
        </Typography>,
    ]

    return (
        <Container component="main" maxWidth="xl" sx={{ position: 'relative' }}>
            <Breadcrumbs
                separator={<NavigateNext fontSize="small" />}
                aria-label="breadcrumb">
                {breadcrumbs}
            </Breadcrumbs>
            {fetching ? (
                <CircularProgress
                    color="secondary"
                    sx={{ mt: '30vh', width: '60px' }}
                    thickness={6}
                    size="4rem"
                />
            ) : classes.length === 0 ? (
                <Typography
                    variant="h4"
                    color="text.secondary"
                    sx={{ fontWeight: '600', mt: '30vh' }}>
                    No Classes Found
                </Typography>
            ) : (
                <Grid
                    container
                    sx={{
                        paddingTop: '30px',
                        width: '100%',
                        paddingBottom: '30px',
                    }}>
                    {classes.map((val) => (
                        <Grid sm={6} xs={12} md={5} lg={4} xl={4} item>
                            {user.role === 'teacher' ? (
                                <CardItemTeacher
                                    topic={val.topic}
                                    class_id={val.schedule_id}
                                    loading={loading}
                                    handleAction={handleAction}
                                    route={route}
                                    of={val.class_id}
                                    start_time={
                                        val.start_time
                                    }></CardItemTeacher>
                            ) : (
                                <CardItemStudent
                                    topic={val.topic}
                                    class_id={val.schedule_id}
                                    loading={loading}
                                    handleAction={selectItem}
                                    route={route}
                                    handleActionDelete={handleRemoveAttendance}
                                    attending_offline={val.attending_offline}
                                    of={val.class_id}
                                    start_time={
                                        val.start_time
                                    }></CardItemStudent>
                            )}
                        </Grid>
                    ))}
                </Grid>
            )}
            <Dialog
                TransitionComponent={Transition}
                keepMounted
                open={open}
                onClose={handleClose}>
                <DialogTitle>Attend Class Offline</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Book your offline seat if you can join class offline.
                    </DialogContentText>
                    {loading ? (
                        <CircularProgress color="secondary" thickness={2} />
                    ) : (
                        <Typography
                            sx={{ mt: 3 }}
                            variant="body1">{`Availability: ${remaining}`}</Typography>
                    )}
                </DialogContent>
                <DialogActions sx={{ mt: 3 }}>
                    <Button
                        disabled={loading}
                        color="secondary"
                        onClick={handleClose}>
                        Cancel
                    </Button>
                    <Button
                        onClick={handleAttendance}
                        disabled={loading}
                        variant="contained"
                        sx={{ position: 'relative' }}>
                        Attend
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
        </Container>
    )
}

export default Page
