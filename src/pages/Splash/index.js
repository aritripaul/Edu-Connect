import React from 'react'
import { Container, Typography, LinearProgress, Box } from '@mui/material'
import { WEBSITE_NAME } from '../../config/consts'
import CssBaseline from '@mui/material/CssBaseline'
function Page(props) {
    return (
        <Container component="main" maxWidth="xs">
            <CssBaseline />
            <Box
                sx={{
                    height: '100vh',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}>
                <Typography
                    variant="h2"
                    color="text.secondary"
                    sx={{ fontWeight: '600' }}>
                    {WEBSITE_NAME}
                </Typography>
                <LinearProgress
                    color="secondary"
                    sx={{ width: '50%', mt: '50px' }}></LinearProgress>
            </Box>
        </Container>
    )
}

export default Page
