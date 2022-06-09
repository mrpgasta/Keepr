import { createSlice } from "@reduxjs/toolkit";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../configs/firebaseConfig";
import { useNavigate } from "react-router-dom"

const initialState = [];

const authSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    signUp: (state, action) => {
        createUserWithEmailAndPassword(auth, action.payload.email, action.payload.password)
            .then((response) => {
                console.log('Login Successful')
                sessionStorage.setItem('Auth Token', response._tokenResponse.refreshToken)
                })
            .catch((error) => {
                if (error.code === 'auth/email-already-in-use') {
                    console.log('Email Already in Use');
                }
            })
    },
    login: (state, action) => {
        signInWithEmailAndPassword(auth, action.payload.email, action.payload.password)
            .then((response) => {
                console.log('Login Successful')
                sessionStorage.setItem('Auth Token', response._tokenResponse.refreshToken)
                })
            .catch((error) => {
                console.log(error.code)
                if (error.code === 'auth/wrong-password') {
                    console.log('Please check the Password');
                }
                if (error.code === 'auth/user-not-found') {
                    console.log('Please check the Email');
                }
            })
    }
  }
});

export const { signUp, login } = authSlice.actions;
export default authSlice.reducer;