import React, { useEffect } from 'react'
import { JitsiMeeting } from '@jitsi/web-sdk'
import Container from '@mui/material/Container'
import { CircularProgress, Toolbar } from '@mui/material'
import { useSelector, useDispatch } from 'react-redux'
import { Navigate, useParams } from 'react-router'
import { setNotification } from '../../../store/notification'
import { apiInstance } from '../../../config/http_client'
import {
    CREATE_CLASS,
    GET_CLASSES,
    GET_DETAILS_SCHEDULE_CLASS,
    JOIN_CLASS,
} from '../../../config/routes'
function Page(props) {
    const { id, class_id } = useParams()
    const user = useSelector((state) => state.auth.user)

    const [class_loading, setClassLoading] = React.useState(true)
    const [decision, setDecision] = React.useState(false)
    const dispatch = useDispatch()
    const fetch = async () => {
        try {
            setClassLoading(true)
            const { data } = await apiInstance.get(GET_CLASSES)

            const result = await apiInstance.get(
                GET_DETAILS_SCHEDULE_CLASS + id
            )
            const req_id = result.data.class_id
            //console.log(req_id, class_id, id, data)
            const res = data.some(
                (val) =>
                    class_id === val.id &&
                    val.id === req_id &&
                    (user.role === 'teacher' || val.verified)
            )
            //console.log(res)
            setDecision(res)

            if (res === false) {
                dispatch(
                    setNotification({
                        message: 'You are not authorized to join this class',
                        severity: 'error',
                    })
                )
            }
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

    useEffect(() => {
        fetch()
    }, [])

    if (class_loading) {
        return (
            <CircularProgress
                color="secondary"
                sx={{ mt: '30vh', width: '60px' }}
                thickness={6}
                size="4rem"
            />
        )
    }
    //  else if (decision === false) {
    //     return <Navigate replace to="/dashboard/upcoming_classes" />
    // }
    return (
        <JitsiMeeting
            domain="meet.jit.si"
            roomName={id}
            userInfo={{ displayName: `${user.first_name} ${user.last_name}` }}
            getIFrameRef={(iframe) => {
                iframe.style.height = '90vh'
            }}
            spinner="circle"
            configOverwrite={{
                startWithAudioMuted: true,
                disableModeratorIndicator: true,
                startsScreenSharing: true,
                enableEmailInStats: false,
            }}
            onApiReady={(externalApi) => {}}
        />
    )
}

export default Page
