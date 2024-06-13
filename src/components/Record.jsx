import Field from './Field';
import EditButtons from './EditButtons';
import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';

const Record = ({recordObject, modelRef, parentIndex, edit, remove}) => {

  console.log(recordObject)
 
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

  const [editing, setEditing] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [crudArrayRef, setCrudArrayRef] = useState(editingRefs[modelRef])
  const [field1, setField1] = useState(recordValuesArray[crudArrayRef[0]])
  const [field2, setField2] = useState(recordValuesArray[crudArrayRef[1]])
  const [field3, setField3] = useState(recordValuesArray[crudArrayRef[2]])
  const [field4, setField4] = useState(recordValuesArray[crudArrayRef[3]])
  const [field5, setField5] = useState(recordValuesArray[crudArrayRef[4]])
  const [field6, setField6] = useState(recordValuesArray[crudArrayRef[5]])
 
  const valuePropStack = [field6, field5, field4, field3, field2, field1] 
  const setterPropStack = [setField6, setField5, setField4, setField3, setField2, setField1] 

  crudArrayRef.forEach((el) => {
    // setField1()

  })

  const editRecord = () => {
    // entry
    
    // edit(modelRef, id, entry)
    toggleEdit()
  }

  const removeRecord = () => {
    remove(modelRef, id)
    toggleEdit()
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