import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'

import axios from 'axios'
let modelRefs = [
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
  ]

let tableLinks = modelRefs.map((el,i = i + 2) => {
    return <NavLink to={el} key={i}>|{el}|</NavLink>
})


const Navbar = () => {

    const dispatch = useDispatch()
    const navigate = useNavigate();
    const handleLogout = async () => {
        const {data} = await axios.get("/api/logout")

        if (data.success) {
            dispatch({
            type: "LOGOUT",
            })
            navigate('/')
        }
    }    

  return (
    <div>
        <header>
            <nav>
                <h1>Agisco</h1>
                <span onClick={handleLogout}> |log out|</span>
                <NavLink to='working_out' key='0'>|working_out`|</NavLink>
                {tableLinks}
            </nav>
        </header>
        <main>
            <Outlet/>
        </main>
    </div>
  )
}

export default Navbar