import { NavLink, Outlet, useNavigate, useSearchParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'

import axios from 'axios'

const Navbar = () => {
    const userId = useSelector((state) => state.userId);
    const workingOut = useSelector((state) => state.workingOut);
    const dispatch = useDispatch()
    const navigate = useNavigate();

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
            <nav className='inline-flex justify-between h-12 bg-primary-dark text-primary-light'>
                <div className='content-center'>
                  <h1 className='w-[10vw] pl-8 text-highlight text-4xl'>agisco</h1>
                </div>
                <div className='w-[90vw] text-right content-center text-2xl'>
                  <NavLink className='py-2 px-5 hover:text-highlight' to='workout_selector' key='0'>start</NavLink>
                  {tableLinks}
                  <span className=' pl-2 pr-8 px-5 hover:text-highlight cursor-pointer' onClick={handleLogout}> log out</span>
                </div>
            </nav>
                <div className='h-1 bg-primary-dark'>
                </div>
                <div className='h-1 bg-highlight'>
                </div>
    
  </>
  ) : (<></>)
}

export default Navbar