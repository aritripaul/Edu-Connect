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
} from '../../../../config/routes'

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />
})

const CardItemTeacher = (props) => (
    <Card onClick={props.handleClick} sx={{ maxWidth: 345, m: 2 }}>
        <CardContent>
            <Typography
                sx={{ fontWeight: '600' }}
                className="description-text1"
                gutterBottom
                variant="h5"
                component="div">
                {props.title}
            </Typography>
            <Typography
                gutterBottom
                className="description-text2"
                variant="body2"
                color="text.secondary">
                {props.description}
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                <Typography
                    sx={{ textAlign: 'left' }}
                    className="description-text1small"
                    variant="caption"
                    color="text.secondary">
                    {`Starts: ${new Date(props.starts).toDateString()}`}
                </Typography>
                <Typography
                    sx={{ textAlign: 'left' }}
                    className="description-text1small"
                    variant="caption"
                    color="text.secondary">
                    {`At: ${new Date(props.starts).toTimeString()}`}
                </Typography>
                <Typography
                    sx={{ textAlign: 'left' }}
                    className="description-text1small"
                    variant="caption"
                    color="text.secondary">
                    {`Ends: ${new Date(props.ends).toDateString()}`}
                </Typography>
                <Typography
                    sx={{ textAlign: 'left' }}
                    className="description-text1small"
                    variant="caption"
                    color="text.secondary">
                    {`At: ${new Date(props.ends).toTimeString()}`}
                </Typography>
            </Box>
        </CardContent>
        <CardActions>
            <Button
                disabled={props.loading}
                onClick={() => {
                    props.handleRoute(props.title, props.id)
                }}>
                Submissions
            </Button>
            <Button
                disabled={props.loading}
                onClick={() => {
                    props.handleDelete(props.id)
                }}>
                Delete
            </Button>
            <Button
                disabled={props.loading}
                onClick={() => {
                    props.handleUpdate({
                        id: props.id,
                        name: props.title,
                        description: props.description,
                        ends: props.ends,
                        starts: props.starts,
                    })
                }}>
                Update
            </Button>
        </CardActions>
    </Card>
)

