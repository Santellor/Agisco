import Field from './Field';
import EditButtons from './EditButtons';
import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';

const Record = ({recordObject, modelRef, parentIndex, edit, remove}) => {
 
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
  const recordValuesArray = Object.values(recordObject)
  const crudArrayRef = editingRefs[modelRef]
  const entry = {}

  const [editing, setEditing] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [editingField1, setEditingField1] = useState(recordValuesArray[crudArrayRef[0]])
  const [editingField2, setEditingField2] = useState(recordValuesArray[crudArrayRef[1]])
  const [editingField3, setEditingField3] = useState(recordValuesArray[crudArrayRef[2]])
  const [editingField4, setEditingField4] = useState(recordValuesArray[crudArrayRef[3]])
  const [editingField5, setEditingField5] = useState(recordValuesArray[crudArrayRef[4]])
  const [editingField6, setEditingField6] = useState(recordValuesArray[crudArrayRef[5]])

  useEffect( ()=> {
    if (editingField1 !== undefined) entry[recordValuesArray[crudArrayRef[0]]] = editingField1
    if (editingField1 !== undefined) entry[recordValuesArray[crudArrayRef[1]]] = editingField2
    if (editingField1 !== undefined) entry[recordValuesArray[crudArrayRef[2]]] = editingField3
    if (editingField1 !== undefined) entry[recordValuesArray[crudArrayRef[3]]] = editingField4
    if (editingField1 !== undefined) entry[recordValuesArray[crudArrayRef[4]]] = editingField5
    if (editingField1 !== undefined) entry[recordValuesArray[crudArrayRef[5]]] = editingField6
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
for (let key in recordObject) {
  // filter out the primary key
  // if (String(key) !== String(Object.keys(recordObject)[0])) {
    if (crudArrayRef.includes(i-parentIndex*100-1)) {
      dynamicRecord.push (<Field key={i} 
                                 editing={editing}
                                 data={String(valuePropStack.pop())} 
                                 setter={setterPropStack.pop()}/>)
    }
    else {
      dynamicRecord.push (<Field key={i}
                                 editing={editing} 
                                 data={String(recordObject[key])}/>)
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