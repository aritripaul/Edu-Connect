import { createSlice } from '@reduxjs/toolkit'

export const settingsSlice = createSlice({
    name: 'settings',
    initialState: {
        mode: localStorage.getItem('themeMode')
            ? localStorage.getItem('themeMode')
            : 'light',
    },
    reducers: {
        toggleDarkMode: (state, action) => {
            if (action.payload) {
                state.mode = 'dark'
                localStorage.setItem('themeMode', 'dark')
            } else {
                state.mode = 'light'
                localStorage.setItem('themeMode', 'light')
            }
        },
    },
})

// Action creators are generated for each case reducer function
export const { toggleDarkMode } = settingsSlice.actions

export default settingsSlice.reducer
