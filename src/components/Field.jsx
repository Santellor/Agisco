import {useState, useEffect} from 'react'
import { IoIosCheckmarkCircle } from "react-icons/io";
import { IoIosCloseCircle } from "react-icons/io";
import axios from 'axios'

const Field = ({data, editing, setter, eagerField, unique }) => {
  const [options, setOptions] = useState([])
  const [checked, setChecked] = useState(data)

  let type = typeof data 
  if (eagerField) {
    type = 'indirect'
  } 

    useEffect (() => {
      if (eagerField !== undefined && editing === true ) {

        const loadDropdownOptions = async () => {

          eagerField = eagerField ?? 'users'
          const res = await axios.get(`/api/field_dropdown/${eagerField}`)
    
          const selectOptions = res.data.map((el, i) => {
          return <option key={i+1} value={el[0]}>{el[1]}</option>
          })
          selectOptions.unshift(<option key={0} >pick a new value</option>)
          setOptions(selectOptions)
        }
        loadDropdownOptions()
      }

    },[editing])
    




  const toggleBoolean = (input) => {

     setChecked(!input)

     return !checked

}

const preserveTypeIntegrity = (userInput) => {

  console.log(userInput)
  console.log(type)
  console.log(+userInput)
  console.log( isNaN(userInput))

  
  if (type === 'number' && isNaN(userInput) ) { 
    console.log(`fired`)
    userInput = 0
  }
  console.log(userInput)

  switch(type) {
    case 'number' : return setter(+userInput)
    case 'boolean' : return setter(toggleBoolean)
    case 'indirect' : return setter(userInput)
      default : return setter(userInput)
    }
}

  return setter && editing && eagerField !== undefined? (
    <select className='w-min' onChange={(e) => preserveTypeIntegrity(e.target.value)}>
      {options}
    </select>

  ) : setter && editing && type === 'boolean' && checked === true ? (
    <div className='flex justify-center text-2xl' onClick={(e) => preserveTypeIntegrity(e.target.value)}>< IoIosCheckmarkCircle /></div>
  ) : setter && editing && type === 'boolean' && checked === false ? (
    <div className='flex justify-center text-2xl' onClick={(e) => preserveTypeIntegrity(e.target.value)}><IoIosCloseCircle /></div>
  ) : setter && editing? (
    <input className='w-auto' type="text" value={data} onChange={(e) => preserveTypeIntegrity(e.target.value)}/>
  ) : data === false ? (
    <div className='flex justify-center text-2xl'>
      <IoIosCloseCircle />
    </div>
  ) : data === true ? (
    <div className='flex justify-center w-max text-2xl'>
      < IoIosCheckmarkCircle />
    </div>
  ) : (
    <div className='self-center w-max'>
      {String(data)}
    </div>
  )
}

export default Field
//FOR ALL

  // Name should be split
    //NEW HEADER ALIASES for workoutName as workout, exerciseName as exercise, groupName as muscle Group, typeName as type

  // all headers should capitalize the first letter of every input
  
  //field default date 
    // updated at as date
    // before passing to fields, I will need a way to trim off either date

    //exceptions
    // workout instances, workout step data
      // created at as date

    //result
      // NEW FIELD TYPE - date 
      // NEW HEADER ALIAS updated at as updated On
      // NEW FIELD ALIAS 'timestamp' as `Dec 31 2023` 
      // NEW HEADER ALIAS created at as created On
        // EXISTING FIELD ALIAS 'timestamp' as `Dec 31 2023`

    //first field should always be set to a null value
      //NEW HEADER ALIAS first field as ""

//users
  // 
//preferences 
  // NEW FIELD TYPE - boolean 
  // NEW FIELD ALIASES - dark mode and metric as checkbox 
//workouts
  // NEW HEADER ALIAS email as creator
//Workout Instances
  // NEW HEADER ALIAS workout ID as workout
  // NEW FIELD ALIAS workout ID as workouts.name where workoutId = providedUserID
    // EXISTING ALIASES - CREATOR type
//Workout Step Data
  // NEW FIELD TYPE - integer 
  // NEW FIELD UNIT - weight as weight WITH kg or lbs outside the text entry
  // NEW FIELD UNIT - time as time WITH mins outside the text entry
  // NEW HEADER ALIAS - Workout Step Id as step
  // NEW FIELD ALIAS workout Step ID as workoutSteps.relativePosition where workoutStepId = id 
  // NEW HEADER ALIAS - instance ID as workout
  // NEW FIELD ALIAS instance ID as workout.name, workout.id where instance id = id FROM instance, then workout.name where workout.id = id FROM workout
//Workout Step
  //NEW HEADER ALIAS exercise ID as exercise
  //NEW FIELD ALIAS exercise id as exercise.name where exercise ID = id
  //NEW HEADER ALIAS relativePosition as step
    // EXISTING ALIASES - WORKOUT type
//Goals
    // EXISTING ALIASES - CREATOR, EXERCISE types
    // EXISTING UNITS - WEIGHT, TIME
// Exercises
  //NEW HEADER ALIAS videoLink as video Link
  //NEW INDIRECT UPDATE 
        //NEW FIELD ALIAS group id as group.name where group id = id
        //ON EDIT dropdown containing list of all groups. when changed, initial value is changed to a specified key with setter
          //call - load
  //NEW INDIRECT UPDATE 
        //NEW FIELD ALIAS type id as type.name where type id = id
        //ON EDIT dropdown containing list of all types. when changed, initial value is changed to a specified key with setter
          //call - load
// muscle groups
        //NEW HEADER ALIAS groupDesc as description
// exercise types
        //NEW HEADER ALIAS groupDesc as description
