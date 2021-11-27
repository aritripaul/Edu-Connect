import React from 'react'
import { useNavigate } from 'react-router-dom'
import not_found from '../../assets/not_found.svg'
import { Container, Typography, Box, Button } from '@mui/material'
function Page(props) {
    const navigate = useNavigate()
    return (
        <Container
            component="main"
            sx={{
                height: '100vh',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                flex: '1',
            }}>
            <img style={{ width: '60%' }} src={not_found}></img>
            <Box sx={{ mt: 7 }}>
                <Typography
                    sx={{ fontWeight: '600' }}
                    variant="h4"
                    color="inherit">
                    Page Not Found
                </Typography>
                <Button
                    sx={{ mt: 5 }}
                    color="primary"
                    variant="contained"
                    onClick={() => {
                        navigate('/')
                    }}>
                    Home
                </Button>
            </Box>
        </Container>
    )
}

export default Page
