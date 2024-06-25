import axios from 'axios'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'


const ActiveWorkout = () => {
const workingOut = useSelector((state) => state.workingOut)
const workoutId = useSelector((state) => state.workoutId)
const userId = useSelector((state) => state.userId)
const workoutStepId = useSelector((state) => state.workoutStepId)
const exerciseId = useSelector((state) => state.exerciseId)
const instanceId = useSelector((state) => state.instanceId)
const [step, setStep ] = useState({})
const [stepStack, setStepStack] = useState([])
const [goal, setGoal ] = useState({exercise: {exerciseName:''}})
const [sets, setSets] = useState(0)
const dispatch = useDispatch()

const loadStepStack = async () => {

    console.log(`instanceId`, instanceId)
    console.log(`exerciseId`, exerciseId)
    console.log(`userId`, userId)
    console.log(`workoutId`, workoutId)


    let {data} = await axios.get(`/api/get_workout_steps/${workoutId}`)

    let initialStepStack = data.reverse()
    // console.log(`WE MADE IT THIS FAR BABY`, initialStepStack)
    let firstStep = [...initialStepStack].pop()
    setStep(firstStep)
    // console.log(`WE MADE IT FARTHER BABY`, firstStep)
    let currentSets = firstStep.sets
    setSets(currentSets)
    let currentExerciseId = firstStep.exerciseId
    setStepStack(initialStepStack)
    // console.log(`currentExerciseId`, currentExerciseId)
    // console.log(`WE MADE IT EVEN FURTHER BABY`, step)
    let goalQueryString = `column=exerciseId&value=${currentExerciseId}`
    let goalsByExercise = await axios.get(`/api/load/goals/${goalQueryString}`)
    goalsByExercise = goalsByExercise.data
    // console.log(`WE MADE IT EVEN FURTHERER BABY`, goalsByExercise)

    let currentGoal
    goalsByExercise.forEach((el) => {
        if (el.userId === userId) currentGoal = el
    })
    // console.log(`ARE WE DOING IT?`, currentGoal )
    setGoal(currentGoal)
    // console.log(`I can do this`, currentGoal.exercise.exerciseName)
    dispatch({type: "UPDATE_RECORD_DEFAULTS", target: 'workoutStepId', payload: firstStep.workoutStepId})
}

const quit = () => {
    dispatch({type: "END_WORKOUT"})
}

const newStepData = async () => {
    let entry = {
        instanceId: instanceId,
        workoutStepId: workoutStepId,
        time: goal.time,
        weight: goal.weight, 
        reps: goal.reps,
        sets: sets,

    }
    let body = {}
    body.entry = entry
    const {data} = await axios.post('/api/add/workout_step_data', body)
    console.log(data)
}

useEffect(() => {
    loadStepStack()
}, [])



    return (
    <>
    <p> Exercise #{step.relativePosition} - {goal.exercise.exerciseName} Sets: {step.sets} </p>

    <p> weight = {goal.weight}   reps = {goal.reps}   total sets = {goal.sets}   time = {goal.time} mins </p>

    <button onClick={(quit)}>quit</button>
    <button onClick={(newStepData)}> simulate start/going to next exercise</button>
    </>
  )
}

export default ActiveWorkout