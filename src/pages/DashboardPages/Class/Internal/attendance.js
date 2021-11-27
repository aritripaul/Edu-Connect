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
import { TablePagination } from '@mui/material'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Paper from '@mui/material/Paper'

import { useNavigate, useParams } from 'react-router-dom'
import { Link } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { setNotification } from '../../../../store/notification'
import { apiInstance } from '../../../../config/http_client'
import {
    GET_DETAILS_SCHEDULE_CLASS,
    GET_CLASS,
    GET_ATTENDANCE,
} from '../../../../config/routes'

const columns = [
    { field: 'first_name', headerName: 'First name', width: 230 },
    { field: 'last_name', headerName: 'Last name', width: 230 },
    {
        field: 'username',
        headerName: 'Username',
        width: 230,
    },
    {
        field: 'organization',
        headerName: 'Organization',
        width: 260,
    },
]

function BasicTable(props) {
    const [rowsPerPage, setRowsPerPage] = React.useState(5)
    const [page, setPage] = React.useState(0)
    const handleChangePage = (event, newPage) => {
        setPage(newPage)
    }

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10))
        setPage(0)
    }
    const emptyRows =
        page > 0 ? Math.max(0, (1 + page) * rowsPerPage - props.rows.length) : 0
    return (
        <React.Fragment>
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell>First Name</TableCell>
                            <TableCell align="right">Last Name</TableCell>
                            <TableCell align="right">Username</TableCell>
                            <TableCell align="right">Organization</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {props.rows
                            .slice(
                                page * rowsPerPage,
                                page * rowsPerPage + rowsPerPage
                            )
                            .map((row) => (
                                <TableRow
                                    key={row.id}
                                    sx={{
                                        '&:last-child td, &:last-child th': {
                                            border: 0,
                                        },
                                    }}>
                                    <TableCell component="th" scope="row">
                                        {row.first_name}
                                    </TableCell>
                                    <TableCell align="right">
                                        {row.last_name}
                                    </TableCell>
                                    <TableCell align="right">
                                        {row.username}
                                    </TableCell>
                                    <TableCell align="right">
                                        {row.organization}
                                    </TableCell>
                                </TableRow>
                            ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={props.rows.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />
        </React.Fragment>
    )
}

function Page(props) {
    const user = useSelector((state) => state.auth.user)
    const dispatch = useDispatch()
    const { class_id, schedule_id } = useParams()
    const [fetching, setFetching] = React.useState(true)
    const [topic, setTopic] = React.useState(null)
    const [classData, setClass] = React.useState(null)
    const [online_students, setOnlineStudents] = React.useState([])
    const [offline_students, setOfflineStudents] = React.useState([])
    const fetch = async () => {
        setFetching(true)
        try {
            const { data } = await apiInstance.get(GET_CLASS + `${class_id}/`)
            const { classroom, member } = data
            const result = await apiInstance.get(
                GET_DETAILS_SCHEDULE_CLASS + schedule_id + '/'
            )
            const tp = result.data.topic
            const res = await apiInstance.get(GET_ATTENDANCE + schedule_id)

            setOfflineStudents(res.data.offline_students)
            setOnlineStudents(res.data.online_students)
            setClass(classroom)
            setTopic(tp)
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
            <Link
                to={`/dashboard/class/${class_id}/`}
                style={{ color: 'primary' }}>
                {classData ? classData.subject : 'Loading...'}
            </Link>
        </MUILink>,
        <MUILink color="primary">
            <Link
                to={`/dashboard/class/${class_id}/upcoming_classes`}
                style={{ color: 'primary' }}>
                {'Classes'}
            </Link>
        </MUILink>,
        <Typography variant="body1" color="primary">
            Students Details
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
            ) : online_students.length === 0 &&
              offline_students.length === 0 ? (
                <Typography
                    variant="h4"
                    color="text.secondary"
                    sx={{ fontWeight: '600', mt: '30vh' }}>
                    No Students Found
                </Typography>
            ) : (
                <Container sx={{ mt: 5 }}>
                    {offline_students.length > 0 && (
                        <React.Fragment>
                            <Typography
                                variant="h4"
                                sx={{
                                    fontWeight: '600',
                                    textAlign: 'left',
                                    mb: 2,
                                }}
                                color="text.secondary">
                                Offline Students
                            </Typography>
                            <BasicTable rows={offline_students} />
                        </React.Fragment>
                    )}
                    {online_students.length > 0 && (
                        <React.Fragment>
                            <Typography
                                variant="h4"
                                sx={{
                                    fontWeight: '600',
                                    textAlign: 'left',
                                    mb: 2,
                                    mt: 2,
                                }}
                                color="text.secondary">
                                Online Students
                            </Typography>
                            <BasicTable rows={online_students} />
                        </React.Fragment>
                    )}
                </Container>
            )}
        </Container>
    )
}

export default Page
