import { configureStore } from '@reduxjs/toolkit'
import authReducer from './auth/authSlice'
import keepReducer from './keeps/keepSlice'

export const store = configureStore({
  reducer: {
      users: authReducer,
      keeps: keepReducer
  },
})