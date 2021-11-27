import { createSlice } from '@reduxjs/toolkit'

export const authSlice = createSlice({
    name: 'auth',
    initialState: {
        user: null,
        loading: true,
    },
    reducers: {
        setUser: (state, action) => {
            state.user = action.payload
            state.loading = false
        },
        logout: (state) => {
            state.user = null
            state.loading = false
        },
        update: (state, action) => {
            if (state.user)
                state.user = {
                    ...state.user,
                    first_name: action.payload.first_name,
                    last_name: action.payload.last_name,
                    organization: action.payload.organization,
                }
        },
        verify: (state, action) => {
            if (state.user)
                state.user = { ...state.user, verified: action.payload }
            state.loading = false
        },
        authLoading: (state, action) => {
            state.loading = action.payload
        },
    },
})

// Action creators are generated for each case reducer function
export const { setUser, logout, verify, authLoading, update } =
    authSlice.actions

export default authSlice.reducer
