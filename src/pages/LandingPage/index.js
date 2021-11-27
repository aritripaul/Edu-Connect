import React, { useState } from 'react'

import CssBaseline from '@mui/material/CssBaseline'
import Box from '@mui/material/Box'
import { makeStyles } from '@mui/styles'
import Button from '@mui/material/Button'
import Container from '@mui/material/Container'
import Typography from '@mui/material/Typography'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Grid from '@mui/material/Grid'
import LinearProgress from '@mui/material/LinearProgress'
import TextField from '@mui/material/TextField'
import CardMedia from '@mui/material/CardMedia'
import Footer from '../../components/Footer'
import Header from '../../components/Headers/general'
import Learning from '../../assets/learning.svg'
import AllInOne from '../../assets/all-in-one.svg'
import BuiltForCollaboration from '../../assets/built-for-collaboration.svg'
import EasyToUse from '../../assets/easy-to-use.svg'
import VideoCall from '../../assets/video_call.svg'
import AccessFromAnyWhere from '../../assets/access-from-anywhere.svg'
import LearningImage from '../../assets/learning-image.jpg'
import Schedule from '../../assets/schedule.svg'
import NotificationImage from '../../assets/notification.svg'
import SecureImage from '../../assets/secure.svg'
import { SEND_MESSAGE } from '../../config/routes'
import { apiInstance } from '../../config/http_client'
import { setNotification } from '../../store/notification'
import { useDispatch } from 'react-redux'

const useStyles = makeStyles((theme) => ({
    secLeft: {
        width: '100%',
        display: 'flex',
        boxSizing: 'border-box',
        padding: '10px 30px',
        justifyContent: 'center',
        alignItems: 'center',
        [theme.breakpoints.down('xs')]: {
            flexDirection: 'column-reverse',
        },
    },
    secRight: {
        width: '100%',
        display: 'flex',
        boxSizing: 'border-box',
        padding: '10px 30px',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row-reverse',
        [theme.breakpoints.down('xs')]: {
            flexDirection: 'column',
        },
    },
}))

