import React from 'react'
import { useEffect, useState } from 'react'
import { useNavigate } from "react-router-dom"
import { signOut } from 'firebase/auth'
import { auth } from '../configs/firebaseConfig'
import { useDispatch, useSelector } from 'react-redux'
import { addKeep, editKeep, deleteKeep, getKeeps, GetKeeps } from '../redux/keeps/keepSlice'
import { nanoid } from 'nanoid'
import { store } from '../redux/store'
import { fetchTodos } from '../redux/keeps/keepSlice'


const Home = (currentUser) => {

    let authToken = sessionStorage.getItem('Auth Token')
    const [isHidden, setIsHidden] = useState(true)
    const dispatch = useDispatch()
    

    const keeps = useSelector(store => store.keeps);
    // console.log(keeps)

    useEffect(() => {
        console.log("dispatching...")
        dispatch(GetKeeps())
    }, [keeps])


    const [isEdit,setIsEdit] = useState(false)

    const onEdit = () =>{
        setIsEdit(!isEdit)  
    }

    const [editedField, setEditedField] = useState({
        id: '',
        label: '',
        password: '',
    })

    const confirmEdit = (event) => {
        event.preventDefault()
        dispatch(editKeep({
            id: editedField.id,
            label: editedField.label,
            password: editedField.password,
            uid: currentUser.currentUser.uid
        }))
        setIsEdit(!isEdit)
        setEditedField({label: '',password: ''})
    }

    const [toDelete,setToDelete] = useState({id:''})

    const handleDelete = () => {
        dispatch(deleteKeep({
            id: toDelete.id
        }))
    }

    useEffect(() => {
        handleDelete()
    },[toDelete])

    const renderCards = () => keeps.map(keep => (
        <div key={keep.id}>
        {isEdit && keep.id === editedField.id ? (
            <div className="p-6 max-w-sm bg-white  rounded-lg border border-orange-500  shadow-md 
            dark:bg-gray-800 dark:border-gray-700">
                <div>
                        <h5 className="mb-2 text-2xl font-bold text-orange-600  dark:text-white">
                            {keep.label}
                        </h5>
                        <p className="mb-3 font-normal text-orange-600 dark:text-gray-400">
                            {keep.password}
                        </p>
                        <button data-modal-toggle="authentication-modal" className="inline-flex items-center py-2 px-3 text-sm font-medium text-center 
                        text-white bg-orange-600  rounded-lg hover:bg-white hover:text-orange-600 hover:border hover:border-orange-600 focus:ring-4 focus:outline-none
                        focus:ring-orange-200 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                        onClick={() => {
                            setEditedField({id: keep.id ,label: keep.label, password: keep.password})
                            onEdit()
                        }}
                        >
                            Edit
                        </button>
                        <button data-modal-toggle="authentication-modal" className="float-right inline-flex items-center py-2 px-3 text-sm font-medium text-center 
                            text-orange-600 = focus:ring-4 focus:outline-none
                            focus:ring-orange-200 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                            onClick={ () => {
                                setToDelete({id: keep.id})
                                handleDelete()
                            }}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 hover:animate-bounce" 
                                fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                        </button>
                </div>
            </div>
        ):(
            <div className="p-6 max-w-sm bg-orange-200  rounded-lg border border-orange-500  shadow-md 
                dark:bg-gray-800 dark:border-gray-700">
                    <div>
                            <h5 className="mb-2 text-2xl font-bold text-orange-600  dark:text-white">
                                {keep.label}
                            </h5>
                            <p className="mb-3 font-normal text-orange-600 dark:text-gray-400">
                                {keep.password}
                            </p>
                            <button data-modal-toggle="authentication-modal" className="inline-flex items-center py-2 px-3 text-sm font-medium text-center 
                            text-orange-600 bg-white  rounded-lg hover:bg-orange-600 hover:text-white focus:ring-4 focus:outline-none
                            focus:ring-orange-200 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                            onClick={() => {
                                setEditedField({id: keep.id ,label: keep.label, password: keep.password})
                                onEdit()
                            }}
                            >
                                Edit
                            </button>
                            <button data-modal-toggle="authentication-modal" className="float-right inline-flex items-center py-2 px-3 text-sm font-medium text-center 
                            text-orange-600 = focus:ring-4 focus:outline-none
                            focus:ring-orange-200 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                            onClick={ () => {
                                setToDelete({id: keep.id})
                                handleDelete()
                            }}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 hover:animate-bounce" 
                                fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                            </button>
                    </div>
            </div>
        )}
        </div>
    ))


    const [values, setValues] = useState({
        label: '',
        password: ''
     });
    
    const handleLogout = () => {
        sessionStorage.removeItem('Auth Token');
        signOut(auth)
        navigate('/login')
    }

    let navigate = useNavigate();

    useEffect(() => {
        if (auth) {
            navigate('/home')
        }
    }, [])

    const handleAdd = () => {
        dispatch(addKeep({
            id: nanoid(),
            label: values.label,
            password: values.password,
            uid: currentUser.currentUser.uid
        }))
        setValues({ label: '', password: '' });
    }

    const handleShow = (event) => {
        event.preventDefault()
        setIsHidden(!isHidden)
    }

    return (
        <div className="grid xl:grid-cols-2">
            <div>
                <div className='container flex'>
                    <h1 className=" font-SpaceGrotesk font-bold text-5xl text-orange-500 pb-10 pr-8">
                        keepr
                        <button onClick={handleAdd} className=" ml-3 text-white bg-orange-500 hover:bg-orange-600 focus:ring-4 focus:outline-none 
                            focus:ring-orange-200 font-medium rounded-full text-sm px-2 py-2 text-center dark:bg-blue-600 
                            dark:hover:bg-blue-700 dark:focus:ring-blue-800" type="button">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" 
                            stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                            </svg>       
                        </button>
                    </h1>
                </div>
                
                <aside className="w-64" aria-label="Sidebar">
                    <div className="overflow-y-auto py-4 px-3 bg-white rounded-lg border border-gray-100 dark:bg-gray-800">
                        <ul className="space-y-2">
                            <li>
                                <a href="#" className="flex items-center p-2 text-base font-normal text-gray-900 rounded-lg
                                dark:text-white hover:bg-orange-100 dark:hover:bg-gray-700">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="black " viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                                <span className="ml-3">Hello {currentUser.currentUser.email}</span>
                                </a>
                            </li>
                            <button type="button" className=" text-white bg-orange-600 hover:bg-orange-500 
                            focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto 
                            px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                            onClick={handleLogout}>
                                Log out
                            </button>
                        </ul>
                    </div>
                </aside>
            </div>
            <div>
                <form>
                    <div className="grid xl:grid-cols-2 xl:gap-6">
                        <div className="relative z-0 w-full mb-6 group">
                            <input type="text" name="floating_first_name" id="floating_first_name"
                            className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0
                            border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600
                            dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-orange-500  peer" 
                            placeholder=" "
                            value={values.label || ''}
                            onChange={(e) => setValues({ ...values, label: e.target.value })}
                            />
                            <label htmlFor="floating_first_name" className="peer-focus:font-medium absolute text-sm 
                            text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 
                            origin-[0] peer-focus:left-0 peer-focus:text-orange-500  peer-focus:dark:text-blue-500 
                            peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 
                            peer-focus:-translate-y-6">
                                Ex. This keep is for my wifi
                            </label>
                        </div>
                        <div className="relative z-0 w-full mb-6 group flex flex-row">
                            <input type={isHidden ? "password" : "text"} name="floating_password" id="floating_password" className="block py-2.5 
                            px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 
                            appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 
                            focus:outline-none focus:ring-0 focus:border-orange-500  peer"
                            placeholder=" "
                            value={values.password || ''}
                            onChange={(e) => setValues({ ...values, password: e.target.value })}
                            
                            />
                            <button onClick={handleShow}>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                </svg>
                            </button>
                            <label htmlFor="floating_last_name" className="peer-focus:font-medium absolute text-sm 
                            text-gray-500 dark:text-gray-400 duration-300 tr    ansform -translate-y-6 scale-75 
                            top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-orange-500  peer-focus:dark:text-blue-500 
                            peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 
                            peer-focus:-translate-y-6">
                                Password
                            </label>
                        
                        </div>  
                    </div>
                </form>
                {isEdit? (
                    <div className="grid xl:grid-cols-1 xl:gap-6">
                        <form className='mb-5 p-4 bg-white rounded-lg border border-orange-500  shadow-md '>
                            <div className="grid xl:grid-cols-2 xl:gap-6">
                                <div className="relative z-0 w-full mb-6 group">
                                    <input type="text" name="floating_first_name" id="floating_first_name"
                                    className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0
                                    border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600
                                    dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-orange-500 
                                    placeholder-white peer" 
                                    placeholder=" "
                                    value={editedField.label  || ''}
                                    onChange={(e) => setEditedField({ ...editedField, label: e.target.value })}
                                    />
                                    <label htmlFor="floating_first_name" className="peer-focus:font-medium absolute text-sm 
                                    text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 
                                    origin-[0] peer-focus:left-0 peer-focus:text-orange-500  peer-focus:dark:text-blue-500 
                                    peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 
                                    peer-focus:-translate-y-6">
                                        Edit the label here
                                    </label>
                                </div>
                                <div className="relative z-0 w-full mb-6 group flex flex-row">
                                    <input type={isHidden ? "password" : "text"} name="floating_password" id="floating_password" className="block py-2.5 
                                    px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 
                                    appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 
                                    focus:outline-none focus:ring-0 focus:border-orange-500  peer"
                                    placeholder=" "
                                    value={editedField.password || ''}
                                    onChange={(e) => setEditedField({ ...editedField, password: e.target.value })}
                                    />
                                    <button onClick={handleShow}>
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                        </svg>
                                    </button>
                                    <label htmlFor="floating_last_name" className="peer-focus:font-medium absolute text-sm 
                                    text-gray-500 dark:text-gray-400 duration-300 tr    ansform -translate-y-6 scale-75 
                                    top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-orange-500  peer-focus:dark:text-blue-500 
                                    peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 
                                    peer-focus:-translate-y-6">
                                        Edit the password here
                                    </label>
                                </div> 
                            </div>
                            <button onClick={confirmEdit}>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                </svg>
                            </button>
                        </form>
                    </div>
                ):(
                    <div>

                    </div>
                )}
                <div className="grid gap-5 md:grid-cols-2">
                    {keeps.length ? renderCards() : <p className="text-center col-span-2 text-gray-700 font-semibold">No Keeps</p>}
                </div>
            </div>
        </div>
    )   
}

export default Home