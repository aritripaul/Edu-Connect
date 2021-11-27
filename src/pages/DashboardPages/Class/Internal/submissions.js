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
    CardContent,
    Grid,
    Container,
    Hidden,
    Breadcrumbs,
    LinearProgress,
    Link as MUILink,
    CircularProgress,
    CardActions,
} from '@mui/material'
import AdapterDateFns from '@mui/lab/AdapterDateFns'
import LocalizationProvider from '@mui/lab/LocalizationProvider'
import TimePicker from '@mui/lab/TimePicker'
import DateTimePicker from '@mui/lab/DateTimePicker'
import TextField from '@mui/material/TextField'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import Select from '@mui/material/Select'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'
import Slide from '@mui/material/Slide'
import { useNavigate, useParams } from 'react-router-dom'
import { Link } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { setNotification } from '../../../../store/notification'
import { apiInstance } from '../../../../config/http_client'
import {
    BASE_URL,
    DELETE_ASSIGNMENT,
    GET_CLASS,
    GET_ASSIGNMENT,
    GET_CLASSES,
    JOIN_CLASS,
    SUBMIT_ASSIGNMENT,
    UPDATE_ASSIGNMENT,
    SUBMISSIONS,
    GRADE_SUBMISSION,
} from '../../../../config/routes'

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />
})

const CardItem = (props) => (
    <Card onClick={props.handleClick} sx={{ maxWidth: 345, m: 2 }}>
        <CardContent>
            <Typography
                sx={{ fontWeight: '600' }}
                className="description-text1"
                gutterBottom
                variant="h5"
                component="div">
                {props.author_name}
            </Typography>
            <Typography
                gutterBottom
                className="description-text2"
                variant="body2"
                sx={{ textAlign: 'center' }}
                color="text.secondary">
                {props.organization}
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                <Typography
                    sx={{ textAlign: 'left' }}
                    className="description-text1small"
                    variant="caption"
                    color="text.secondary">
                    {`Submitted on: ${new Date(
                        props.submitted_on
                    ).toDateString()}`}
                </Typography>
                <Typography
                    sx={{ textAlign: 'left' }}
                    className="description-text1small"
                    variant="caption"
                    color="text.secondary">
                    {`At: ${new Date(props.submitted_on).toTimeString()}`}
                </Typography>
                <Typography
                    sx={{ textAlign: 'left' }}
                    className="description-text1small"
                    variant="caption"
                    color="text.secondary">
                    {`Username: ${props.username}`}
                </Typography>
                <Typography
                    sx={{ textAlign: 'left' }}
                    className="description-text1small"
                    variant="caption"
                    color="text.secondary">
                    {`Grade: ${
                        props.grade === null ? 'Ungraded' : props.grade
                    }`}
                </Typography>
            </Box>
        </CardContent>
        <CardActions>
            <Button
                href={`${BASE_URL}${props.content.slice(2)}`}
                target="_blank">
                View
            </Button>
            <Button
                onClick={() => {
                    props.handleGrade({
                        id: props.id,
                        author_name: props.author_name,
                        submitted_on: props.submitted_on,
                        content: props.content,
                        grade: props.grade,
                    })
                }}>
                {props.grade === null ? 'Grade' : 'Change Grade'}
            </Button>
        </CardActions>
    </Card>
)

