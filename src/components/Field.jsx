import {useState} from 'react'

const Field = ({data, editing, setter}) => {
let type = typeof data
// if (data[4] === '-' && data[6] === '-') type = 'date'

console.log(data, type)
  switch(type) {
    case 'number' :
    case 'boolean' :
    case 'date' :
    default :

  }

  // const [viewValue, setViewValue] = useState(shellCopy)

  return setter && editing?(
    <td>
    <input type="text" value={data} onChange={(e) => setter(e.target.value)}/>
    </td>
  ) : (
    <td>
        {data}
    </td>
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
