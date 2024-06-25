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
  const workoutId = useSelector((state) => state.workoutId)
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
  navigate("/")

}

  useEffect(() => {
    console.log(`workoutId`, workoutId)
    getWorkouts()
},[])

useEffect(() => {
  console.log(`workoutId`, workoutId)
  console.log(`workout`, workout)
  console.log(`workoutIndexArray`, workoutIndexArray)
  let workoutIndex = workouts.indexOf(workout)
  let finalWorkoutId = workoutIndexArray[workoutIndex]
  console.log(finalWorkoutId)
  dispatch({type:"UPDATE_RECORD_DEFAULTS", target:"workoutId", payload:finalWorkoutId})
}, [workout])
  

  return (
    <>
     <select  onChange={(e) => setWorkout(e.target.value)}>
      {options}
      </select>
      <button onClick={(e) => swolPatrol(e.target.value)}>Start this Workout</button>

      <Table routeModelRef='workout_steps' searchColumnDefault={`workoutName`} searchValueDefault={workout}/>
    </>
  )
}

export default ActiveWorkout

