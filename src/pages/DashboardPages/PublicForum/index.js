import React from 'react'
import { Container, Typography } from '@mui/material'
import under_construction from '../../../assets/under_construction.svg'
function Page(props) {
    return (
        <Container
            component="main"
            sx={{
                width: '100%',
                justifyContent: 'center',
                alignItems: 'center',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
            }}>
            <img
                src={under_construction}
                style={{
                    width: '50%',
                    height: 'auto',
                    marginTop: '100px',
                }}></img>
            <Typography
                sx={{ textAlign: 'center', mt: 6 }}
                maxWidth={'sm'}
                variant="h6">
                Work in progress
            </Typography>
            <Typography
                sx={{ textAlign: 'center', mt: 3 }}
                maxWidth={'sm'}
                variant="body1">
                Students and teacher can ask and solve each other doubts and
                even students from other organization can help in solving each
                other problems.
            </Typography>
        </Container>
    )
}

export default Page
