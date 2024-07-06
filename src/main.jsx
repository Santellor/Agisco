import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import store from './redux/store.js'
import { Provider } from 'react-redux'
import { 
  createBrowserRouter,
  Route,
  createRoutesFromElements,
  RouterProvider,
  useNavigate,
  } from 'react-router-dom';
  
import Login from './components/Login';
import Register from './components/Register.jsx'
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
      <Route path='/' element={<App/>}>
        <Route index element={<SelectWorkout />} />
        <Route path='/working_out' element={<ActiveWorkout />} />
        <Route path='/workout_selector' element={<SelectWorkout />} />
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
        {/* add new tables with route filters as props here */}
        {tables}
      </Route>
    )
);


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </React.StrictMode>,
)
