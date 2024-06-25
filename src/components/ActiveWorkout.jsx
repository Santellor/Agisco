import axios from 'axios'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Table from './Table'
import { useNavigate } from 'react-router-dom'


const ActiveWorkout = () => {
const workingOut = useSelector((state) => state.workingOut)
const workoutId = useSelector((state) => state.workoutId)
const userId = useSelector((state) => state.userId)
const workoutStepId = useSelector((state) => state.workoutStepId)
const exerciseId = useSelector((state) => state.exerciseId)
const instanceId = useSelector((state) => state.instanceId)
const [step, setStep ] = useState({relativePosition:1})
const [stepStack, setStepStack] = useState([])
const [stepDataStack, setStepDataStack] = useState([])
const [exercise, setExercise ] = useState({muscleGroup: {groupName:''}, exerciseType: {typeName:''}})
const [goal, setGoal ] = useState({exercise: {exerciseName:''}})
const [sets, setSets] = useState(0)
const [datumId, setDatumId] = useState(null)
const dispatch = useDispatch()
const navigate = useNavigate()

const loadStepStack = async () => {

    console.log(`instanceId`, instanceId)
    console.log(`exerciseId`, exerciseId)
    console.log(`userId`, userId)
    console.log(`workoutId`, workoutId)

    
    let {data} = await axios.get(`/api/get_workout_steps/${workoutId}`)
    let initialStepStack = data.reverse()
    let instanceStepArray = []
    let instanceStepDataArray = []
    for (let step of initialStepStack) {
    
        // console.log(`WE MADE IT THIS FAR BABY`, initialStepStack)
        
        // console.log(`initialStepStack`, initialStepStack)
        let currentStep = step
        console.log(`WE MADE IT FARTHER BABY`, currentStep)
        let currentSets = currentStep.sets
        setSets(currentSets)
        
        let currentExerciseId = currentStep.exerciseId
        
        // console.log(`currentExerciseId`, currentExerciseId)
        // console.log(`WE MADE IT EVEN FURTHER BABY`, step)
        let exerciseQueryString = `column=exerciseId&value=${currentExerciseId}`
        let exerciseById = await axios.get(`/api/load/exercises/${exerciseQueryString}`)
        // console.log(`AHHHHH`, exerciseById.data)
        let currentExercise = exerciseById.data[0]
        setExercise(currentExercise)
       
        // console.log(`WE MADE IT EVEN FURTHERER BABY`, goalsByExercise)
    
        let goalQueryString = `column=exerciseId&value=${currentExerciseId}`
        let goalsByExercise = await axios.get(`/api/load/goals/${goalQueryString}`)
        goalsByExercise = goalsByExercise.data
        console.log(`WE MADE IT EVEN FURTHERER BABY`, goalsByExercise)
    
        let currentGoal = {}
        goalsByExercise.forEach((el) => {
            if (el.userId === userId) currentGoal = el
        })
        // console.log(`ARE WE DOING IT?`, currentGoal )
        setGoal(currentGoal)
        // console.log(`I can do this`, currentGoal.exercise.exerciseName)
        dispatch({type: "UPDATE_RECORD_DEFAULTS", target: 'workoutStepId', payload: currentStep.workoutStepId})
        
        if (instanceStepDataArray.length < initialStepStack.length) {
            instanceStepArray.push({exercise: currentExercise, goal: currentGoal, step: currentStep})
        }
    }

    if (instanceStepDataArray.length < initialStepStack.length) {
        for (let stepObject of instanceStepArray) {
            let entry = {
                instanceId: instanceId,
                workoutStepId: stepObject.step.workoutStepId,
                time: stepObject.goal.time ?? 10,
                weight: stepObject.goal.weight, 
                reps: stepObject.goal.reps,
                sets: stepObject.goal.sets ?? 3,
            }
            let body = {}
            body.entry = entry
                const {data} = await axios.post('/api/add/workout_step_data', body)
                console.log(data)
                instanceStepDataArray.push(data)
        }
    }
    setStepDataStack(instanceStepDataArray)
    setStepStack(instanceStepArray)
}

const quit = () => {
    dispatch({type: "END_WORKOUT"})
    navigate('/')
    
}

let currentDataRecord = datumId !== null ?  < Table routeModelRef='workout_step_data' filter={{ column:'datumId', value:datumId}} viewController={false} /> : 'loading'

useEffect(() => {
    loadStepStack()
}, [])

const next = () => {

    console.log(`stepDataStack`, stepDataStack)
    console.log(`stepStack`, stepStack)
    
}

    return (
    <>
    <p> Exercise #{step.relativePosition} - {exercise.exerciseName} Sets: {step.sets} </p>

    <p> img = {exercise.chart} </p>

    <p> vid = {exercise.videoLink}</p>
    <p> muscle group: {exercise.muscleGroup.groupName} exercise type: {exercise.exerciseType.typeName}</p>

    <p> weight = {goal.weight}  reps = {goal.reps}  total sets = {goal.sets}  time = {goal.time} mins </p>

    <button onClick={(quit)}>quit</button>
    <button onClick={(next)}>next</button>

    {currentDataRecord}
    </>
  )
}

export default ActiveWorkout