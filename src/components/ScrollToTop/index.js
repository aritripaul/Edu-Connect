import React from 'react'
import Fab from '@mui/material/Fab'
import { makeStyles } from '@mui/styles'
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp'
import Zoom from '@mui/material/Zoom'
import useScrollTrigger from '@mui/material/useScrollTrigger'
const useStyles = makeStyles((theme) => ({
    root: {
        position: 'fixed',
        bottom: theme.spacing(2),
        right: theme.spacing(2),
        zIndex: 1300,
    },
}))

function ScrollTop(props) {
    const classes = useStyles()

    const trigger = useScrollTrigger({
        disableHysteresis: true,
        threshold: 100,
    })

    const handleClick = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    return (
        <Zoom in={trigger}>
            <div
                onClick={handleClick}
                role="presentation"
                className={classes.root}>
                <Fab
                    color="secondary"
                    size="small"
                    aria-label="scroll back to top">
                    <KeyboardArrowUpIcon sx={{ color: 'white' }} />
                </Fab>
            </div>
        </Zoom>
    )
}

export default ScrollTop
