import * as React from 'react'
import PropTypes from 'prop-types'
import AppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import CssBaseline from '@mui/material/CssBaseline'
import Divider from '@mui/material/Divider'
import Drawer from '@mui/material/Drawer'
import IconButton from '@mui/material/IconButton'
import InboxIcon from '@mui/icons-material/MoveToInbox'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import MailIcon from '@mui/icons-material/Mail'
import MenuIcon from '@mui/icons-material/Menu'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import Hidden from '@mui/material/Hidden'
import { WEBSITE_NAME } from '../../config/consts'
import {
    AccountCircleRounded,
    AssignmentIndRounded,
    DarkModeRounded,
    ExitToAppRounded,
    ForumRounded,
    GroupOutlined,
    LightModeRounded,
    LogoutRounded,
    UpcomingRounded,
} from '@mui/icons-material'
import { useDispatch, useSelector } from 'react-redux'
import { toggleDarkMode } from '../../store/settings'
import ClassIcon from '@mui/icons-material/Class'
import { Navigate, useNavigate } from 'react-router-dom'
import { setUser } from '../../store/auth'
const drawerWidth = 240

function ResponsiveDrawer(props) {
    const { window } = props
    const [mobileOpen, setMobileOpen] = React.useState(false)
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const user = useSelector((state) => state.auth.user)
    const mode = useSelector((state) => state.settings.mode)
    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen)
    }

    const student = [
        {
            name: 'My Classes',
            url: '/',
            type: 1,
            icon: <ClassIcon />,
        },
        {
            name: 'Assignments',
            url: '/assignments',
            type: 1,
            icon: <AssignmentIndRounded />,
        },
        {
            name: 'Upcoming Classes',
            url: '/upcoming_classes',
            type: 1,
            icon: <UpcomingRounded />,
        },

        {
            name: 'Public Forum',
            url: '/public_forum',
            type: 2,
            icon: <ForumRounded />,
        },
    ]

    const teacher = [
        {
            name: 'My Classes',
            url: '/',
            type: 1,
            icon: <ClassIcon />,
        },
        {
            name: 'Assignments',
            url: '/assignments',
            type: 1,
            icon: <AssignmentIndRounded />,
        },
        {
            name: 'Upcoming Classes',
            url: '/upcoming_classes',
            type: 1,
            icon: <UpcomingRounded />,
        },
        {
            name: 'Public Forum',
            url: '/public_forum',
            type: 2,
            icon: <ForumRounded />,
        },
    ]

    const list = user.role === 'teacher' ? teacher : student

    const drawer = (
        <div>
            <Toolbar>
                <Typography
                    variant="h6"
                    onClick={() => {
                        navigate('/')
                    }}
                    sx={{ fontWeight: '600', cursor: 'pointer' }}
                    color="text.secondary">
                    {WEBSITE_NAME}
                </Typography>
            </Toolbar>
            <Divider />
            <List>
                {list
                    .filter((val) => val.type === 1)
                    .map((value, index) => (
                        <ListItem
                            onClick={() => {
                                navigate('/dashboard' + value.url)
                            }}
                            button
                            key={value.name}>
                            <ListItemIcon>{value.icon}</ListItemIcon>
                            <ListItemText primary={value.name} />
                        </ListItem>
                    ))}
            </List>
            <Divider />
            <List>
                {list
                    .filter((val) => val.type === 2)
                    .map((value, index) => (
                        <ListItem
                            onClick={() => {
                                navigate('/dashboard' + value.url)
                            }}
                            button
                            key={value.name}>
                            <ListItemIcon>{value.icon}</ListItemIcon>
                            <ListItemText primary={value.name} />
                        </ListItem>
                    ))}
                <ListItem
                    onClick={() => {
                        localStorage.removeItem('accessToken')
                        dispatch(setUser(null))
                    }}
                    button
                    key={'logout'}>
                    <ListItemIcon>
                        <LogoutRounded />
                    </ListItemIcon>
                    <ListItemText primary={'Log Out'} />
                </ListItem>
            </List>
        </div>
    )

    const container =
        window !== undefined ? () => window().document.body : undefined

    return (
        <Box sx={{ display: 'flex' }}>
            <CssBaseline />
            <AppBar
                position="fixed"
                sx={{
                    width: { md: `calc(100% - ${drawerWidth}px)` },
                    ml: { md: `${drawerWidth}px` },
                }}>
                <Toolbar
                    sx={{ position: 'relative', display: 'flex', flex: '1' }}>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        edge="start"
                        onClick={handleDrawerToggle}
                        sx={{ mr: 2, display: { md: 'none' } }}>
                        <MenuIcon />
                    </IconButton>
                    <Hidden mdUp>
                        <Typography
                            sx={{ fontWeight: '600', cursor: 'pointer' }}
                            variant="h6"
                            onClick={() => {
                                navigate('/')
                            }}
                            noWrap
                            component="div">
                            {WEBSITE_NAME}
                        </Typography>
                    </Hidden>
                    <Box
                        sx={{
                            position: 'absolute',
                            right: 20,
                            height: '100%',
                            display: 'flex',
                            flexGrow: 1,
                            justifyContent: 'flex-end',
                            paddingLeft: '20px',
                            alignItems: 'center',
                        }}>
                        {mode === 'light' ? (
                            <IconButton
                                color="inherit"
                                onClick={() => {
                                    dispatch(toggleDarkMode(true))
                                }}>
                                <DarkModeRounded />
                            </IconButton>
                        ) : (
                            <IconButton
                                color="inherit"
                                onClick={() => {
                                    dispatch(toggleDarkMode(false))
                                }}>
                                <LightModeRounded />
                            </IconButton>
                        )}
                        <IconButton
                            aria-label="Profile"
                            sx={{ ml: 3, mr: 3 }}
                            color="inherit"
                            onClick={() => {
                                navigate('/dashboard/profile')
                            }}>
                            <AccountCircleRounded />
                        </IconButton>
                    </Box>
                </Toolbar>
            </AppBar>
            <Box
                component="nav"
                sx={{ width: { md: drawerWidth }, flexShrink: { sm: 0 } }}
                aria-label="mailbox folders">
                {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
                <Drawer
                    container={container}
                    variant="temporary"
                    open={mobileOpen}
                    onClick={handleDrawerToggle}
                    onClose={handleDrawerToggle}
                    ModalProps={{
                        keepMounted: true, // Better open performance on mobile.
                    }}
                    sx={{
                        display: { xs: 'block', sm: 'block', md: 'none' },
                        '& .MuiDrawer-paper': {
                            boxSizing: 'border-box',
                            width: drawerWidth,
                        },
                    }}>
                    {drawer}
                </Drawer>
                <Drawer
                    variant="permanent"
                    sx={{
                        display: { sm: 'none', xs: 'none', md: 'block' },
                        '& .MuiDrawer-paper': {
                            boxSizing: 'border-box',
                            width: drawerWidth,
                        },
                    }}
                    open>
                    {drawer}
                </Drawer>
            </Box>
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    p: 1,
                    width: {
                        md: `calc(100% - ${drawerWidth}px)`,
                        sm: `calc(100% - ${drawerWidth}px)`,
                    },
                }}>
                <Toolbar />

                {props.children}
            </Box>
        </Box>
    )
}

ResponsiveDrawer.propTypes = {
    /**
     * Injected by the documentation to work in an iframe.
     * You won't need it on your project.
     */
    window: PropTypes.func,
}

export default ResponsiveDrawer
