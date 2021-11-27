import { createSlice } from '@reduxjs/toolkit'

export const notificationSlice = createSlice({
    name: 'notification',
    initialState: {
        open: false,
        message: '',
        severity: '', // error, warning, info, success
    },
    reducers: {
        setNotification: (state, action) => {
            state.message = action.payload.message
            state.severity = action.payload.severity
            state.open = true
        },
        closeNotification: (state) => {
            state.open = false
        },
    },
})

// Action creators are generated for each case reducer function
export const { setNotification, closeNotification } = notificationSlice.actions

export default notificationSlice.reducer