function Page(props) {
    const user = useSelector((state) => state.auth.user)
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { id } = useParams()
    const [class_loading, setClassLoading] = React.useState(false)
    const [classData, setClasses] = React.useState([])
    const [classroom, setClassroom] = React.useState(null)
    const [assignments, setAssignments] = React.useState([])
    const [assignment_loading, setAssignmentLoading] = React.useState(true)

    const [end_date, setEndDate] = React.useState(new Date())

    const [loading, setLoading] = React.useState(false)
    const [open_update_assignment, setOpenUpdateAssignment] =
        React.useState(null)
    const fetchClasses = async () => {
        try {
            setClassLoading(true)
            const { data } = await apiInstance.get(GET_CLASSES)
            const result = await apiInstance.get(GET_CLASS + id + '/')
            setClassroom(result.data.classroom)
            setClasses(data)
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

    const fetchAssignments = async () => {
        setAssignmentLoading(true)
        try {
            const { data } = await apiInstance.get(GET_ASSIGNMENT + id + '/')

            setAssignments(data.assignments)
            setAssignmentLoading(false)
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

    React.useEffect(() => {
        fetchAssignments()
        fetchClasses()
    }, [])

    const handleClickOpenUpdateAssignment = (item) => {
        setOpenUpdateAssignment(item)
        setEndDate(item.ends)
    }
    const handleCloseUpdatesAssignment = () => {
        setOpenUpdateAssignment(null)
    }

    const handleAssignmentDelete = async (assignment_id) => {
        setLoading(true)
        try {
            await apiInstance.delete(DELETE_ASSIGNMENT + assignment_id + '/')
            setLoading(false)
            fetchAssignments()
            dispatch(
                setNotification({
                    message: 'Assignment Deleted Successfully!',
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

    const handleUpdate = async (event) => {
        event.preventDefault()
        setLoading(true)
        const data = new FormData(event.currentTarget)
        try {
            const body = {
                name: data.get('assignment_name'),
                description: data.get('description'),
                end_date,
            }

            await apiInstance.put(
                UPDATE_ASSIGNMENT + open_update_assignment.id + '/',
                body
            )

            setLoading(false)
            handleCloseUpdatesAssignment()
            fetchAssignments()

            dispatch(
                setNotification({
                    message: 'Assignment Updated Successfully !',
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
                {classroom ? classroom.subject : 'Loading...'}
            </Link>
        </MUILink>,
        <Typography variant="body1" color="primary">
            Assignments
        </Typography>,
    ]

    return (
        <Container component="main" maxWidth="xl" sx={{ position: 'relative' }}>
            <Breadcrumbs
                separator={<NavigateNext fontSize="small" />}
                aria-label="breadcrumb">
                {breadcrumbs}
            </Breadcrumbs>

            {assignment_loading ? (
                <CircularProgress
                    color="secondary"
                    sx={{ mt: '30vh', width: '60px' }}
                    thickness={6}
                    size="4rem"
                />
            ) : assignments.length === 0 ? (
                <Typography
                    variant="h4"
                    color="text.secondary"
                    sx={{ fontWeight: '600', mt: '30vh' }}>
                    No assignments Found
                </Typography>
            ) : (
                <Grid
                    container
                    sx={{
                        paddingTop: '30px',
                        width: '100%',
                        paddingBottom: '30px',
                    }}>
                    {assignments.map((val) => (
                        <Grid sm={4} xs={12} md={3} lg={3} xl={3} item>
                            <CardItemTeacher
                                handleClick={() => {}}
                                starts={val.start_date}
                                ends={val.end_date}
                                content={val.content}
                                username={val.created_by}
                                title={val.name}
                                handleRoute={(title, assignment_id) => {
                                    navigate(
                                        `/dashboard/class/${id}/assignments/${title}/${assignment_id}`
                                    )
                                }}
                                id={val.id}
                                handleUpdate={handleClickOpenUpdateAssignment}
                                loading={loading}
                                handleDelete={handleAssignmentDelete}
                                subject={val.subject}
                                description={val.description}
                                ns={val.number_of_students}></CardItemTeacher>
                        </Grid>
                    ))}
                </Grid>
            )}

            {user.role === 'teacher' && open_update_assignment !== null && (
                <Dialog
                    TransitionComponent={Transition}
                    keepMounted
                    open={open_update_assignment !== null}
                    onClose={handleCloseUpdatesAssignment}>
                    <DialogTitle>Update Assignment</DialogTitle>

                    <DialogContent>
                        <DialogContentText>
                            Provide the below details to update assignment.
                        </DialogContentText>
                        {class_loading ? (
                            <CircularProgress
                                color="secondary"
                                sx={{ mt: '30vh', width: '60px' }}
                                thickness={6}
                                size="4rem"
                            />
                        ) : (
                            <Box
                                component="form"
                                onSubmit={handleUpdate}
                                noValidate
                                sx={{ mt: 3 }}>
                                <Grid container spacing={2}>
                                    <Grid item xs={12} md={6} lg={6} xl={6}>
                                        <TextField
                                            required
                                            variant="standard"
                                            fullWidth
                                            variant="outlined"
                                            sx={{ mb: 1 }}
                                            id="assignment_name"
                                            disabled={loading}
                                            defaultValue={
                                                open_update_assignment.name
                                            }
                                            label="Assignment Name"
                                            name="assignment_name"
                                            autoComplete="family-name"
                                        />
                                    </Grid>

                                    <Grid item xs={12} md={6} lg={6} xl={6}>
                                        <LocalizationProvider
                                            dateAdapter={AdapterDateFns}>
                                            <DateTimePicker
                                                label="End Date"
                                                required
                                                id="endDate"
                                                fullWidth
                                                value={end_date}
                                                onChange={(newValue) => {
                                                    setEndDate(newValue)
                                                }}
                                                variant="standard"
                                                name="start_time"
                                                minDateTime={
                                                    new Date(
                                                        open_update_assignment.starts
                                                    )
                                                }
                                                disabled={loading}
                                                renderInput={(params) => (
                                                    <TextField {...params} />
                                                )}
                                            />
                                        </LocalizationProvider>
                                    </Grid>

                                    <Grid item xs={12}>
                                        <TextField
                                            autoComplete="given-name"
                                            name="description"
                                            required
                                            variant="standard"
                                            disabled={loading}
                                            fullWidth
                                            variant="outlined"
                                            multiline
                                            defaultValue={
                                                open_update_assignment.description
                                            }
                                            rows={3}
                                            id="description"
                                            label="Description"
                                            autoFocus
                                        />
                                    </Grid>
                                </Grid>

                                <DialogActions sx={{ mt: 3 }}>
                                    <Button
                                        disabled={loading}
                                        color="secondary"
                                        onClick={handleCloseUpdatesAssignment}>
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
                        )}
                    </DialogContent>
                </Dialog>
            )}
        </Container>
    )
}

export default Page
