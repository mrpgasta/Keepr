import React from 'react'
import { useEffect, useState } from 'react'
import { useNavigate } from "react-router-dom"
import { signOut } from 'firebase/auth'
import { auth } from '../configs/firebaseConfig'
import { useDispatch, useSelector } from 'react-redux'
import { addKeep, editKeep, deleteKeep, GetKeeps } from '../redux/keeps/keepSlice'
import { nanoid } from 'nanoid'
import { store } from '../redux/store'


const Home = (currentUser) => {

    let authToken = sessionStorage.getItem('Auth Token')
    const [isHidden, setIsHidden] = useState(true)
    const [isHiddenEdit, setIsHiddenEdit] = useState(true)
    const dispatch = useDispatch()

    

    const [showPass,setShowPass] = useState(true)
    const [shownPass,setShownPass] = useState('')

    const handleShowPass = (id) => {
        setShowPass(!showPass)
        setShownPass(id)
        setCloseAlert(false)
    }

    const keeps = useSelector(store => store.keeps.keepList);
    const { profile, error, loading } = keeps;

    const [keepRefreshOnAdd,setKeepRefreshOnAdd] = useState(false)
    const [keepRefreshOnEdit,setKeepRefreshOnEdit] = useState(false)
    const [keepRefreshOnDelete,setKeepRefreshOnDelete] = useState(false)

    //hook for add,edit,delete

    useEffect(() => {
        if (!profile) {
            dispatch(GetKeeps(currentUser.currentUser.uid))
        }
    }, [dispatch(GetKeeps)])

    useEffect(() => {
        dispatch(GetKeeps(currentUser.currentUser.uid))
    }, [keepRefreshOnAdd])

    useEffect(() => {
        dispatch(GetKeeps(currentUser.currentUser.uid))
    }, [keepRefreshOnEdit])

    useEffect(() => {
        dispatch(GetKeeps(currentUser.currentUser.uid))
    }, [keepRefreshOnDelete])


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
        setKeepRefreshOnEdit(!keepRefreshOnEdit)
    }

    const [toDelete,setToDelete] = useState({id:''})

    const handleDelete = () => {
        dispatch(deleteKeep(toDelete.id))
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
                        <div className='flex items-center'>
                            <h5 className="mb-2 text-2xl font-bold text-orange-600  dark:text-white">
                                {keep.label}
                            </h5>
                            <button onClick={() => handleShowPass(keep.id)} className="inline-flex relative items-center ml-3   cursor-pointer text-orange-500">
                            {showPass && keep.id === shownPass ? (
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                        <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                                        <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                                    </svg>
                                ):(
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clipRule="evenodd" />
                                        <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z" />
                                    </svg>
                                )}
                            </button>
                        </div>
                        {showPass && keep.id === shownPass ? (
                                <p className=" mb-3 font-normal text-orange-600  dark:text-gray-400 cursor-pointer">
                                    {keep.password}
                                </p>
                            ):(
                                <p className=" hidden mb-3 font-normal text-orange-600 bg-orange-100 rounded-lg p-2 dark:text-gray-400 cursor-pointer">
                                    {keep.password}
                                </p>
                            )}           
                        {/* <p className="mb-3 font-normal text-orange-600 dark:text-gray-400">
                            {keep.password}
                        </p> */}
                        <button data-modal-toggle="authentication-modal" className="inline-flex items-center py-2 px-3 text-sm font-medium text-center 
                        text-orange-600 bg-white rounded-lg hover:bg-orange-600 hover:text-white border border-orange-600
                        focus:ring-orange-200 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                        onClick={() => {
                            setEditedField({id: keep.id ,label: keep.label, password: keep.password})
                            onEdit()
                        }}
                        >
                            Cancel
                        </button>
                        <button data-modal-toggle="authentication-modal" className="float-right inline-flex items-center py-2 px-3 text-sm font-medium text-center 
                            text-orange-600 = focus:ring-4 focus:outline-none
                            focus:ring-orange-200 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                            onClick={ () => {
                                setToDelete({id: keep.id})
                                handleDelete()
                                setKeepRefreshOnDelete(!keepRefreshOnDelete)
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
                        
                            <div className='flex items-center'>
                                <h5 className="mb-2 text-2xl font-bold text-orange-600  dark:text-white">
                                    {keep.label}
                                </h5>
                                
                                <button onClick={() => handleShowPass(keep.id)} className="inline-flex relative items-center ml-3   cursor-pointer text-orange-500">
                                    {showPass && keep.id === shownPass ? (
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                            <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                                            <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                                        </svg>
                                    ):(
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clipRule="evenodd" />
                                            <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z" />
                                        </svg>
                                    )}
                                </button>
                            </div>       
                            {showPass && keep.id === shownPass ? (
                                <p className=" mb-3 font-normal text-orange-600  dark:text-gray-400 cursor-pointer">
                                    {keep.password}
                                </p>
                            ):(
                                <p className=" hidden mb-3 font-normal text-orange-600 bg-orange-100 rounded-lg p-2 dark:text-gray-400 cursor-pointer">
                                    {keep.password}
                                </p>
                            )}                  
                            <button data-modal-toggle="authentication-modal" className="inline-flex items-center py-2 px-3 text-sm font-medium text-center 
                            text-white bg-orange-600 rounded-lg hover:bg-orange-200 hover:text-orange-500 hover:border hover:border-orange-600 focus:ring-4 focus:outline-none
                            focus:ring-orange-200 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                            onClick={() => {
                                setEditedField({id: keep.id ,label: keep.label, password: keep.password})
                                onEdit()
                            }}
                            >
                                Edit
                            </button>
                            <button data-modal-toggle="authentication-modal" className="float-right ml-2 inline-flex items-center py-2 px-3 text-sm font-medium text-center 
                            text-orange-600 focus:ring-4 focus:outline-none
                            focus:ring-orange-200 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                            onClick={ () => {
                                setToDelete({id: keep.id})
                                handleDelete()
                                setKeepRefreshOnDelete(!keepRefreshOnDelete)
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
        setKeepRefreshOnAdd(!keepRefreshOnAdd)
    }

    const handleShow = (event) => {
        event.preventDefault()
        setIsHidden(!isHidden)
    }

    const handleShowOnEdit = (event) => {
        event.preventDefault()
        setIsHiddenEdit(!isHiddenEdit)
    }

    const [closeAlert,setCloseAlert] = useState(false)

    const handleCloseAlert = () => {
        setCloseAlert(!closeAlert)
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
                    <div className="overflow-y-auto py-4 px-3 bg-orange-100 rounded-lg border border-orange-500 dark:bg-gray-800">
                        <ul className="space-y-2">
                            <li>
                                <a href="#" className="flex items-center p-2 text-base font-bold text-orange-600 rounded-lg
                                dark:text-white hover:bg-orange-100 dark:hover:bg-gray-700">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none " viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
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
                            <button onClick={handleShow} className="text-orange-600">
                                {isHidden ? (
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clipRule="evenodd" />
                                        <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z" />
                                    </svg>
                                ):(
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                        <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                                        <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                                    </svg>
                                )}
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
                                    <input type={isHiddenEdit ? "password" : "text"} name="floating_password" id="floating_password" className="block py-2.5 
                                    px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 
                                    appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 
                                    focus:outline-none focus:ring-0 focus:border-orange-500  peer"
                                    placeholder=" "
                                    value={editedField.password || ''}
                                    onChange={(e) => setEditedField({ ...editedField, password: e.target.value })}
                                    />
                                    <button onClick={handleShowOnEdit} className="text-orange-600">
                                        {isHiddenEdit ? (
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clipRule="evenodd" />
                                                <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z" />
                                            </svg>
                                        ):(
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                                                <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                                            </svg>
                                        )}
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
                {showPass && !closeAlert?(
                    <div id="alert-border-1" className="flex p-4 mb-4 bg-orange-100 border-t-4 border-orange-500 dark:bg-blue-200" role="alert">
                        <svg className="flex-shrink-0 w-5 h-5 text-orange-600" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"></path></svg>
                        <div className="ml-3 text-sm font-medium text-orange-600">
                        You can only view one password at a time. Subscribe to my patreon to view multiple passwords 😇
                        </div>
                        <button type="button" className="ml-auto -mx-1.5 -my-1.5 dark:bg-blue-200 text-orange-600
                        rounded-lg  p-1.5 dark:hover:bg-blue-300 inline-flex
                        h-6 w-6" data-dismiss-target="#alert-border-1" aria-label="Close" onClick={handleCloseAlert}>
                        <span className="sr-only">Dismiss</span>
                            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1
                                1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd">
                                </path>
                            </svg>
                        </button>
                    </div>
                ):(
                    <div id="alert-border-1" className=" hidden flex p-4 mb-4 bg-orange-100 border-t-4 border-orange-500 dark:bg-blue-200" role="alert">
                        <svg className="flex-shrink-0 w-5 h-5 text-orange-600" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"></path></svg>
                        <div className="ml-3 text-sm font-medium text-orange-600">
                        You can only view one password at a time. Subscribe to my patreon to view multiple passwords 😇
                        </div>
                        <button type="button" className="ml-auto -mx-1.5 -my-1.5 dark:bg-blue-200 text-orange-600
                        rounded-lg  p-1.5 dark:hover:bg-blue-300 inline-flex
                        h-6 w-6" data-dismiss-target="#alert-border-1" aria-label="Close">
                        <span className="sr-only">Dismiss</span>
                            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1
                                1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd">
                                </path>
                            </svg>
                        </button>
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