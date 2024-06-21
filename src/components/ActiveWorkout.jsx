import { useEffect, useState } from 'react'
import axios from 'axios'
import Table from './Table'

const ActiveWorkout = () => {

  const [workout, setWorkout] = useState(0)
  const [options, setOptions] = useState([])

  // const getWorkouts = async () => {
  // let {data} = await axios.get('/api/get_workouts/')

//   let workoutIdArray = []
//   let workoutArray = data.map((element, i) => {
//      workoutIdArray[i] = element.workoutId
//      return element = element.workoutName
//     });

//     let workoutOptions = workoutArray.map((element, i) => {
//       return element = <option key={i} value={workoutIdArray[i]}>{element}</option>
//     })

//     setOptions(workoutOptions)
// }

const getSteps = async () => {
  console.log(workout)
  let res = await axios.get(`/api/get_workout_steps/${workout}`)

    console.log(res.data)
}
  

//   useEffect(() => {
//     getWorkouts()
// },[])

  useEffect(() => {
    getSteps()
},[workout])
  

  return (
    <>
     <select  onChange={(e) => setWorkout(e.target.value)}>
      {options}
    </select>
    </>
  )
}

export default ActiveWorkout

