import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import Table from './Table'
import { useNavigate } from 'react-router-dom'
import { IoPencil } from "react-icons/io5";
import { IoIosCheckmarkCircle } from "react-icons/io";

const ActiveWorkout = () => {

  const [workout, setWorkout] = useState()
  const [workouts, setWorkouts] = useState([])
  const [workoutIndexArray, setWorkoutIndexArray] = useState([])
  const [options, setOptions] = useState([])
  const [viewSearch, setViewSearch] = useState(false)
  const [workoutOutlet, setWorkoutOutlet] = useState([])
  const [searchButton, setSearchButton] = useState(< IoPencil />)
  const workoutId = useSelector((state) => state.workoutId)
  const stateWorkoutName = useSelector((state) => state.workoutName)
  const userId = useSelector((state) => state.userId)
  const dark = useSelector((state) => state.dark)
  const dispatch = useDispatch()
  const navigate = useNavigate()


  const getWorkouts = async () => {
  let {data} = await axios.get('/api/get_workouts/')

  let workoutIdArray = []
  let workoutArray = data.map((element, i) => {
     workoutIdArray[i] = element.workoutId
     return element = element.workoutName
    });

  setWorkoutIndexArray(workoutIdArray)


    let workoutOptions = workoutArray.map((element, i) => {
      return element = <option key={i} value={element}>{element}</option>
    })

    setOptions(workoutOptions)
    setWorkout(workoutArray[0])
    setWorkouts(workoutArray)

    // !! start workout route
    // select a workout
    // list all workout steps with that workout ID
    // set the active workout to that workout and set active workout to true, redirect to workout
}  

const newInstance = async () => {
  let entry = {
      userId: userId,
      workoutId: workoutId
  }
  let body = {}
  body.entry = entry
  const {data} = await axios.post('/api/add/workout_instances', body)
  console.log('instance', data)
  dispatch({type: "UPDATE_RECORD_DEFAULTS", target: 'instanceId', payload: data.instanceId})
}

const swolPatrol = async () => {

  await newInstance()
  dispatch({type:"START_WORKOUT"})
  navigate("/working_out")

}

  useEffect(() => {
    // console.log(`workoutId`, workoutId)
    getWorkouts()
},[])

const toggleSearch = () => {
  setViewSearch(!viewSearch)
if (!viewSearch) setSearchButton(< IoIosCheckmarkCircle />)
else setSearchButton(< IoPencil />)
}

const handleDark = () => {
  console.log(`dark`, dark)
  return dark ? viewSearch ? 'dark:bg-slate-900' : 'dark:bg-slate-900 dark:text-primary-light'  :'  bg-neutral' 
}

useEffect(() => {
  // console.log(`workoutId`, workoutId)
  // console.log(`workout`, workout)
  // console.log(`workoutIndexArray`, workoutIndexArray)
  let workoutIndex = workouts.indexOf(workout)
  let finalWorkoutId = workoutIndexArray[workoutIndex] ?? 1
  // console.log(finalWorkoutId)
  dispatch({type:"UPDATE_RECORD_DEFAULTS", target:"workoutId", payload:finalWorkoutId})
  dispatch({type:"UPDATE_RECORD_DEFAULTS", target:"workoutName", payload:workout})

  const loadRawSteps = async () => {
    const rawStepQueryString = `column=workoutId&value=${finalWorkoutId}&order=relativePosition`
    const {data} = await axios.get(`/api/load/workout_steps/${rawStepQueryString}`)
    let rawSteps = data
    rawSteps = rawSteps.map((el, i) => {
      return el = <li key={i}>{i+1}- {el.exercise.exerciseName} for {el.sets} sets </li>
    })
    // console.log(data)

    setWorkoutOutlet(
                    <div className={` flex flex-col translate-x-[240%] translate-y-[0%] justify-center text-2xl vh text-primary dark `} >
                        <h1 className='text-4xl py-5'>{workout}</h1>
                        <ol className=' text-lg text-primary dark'>
                          {rawSteps}
                        </ol>
                    </div> )
  }
  viewSearch? 
    setWorkoutOutlet(
      <Table routeModelRef='workout_steps' searchColumnDefault='workout' searchValueDefault={workout} defaultLength='6' viewController={true} filter={{order:'relativePosition'}}/> 
  ) :
  loadRawSteps()
  
  

}, [workout, viewSearch])
  

  return (
  <>
    <div className='relative min-h-[80vh]'>
      <div className=' fixed top-[5.25rem] min-h-[88.6vh] w-[22vw] flex flex-col bg-primary-dark text-highlight'>
        </div>
      <div className=' fixed top-[6rem] w-[22vw] flex flex-col bg-primary-dark text-highlight z-10'>
        <select className='bg-neutral dark:bg-slate-900 dark:text-primary-light text-lg text-primary-dark mx-1 px-2 py-3 self-center w-[18vw] my-2 rounded' onChange={(e) => setWorkout(e.target.value)}>
        {options}
        </select>
        <button className=' text-lg self-center text-primary dark my-2 mx-1 py-1 px-3 rounded bg-primary-light text-primary-dark hover:text-highlight' onClick={(e) => swolPatrol(e.target.value)}>start this workout</button>
        <button className=' self-center text-2xl my-2 mx-1 py-3 px-3 rounded bg-primary-light text-primary-dark hover:text-highlight' onClick={toggleSearch}>{searchButton}</button>
      </div>
      <div className={` ${handleDark()} min-h-[60vh]`}>
        {workoutOutlet}
      </div>
    </div>
  </>
  )
}

export default ActiveWorkout

