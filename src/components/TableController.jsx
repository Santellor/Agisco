import {useEffect, useState} from 'react'
import axios from 'axios';
import { useDispatch, useSelector} from 'react-redux'

const TableController = ({modelRef, filter, filterSetter, addRecord}) => {
    const userId = useSelector((state) => state.userId);
    const workoutId = useSelector((state) => state.workoutId);
    const exerciseId = useSelector((state) => state.exerciseId);
    const groupId = useSelector((state) => state.groupId);
    const typeId = useSelector((state) => state.typeId);
    const instanceId = useSelector((state) => state.instanceId);
    const workoutStepId = useSelector((state) => state.workoutStepId);
    const [template, setTemplate] = useState({})
    const dispatch = useDispatch() 

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
    filterSetter({})

      loadTemplate()
  }, [modelRef])
  let recordObjectCopy = template

  delete recordObjectCopy[wrongTimeRef]
  let cutoffIndex = Object.keys(recordObjectCopy).indexOf(timeRef) + 1

  for (let key in recordObjectCopy) {
    if (typeof recordObjectCopy[key] === 'object') {
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
    const unfilteredTemplateKeys=Object.keys(recordObjectCopy)
    const templateSpecialKeys = [...unfilteredTemplateKeys.slice(cutoffIndex)]

    let dynamicKeys = []
    for ( let key of templateSpecialKeys) {
        dynamicKeys.push(dynamicRefs[key])
    }

    let staticValues = []
    for (let value of templateValues) {
        let valueType = typeof value 

        
            if (valueType === 'number') staticValues.push(1)
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
        const newFilter = {...filter, column: userColumnInput}
        filterSetter(newFilter)
    } 

    let selectCopy = [...templateFinalKeys]

    let defaultOptionIndex = selectCopy.indexOf(filter.column)
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
        const newFilter = {...filter, value: userValueInput}
        filterSetter(newFilter)
    } 

    // and arrows for determining offset
    const changeFilterOffset = (userOffsetInput) => {
        if (filter.offset === undefined) filter.offset = 0
        if (filter.offset + userOffsetInput < 0) filter.offset = -userOffsetInput
        const newFilter = {...filter, offset: filter.offset + userOffsetInput}
        filterSetter(newFilter)
    } 

    let searchField = filter.value ?? ''
    let searchColumn = filter.column ?? 'search a column'


  return (
  <>
    <select value={searchColumn} onChange={(e) => changeFilterColumn(e.target.value)}>
      {options}
    </select>
    <input type="text" value={searchField} placeholder='search for a value' onChange={(e) => changeFilterValue(e.target.value)}/>
    <button onClick={() => addRecord(newRecord)}>add new</button>
    <button onClick={() => changeFilterOffset(20)}>next</button>
    <button onClick={() => changeFilterOffset(-20)}>back</button>
  
  </>
  )
}

export default TableController