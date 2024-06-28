import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react'
import axios from 'axios';
import { 
  createBrowserRouter,
  Route,
  createRoutesFromElements,
  RouterProvider,
  useNavigate,
  } from 'react-router-dom';
  
import Login from './components/Login';
import Table from './components/Table';
import Home from './components/Home';
import Navbar from './components/Navbar';
import SelectWorkout from './components/SelectWorkout';
import ActiveWorkout from './components/ActiveWorkout';

// create a model reference for all of the crud tables
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
];

// create a list of routes that reuse the table component, passing the correct reference
let tables = modelRefs.map((el,i) => {
  return <Route path={el} 
                key={i}  
                element={<Table routeModelRef={el}/>} 
        />
});

// initialize our router, which we only need when logged in AND not working out
const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path='/' element={<Navbar />}>
        <Route index element={<SelectWorkout />} />
        <Route path='/working_out' element={<ActiveWorkout />} />
        <Route path='/workout_selector' element={<SelectWorkout />} />
        {/* add new tables with route filters as props here */}
        {tables}
      </Route>
    )
);



function App() {

  const userId = useSelector((state) => state.userId);
  const workingOut = useSelector((state) => state.workingOut);
  const dispatch = useDispatch()

  const sessionCheck = async () => {
    const {data} = await axios.get("/api/session-check")

    if (data.success) {
      dispatch({
        type: "USER_AUTH",
        payload: data.userId
      })
    } 
  }
  
  useEffect(() => {
    sessionCheck()
  }, [userId,])
  
  return userId? 
  // workingOut? ( <ActiveWorkout/>) : ( <RouterProvider router={router}/>) : ( <Login/> )
  ( <RouterProvider router={router}/>) : ( <Login/> )
}

export default App