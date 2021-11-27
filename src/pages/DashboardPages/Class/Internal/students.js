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
import { GET_CLASS, GET_REQUESTS, VERIFY } from '../../../../config/routes'

const CardItem = (props) => (
    <Card onClick={props.handleClick} sx={{ maxWidth: 340, m: 2 }}>
        <CardContent>
            <Typography
                sx={{ textAlign: 'left' }}
                className="description-text1small"
                variant="caption"
                color="text.secondary">
                {`Name: ${props.name}`}
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
                {`Organization: ${props.organization}`}
            </Typography>
        </CardContent>
    </Card>
)

function Page(props) {
    const user = useSelector((state) => state.auth.user)
    const dispatch = useDispatch()
    const { id } = useParams()

    const [fetching, setFetching] = React.useState(true)
    const [classData, setClass] = React.useState(null)
    const [students, setStudents] = React.useState([])
    const fetch = async () => {
        setFetching(true)
        try {
            const { data } = await apiInstance.get(GET_CLASS + `${id}/`)
            const { classroom, member } = data
            const res = await apiInstance.get(
                GET_REQUESTS + id + '/?verified=true'
            )

            setStudents(res.data.verification)
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
            Students
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
            ) : students.length === 0 ? (
                <Typography
                    variant="h4"
                    color="text.secondary"
                    sx={{ fontWeight: '600', mt: '30vh' }}>
                    No Students Found
                </Typography>
            ) : (
                <Grid
                    container
                    sx={{
                        paddingTop: '30px',
                        width: '100%',
                        paddingBottom: '30px',
                    }}>
                    {students.map((val) => (
                        <Grid sm={6} xs={12} md={5} lg={4} xl={4} item>
                            <CardItem
                                name={val.firstname + ' ' + val.lastname}
                                username={val.username}
                                userId={val.id}
                                organization={val.organization}></CardItem>
                        </Grid>
                    ))}
                </Grid>
            )}
        </Container>
    )
}

export default Page
