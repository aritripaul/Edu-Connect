import React from 'react'
import {
    AddCircleOutlineRounded,
    NavigateNext,
    AllInclusiveRounded,
    CheckCircleOutlineRounded,
    PendingActionsRounded,
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
} from '@mui/material'

import TextField from '@mui/material/TextField'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'
import Slide from '@mui/material/Slide'
import { useNavigate } from 'react-router-dom'
import { Link } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import art1 from '../../../assets/art1.jpg'
import art2 from '../../../assets/art2.jpg'
import art3 from '../../../assets/art3.jpg'
import art5 from '../../../assets/art5.jpg'
import { setNotification } from '../../../store/notification'
import { apiInstance } from '../../../config/http_client'
import { CREATE_CLASS, GET_CLASSES, JOIN_CLASS } from '../../../config/routes'
import './styles.css'
const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />
})

const images = [art1, art2, art3, art5]
const getImage = () => {
    return images[getRandomInt(4)]
}
const CardItem = (props) => (
    <Card onClick={props.handleClick} sx={{ maxWidth: 345, m: 2 }}>
        <CardActionArea>
            <CardMedia
                component="img"
                height="140"
                image={getImage()}
                alt="green iguana"
            />
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
                        {`Tutor: ${props.name}`}
                    </Typography>
                    <Typography
                        sx={{ textAlign: 'left' }}
                        className="description-text1small"
                        variant="caption"
                        color="text.secondary">
                        {`Username: ${props.username}`}
                    </Typography>
                    {props.role !== 'teacher' && (
                        <Typography
                            sx={{ textAlign: 'left' }}
                            className="description-text1small"
                            variant="caption"
                            color="text.secondary">
                            {`Status: ${props.joined ? 'Joined' : 'Requested'}`}
                        </Typography>
                    )}
                </Box>
            </CardContent>
        </CardActionArea>
    </Card>
)

function getRandomInt(max) {
    return Math.floor(Math.random() * max)
}