function Items(props) {
    let { image, title, content } = props
    return (
        <Box
            sx={{
                width: '100%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
            }}>
            <Card elevation={0} sx={{ maxWidth: 345 }}>
                <CardMedia
                    component="img"
                    height="140"
                    style={{ objectFit: 'contain', padding: '5px' }}
                    image={image}
                    alt="green iguana"
                />
                <CardContent>
                    <Typography gutterBottom variant="h5" component="div">
                        {title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        {content}
                    </Typography>
                </CardContent>
            </Card>
        </Box>
    )
}

function Page(props) {
    const classes = useStyles(props)
    const dispatch = useDispatch()
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (event) => {
        event.preventDefault()
        const data = new FormData(event.currentTarget)
        setLoading(true)
        const body = {
            email: data.get('email'),
            name: data.get('name'),
            message: data.get('message'),
        }

        try {
            const { data } = await apiInstance.post(SEND_MESSAGE, body)
            setLoading(false)
            dispatch(
                setNotification({
                    message: 'We received your message !',
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
    return (
        <React.Fragment>
            <Container component="main" maxWidth="lg">
                <CssBaseline />
                <Container maxWidth="md">
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                        }}>
                        <Header />

                        <Box
                            sx={{
                                display: 'flex',
                                height: '100vh',
                                alignItems: 'center',
                                flex: '1',
                                flexDirection: 'column',
                                justifyContent: 'center',
                            }}>
                            <Box
                                style={{
                                    display: 'flex',
                                    paddingTop: '20vh',
                                    flexDirection: 'column',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    flex: '1',
                                }}>
                                <Typography
                                    variant="h2"
                                    gutterBottom
                                    sx={{ textAlign: 'center' }}>
                                    Where Sharing of Knowledge Happens.
                                </Typography>
                                <Typography
                                    variant="body2"
                                    gutterBottom
                                    sx={{ textAlign: 'center' }}>
                                    Edu Connect is all-in-one platform for
                                    e-learning. It is easy-to-use and secure
                                    tool which helps teachers and students to
                                    connect and enrich the learning experiences
                                    together.
                                </Typography>
                            </Box>
                            <img
                                src={Learning}
                                style={{
                                    marginTop: '30px',
                                    width: '40%',
                                }}></img>
                        </Box>
                    </Box>
                </Container>
                <div id="whyus" />
                <Box style={{ margin: '150px 2px', width: '100%' }}>
                    <Grid container justifyContent="center">
                        <Grid
                            item
                            xs={12}
                            sm={6}
                            md={3}
                            lg={3}
                            xl={3}
                            justifyContent="center"
                            sx={{ padding: '7px' }}>
                            <Items
                                image={AllInOne}
                                title={'All in one'}
                                content={
                                    'Bring all your learning tools together and manage multiple classes in one central destination.'
                                }></Items>
                        </Grid>
                        <Grid
                            item
                            xs={12}
                            sm={6}
                            md={3}
                            lg={3}
                            xl={3}
                            sx={{ padding: '7px' }}>
                            <Items
                                image={BuiltForCollaboration}
                                title={'Built for collaboration'}
                                content={
                                    'Work simultaneously in the same document with the whole class or connect face-to-face.'
                                }></Items>
                        </Grid>
                        <Grid
                            item
                            xs={12}
                            sm={6}
                            md={3}
                            lg={3}
                            xl={3}
                            sx={{ padding: '7px' }}>
                            <Items
                                image={EasyToUse}
                                title={'Easy to use'}
                                content={
                                    'Anyone in your school community can get up and running with Classroom in minutes.'
                                }></Items>
                        </Grid>
                        <Grid
                            item
                            xs={12}
                            sm={6}
                            md={3}
                            lg={3}
                            xl={3}
                            sx={{ padding: '7px' }}>
                            <Items
                                image={AccessFromAnyWhere}
                                title={'Easy Access'}
                                content={
                                    'Empower teaching and learning from anywhere, on any device, and give your class more flexibility and mobility.'
                                }></Items>
                        </Grid>
                    </Grid>
                </Box>

                <Box style={{ margin: '100px 2px' }}>
                    <Grid container justifyContent="center">
                        <Grid item xs={12} maxWidth="md">
                            <Box
                                style={{
                                    display: 'flex',
                                    width: '100%',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                }}>
                                <img
                                    style={{ width: '80%', height: 'auto' }}
                                    src={LearningImage}></img>
                            </Box>
                        </Grid>
                    </Grid>
                </Box>
                <div id="feature" />
                <Box id="features" className={classes.secLeft}>
                    <Box
                        style={{
                            display: 'flex',
                            flex: '3',
                            padding: '10px 20px',
                            textAlign: 'left',
                            height: '100%',
                            flexDirection: 'column',
                        }}>
                        <Typography variant="h4" color="text.primary">
                            Video Call
                        </Typography>
                        <Typography
                            sx={{ mt: '25px' }}
                            variant="body1"
                            color="text.secondary">
                            {' '}
                            Connect with your class with the face-to-face online
                            video calling feature.
                        </Typography>
                    </Box>
                    <Box
                        style={{
                            display: 'flex',
                            flex: '2',
                            textAlign: 'left',
                        }}>
                        <img
                            src={VideoCall}
                            style={{ width: '80%', height: 'auto' }}></img>
                    </Box>
                </Box>

                <Box className={classes.secRight}>
                    <Box
                        style={{
                            display: 'flex',
                            flex: '3',
                            padding: '10px 20px',
                            textAlign: 'left',
                            height: '100%',
                            flexDirection: 'column',
                        }}>
                        <Typography variant="h4" color="text.primary">
                            Scheduler
                        </Typography>
                        <Typography
                            sx={{ mt: '25px' }}
                            variant="body1"
                            color="text.secondary">
                            Schedule your classes and let students know the
                            offline and online seat availability
                        </Typography>
                    </Box>
                    <Box
                        style={{
                            display: 'flex',
                            flex: '2',
                            textAlign: 'left',
                        }}>
                        <img
                            src={Schedule}
                            style={{ width: '80%', height: 'auto' }}></img>
                    </Box>
                </Box>

                <Box className={classes.secLeft}>
                    <Box
                        style={{
                            display: 'flex',
                            flex: '3',
                            padding: '10px 20px',
                            textAlign: 'left',
                            height: '100%',
                            flexDirection: 'column',
                        }}>
                        <Typography variant="h4" color="text.primary">
                            Get Notified
                        </Typography>
                        <Typography
                            sx={{ mt: '25px' }}
                            variant="body1"
                            color="text.secondary">
                            {' '}
                            Notify students about important class updates or
                            share study material in no time.
                        </Typography>
                    </Box>
                    <Box
                        style={{
                            display: 'flex',
                            flex: '2',
                            textAlign: 'left',
                        }}>
                        <img
                            src={NotificationImage}
                            style={{ width: '80%', height: 'auto' }}></img>
                    </Box>
                </Box>

                <Box className={classes.secRight}>
                    <Box
                        style={{
                            display: 'flex',
                            flex: '3',
                            padding: '10px 20px',
                            textAlign: 'left',
                            height: '100%',
                            flexDirection: 'column',
                        }}>
                        <Typography variant="h4" color="text.primary">
                            Be Secure
                        </Typography>
                        <Typography
                            sx={{ mt: '25px' }}
                            variant="body1"
                            color="text.secondary">
                            We provide security and privacy of the data shared
                            in class and make sure that authorize users can only
                            access them.
                        </Typography>
                    </Box>
                    <Box
                        style={{
                            display: 'flex',
                            flex: '2',
                            textAlign: 'left',
                        }}>
                        <img
                            src={SecureImage}
                            style={{ width: '80%', height: 'auto' }}></img>
                    </Box>
                </Box>

                <div id="contact" />
                <Box
                    id="contact"
                    style={{
                        margin: '100px 2px',
                        width: '100%',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}>
                    <Container maxWidth={'xs'}>
                        <Typography variant="h4" color="text.primary">
                            Contact Us
                        </Typography>
                        <Typography
                            variant="body1"
                            sx={{ mt: '25px' }}
                            color="text.secondary">
                            We would like to here from you !
                        </Typography>
                        <Box
                            component="form"
                            onSubmit={handleSubmit}
                            noValidate
                            sx={{ mt: 1 }}>
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                id="name"
                                label="Name"
                                name="name"
                                disabled={loading}
                                autoComplete="name"
                            />
                            <TextField
                                margin="normal"
                                required
                                disabled={loading}
                                fullWidth
                                name="email"
                                label="Email"
                                type="email"
                                id="email"
                                autoComplete="email"
                            />
                            <TextField
                                margin="normal"
                                required
                                disabled={loading}
                                fullWidth
                                name="message"
                                label="Message"
                                id="message"
                                multiline
                                rows={4}
                            />
                            <Button
                                type="submit"
                                fullWidth
                                disabled={loading}
                                color="secondary"
                                variant="contained"
                                sx={{ position: 'relative', mt: 3, mb: 2 }}>
                                Send
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
                    </Container>
                </Box>
            </Container>
            <Footer />
        </React.Fragment>
    )
}

export default Page
