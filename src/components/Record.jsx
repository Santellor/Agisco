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
    console.log(`entry`, entry)
 
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
console.log(`parentIndex`, parentIndex)

let rowPosition = +parentIndex + 1 

let gridStart
    switch (rowPosition) {
        case 20 : gridStart = 'row-start-74'
                break
        case 19 : gridStart = 'row-start-70'
                break
        case 18 : gridStart = 'row-start-66'
                break
        case 17 : gridStart = 'row-start-62'
                break
        case 16 : gridStart = 'row-start-58'
                break
        case 15 : gridStart = 'row-start-54'
                break
        case 14 : gridStart = 'row-start-50'
                break
        case 13 : gridStart = 'row-start-46'
                break
        case 12 : gridStart = 'row-start-42'
                break
        case 11 : gridStart = 'row-start-38'
                break
        case 10 : gridStart = 'row-start-34'
                break
        case 9 : gridStart = 'row-start-30'
                break
        case 8 : gridStart = 'row-start-26'
                break
        case 7 : gridStart = 'row-start-22'
                break
        case 6 : gridStart = 'row-start-18'
                break
        case 5 : gridStart = 'row-start-14'
                break
        case 4 : gridStart = 'row-start-10'
                break
        case 3 : gridStart = 'row-start-6'
                break
        default : gridStart = 'row-start-2'
                break
    }

//create our record, beginning with a component for buttons

let dynamicRecord = [ <EditButtons 
                        key={i}
                        gridStart={gridStart}
                        editRecord={editRecord}
                        editing={editing}
                        toggleEdit={() => toggleEdit()}
                        removeRecord={removeRecord}
                        deleting={deleting} 
                        toggleDelete={() => toggleDelete()} 
                    />,
                    <div className={`border-b-gray-400 border-b-2 rounded-l-xl ${gridStart} pl-2 my-1 bg-secondary-light dark:bg-slate-600 dark:border-b-slate-600`}>
                    </div>
                  ]
i++

let BorderRef = {
  false: 'border-r-[2px]',
  true: ''
}

//loop through values. for each CRUD value, we must send a state value and then a setter 

let GridStartNum = +gridStart.replace(/[^0-9.]/g, '')
let GridStartTest1 = `row-start-${GridStartNum+1}`
let GridStartTest2 = `row-start-${GridStartNum+2}`
let GridStartTest3 = `row-start-${GridStartNum+3}`

let sillies1 = [
  <span className={`${GridStartTest1} invisible`}>1</span>,
  <span className={`${GridStartTest1} invisible`}>1</span>,
  <span className={`${GridStartTest1} invisible`}>1</span>
]
let sillies2 = [
  <span className={`${GridStartTest2} invisible`}>2</span>,
  <span className={`${GridStartTest2} invisible`}>2</span>,
  <span className={`${GridStartTest2} invisible`}>2</span>
]
let sillies3 = [
  <span className={`${GridStartTest3} invisible`}>3</span>,
  <span className={`${GridStartTest3} invisible`}>3</span>,
  <span className={`${GridStartTest3} invisible`}>3</span>
]

for (let fieldValue of displayFieldValues) {

    let isLast = false
    if (i-parentIndex*100-1 === displayFieldValues.length-1) isLast = true
    
    if ( crudArrayRef.includes(i-parentIndex*100-1) && eagerFieldArray.length > 0 ) {
      dynamicRecord.push (
        <div key={i} className={`flex flex-col border-b-gray-400 border-b-2 my-1 bg-secondary-light dark:bg-slate-600 dark:border-b-slate-600 dark:text-secondary-light content-center ${gridStart} ${BorderRef[isLast]} px-2 border-highlight text-center`}>
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
        <div key={i} className={`flex flex-col border-b-gray-400 border-b-2 my-1 bg-secondary-light dark:bg-slate-600 dark:border-b-slate-600 dark:text-secondary-light content-center ${gridStart} ${BorderRef[isLast]} px-2 border-highlight text-center`}>
          <Field  
            editing={editing}
            data={valuePropStack.pop()} 
            setter={setterPropStack.pop()}
            unique={true}/>
        </div>    
      )
    } else if (crudArrayRef.includes(i-parentIndex*100-1)) {
      dynamicRecord.push (
        <div key={i} className={`flex flex-col border-b-gray-400 border-b-2 my-1 bg-secondary-light dark:bg-slate-600 dark:border-b-slate-600 dark:text-secondary-light content-center ${gridStart} ${BorderRef[isLast]} px-2 border-highlight text-center`}>
          <Field  
            editing={editing}
            data={valuePropStack.pop()} 
            setter={setterPropStack.pop()}/>
        </div>    
      )
    }
    else {
      dynamicRecord.push (
        <div  key={i} className={`flex flex-col border-b-gray-400 border-b-2 my-1 bg-secondary-light dark:bg-slate-600 dark:border-b-slate-600 dark:text-secondary-light content-center ${gridStart} ${BorderRef[isLast]} px-2 border-highlight text-center`}>
          <Field
            editing={editing} 
            data={fieldValue}/>
        </div>
      )
      eagerFieldArray.pop()
    }
    i++
    sillies1.push(
      <>
        <span className={`${GridStartTest1} invisible`}>1</span>
      </>
    )
    sillies2.push(
      <>
        <span className={`${GridStartTest2} invisible`}>2</span>
      </>
    )
    sillies3.push(
      <>
        <span className={`${GridStartTest3} invisible`}>3</span>
      </>
    )
  
}

dynamicRecord.push(
  <div className={`border-b-gray-400 border-b-2  rounded-r-xl ${gridStart} my-1 bg-secondary-light dark:bg-slate-600 dark:border-b-slate-600`}>
                  </div>
)


return (
    <>
    {dynamicRecord}
    {sillies1}
    {sillies2}
    {sillies3}
    </>
    
  )
}

export default Record