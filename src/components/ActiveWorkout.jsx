import axios from 'axios'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Table from './Table'
import { useNavigate } from 'react-router-dom'
import Exercise from './Exercise'
import placeholder from '../assets/chart_placeholder.png'


const ActiveWorkout = () => {
const workingOut = useSelector((state) => state.workingOut)
const workoutId = useSelector((state) => state.workoutId)
const userId = useSelector((state) => state.userId)
const workoutStepId = useSelector((state) => state.workoutStepId)
const stateWorkoutName = useSelector((state) => state.workoutName)
const exerciseId = useSelector((state) => state.exerciseId)
const instanceId = useSelector((state) => state.instanceId)
const [step, setStep ] = useState({relativePosition:1})
const [stepIndex, setStepIndex ] = useState(0)
const [stepStack, setStepStack] = useState([])
const [stepDataStack, setStepDataStack] = useState([])
const [exercise, setExercise ] = useState({muscleGroup: {groupName:''}, exerciseType: {typeName:''}})
const [goal, setGoal ] = useState({exercise: {exerciseName:''}})
const [completed, setCompleted] = useState(false)
const [endReport, setEndReport] = useState([])
const [availableButtons, setAvailableButtons] = useState([])
const [datumId, setDatumId] = useState(null)
const dispatch = useDispatch()
const navigate = useNavigate()

const loadStepStack = async () => {

    // console.log(`instanceId`, instanceId)
    // console.log(`exerciseId`, exerciseId)
    // console.log(`userId`, userId)
    // console.log(`workoutId`, workoutId)

    let {data} = await axios.get(`/api/get_workout_steps/${workoutId}`)
    let initialStepStack = data
    let instanceStepArray = []
    for (let step of initialStepStack) {
    
        // console.log(`WE MADE IT THIS FAR BABY`, initialStepStack)
        
        // console.log(`initialStepStack`, initialStepStack)
        let currentStep = step
        // console.log(`WE MADE IT FARTHER BABY`, currentStep)
             
        let currentExerciseId = currentStep.exerciseId
        
        // console.log(`currentExerciseId`, currentExerciseId)
        // console.log(`WE MADE IT EVEN FURTHER BABY`, step)
        let exerciseQueryString = `column=exerciseId&value=${currentExerciseId}`
        let exerciseById = await axios.get(`/api/load/exercises/${exerciseQueryString}`)
        // console.log(`AHHHHH`, exerciseById.data)
        let currentExercise = exerciseById.data[0]
        
       
        // console.log(`WE MADE IT EVEN FURTHERER BABY`, goalsByExercise)
    
        let goalQueryString = `column=exerciseId&value=${currentExerciseId}`
        let goalsByExercise = await axios.get(`/api/load/goals/${goalQueryString}`)
        goalsByExercise = goalsByExercise.data
        // console.log(`WE MADE IT EVEN FURTHERER BABY`, goalsByExercise)
    
        let currentGoal = {}
        goalsByExercise.forEach((el) => {
            if (el.userId === userId) currentGoal = el
        })
        // console.log(`ARE WE DOING IT?`, currentGoal )
        
        // console.log(`I can do this`, currentGoal.exercise.exerciseName)
        
        
        if (instanceStepArray.length < initialStepStack.length) {
            instanceStepArray.push({exercise: currentExercise, goal: currentGoal, step: currentStep})
        }
    }
    
    setStepStack(instanceStepArray)
    
    let stepAndFriends = instanceStepArray[0]


    setStepIndex(0)
    setStep(stepAndFriends.step)
    setExercise(stepAndFriends.exercise)
    setGoal(stepAndFriends.goal)
    dispatch({type: "UPDATE_RECORD_DEFAULTS", target: 'workoutStepId', payload: stepAndFriends.step.workoutStepId})  

}

const quit = () => {
    dispatch({type: "END_WORKOUT"})
    navigate('/')
    
}

const createData = async ( newStepIndex ) => {

    (console.log(`stepDataStack`, stepDataStack))
    let i = newStepIndex 

    if (stepDataStack[i] === undefined) {
        let stepObject = stepStack[i]
        let instanceStepDataArray = [...stepDataStack]
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
        instanceStepDataArray.push(data.datumId)
        setStepDataStack(instanceStepDataArray)
        let stepDatum = instanceStepDataArray[i]
        setDatumId(stepDatum)
        console.log(`stepDataStack`, stepDataStack)

    }     

        
}

const calculateEndReport = () => {
    const exerciseNames = []
    const theEndReport = [<div className='bg-neutral h-20 mb-2'></div>]
    for ( let step of stepStack) {
        exerciseNames.push(step.exercise.exerciseName)
    }
    for ( let i = 0; i < exerciseNames.length; i++) {
       theEndReport.push(
        <div  key={i}>

            <div className='px-2 py-1 mb-[9.778px] h-[34px] rounded self-end bg-secondary-light' > 
            #{i+1} - {exerciseNames[i]} 
            </div>
        </div>
       )
            
    }
    setEndReport(
        <div className='flex flex-row '>
            <div className=''>
                {theEndReport}
            </div>

            <div className='text-xl'>
            < Table routeModelRef='workout_step_data' filter={{ column:'instanceId', value:instanceId}} viewController={false} defaultLength={7} defaultEditing={true}/>
            </div>
        </div>)
}


let currentDataRecord = datumId !== null &&  stepDataStack[stepIndex] !== undefined?  
    < Table routeModelRef='workout_step_data' filter={{ column:'datumId', value:datumId}} viewController={false} defaultEditing={true}/> : 
    <button className=' text-lg text-primary dark my-1 mx-1 py-3 px-3 rounded bg-primary-light text-primary-dark hover:text-highlight' onClick={(() => createData(stepIndex))}>record performance</button>
// let currentDataRecord = 'loading'

useEffect(() => {
    loadStepStack()
}, [])

const shiftStep = (currentStepIndex) => {

    {console.log(`EYY stepDataStack`, stepDataStack)
        console.log(`EYY stepStack`, stepStack)

        let stepAndFriends = stepStack[currentStepIndex]
        let stepDatum = stepDataStack[currentStepIndex]

        console.log(`EYY stepAndFriends`, stepAndFriends)
        console.log(`EYY stepDatum`, stepDatum)
        setDatumId(stepDatum)
        setStep(stepAndFriends.step)
        setExercise(stepAndFriends.exercise)
        setGoal(stepAndFriends.goal)
        dispatch({type: "UPDATE_RECORD_DEFAULTS", target: 'workoutStepId', payload: stepAndFriends.step.workoutStepId})   }
    
}


const next = () => {
console.log(`EYY stepIndex`, stepIndex)
    if (stepIndex < stepStack.length) {
        let newStepIndex = stepIndex + 1
        setStepIndex(newStepIndex)
        if (newStepIndex === stepStack.length) {
            calculateEndReport()
            setCompleted(true)
        } else {
        shiftStep(newStepIndex)
        }
    }
}

const back = () => {
console.log(`YO stepIndex`, stepIndex)
    if (stepIndex >= 1) {
        let newStepIndex = stepIndex - 1
        setStepIndex(newStepIndex)
        shiftStep(newStepIndex)

    }
}

useEffect(() => {
    console.log(`you're fired`)
    const buttons = () => {
        let buttonArray = []
        if (stepIndex !== 0 )
            buttonArray.push(<button className=' text-lg text-primary dark my-1 mx-1 py-3 px-3 rounded bg-primary-light text-primary-dark hover:text-highlight' key='0' onClick={(back)}>back</button>)
        if (stepDataStack[stepIndex] !== undefined)
            buttonArray.push(<button className=' text-lg text-primary dark my-1 mx-1 py-3 px-3 rounded bg-primary-light text-primary-dark hover:text-highlight' key='1' onClick={(next)}>next</button>)
        setAvailableButtons(buttonArray)
    }
    console.log(`step`, step)
    buttons()
}, [stepDataStack, stepIndex])

    

    return completed ? (
    <div className='px-[5vw]'>
        <div className='flex flex-row bg-primary-dark px-[5vw] pb-5  mt-5 rounded-lg justify-center'>
            <h1 className='self-center text-4xl text-highlight mt-4'>well done, you finished {stateWorkoutName}!</h1>
        </div>
        
      
    <div className='px-[5vw] text-left text-lg'>
      {endReport}
    </div>
      <button className=' text-lg text-primary dark my-8 mx-1 py-3 px-14 rounded bg-primary-light text-primary-dark hover:text-highlight' onClick={(quit)}>finish</button>
    </div>
  ) : (
    <div className='justify-center py-2 w-[100vw] h-[90vh] text-lg text-primary dark'>
    
    <h1 className='text-4xl text-primary dark'> {stateWorkoutName} </h1>
    <h2 className='text-4xl text-primary dark'> Exercise #{step.relativePosition} - {exercise.exerciseName} for {step.sets} sets </h2>
    <p> GOALS: weight = {goal.weight ?? `not set`} lbs  reps = {goal.reps ?? `not set`}  total sets = {goal.sets ?? `not set`}  time = {goal.time ?? `not set`} mins </p>
    <div className='w-[100vw] flex justify-center'>
        <img src={placeholder} alt="a silly dumbbell I drew in ms paint" />
    </div>

    
    <p>{exercise.exerciseType.typeName} for {exercise.muscleGroup.groupName} </p>


    <button className=' text-lg text-primary dark my-1 mx-1 py-3 px-3 rounded bg-primary-light text-primary-dark hover:text-highlight' onClick={(quit)}>quit</button>
    {availableButtons}

    {currentDataRecord}
    </div>

  )
}

export default ActiveWorkout