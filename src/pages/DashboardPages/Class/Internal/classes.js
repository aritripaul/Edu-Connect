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

import { useNavigate, useParams } from 'react-router-dom'
import { Link } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { setNotification } from '../../../../store/notification'
import { apiInstance } from '../../../../config/http_client'
import {
    DELETE_SCHEDULED_CLASS,
    GET_CLASS,
    GET_REQUESTS,
    GET_SCHEDULED_CLASS,
    VERIFY,
} from '../../../../config/routes'

const CardItem = (props) => (
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
                        `/dashboard/class/${props.of}/upcoming_classes/attendance/${props.class_id}`
                    )
                }}
                disabled={props.loading}>
                More
            </Button>
        </CardActions>
    </Card>
)

function Page(props) {
    const user = useSelector((state) => state.auth.user)
    const dispatch = useDispatch()
    const { id } = useParams()
    const navigate = useNavigate()
    const [fetching, setFetching] = React.useState(true)
    const [classData, setClass] = React.useState(null)
    const [loading, setLoading] = React.useState(false)
    const [classes, setClasses] = React.useState([])
    const fetch = async () => {
        setFetching(true)
        try {
            const { data } = await apiInstance.get(GET_CLASS + `${id}/`)
            const { classroom, member } = data
            const res = await apiInstance.get(GET_SCHEDULED_CLASS + id)

            setClasses(res.data.scheduled_classes)
            setClass(classroom)

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
        if (user.role == 'teacher') fetch()
    }, [])
    const route = (to) => {
        navigate(to)
    }

    const handleAction = async (topic, class_id) => {
        setLoading(true)

        try {
            const { data } = await apiInstance.delete(
                DELETE_SCHEDULED_CLASS + class_id + '/'
            )

            const res = await apiInstance.get(GET_SCHEDULED_CLASS + id)

            setClasses(res.data.scheduled_classes)
            setLoading(false)
            dispatch(
                setNotification({
                    message: `${topic} removed successfully`,
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

    const breadcrumbs = [
        <MUILink color="primary">
            <Link to="/dashboard/" style={{ color: 'primary' }}>
                My Classes
            </Link>
        </MUILink>,
        <MUILink color="primary">
            <Link to={`/dashboard/class/${id}/`} style={{ color: 'primary' }}>
                {classData ? classData.subject : 'Loading...'}
            </Link>
        </MUILink>,
        <Typography variant="body1" color="primary">
            Classes
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
                            <CardItem
                                topic={val.topic}
                                class_id={val.schedule_id}
                                loading={loading}
                                handleAction={handleAction}
                                route={route}
                                of={val.class_id}
                                start_time={val.start_time}></CardItem>
                        </Grid>
                    ))}
                </Grid>
            )}
        </Container>
    )
}

export default Page
