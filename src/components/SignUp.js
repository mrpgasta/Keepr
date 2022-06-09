import React from 'react'
import { useState } from "react"
import { useDispatch } from "react-redux"
import { Link, useNavigate } from "react-router-dom"

import { signUp } from '../redux/auth/authSlice';

const SignUp = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [values, setValues] = useState({
       email: '',
       password: ''
    });

    const handleSignUp = () => {
        setValues({ email: '', password: '' });
        dispatch(signUp({
            email: values.email,
            password: values.password
        }));
    }

    return (
        <div>
            <h1 className="text-center font-SpaceGrotesk font-bold text-5xl text-orange-500 pb-10">keepr</h1>
            <form>
                <div className="mb-6">
                    <label htmlFor="email" className="block mb-2 text-sm font-medium
                     text-gray-900 dark:text-gray-300">
                         Your email
                    </label>
                    <input type="email" id="email" className="bg-gray-50 border 
                    border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 
                    focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 
                    dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                     placeholder="name@email.com" required
                     value={values.email}
                     onChange={(e) => setValues({ ...values, email: e.target.value })}
                     />
                </div>
                <div className="mb-6">
                    <label htmlFor="password" className="block mb-2 text-sm font-medium 
                    text-gray-900 dark:text-gray-300">
                        Your password
                    </label>
                    <input type="text" id="password" className="bg-gray-50 border 
                    border-gray-300 text-gray-900 text-sm rounded-lg 
                    focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 
                    dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 
                    dark:focus:border-blue-500" required
                     value={values.password}
                     onChange={(e) => setValues({ ...values,password: e.target.value })}
                    />
                </div>

                <div className="flex items-start mb-6">
                    <Link to="/login">
                        <label htmlFor="remember" className="text-sm font-medium text-gray-500 hover:text-blue-500
                        dark:text-gray-300">
                            Login instead?
                        </label>
                    </Link>
                </div>
                
                <button type="button" className="text-white bg-blue-700 hover:bg-blue-800 
                focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto 
                px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                onClick={handleSignUp}
                >
                    Sign Up
                </button>
            </form>
        </div>
    )   
}

export default SignUp