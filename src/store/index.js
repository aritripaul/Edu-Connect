import { configureStore } from '@reduxjs/toolkit'
import auth from './auth'
import settings from './settings'
import notification from './notification'
export default configureStore({
    reducer: { auth, notification, settings },
})
