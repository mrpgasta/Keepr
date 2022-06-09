import { configureStore } from '@reduxjs/toolkit'
import authReducer from './auth/authSlice'
import keepReducer from './keeps/keepSlice'
import thunkMiddleware from 'redux-thunk'
import { composeWithDevTools } from '@redux-devtools/extension'
import { applyMiddleware } from 'redux'

const composedEnhancer = composeWithDevTools(applyMiddleware(thunkMiddleware))

export const store = configureStore({
  reducer: {
      users: authReducer,
      keeps: keepReducer
  },
  composedEnhancer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false
    }),
})