function Page(props) {
    const user = useSelector((state) => state.auth.user)
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [filter, setFilter] = React.useState('all')
    const [classes, setClasses] = React.useState([])
    const [class_loading, setClassLoading] = React.useState(true)
    const [open, setOpen] = React.useState(false)
    const [open_join, setOpenJoin] = React.useState(false)
    const [loading, setLoading] = React.useState(false)

    const fetch = async () => {
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

    React.useEffect(() => {
        fetch()
    }, [])

    const handleClickOpen = () => {
        setOpen(true)
    }
    const handleClose = () => {
        setOpen(false)
    }
    const handleClickOpenJoin = () => {
        setOpenJoin(true)
    }
    const handleCloseJoin = () => {
        setOpenJoin(false)
    }

    const handleSubmitJoin = async (event) => {
        event.preventDefault()
        setLoading(true)
        const data = new FormData(event.currentTarget)

        const body = {
            subject: data.get('class_name'),
        }
        try {
            const { data } = await apiInstance.post(JOIN_CLASS, body)
            setLoading(false)
            handleCloseJoin()
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
    const handleSubmit = async (event) => {
        event.preventDefault()
        setLoading(true)
        const data = new FormData(event.currentTarget)

        const body = {
            subject: data.get('class_name'),
            description: data.get('description'),
        }
        try {
            const { data } = await apiInstance.post(CREATE_CLASS, body)
            setLoading(false)
            handleClose()
            fetch()
            dispatch(
                setNotification({
                    message: 'Class Created Successfully !',
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
    function handleClick(event) {
        event.preventDefault()
    }

    const isExist = () => {
        return classes.filter((value) => {
            if (filter === 'all') return true
            else if (filter === 'requested' && value.verified === false)
                return true
            else if (filter === 'joined' && value.verified === true) return true
            else return false
        }).length
    }

    const breadcrumbs = [
        <Typography variant="body1" color="primary">
            My Classes
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
                        color={filter === 'requested' ? 'info' : 'default'}
                        sx={{ m: 1 }}
                        onClick={() => {
                            setFilter('requested')
                        }}
                        variant={filter === 'requested' ? 'filled' : 'outlined'}
                        label="Requested"
                        deleteIcon={<PendingActionsRounded />}
                        onDelete={() => {
                            setFilter('requested')
                        }}
                    />
                    <Chip
                        color={filter === 'joined' ? 'info' : 'default'}
                        sx={{ m: 1 }}
                        onClick={() => {
                            setFilter('joined')
                        }}
                        variant={filter === 'joined' ? 'filled' : 'outlined'}
                        label="Joined"
                        deleteIcon={<CheckCircleOutlineRounded />}
                        onDelete={() => {
                            setFilter('joined')
                        }}
                    />
                </Toolbar>
            )}

            {class_loading ? (
                <CircularProgress
                    color="secondary"
                    sx={{ mt: '30vh', width: '60px' }}
                    thickness={6}
                    size="4rem"
                />
            ) : classes.length === 0 || isExist() === 0 ? (
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
                    {classes
                        .filter((value) => {
                            if (filter === 'all') return true
                            else if (
                                filter === 'requested' &&
                                value.verified === false
                            )
                                return true
                            else if (
                                filter === 'joined' &&
                                value.verified === true
                            )
                                return true
                            else return false
                        })
                        .map((val) => (
                            <Grid sm={6} xs={12} md={4} lg={3} xl={3} item>
                                <CardItem
                                    handleClick={() => {
                                        navigate(`/dashboard/class/${val.id}`)
                                    }}
                                    name={
                                        val.teacher_first_name +
                                        ' ' +
                                        val.teacher_last_name
                                    }
                                    joined={val.verified}
                                    username={val.created_by}
                                    role={user.role}
                                    title={val.subject}
                                    description={val.description}
                                    ns={val.number_of_students}></CardItem>
                            </Grid>
                        ))}
                </Grid>
            )}

            <Hidden smDown>
                {user.role === 'teacher' ? (
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
                            Create Class
                        </Typography>
                    </Fab>
                ) : (
                    <Fab
                        onClick={handleClickOpenJoin}
                        sx={{ position: 'fixed', right: 50, bottom: 40 }}
                        variant="extended"
                        color="secondary"
                        aria-label="Join Class">
                        <AddCircleOutlineRounded
                            sx={{ ml: 1, color: 'white', mr: 1 }}
                        />
                        <Typography
                            color="inherit"
                            variant="button"
                            sx={{ color: 'white' }}>
                            Join Class
                        </Typography>
                    </Fab>
                )}
            </Hidden>
            <Hidden smUp>
                {user.role === 'teacher' ? (
                    <Fab
                        onClick={handleClickOpen}
                        sx={{ position: 'fixed', right: 60, bottom: 50 }}
                        aria-label="Create Class"
                        color="secondary">
                        <AddCircleOutlineRounded
                            color="inherit"
                            sx={{ ml: 1, color: 'white', mr: 1 }}
                        />
                    </Fab>
                ) : (
                    <Fab
                        onClick={handleClickOpenJoin}
                        sx={{ position: 'fixed', right: 60, bottom: 50 }}
                        color="secondary"
                        aria-label="Join Class">
                        <AddCircleOutlineRounded
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
                    <DialogTitle>New Class</DialogTitle>

                    <DialogContent>
                        <DialogContentText>
                            Provide the below details to create your class. Note
                            that class name should be unique.
                        </DialogContentText>
                        <Box
                            component="form"
                            noValidate
                            onSubmit={handleSubmit}
                            sx={{ mt: 3 }}>
                            <Grid container spacing={2}>
                                <Grid item xs={12}>
                                    <TextField
                                        autoComplete="given-name"
                                        name="class_name"
                                        required
                                        variant="standard"
                                        disabled={loading}
                                        fullWidth
                                        id="class_name"
                                        label="Class Name"
                                        autoFocus
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        required
                                        variant="standard"
                                        fullWidth
                                        id="description"
                                        disabled={loading}
                                        label="Description"
                                        name="description"
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
                    </DialogContent>
                </Dialog>
            )}

            {user.role === 'student' && (
                <Dialog
                    TransitionComponent={Transition}
                    keepMounted
                    open={open_join}
                    onClose={handleCloseJoin}>
                    <DialogTitle>Join Class</DialogTitle>

                    <DialogContent>
                        <DialogContentText>
                            Ask your teacher for the class name and enter here.
                        </DialogContentText>
                        <Box
                            component="form"
                            noValidate
                            onSubmit={handleSubmitJoin}
                            sx={{ mt: 3 }}>
                            <Grid container spacing={2}>
                                <Grid item xs={12}>
                                    <TextField
                                        autoComplete="given-name"
                                        name="class_name"
                                        required
                                        variant="standard"
                                        disabled={loading}
                                        fullWidth
                                        id="class_name"
                                        label="Class Name"
                                        autoFocus
                                    />
                                </Grid>
                            </Grid>
                            <DialogActions sx={{ mt: 3 }}>
                                <Button
                                    disabled={loading}
                                    color="secondary"
                                    onClick={handleCloseJoin}>
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={loading}
                                    variant="contained"
                                    sx={{ position: 'relative' }}>
                                    Join
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
