import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import Table from './Table'
import { useNavigate } from 'react-router-dom'

const ActiveWorkout = () => {

  const [workout, setWorkout] = useState()
  const [workouts, setWorkouts] = useState([])
  const [workoutIndexArray, setWorkoutIndexArray] = useState([])
  const [options, setOptions] = useState([])
  const [viewSearch, setViewSearch] = useState(false)
  const [workoutOutlet, setWorkoutOutlet] = useState([])
  const [searchButton, setSearchButton] = useState('edit this workout')
  const workoutId = useSelector((state) => state.workoutId)
  const stateWorkoutName = useSelector((state) => state.workoutName)
  const userId = useSelector((state) => state.userId)
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
    console.log(`workoutId`, workoutId)
    getWorkouts()
},[])

const toggleSearch = () => {
  setViewSearch(!viewSearch)
if (searchButton === 'edit this workout') setSearchButton(`done editing`)
else setSearchButton('edit this workout')
}

useEffect(() => {
  console.log(`workoutId`, workoutId)
  console.log(`workout`, workout)
  console.log(`workoutIndexArray`, workoutIndexArray)
  let workoutIndex = workouts.indexOf(workout)
  let finalWorkoutId = workoutIndexArray[workoutIndex] ?? 1
  console.log(finalWorkoutId)
  dispatch({type:"UPDATE_RECORD_DEFAULTS", target:"workoutId", payload:finalWorkoutId})
  dispatch({type:"UPDATE_RECORD_DEFAULTS", target:"workoutName", payload:workout})

  const loadRawSteps = async () => {
    const rawStepQueryString = `column=workoutId&value=${finalWorkoutId}&order=relativePosition`
    const {data} = await axios.get(`/api/load/workout_steps/${rawStepQueryString}`)
    let rawSteps = data
    rawSteps = rawSteps.map((el, i) => {
      return el = <li key={i}>{i+1}- {el.exercise.exerciseName} for {el.sets} sets </li>
    })
    console.log(data)

    setWorkoutOutlet(
                    <div className='text-2xl vh text-primary dark bg-neutral h-[80vh]' >
                        <h1 className='text-4xl py-5'>{workout}</h1>
                        <ol className=' text-lg text-primary dark'>
                          {rawSteps}
                        </ol>
                    </div> )
  }
  viewSearch? 
    setWorkoutOutlet(
    <div  className='bg-neutral h-[80vh]'>
      <Table routeModelRef='workout_steps' searchColumnDefault='workout' searchValueDefault={workout} defaultLength='6' viewController={true} filter={{order:'relativePosition'}}/> 
    </div>) :
  loadRawSteps()
  
  

}, [workout, viewSearch])
  

  return (
  <>
    <div className='justify-center w-[100vw]'>
      <div className=' bg-primary-dark'>
        <select className='bg-neutral text-lg text-primary-dark mx-1 pt-3 pb-3 py-10 my-2 rounded' onChange={(e) => setWorkout(e.target.value)}>
        {options}
        </select>
        <button className=' text-lg text-primary dark my-1 mx-1 py-3 px-3 rounded bg-primary-light text-primary-dark hover:text-highlight' onClick={(e) => swolPatrol(e.target.value)}>start this workout</button>
        <button className=' text-lg text-primary dark my-1 mx-1 py-3 px-3 rounded bg-primary-light text-primary-dark hover:text-highlight' onClick={toggleSearch}>{searchButton}</button>
      </div>
      <div >
        {workoutOutlet}
      </div>
    </div>
  </>
  )
}

export default ActiveWorkout

