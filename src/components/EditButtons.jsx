import React from 'react'

// const EditButtons = ({edit, editing, toggleEdit, remove, deleting, toggleDelete}) => {
const EditButtons = ({ editRecord, editing, toggleEdit, deleting, toggleDelete}) => {
  if (editing) {
    return (
        <td>
            <button onClick={editRecord}>Save</button>
        </td>
    )
} else if (deleting) {
    return (
        <td>
            <button onClick={null}>Confirm Delete</button>
            <button onClick={toggleDelete}>Back</button>
        </td>          
    )
} else {
    return (
        <td>
            <button onClick={toggleDelete}>Delete</button>
            <button onClick={toggleEdit}>Edit</button>
        </td>          
    )
}
}

export default EditButtons