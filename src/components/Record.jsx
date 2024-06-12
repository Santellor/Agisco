import Field from './Field';
import EditButtons from './EditButtons';
import { useEffect, useReducer, useState } from 'react';

// const Record = ({values, modelRef, parentIndex, edit, remove}) => {
const Record = ({values, parentIndex, modelRef }) => {
  

  //create dynamic states with reducers. Since this is only used locally, I decided not to use redux this time
  const initialState = {}
  const reducer = (state, action) => {
    switch (action.type) {
      case 'EDIT_FIELD' :
        return {
          ...state,
          [action.field]: action.value
        };
      default:
        return state
    }
  };
  const [state, dispatch] = useReducer(reducer, initialState)
  const [editing, setEditing] = useState(false)
  const [deleting, setDeleting] = useState(false)
  
  const editRecord = () => {
    // entry
    
    // edit(modelref, id, entry)
    toggleEdit()
  }
    
  const toggleEdit = () => {
    setEditing(!editing)
  }
      
  const toggleDelete = () => {
    setDeleting(!deleting)
  }
        
//remove timestamps to cut down on clutter
delete values.updatedAt
delete values.createdAt
// create an index to match up to 99 keys per record, using the parent record index to differentiate field keys
let i = 0
i += parentIndex * 100




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

//loop through values. for each value, we must create a state and then a setter 
for (let value in values) {
  // filter out the primary key
  if (value !== Object.keys(values)[0]) {
    if(initialState !== undefined) initialState[i] = values[value]
    dynamicRecord.push (<Field key={i} data={state[i]} dispatch={() => dispatch }/>)
    i++
  }
}

useEffect(()=> {
  console.log(`initialState`, initialState)
 console.log(`state`, state)
 console.log(!initialState[101])
 console.log(initialState[101])
 },[values] )

 
  return (
    <tr>
        {dynamicRecord}
    </tr>
  )
}

export default Record