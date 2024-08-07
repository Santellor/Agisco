import {useEffect, useState} from 'react'
import axios from 'axios';
import { useDispatch, useSelector} from 'react-redux'
import { IoIosArrowDroprightCircle } from "react-icons/io";
import { IoIosArrowDropleftCircle } from "react-icons/io";
import { IoIosAddCircle } from "react-icons/io";




const TableController = ({modelRef, searchColumn, setSearchColumn, searchValue, setSearchValue, searchOffset, setSearchOffset, displayFieldKeys, viewController, addRecord}) => {
    const userId = useSelector((state) => state.userId);
    const workoutId = useSelector((state) => state.workoutId);
    const exerciseId = useSelector((state) => state.exerciseId);
    const groupId = useSelector((state) => state.groupId);
    const typeId = useSelector((state) => state.typeId);
    const instanceId = useSelector((state) => state.instanceId);
    const workoutStepId = useSelector((state) => state.workoutStepId);
    const [template, setTemplate] = useState({})
    const dispatch = useDispatch() 

    if (viewController === false) return (<></>)

    let dynamicRefs = {
        userId: userId,
        workoutId: workoutId,
        exerciseId: exerciseId,
        groupId: groupId,
        typeId: typeId,
        instanceId: instanceId,
        workoutStepId: workoutStepId,
    }

    let timeRef, wrongTimeRef;
  if (modelRef !== 'workout_instances' || modelRef !== 'workout_step_data') {
    timeRef = 'updatedAt'
    wrongTimeRef = 'createdAt'
  } else {}
    timeRef = 'createdAt'
    wrongTimeRef= 'updatedAt'

  let fieldKeysArray = []

  const loadTemplate = async () => {
    
    let {data} = await axios.get(`/api/load/${modelRef}/all`)

    setTemplate(data[0])

  }

  useEffect(() => {
    setTemplate({})

    loadTemplate()
  }, [modelRef])
  let recordObjectCopy = template
  console.table(template)

  delete recordObjectCopy[wrongTimeRef]
  let cutoffIndex = Object.keys(recordObjectCopy).indexOf(timeRef) + 1

  for (let key in recordObjectCopy) {
    if (recordObjectCopy[key] === null) key = "n/a"
    else if (typeof recordObjectCopy[key] === 'object') {
      let nestedKeys = Object.keys(recordObjectCopy[key])
      delete recordObjectCopy[key] 
      fieldKeysArray = [...fieldKeysArray, ...nestedKeys]
    }
  }

  let filteredRecordKeysArray = Object.keys(recordObjectCopy).slice(1,cutoffIndex)
  let templatePureKeys = filteredRecordKeysArray.slice(0, -1)
  let filteredRecordValuesArray = Object.values(recordObjectCopy).slice(1,cutoffIndex)
  let templateValues = filteredRecordValuesArray.slice(0, -1) 
  
  fieldKeysArray = [...fieldKeysArray, ...filteredRecordKeysArray]

    let headerOptionsCopy = [...fieldKeysArray]
    headerOptionsCopy = headerOptionsCopy.slice(1)

    const newRecord = {} 
    const unfilteredTemplate=Object.keys(recordObjectCopy)
    const templateSpecialKeys = [...unfilteredTemplate.slice(cutoffIndex)]

    let dynamicKeys = []
    for ( let key of templateSpecialKeys) {
        dynamicKeys.push(dynamicRefs[key])
    }

    let staticValues = []
    for (let value of templateValues) {
        let valueType = typeof value 

            if (valueType === 'number') staticValues.push(0)
            else if (valueType === 'boolean') staticValues.push(false)
            else staticValues.push(`new`)
        
    }

    const templateFinalKeys = [...templateSpecialKeys, ...templatePureKeys]

    for (let key of templateFinalKeys) {
        // console.log(key, dynamicValues)
       if(templateSpecialKeys.includes(key)) newRecord[key] = dynamicKeys.shift()
       else newRecord[key] = staticValues.shift()
    }

    // (columns dropdown, 
    let options = []

    const changeFilterColumn = (userColumnInput) => {
        setSearchColumn(userColumnInput)
    } 

    let selectCopy = [...displayFieldKeys].slice(1)

    let defaultOptionIndex = selectCopy.indexOf(searchColumn)
    if(defaultOptionIndex >= 0) {
        let defaultOption = selectCopy[defaultOptionIndex]
        selectCopy.splice(defaultOptionIndex, 1)
        options.push(<option key={0} value={defaultOption}>{defaultOption}</option>)
        options.push(<option key={1} value=''>search a column</option>)
    } else {
        options.push(<option key={0} value=''>search a column</option>)
    }
    options = [...options, selectCopy.map((el, i) => {
        return <option key={i+options.length} value={el}>{el}</option>
        })
    ]

   

    // value text input),

    const changeFilterValue = (userValueInput) => {
        setSearchValue(userValueInput)
    } 

    // and arrows for determining offset
    const changeFilterOffset = (userOffsetInput) => {
        if (searchOffset + userOffsetInput < 0) setSearchOffset(0)
        else setSearchOffset(searchOffset + userOffsetInput)
    } 

    let field = searchValue ?? ''
    let column = searchColumn ?? 'search a column'


  return (
  <div className='fixed top-[17.4rem] w-[22vw] flex flex-col bg-primary-dark text-highlight'>
    <select className='bg-neutral dark:bg-slate-900 dark:text-primary-light self-center text-lg text-primary-dark mx-1 px-2 py-3 my-2 w-[18vw] rounded' value={column} onChange={(e) => changeFilterColumn(e.target.value)}>
      {options}
    </select> 
    <input className='bg-neutral dark:bg-slate-900 dark:text-primary-light self-center text-lg text-primary-dark mx-1 px-2 py-3 my-2 w-[18vw] rounded' type="text" value={field} placeholder='search for a value' onChange={(e) => changeFilterValue(e.target.value)}/> 
    <div>
      <button className=' self-center text-2xl my-2 mx-1 py-3 px-3 rounded bg-primary-light text-primary-dark hover:text-highlight' onClick={() => addRecord(newRecord)}><IoIosAddCircle /></button>
      <button className=' self-center text-2xl my-2 mx-1 py-3 px-3 rounded bg-primary-light text-primary-dark hover:text-highlight' onClick={() => changeFilterOffset(-1)}><IoIosArrowDropleftCircle /></button>
      <button className=' self-center text-2xl my-2 mx-1 py-3 px-3 rounded bg-primary-light text-primary-dark hover:text-highlight' onClick={() => changeFilterOffset(1)}><IoIosArrowDroprightCircle /></button>
    </div>    
  
  </div>
  )
}

export default TableController