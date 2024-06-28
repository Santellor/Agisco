import Field from './Field';
import EditButtons from './EditButtons';
import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';

const Record = ({recordObject, modelRef, parentIndex, edit, remove, cutoffIndex}) => {

  // console.log(`recordObject`, recordObject) 

  let timeRef, wrongTimeRef;
  if (modelRef !== 'workout_instances' || modelRef !== 'workout_step_data') {
    timeRef = 'updatedAt'
  } else {
    timeRef = 'createdAt'
  }

  let fieldValuesArray = []
  let fieldKeysArray = []

  let recordObjectCopy = {...recordObject}
  for (let key in recordObjectCopy) {
    if (typeof recordObjectCopy[key] === 'object') {
      let nestedValues = Object.values(recordObjectCopy[key])
      let nestedKeys = Object.keys(recordObjectCopy[key])
      delete recordObjectCopy[key]
      fieldValuesArray = [...fieldValuesArray, ...nestedValues] 
      fieldKeysArray = [...fieldKeysArray, ...nestedKeys]
    }
  }

  let filteredRecordValuesArray = Object.values(recordObjectCopy)
  const trueId = filteredRecordValuesArray.shift()
  let filteredRecordKeysArray = Object.keys(recordObjectCopy).slice(1)
  fieldValuesArray = [ ...fieldValuesArray, ...filteredRecordValuesArray]
  fieldKeysArray = [...fieldKeysArray, ...filteredRecordKeysArray]

 
  const editingRefs = { 
    users: [0,1], 
    preferences: [1,2],
    workouts: [1],
    workout_instances: [],
    workout_step_data: [1,2,3,4],
    workout_steps: [0,1,2,3],
    goals: [1,2,3,4,5],
    exercises: [1,2,3,4,5],
    muscle_groups: [0,1],
    exercise_types: [0,1],
  }

  const eagerFields = { 
    users: [],  
    preferences: ['users'], 
    workouts: ['users'], 
    workout_instances: ['workouts', 'users'],
    workout_step_data: [],
    workout_steps: ['exercises','workouts'],
    goals: ['exercises', `users`],
    exercises: ['exercise_types', 'muscle_groups', 'users'],
    muscle_groups: [],
    exercise_types: [],
  }

  const uniqueFields = { 
    users: [],  
    preferences: [], 
    workouts: [], 
    workout_instances: [],
    workout_step_data: [],
    workout_steps: [2],
    goals: [],
    exercises: [],
    muscle_groups: [],
    exercise_types: [],
  }

  const crudArrayRef = editingRefs[modelRef]
  let eagerFieldArray = eagerFields[modelRef]

  let displayFieldValues = fieldValuesArray.slice(0,cutoffIndex-1)
  
  if (eagerFieldArray.length > 0 ) {

    
    let eagerFieldIndirectKeys = Object.keys({...recordObject}).slice(-eagerFieldArray.length)
    fieldKeysArray = [...eagerFieldIndirectKeys, ...fieldKeysArray.slice(eagerFieldIndirectKeys.length)]
    let eagerFieldIndirectValues = Object.values({...recordObject}).slice(-eagerFieldArray.length)
    fieldValuesArray = [...eagerFieldIndirectValues, ...fieldValuesArray.slice(eagerFieldIndirectKeys.length)]
    
    // console.log(`eagerFieldIndirectKeys`, eagerFieldIndirectKeys)
    // console.log(`fieldKeysArray`, fieldKeysArray)
    // console.log(`eagerFieldIndirectValues`, eagerFieldIndirectValues)
    // console.log(`fieldValuesArray`, fieldValuesArray)
    
  }
  
  
  let uniqueFieldArray = uniqueFields[modelRef]

  const [editing, setEditing] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [editingField1, setEditingField1] = useState(fieldValuesArray[crudArrayRef[0]])
  const [editingField2, setEditingField2] = useState(fieldValuesArray[crudArrayRef[1]])
  const [editingField3, setEditingField3] = useState(fieldValuesArray[crudArrayRef[2]])
  const [editingField4, setEditingField4] = useState(fieldValuesArray[crudArrayRef[3]])
  const [editingField5, setEditingField5] = useState(fieldValuesArray[crudArrayRef[4]])
  const [editingField6, setEditingField6] = useState(fieldValuesArray[crudArrayRef[5]])
  let entry = {}
    if (editingField1 !== undefined) entry[fieldKeysArray[crudArrayRef[0]]] = editingField1
    if (editingField1 !== undefined) entry[fieldKeysArray[crudArrayRef[1]]] = editingField2
    if (editingField1 !== undefined) entry[fieldKeysArray[crudArrayRef[2]]] = editingField3
    if (editingField1 !== undefined) entry[fieldKeysArray[crudArrayRef[3]]] = editingField4
    if (editingField1 !== undefined) entry[fieldKeysArray[crudArrayRef[4]]] = editingField5
    if (editingField1 !== undefined) entry[fieldKeysArray[crudArrayRef[5]]] = editingField6
    delete entry.undefined
    // console.log(`entry`, entry)
 
  const valuePropStack = [editingField6, editingField5, editingField4, editingField3, editingField2, editingField1] 
  const setterPropStack = [setEditingField6, setEditingField5, setEditingField4, setEditingField3, setEditingField2, setEditingField1] 

  const editRecord = () => {
    console.log(`trueId`, trueId)
    console.log(`entry`, entry)
    edit(trueId, entry)
    toggleEdit()
  }

  const removeRecord = () => {
    console.log(`trueId`, trueId)
    remove(trueId)
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
for (let fieldValue of displayFieldValues) {
    
    if ( crudArrayRef.includes(i-parentIndex*100-1) && eagerFieldArray.length > 0 ) {
      dynamicRecord.push (
        <div key={i} className=' border-l-2 content-center border-highlight text-center px-2'>
          <Field  
            editing={editing}
            data={fieldValue} 
            setter={setterPropStack.pop()}
            eagerField = {eagerFieldArray.pop()}/>
        </div>
      )
      valuePropStack.pop()
    } else if (crudArrayRef.includes(i-parentIndex*100-1) && uniqueFieldArray.includes(i-parentIndex*100-1)) {
      dynamicRecord.push (
        <div key={i} className=' border-l-2 content-center border-highlight text-center px-2'>
          <Field  
            editing={editing}
            data={valuePropStack.pop()} 
            setter={setterPropStack.pop()}
            unique={true}/>
        </div>    
      )
    } else if (crudArrayRef.includes(i-parentIndex*100-1)) {
      dynamicRecord.push (
        <div key={i} className=' border-l-2 content-center border-highlight text-center px-2'>
          <Field  
            editing={editing}
            data={valuePropStack.pop()} 
            setter={setterPropStack.pop()}/>
        </div>    
      )
    }
    else {
      dynamicRecord.push (
        <div  key={i} className=' border-l-2 content-center border-highlight text-center px-2'>
          <Field
            editing={editing} 
            data={fieldValue}/>
        </div>
      )
      eagerFieldArray.pop()
    }
    i++
  // }
}

return (
    <>
    
    {dynamicRecord}
    </>
    
  )
}

export default Record