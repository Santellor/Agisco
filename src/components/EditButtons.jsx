import React from 'react'
import { FaRegTrashAlt } from 'react-icons/fa'
import { IoPencil } from "react-icons/io5";
import { RiArrowGoBackFill } from "react-icons/ri";
import { IoIosCheckmarkCircle } from "react-icons/io";



// const EditButtons = ({edit, editing, toggleEdit, remove, deleting, toggleDelete}) => {
const EditButtons = ({ editRecord, editing, toggleEdit, removeRecord, deleting, toggleDelete, gridStart}) => {

  if (editing) {
    return (
        <div className={`flex flex-row justify-center h-auto content-center bg-neutral ${gridStart}`}>
            <button className='border-highlight border-b-2 self-center text-lg my-1 mr-4 h-min py-2 px-3 rounded  bg-primary-dark text-primary-light hover:text-highlight' onClick={editRecord}><IoIosCheckmarkCircle /></button>
        </div>
    )
} else if (deleting) {
    return (
        <div className={`flex flex-row justify-center h-auto content-center bg-neutral ${gridStart}`}>
            <button className='border-highlight border-b-2 self-center text-lg my-1 mx-1 h-min py-2 px-3 rounded bg-primary-dark text-primary-light hover:text-red-700' onClick={removeRecord}><FaRegTrashAlt /></button>
            <button className='border-highlight border-b-2 self-center text-lg my-1 mr-4 h-min py-2 px-3 rounded bg-primary-dark text-primary-light hover:text-highlight' onClick={toggleDelete}><RiArrowGoBackFill /></button>
        </div>          
    )
} else {
    return (
        <div className={`flex flex-row justify-center content-center bg-neutral ${gridStart}`}>
            <button className='border-highlight border-b-2 self-center text-lg my-1 mx-1 h-min py-2 px-3 rounded bg-primary-dark text-primary-light hover:text-highlight' onClick={toggleDelete}><FaRegTrashAlt /></button>
            <button className='border-highlight border-b-2 self-center text-lg my-1 mr-4 h-min py-2 px-3 rounded bg-primary-dark text-primary-light hover:text-highlight' onClick={toggleEdit}><IoPencil /></button>
        </div>           
    )
}
}

export default EditButtons