import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import useScrollTrigger from '@mui/material/useScrollTrigger'

import Button from '@mui/material/Button'
import SwipeableDrawer from '@mui/material/SwipeableDrawer'
import Slide from '@mui/material/Slide'
import PropTypes from 'prop-types'
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import Hidden from '@mui/material/Hidden'
import { useDispatch, useSelector } from 'react-redux'
import { setUser } from '../../store/auth'
import { setNotification } from '../../store/notification'
import {
    IconButton,
    List,
    ListItem,
    Box,
    Divider,
    ListItemText,
} from '@mui/material'
import { Menu } from '@mui/icons-material'
function HideOnScroll(props) {
    const { children, window } = props
    // Note that you normally won't need to set the window ref as useScrollTrigger
    // will default to window.
    // This is only being set here because the demo is in an iframe.
    const trigger = useScrollTrigger({
        target: window ? window() : undefined,
    })

    return (
        <Slide appear={false} direction="down" in={!trigger}>
            {children}
        </Slide>
    )
}

HideOnScroll.propTypes = {
    children: PropTypes.element.isRequired,
    /**
     * Injected by the documentation to work in an iframe.
     * You won't need it on your project.
     */
    window: PropTypes.func,
}

function ElevationScroll(props) {
    const { children, window } = props

    // Note that you normally won't need to set the window ref as useScrollTrigger
    // will default to window.
    // This is only being set here because the demo is in an iframe.
    const trigger = useScrollTrigger({
        disableHysteresis: true,
        threshold: 0,
        target: window ? window() : undefined,
    })

    return React.cloneElement(children, {
        elevation: trigger ? 4 : 0,
    })
}

ElevationScroll.propTypes = {
    children: PropTypes.element.isRequired,
    /**
     * Injected by the documentation to work in an iframe.
     * You won't need it on your project.
     */
    window: PropTypes.func,
}

function Header(props) {
    const [open, setOpen] = useState(false)
    const navigate = useNavigate()
    const user = useSelector((state) => state.auth.user)
    const dispatch = useDispatch()
    const route = (path) => {
        navigate(path)
    }
    const toggleDrawer = (open) => (event) => {
        if (
            event &&
            event.type === 'keydown' &&
            (event.key === 'Tab' || event.key === 'Shift')
        ) {
            return
        }
        setOpen(open)
    }

    const list = (anchor) => (
        <Box
            sx={{ width: 250 }}
            role="presentation"
            onClick={toggleDrawer(false)}
            onKeyDown={toggleDrawer(false)}>
            <List>
                {[
                    { name: 'WhyUs?', url: '#whyus' },
                    { name: 'Features', url: '#features' },
                    { name: 'Contact Us', url: '#contact' },
                ].map((text, index) => (
                    <ListItem
                        onClick={() => {
                            toggleDrawer(false)
                            window.location.href = text.url
                        }}
                        button
                        key={text.name}>
                        <ListItemText
                            disableTypography
                            color=""
                            primary={
                                <Typography
                                    color="inherit"
                                    sx={{ fontWeight: '600' }}>
                                    {text.name}
                                </Typography>
                            }
                        />
                    </ListItem>
                ))}
            </List>
            <Divider />
            <List>
                {user ? (
                    <ListItem
                        onClick={() => {
                            toggleDrawer(false)
                            navigate('/dashboard')
                        }}
                        button>
                        <ListItemText
                            disableTypography
                            color="primary"
                            primary={
                                <Typography
                                    color="primary"
                                    sx={{ fontWeight: '600' }}>
                                    Dashboard
                                </Typography>
                            }
                        />
                    </ListItem>
                ) : (
                    <ListItem
                        onClick={() => {
                            toggleDrawer(false)
                            navigate('/auth/login')
                        }}
                        button>
                        <ListItemText
                            disableTypography
                            color="primary"
                            primary={
                                <Typography
                                    color="primary"
                                    sx={{ fontWeight: '600' }}>
                                    Login
                                </Typography>
                            }
                        />
                    </ListItem>
                )}
                {user && (
                    <ListItem
                        onClick={() => {
                            toggleDrawer(false)
                            localStorage.removeItem('accessToken')
                            dispatch(setUser(null))
                            dispatch(
                                setNotification({
                                    message: 'Logged Out!',
                                    severity: 'success',
                                })
                            )
                        }}
                        button
                        key={'logout'}>
                        <ListItemText
                            disableTypography
                            color="secondary"
                            primary={
                                <Typography
                                    color="secondary"
                                    sx={{ fontWeight: '600' }}>
                                    Logout
                                </Typography>
                            }
                        />
                    </ListItem>
                )}
            </List>
        </Box>
    )

    return (
        <React.Fragment>
            <ElevationScroll {...props}>
                <AppBar color="inherit">
                    <Toolbar>
                        <Typography
                            color="text.secondary"
                            variant="h5"
                            sx={{
                                fontWeight: '600',
                                flexGrow: 1,
                                textAlign: 'left',
                            }}>
                            Edu Connect
                        </Typography>
                        <Hidden mdDown>
                            <Button
                                style={{ margin: '0px 15px' }}
                                color="inherit"
                                onClick={() => {
                                    window.location.href = '#whyus'
                                }}>
                                Why Us?
                            </Button>
                            <Button
                                style={{ margin: '0px 15px' }}
                                color="inherit"
                                onClick={() => {
                                    window.location.href = '#features'
                                }}>
                                Features
                            </Button>
                            <Button
                                style={{ margin: '0px 15px' }}
                                color="inherit"
                                onClick={() => {
                                    window.location.href = '#contact'
                                }}>
                                Contact Us
                            </Button>
                            {user ? (
                                <Button
                                    style={{ margin: '0px 15px' }}
                                    variant="contained"
                                    color="primary"
                                    onClick={() => {
                                        route('/dashboard')
                                    }}>
                                    Dashboard
                                </Button>
                            ) : (
                                <Button
                                    style={{ margin: '0px 15px' }}
                                    variant="contained"
                                    color="primary"
                                    onClick={() => {
                                        route('auth/login')
                                    }}>
                                    Login
                                </Button>
                            )}

                            {user && (
                                <Button
                                    style={{
                                        margin: '0px 15px',
                                        color: 'white',
                                    }}
                                    variant="contained"
                                    color="secondary"
                                    onClick={() => {
                                        localStorage.removeItem('accessToken')
                                        dispatch(setUser(null))
                                        dispatch(
                                            setNotification({
                                                message: 'Logged Out!',
                                                severity: 'success',
                                            })
                                        )
                                    }}>
                                    Logout
                                </Button>
                            )}
                        </Hidden>
                        <Hidden mdUp>
                            <IconButton
                                onClick={toggleDrawer(true)}
                                color="secondary">
                                <Menu color="secondary" />
                            </IconButton>
                        </Hidden>
                    </Toolbar>
                </AppBar>
            </ElevationScroll>

            <SwipeableDrawer
                anchor={'right'}
                open={open}
                onClose={toggleDrawer(false)}
                onOpen={toggleDrawer(true)}>
                {list('left')}
            </SwipeableDrawer>
        </React.Fragment>
    )
}

export default Header
