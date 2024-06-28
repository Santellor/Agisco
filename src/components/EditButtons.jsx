import React from 'react'

// const EditButtons = ({edit, editing, toggleEdit, remove, deleting, toggleDelete}) => {
const EditButtons = ({ editRecord, editing, toggleEdit, removeRecord, deleting, toggleDelete}) => {
  if (editing) {
    return (
        <div className='flex justify-center'>
            <button className=' text-lg text-primary dark my-1 py-2 px-3 rounded bg-primary-dark text-primary-light hover:text-highlight' onClick={editRecord}>save</button>
        </div>
    )
} else if (deleting) {
    return (
        <div className='flex justify-center'>
            <button className=' text-lg text-primary dark my-1 mx-1 py-2 px-3 rounded bg-primary-dark text-primary-light hover:text-highlight' onClick={removeRecord}>confirm delete</button>
            <button className=' text-lg text-primary dark my-1 mr-1 py-2 px-3 rounded bg-primary-dark text-primary-light hover:text-highlight' onClick={toggleDelete}>back</button>
        </div>          
    )
} else {
    return (
        <div className='flex justify-center'>
            <button className=' text-lg text-primary dark my-1 mx-1 py-2 px-3 rounded bg-primary-dark text-primary-light hover:text-highlight' onClick={toggleDelete}>delete</button>
            <button className=' text-lg text-primary dark my-1 mr-1 py-2 px-3 rounded bg-primary-dark text-primary-light hover:text-highlight' onClick={toggleEdit}>edit</button>
        </div>           
    )
}
}

export default EditButtons