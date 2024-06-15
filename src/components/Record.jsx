import Field from './Field';
import EditButtons from './EditButtons';
import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';

const Record = ({recordObject, modelRef, parentIndex, edit, remove}) => {

  let timeRef, wrongTimeRef;
  if (modelRef !== 'workout_instances' || modelRef !== 'workout_step_data') {
    timeRef = 'updatedAt'
    wrongTimeRef = 'createdAt'
  } else {}
    timeRef = 'createdAt'
    wrongTimeRef= 'updatedAt'

  let fieldValuesArray = []

  let recordObjectCopy = {...recordObject}
  console.log(`record object copy`, recordObjectCopy)

  delete recordObjectCopy[wrongTimeRef]
  let cutoffIndex = Object.keys(recordObjectCopy).indexOf(timeRef) + 1

  for (let element in recordObjectCopy) {
      console.log(`typeof for key`, typeof recordObjectCopy[element])
    if (typeof recordObjectCopy[element] === 'object') {
      let nestedValues = Object.values(recordObjectCopy[element])
      console.log(`nestedValues`, nestedValues)
      delete recordObjectCopy[element]
      fieldValuesArray = [...fieldValuesArray, ...nestedValues] 
    }
  }

  console.log(`after loop`, recordObjectCopy)
  console.log(`before merge`,fieldValuesArray)

  let filteredRecordValuesArray = Object.values(recordObjectCopy).slice(1,cutoffIndex)
  fieldValuesArray = [ ...fieldValuesArray, ...filteredRecordValuesArray]

  console.log(`after merge`,fieldValuesArray)
 
  const editingRefs = { 
    users: [1,2], 
    preferences: [1,2],
    workouts: [1],
    workout_instances: [],
    workout_step_data: [1,2,3,4],
    workout_steps: [1,2],
    goals: [1,2,3,4],
    exercises: [1,2,3,7,8],
    muscle_groups: [1,2],
    exercise_types: [1,2],
  }

  const crudArrayRef = editingRefs[modelRef]
  const entry = {}

  const [editing, setEditing] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [editingField1, setEditingField1] = useState(fieldValuesArray[crudArrayRef[0]])
  const [editingField2, setEditingField2] = useState(fieldValuesArray[crudArrayRef[1]])
  const [editingField3, setEditingField3] = useState(fieldValuesArray[crudArrayRef[2]])
  const [editingField4, setEditingField4] = useState(fieldValuesArray[crudArrayRef[3]])
  const [editingField5, setEditingField5] = useState(fieldValuesArray[crudArrayRef[4]])
  const [editingField6, setEditingField6] = useState(fieldValuesArray[crudArrayRef[5]])

  useEffect( ()=> {
    if (editingField1 !== undefined) entry[fieldValuesArray[crudArrayRef[0]]] = editingField1
    if (editingField1 !== undefined) entry[fieldValuesArray[crudArrayRef[1]]] = editingField2
    if (editingField1 !== undefined) entry[fieldValuesArray[crudArrayRef[2]]] = editingField3
    if (editingField1 !== undefined) entry[fieldValuesArray[crudArrayRef[3]]] = editingField4
    if (editingField1 !== undefined) entry[fieldValuesArray[crudArrayRef[4]]] = editingField5
    if (editingField1 !== undefined) entry[fieldValuesArray[crudArrayRef[5]]] = editingField6
    delete entry.undefined
    console.log(`entry`, entry)
    },[editing])
 
  const valuePropStack = [editingField6, editingField5, editingField4, editingField3, editingField2, editingField1] 
  const setterPropStack = [setEditingField6, setEditingField5, setEditingField4, setEditingField3, setEditingField2, setEditingField1] 

  const editRecord = () => {
    console.log(`modelRef`, modelRef)
    console.log(`parentIndex`, parentIndex)
    console.log(`entry`, entry)
    // edit(modelRef, parentIndex, entry)
    toggleEdit()
  }

  const removeRecord = () => {
    console.log(`modelRef`, modelRef)
    console.log(`parentIndex`, parentIndex)
    // remove(modelRef, parentIndex)
  }
    
  const toggleEdit = () => {
    setEditing(!editing)
  }
      
  const toggleDelete = () => {
    setDeleting(!deleting)
  }
        
// create an index to match up to 99 keys per record, using the parent record index to differentiate field keys
let i = parentIndex * 100

//create our record, beginning with a component for buttons

  // Deletion and editing should only render the buttons if the logged in user is the owner
    // if admin, ignore this
    // if a USERid is present, use that immediately
    // if not, search using 
        // workout step data -> instance id -> userID of instance where instanceid = instanceid
        // workout step -> workout id -> userID of workout where workoutid = workoutid


let dynamicRecord = [ <EditButtons 
                        key={i}
                        editRecord={editRecord}
                        editing={editing}
                        toggleEdit={() => toggleEdit()}
                        removeRecord={removeRecord}
                        deleting={deleting} 
                        toggleDelete={() => toggleDelete()} 
                    />]
i++

//loop through values. for each CRUD value, we must send a state value and then a setter 
for (let fieldValue of fieldValuesArray) {
  // filter out the primary key
  // if (String(key) !== String(Object.keys(recordObject)[0])) {
    if (crudArrayRef.includes(i-parentIndex*100-1)) {
      dynamicRecord.push (<Field key={i} 
                                 editing={editing}
                                 data={valuePropStack.pop()} 
                                 setter={setterPropStack.pop()}/>)
    }
    else {
      dynamicRecord.push (<Field key={i}
                                 editing={editing} 
                                 data={fieldValue}/>)
    }
    i++
  // }
}

return (
    <tr>
        {dynamicRecord}
    </tr>
  )
}

export default Record