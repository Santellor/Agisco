import React from 'react'

const EditButtons = ({edit, isEditing, removeDate}) => {
  if (isEditing) {
    return (
        <td>
            <button onClick={edit}>Save</button>
        </td>
    )
} else {
    return (
        <td>
            <button onClick={removeDate}>Delete</button>
            <button onClick={edit}>Edit</button>
        </td>          
    )
   
}
}

export default EditButtons