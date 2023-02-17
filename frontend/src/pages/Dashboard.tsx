import React, { useState, useEffect } from 'react'
import Header from '../components/Header/Header'
import Sidebar from '../components/Sidebar/Sidebar'
import BoardArea from '../components/BoardArea/BoardArea'
import ShowSidebar from '../components/ShowSidebar'
import { Board } from '../types'
import { AppDispatch, RootState } from "../app/store"
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { getBoards, reset } from '../features/boards/boardSlice'
import data from '../data.json'
import BoardForm from '../components/Forms/BoardForm'
import Loader from '../components/Loader'

function Dashboard() {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false)
  const [showSidebar, setShowSidebar] = useState<boolean>(true)
// TEMP: 
const [showBoardForm, setShowBoardForm] = useState(true)

  const navigate = useNavigate()
  const {user} = useSelector((state: any) => state.auth)
  const {boards, isLoading, isError, message} = useSelector((state: any) => state.boards)
  const dispatch = useDispatch<AppDispatch>()

  useEffect(() => {
    if(isError){
      console.log(message)
    }
    if(!user) {
      navigate('/login')
    }

    dispatch(getBoards()) 

    return () => {
      dispatch(reset())
    }
  }, [user, navigate, isError, message, dispatch])

  if(isLoading) {
    return <Loader />
  }

  return (
    <div className={`flex h-full ${isDarkMode && "dark"}`}>
      <Sidebar 
          isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} 
          showSidebar={showSidebar} setShowSidebar={setShowSidebar} 
      />
      <div className="flex flex-col flex-1 overflow-auto" tabIndex={0}>
      {/*   <Header 
            isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} 
            showSidebar={showSidebar} setShowSidebar={setShowSidebar} 
         /> */}
        {/* <BoardArea /> */}
        <h1>welcome {user && user.name}</h1>
        {showBoardForm && <BoardForm setShowBoardForm={setShowBoardForm} title="Add New Board" />}

        <p> let's display a board name here</p>
      </div>
      {!showSidebar && <ShowSidebar setShowSidebar={setShowSidebar} />}
    </div>
  )
}

export default Dashboard;