function Page(props) {
    const user = useSelector((state) => state.auth.user)
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { id, class_id, topic } = useParams()
    const [class_loading, setClassLoading] = React.useState(false)

    const [classroom, setClassroom] = React.useState(null)
    const [submissions, setSubmissions] = React.useState([])
    const [submission_loading, setSubmissionLoading] = React.useState(true)

    const [loading, setLoading] = React.useState(false)
    const [open_assignment, setOpenAssignment] = React.useState(null)
    const fetchClasses = async () => {
        try {
            setClassLoading(true)

            const result = await apiInstance.get(GET_CLASS + class_id + '/')
            setClassroom(result.data.classroom)

            setClassLoading(false)
        } catch (err) {
            setClassLoading(false)
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

    const fetchSubmissions = async () => {
        setSubmissionLoading(true)
        try {
            const { data } = await apiInstance.get(SUBMISSIONS + id + '/')
            setSubmissions(data.submission)
            console.log(data.submission)
            setSubmissionLoading(false)
        } catch (err) {
            setLoading(false)
            setSubmissionLoading(false)
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
        fetchSubmissions()
        fetchClasses()
    }, [])

    const handleClickOpenAssignment = (item) => {
        setOpenAssignment(item)
    }
    const handleCloseAssignment = () => {
        setOpenAssignment(null)
    }

    const handleUpdate = async (event) => {
        event.preventDefault()
        setLoading(true)
        const data = new FormData(event.currentTarget)
        try {
            const body = {
                grade: data.get('grade'),
            }
            await apiInstance.put(
                GRADE_SUBMISSION + open_assignment.id + '/',
                body
            )
            setLoading(false)
            fetchSubmissions()
            dispatch(
                setNotification({
                    message: 'Submission Graded Successfully !',
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
            <Link
                to={`/dashboard/class/${class_id}/`}
                style={{ color: 'primary' }}>
                {classroom ? classroom.subject : 'Loading...'}
            </Link>
        </MUILink>,
        <MUILink color="primary">
            <Link
                to={`/dashboard/class/${class_id}/assignments`}
                style={{ color: 'primary' }}>
                Assignments
            </Link>
        </MUILink>,
        <Typography variant="body1" color="primary">
            {topic}
        </Typography>,
    ]

    return (
        <Container component="main" maxWidth="xl" sx={{ position: 'relative' }}>
            <Breadcrumbs
                separator={<NavigateNext fontSize="small" />}
                aria-label="breadcrumb">
                {breadcrumbs}
            </Breadcrumbs>

            {submission_loading ? (
                <CircularProgress
                    color="secondary"
                    sx={{ mt: '30vh', width: '60px' }}
                    thickness={6}
                    size="4rem"
                />
            ) : submissions.length === 0 ? (
                <Typography
                    variant="h4"
                    color="text.secondary"
                    sx={{ fontWeight: '600', mt: '30vh' }}>
                    No Submissions Found
                </Typography>
            ) : (
                <Grid
                    container
                    sx={{
                        paddingTop: '30px',
                        width: '100%',
                        paddingBottom: '30px',
                    }}>
                    {submissions.map((val) => (
                        <Grid sm={4} xs={12} md={3} lg={3} xl={3} item>
                            <CardItem
                                author_name={`${val.first_name} ${val.last_name}`}
                                organization={val.organization}
                                username={val.username}
                                id={val.submission_id}
                                handleGrade={handleClickOpenAssignment}
                                grade={val.grade}
                                content={val.content}
                                submitted_on={val.submitted_on}></CardItem>
                        </Grid>
                    ))}
                </Grid>
            )}

            {user.role === 'teacher' && open_assignment !== null && (
                <Dialog
                    TransitionComponent={Transition}
                    keepMounted
                    open={open_assignment !== null}
                    onClose={handleCloseAssignment}>
                    <DialogTitle>Submission</DialogTitle>

                    <DialogContent>
                        <DialogContentText>
                            Provide the below details to update assignment.
                        </DialogContentText>
                        <Typography
                            sx={{ textAlign: 'left' }}
                            className="description-text1small"
                            variant="body2"
                            gutterBottom
                            color="text.secondary">
                            {`Submitted on: ${new Date(
                                open_assignment.submitted_on
                            ).toDateString()}`}
                        </Typography>
                        <Typography
                            sx={{ textAlign: 'left' }}
                            className="description-text1small"
                            variant="body2"
                            gutterBottom
                            color="text.secondary">
                            {`At: ${new Date(
                                open_assignment.submitted_on
                            ).toTimeString()}`}
                        </Typography>
                        <Typography
                            sx={{ textAlign: 'left' }}
                            className="description-text1small"
                            variant="body2"
                            gutterBottom
                            color="text.secondary">
                            {`By: ${open_assignment.author_name}`}
                        </Typography>

                        <Box
                            component="form"
                            onSubmit={handleUpdate}
                            noValidate
                            sx={{ mt: 3 }}>
                            <Grid container spacing={2}>
                                <Grid item xs={12}>
                                    <TextField
                                        required
                                        variant="standard"
                                        fullWidth
                                        variant="outlined"
                                        sx={{ mb: 1 }}
                                        id="grade"
                                        defaultValue={
                                            open_assignment.grade === null
                                                ? ''
                                                : open_assignment.grade
                                        }
                                        disabled={loading}
                                        label="Grade"
                                        name="grade"
                                    />
                                </Grid>
                            </Grid>
                            <Button
                                href={`${BASE_URL}${open_assignment.content.slice(
                                    2
                                )}`}
                                target="_blank">
                                View Submission
                            </Button>

                            <DialogActions sx={{ mt: 3 }}>
                                <Button
                                    disabled={loading}
                                    color="secondary"
                                    onClick={handleCloseAssignment}>
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={loading}
                                    variant="contained"
                                    sx={{ position: 'relative' }}>
                                    Grade
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
            )}
        </Container>
    )
}

export default Page
