import React, { useEffect } from 'react'
import NavBar from './components/NavBar'
import { Navigate, Route, Routes } from 'react-router-dom'
import HomePage from "./page/HomePage";
import SignUpPage from './page/SignUpPage'
import LoginPage from './page/LoginPage'
import SettingPage from './page/SettingPage'
import ProfilePage from './page/ProfilePage'
import { useAuthStore } from './store/useAuthStore'
import {Loader} from "lucide-react";
import {Toaster} from "react-hot-toast"
import { useThemeStore } from './store/useThemeStore'
const App = () => {
  const {authUser,CheckAuthi,isCheckingAuth,onlineUsers}=useAuthStore();
    const {theme}=useThemeStore();
  useEffect(()=>{
    CheckAuthi();
  },[CheckAuthi])

console.log(onlineUsers)
  
if(isCheckingAuth && !authUser) return(

  <div className='flex items-center justify-center h-screen'>
    <Loader className="size-10 animate-spin"/>
  </div>
)


  return (
   
    <div data-theme={theme}>
     <NavBar/>
     <Routes>
      <Route path="/" element={authUser ? <HomePage/>:<Navigate to="/login"/>} />
      <Route path='/signup' element={!authUser ? <SignUpPage/>:<Navigate to="/"/>}/>
      <Route path='/login' element={!authUser ? <LoginPage/>: <Navigate to="/"/>}/>
      <Route path='/settings' element={<SettingPage/>}/>
      <Route path='/profile' element={ authUser ? <ProfilePage/>:<Navigate to="/login"/>}/>

     </Routes>
     <Toaster/>
    </div>
  )
}

export default App