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
import { useNavigate } from 'react-router-dom'
import { Link } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { setNotification } from '../../../store/notification'
import { apiInstance } from '../../../config/http_client'
import {
    BASE_URL,
    CREATE_ASSIGNMENT,
    CREATE_CLASS,
    DELETE_ASSIGNMENT,
    DELETE_SUBMISSION,
    GET_ASSIGNMENT,
    GET_CLASSES,
    JOIN_CLASS,
    SUBMIT_ASSIGNMENT,
    UPDATE_ASSIGNMENT,
} from '../../../config/routes'
import './styles.css'
const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />
})

const CardItemStudent = (props) => (
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
                    {`Class: ${props.subject}`}
                </Typography>
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
                <Typography
                    sx={{ textAlign: 'left' }}
                    className="description-text1small"
                    variant="caption"
                    color="text.secondary">
                    {`Author: ${props.username}`}
                </Typography>
                <Typography
                    sx={{ textAlign: 'left' }}
                    className="description-text1small"
                    variant="caption"
                    color={'text.secondary'}>
                    {`Status: ${props.pending ? 'Pending' : 'Completed'}`}
                </Typography>
                <Typography
                    sx={{ textAlign: 'left' }}
                    className="description-text1small"
                    variant="caption"
                    color={'text.secondary'}>
                    {`Grade: ${props.grade ? props.grade : 'Not yet graded'}`}
                </Typography>
            </Box>
        </CardContent>
        <CardActions>
            {props.pending ? (
                <Button
                    disabled={props.loading}
                    onClick={() => {
                        props.handleSubmit({
                            subject: props.subject,
                            description: props.description,
                            ends: props.ends,
                            starts: props.starts,
                            content: props.content,
                            id: props.id,
                            name: props.title,
                        })
                    }}>
                    Submit
                </Button>
            ) : (
                <Button
                    disabled={props.loading}
                    onClick={() => {
                        props.handleDelete(props.submission_id)
                    }}>
                    Delete
                </Button>
            )}
        </CardActions>
    </Card>
)

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
                    {`Class: ${props.subject}`}
                </Typography>
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
                <MUILink
                    href={BASE_URL + props.content.slice(2)}
                    target="_blank"
                    sx={{ textAlign: 'left' }}
                    className="description-text1small"
                    variant="caption"
                    color="text.secondary">
                    {`Document`}
                </MUILink>
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
    const [filter, setFilter] = React.useState('all')
    const [class_loading, setClassLoading] = React.useState(false)
    const [classData, setClasses] = React.useState([])
    const [assignments, setAssignments] = React.useState([])
    const [assignment_loading, setAssignmentLoading] = React.useState(true)
    const [open, setOpen] = React.useState(false)
    const [selected_class, setSelectedClass] = React.useState(null)
    const [start_date, setStartDate] = React.useState(new Date())
    const [end_date, setEndDate] = React.useState(new Date())
    const [open_assignment, setOpenAssignment] = React.useState(null)
    const [uploaded_file, setUploadedFile] = React.useState(null)
    const [loading, setLoading] = React.useState(false)
    const [open_update_assignment, setOpenUpdateAssignment] =
        React.useState(null)
    const fetchClasses = async () => {
        try {
            setClassLoading(true)
            const { data } = await apiInstance.get(GET_CLASSES)
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
            const { data } = await apiInstance.get(GET_ASSIGNMENT)
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

    React.useEffect(() => {
        setUploadedFile(null)
    }, [open, open_assignment])

    const handleClickOpen = () => {
        setOpen(true)
    }
    const handleClose = () => {
        setOpen(false)
        setUploadedFile(null)
    }
    const handleClickOpenAssignment = (item) => {
        setOpenAssignment(item)
    }
    const handleCloseAssignment = () => {
        setOpenAssignment(null)
        setUploadedFile(null)
    }
    const handleClickOpenUpdateAssignment = (item) => {
        setOpenUpdateAssignment(item)
        setEndDate(item.ends)
    }
    const handleCloseUpdatesAssignment = () => {
        setOpenUpdateAssignment(null)
    }

    const handleSubmissionDelete = async (submission_id) => {
        setLoading(true)
        try {
            await apiInstance.delete(DELETE_SUBMISSION + submission_id + '/')
            setLoading(false)
            fetchAssignments()
            dispatch(
                setNotification({
                    message: 'Submission Deleted Successfully!',
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

    const handleSubmitAssignment = async (event) => {
        event.preventDefault()
        setLoading(true)

        try {
            const data = new FormData(event.currentTarget)
            const dataURI = await fileToDataUri(data.get('assignment_file'))
            const body = {
                assignment: dataURI,
            }

            await apiInstance.post(
                SUBMIT_ASSIGNMENT + open_assignment.id + '/',
                body
            )
            handleCloseAssignment()
            setLoading(false)
            fetchAssignments()
            dispatch(
                setNotification({
                    message: 'Submitted Successfully !',
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
    const fileToDataUri = (file) =>
        new Promise((resolve, reject) => {
            const reader = new FileReader()
            reader.onload = (event) => {
                resolve(event.target.result)
            }
            reader.readAsDataURL(file)
        })

    const handleSubmit = async (event) => {
        event.preventDefault()
        setLoading(true)

        if (selected_class === null) {
            setLoading(false)
            dispatch(
                setNotification({
                    message: 'Class is required',
                    severity: 'warning',
                })
            )
            return
        }
        try {
            const data = new FormData(event.currentTarget)
            const dataURI = await fileToDataUri(data.get('assignment_file'))
            const body = {
                assignment_name: data.get('assignment_name'),
                assignment: dataURI,
                description: data.get('description'),
                start_date,
                end_date,
            }

            await apiInstance.post(CREATE_ASSIGNMENT + selected_class, body)
            handleClose()
            setLoading(false)
            fetchAssignments()
            dispatch(
                setNotification({
                    message: 'Assignment Created Successfully !',
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
            handleCloseUpdatesAssignment()
            setLoading(false)
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

    const isEmpty = () => {
        if (filter === 'all') return assignments.length === 0
        else if (filter === 'pending') {
            return assignments.filter((val) => val.pending).length === 0
        } else {
            return assignments.filter((val) => !val.pending).length === 0
        }
    }

    const breadcrumbs = [
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

            {user.role === 'student' && (
                <Toolbar sx={{ p: 1 }}>
                    <Chip
                        color={filter === 'all' ? 'info' : 'default'}
                        sx={{ m: 1 }}
                        onClick={() => {
                            setFilter('all')
                        }}
                        variant={filter === 'all' ? 'filled' : 'outlined'}
                        label="All"
                        deleteIcon={<AllInclusiveRounded />}
                        onDelete={() => {
                            setFilter('all')
                        }}
                    />
                    <Chip
                        color={filter === 'pending' ? 'info' : 'default'}
                        sx={{ m: 1 }}
                        onClick={() => {
                            setFilter('pending')
                        }}
                        variant={filter === 'pending' ? 'filled' : 'outlined'}
                        label="Pending"
                        deleteIcon={<PendingActionsRounded />}
                        onDelete={() => {
                            setFilter('pending')
                        }}
                    />
                    <Chip
                        color={filter === 'completed' ? 'info' : 'default'}
                        sx={{ m: 1 }}
                        onClick={() => {
                            setFilter('completed')
                        }}
                        variant={filter === 'completed' ? 'filled' : 'outlined'}
                        label="Completed"
                        deleteIcon={<CheckCircleOutlineRounded />}
                        onDelete={() => {
                            setFilter('completed')
                        }}
                    />
                </Toolbar>
            )}

            {assignment_loading ? (
                <CircularProgress
                    color="secondary"
                    sx={{ mt: '30vh', width: '60px' }}
                    thickness={6}
                    size="4rem"
                />
            ) : assignments.length === 0 || isEmpty() ? (
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
                    {assignments
                        .filter((v) => {
                            if (filter === 'all') return true
                            else if (filter === 'pending') return v.pending
                            else return !v.pending
                        })
                        .map((val) => (
                            <Grid sm={4} xs={12} md={3} lg={3} xl={3} item>
                                {user.role === 'teacher' ? (
                                    <CardItemTeacher
                                        handleClick={() => {}}
                                        starts={val.start_date}
                                        ends={val.end_date}
                                        username={val.created_by}
                                        title={val.name}
                                        content={val.content}
                                        id={val.id}
                                        handleRoute={(title, assignment_id) => {
                                            navigate(
                                                `/dashboard/class/${val.class_id}/assignments/${title}/${assignment_id}`
                                            )
                                        }}
                                        handleUpdate={
                                            handleClickOpenUpdateAssignment
                                        }
                                        loading={loading}
                                        handleDelete={handleAssignmentDelete}
                                        subject={val.subject}
                                        description={val.description}
                                        ns={
                                            val.number_of_students
                                        }></CardItemTeacher>
                                ) : (
                                    <CardItemStudent
                                        handleSubmit={handleClickOpenAssignment}
                                        starts={val.start_date}
                                        ends={val.end_date}
                                        username={val.created_by}
                                        title={val.name}
                                        content={val.content}
                                        id={val.id}
                                        grade={val.grade}
                                        loading={loading}
                                        subject={val.subject}
                                        handleDelete={handleSubmissionDelete}
                                        submission_id={val.submission}
                                        pending={val.pending}
                                        description={val.description}
                                        ns={
                                            val.number_of_students
                                        }></CardItemStudent>
                                )}
                            </Grid>
                        ))}
                </Grid>
            )}

            <Hidden smDown>
                {user.role === 'teacher' && (
                    <Fab
                        onClick={handleClickOpen}
                        sx={{ position: 'fixed', right: 50, bottom: 40 }}
                        color="secondary"
                        variant="extended"
                        aria-label="Create Class">
                        <AddCircleOutlineRounded
                            color="inherit"
                            sx={{ ml: 1, color: 'white', mr: 1 }}
                        />
                        <Typography
                            color="inherit"
                            variant="button"
                            sx={{ color: 'white' }}>
                            Create Assignment
                        </Typography>
                    </Fab>
                )}
            </Hidden>
            <Hidden smUp>
                {user.role === 'teacher' && (
                    <Fab
                        onClick={handleClickOpen}
                        sx={{ position: 'fixed', right: 60, bottom: 50 }}
                        aria-label="Create Assignment"
                        color="secondary">
                        <AddCircleOutlineRounded
                            color="inherit"
                            sx={{ ml: 1, color: 'white', mr: 1 }}
                        />
                    </Fab>
                )}
            </Hidden>

            {user.role === 'teacher' && (
                <Dialog
                    TransitionComponent={Transition}
                    keepMounted
                    open={open}
                    onClose={handleClose}>
                    <DialogTitle>New Assignment</DialogTitle>

                    <DialogContent>
                        <DialogContentText>
                            Provide the below details to create assignment.
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
                                noValidate
                                onSubmit={handleSubmit}
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
                                            label="Assignment Name"
                                            name="assignment_name"
                                            autoComplete="family-name"
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={6} lg={6} xl={6}>
                                        <FormControl
                                            disabled={loading}
                                            required
                                            fullWidth>
                                            <InputLabel id="demo-simple-select-label">
                                                Class
                                            </InputLabel>
                                            <Select
                                                labelId="demo-simple-select-label"
                                                id="demo-simple-select"
                                                value={selected_class}
                                                label="Age"
                                                required
                                                onChange={(event) => {
                                                    setSelectedClass(
                                                        event.target.value
                                                    )
                                                }}>
                                                {classData.map((value) => (
                                                    <MenuItem value={value.id}>
                                                        {value.subject}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
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
                                                minDateTime={start_date}
                                                disabled={loading}
                                                renderInput={(params) => (
                                                    <TextField {...params} />
                                                )}
                                            />
                                        </LocalizationProvider>
                                    </Grid>
                                    <Grid item xs={12} md={6} lg={6} xl={6}>
                                        <LocalizationProvider
                                            dateAdapter={AdapterDateFns}>
                                            <DateTimePicker
                                                label="Start Date"
                                                required
                                                id="startDate"
                                                fullWidth
                                                value={start_date}
                                                onChange={(newValue) => {
                                                    setStartDate(newValue)
                                                }}
                                                variant="standard"
                                                name="start_time"
                                                minDateTime={new Date()}
                                                maxDateTime={end_date}
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
                                            rows={3}
                                            id="description"
                                            label="Description"
                                            autoFocus
                                        />
                                        <input
                                            accept="application/pdf,application/vnd.ms-excel,application/vnd.ms-excel,application/msword,text/plain,application/vnd.ms-powerpoint,.csv"
                                            style={{ display: 'none' }}
                                            onChange={(event) => {
                                                setUploadedFile(
                                                    event.target.files[0]
                                                )
                                            }}
                                            id="raised-button-file"
                                            name="assignment_file"
                                            type="file"
                                        />
                                        <label htmlFor="raised-button-file">
                                            <Button
                                                sx={{ mt: 1 }}
                                                color="primary"
                                                disabled={loading}
                                                variant="outlined"
                                                component="span">
                                                Upload
                                                <UploadFileRounded
                                                    sx={{ ml: 1 }}
                                                />
                                            </Button>
                                            {uploaded_file && (
                                                <Typography
                                                    variant="body2"
                                                    sx={{
                                                        mt: 1,
                                                        fontWeight: '600',
                                                    }}
                                                    color="text.secondary">
                                                    {uploaded_file.name}
                                                </Typography>
                                            )}
                                        </label>
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
                                        Create
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

            {user.role === 'student' && open_assignment && (
                <Dialog
                    TransitionComponent={Transition}
                    keepMounted
                    open={open_assignment !== null}
                    onClose={handleCloseAssignment}>
                    <DialogTitle>{`${open_assignment.name} (${open_assignment.subject})`}</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            {open_assignment.description}
                        </DialogContentText>
                        <Typography
                            sx={{ textAlign: 'left', mt: 5 }}
                            className="description-text1small"
                            variant="caption"
                            color="text.secondary">
                            {`Starts: ${new Date(open_assignment.starts)}`}
                        </Typography>

                        <Typography
                            sx={{ textAlign: 'left' }}
                            className="description-text1small"
                            variant="caption"
                            color="text.secondary">
                            {`Ends: ${new Date(open_assignment.ends)}`}
                        </Typography>
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
                                noValidate
                                onSubmit={handleSubmitAssignment}
                                sx={{ mt: 3 }}>
                                <Grid container spacing={2}>
                                    <Grid item xs={12} lg={6} md={6}>
                                        <Button
                                            href={`${BASE_URL}${open_assignment.content.slice(
                                                2
                                            )}`}
                                            target="_blank"
                                            variant="outlined"
                                            sx={{ m: 1 }}
                                            color="primary">
                                            Assignment
                                            <DownloadRounded sx={{ ml: 1 }} />
                                        </Button>
                                    </Grid>
                                    <Grid item xs={12} lg={6} md={6}>
                                        <input
                                            accept="application/pdf,application/vnd.ms-excel,application/vnd.ms-excel,application/msword,text/plain,application/vnd.ms-powerpoint,.csv"
                                            style={{ display: 'none' }}
                                            id="raised-button-file-submission"
                                            name="assignment_file"
                                            onChange={(event) => {
                                                setUploadedFile(
                                                    event.target.files[0]
                                                )
                                            }}
                                            type="file"
                                        />
                                        <label htmlFor="raised-button-file-submission">
                                            <Button
                                                sx={{ m: 1 }}
                                                color="primary"
                                                variant="outlined"
                                                component="span">
                                                Submit
                                                <UploadFileRounded
                                                    sx={{ ml: 1 }}
                                                />
                                            </Button>
                                            {uploaded_file && (
                                                <Typography
                                                    variant="body2"
                                                    sx={{
                                                        mt: 1,
                                                        fontWeight: '600',
                                                    }}
                                                    color="text.secondary">
                                                    {uploaded_file.name}
                                                </Typography>
                                            )}
                                        </label>
                                    </Grid>
                                </Grid>

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
                                        Submit
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
