import { useEffect, useState } from 'react';
import { NavLink, Outlet, useNavigate, useSearchParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { IoIosMoon } from "react-icons/io";
import { IoIosSunny } from "react-icons/io";
import axios from 'axios';

const Navbar = () => {
    const userId = useSelector((state) => {
      console.log(state) 
      return state.userId});
    const dark = useSelector((state) => state.dark);
    const metric = useSelector((state) => state.metric);
    
    metric
    const workingOut = useSelector((state) => state.workingOut);
    const dispatch = useDispatch()
    const navigate = useNavigate();

    const handleDark = async () => {
      let swapper = !dark
      let body = { }
      console.log(`dark`, dark)
      body.entry = {darkMode: swapper}
      await axios.put(`/api/edit/preferences/${userId}`, body)
      dispatch({
        type: "DARK",
        payload: swapper
      })
    }

    const handleMetric = async () => {
      let swapper = !metric
      let body = { }
      console.log(`metric`, metric)
      body.entry = {metric: swapper}
      await axios.put(`/api/edit/preferences/${userId}`, body)
      dispatch({
        type: "METRIC",
        payload: swapper
      })
    }

    useEffect (() => {
      const pullPreferences = async () => {
        if (userId !== undefined && userId !== null) {
          let queryString = `column=preferenceId&value=${userId}`
          let {data} = await axios.get(`/api/load/preferences/${queryString}`)
          console.log(`data`, data)
          if (data[0].darkMode) {
            dispatch({
              type: "DARK", 
              payload: true
            })
          } else {
            dispatch({
              type: "DARK", 
              payload: false
          })
        }

        if (data[0].metric) {
          dispatch({
            type: "METRIC",
            payload: true
          })
        } else {
          dispatch({
            type: "METRIC",
            payload: false
          })
        }
      }
      }
      pullPreferences()
    }, [userId])

    let modelRefs 
    userId === 7? modelRefs = [
        `users`, 
        `preferences`,
        `workouts`,
        `workout_instances`,
        `workout_step_data`,
        `workout_steps`,
        `goals`,
        `exercises`,
        `muscle_groups`,
        `exercise_types`
      ] : modelRefs = [
        `workouts`,
        `goals`,
        `exercises`,
      ]

    
    let tableLinks = modelRefs.map((el,i = i + 4) => {
        return <NavLink className='px-5 hover:text-highlight' to={el} key={i}>{el}</NavLink>
    })

    
    const handleLogout = async () => {
        const {data} = await axios.get("/api/logout")

        if (data.success) {
            dispatch({
            type: "LOGOUT",
            })
            navigate('/login')
        }
    }

    

  return userId && !workingOut ? (
  <>
            <nav className='flex flex-row justify-between h-[9vh] bg-primary-dark pt-2 pb-[4.5rem] border-b-4 max-w-[100vw] border-highlight text-primary-light'>
                <div className='flex flex-row h-[9vh] pl-[5vw] text-highlight text-right content-center text-5xl'>
                agisco
                <div className='text-xl self-top '>
                  <button className='mt-6 pl-4 pr-2 text-primary-light hover:text-highlight' onClick={handleDark}>{!dark? <IoIosSunny /> : <IoIosMoon />}</button>
                  <button className='text-primary-light hover:text-highlight translate-y-[-10%]' onClick={handleMetric}>{!metric? `LB` : `KG` }</button>
                </div>
                </div>
                <div className='py-2 w-[60vw] h-[9vh] text-right content-center text-2xl '>
                  <NavLink className='px-5 hover:text-highlight' to='workout_selector' key='0'>start</NavLink>
                  {tableLinks}
                  <span className=' pl-2 pr-8 px-5 hover:text-highlight cursor-pointer' onClick={handleLogout}> log out</span>
                </div>
            </nav>
    
  </>
  ) : (<></>)
}

export default Navbar