import { useEffect, useState, useCallback} from 'react'
import { useSelector } from 'react-redux'
import axios from 'axios'
import Record from './Record'
import TableController from './TableController'

const Table = ({routeModelRef , filter, searchColumnDefault, searchValueDefault, viewController, defaultEditing, defaultLength}) => {

const [tableData, setTableData] = useState([])
const [filteredTableData, setFilteredTableData] = useState([])
const [spoofTableData, setSpoofTableData] = useState([])
const [modelRef, setModelRef] = useState()
const [searchColumn, setSearchColumn] = useState(searchColumnDefault)
const [searchValue, setSearchValue] = useState(searchValueDefault)
const [searchOffset, setSearchOffset] = useState(0)
const [displayFieldKeys, setDisplayFieldKeys] = useState([])
const [timeRef, setTimeRef] = useState('updatedAt')
const [wrongTimeRef, setWrongTimeRef] = useState('createdAt')
const workoutId = useSelector((state) => state.workoutId)
const workoutName = useSelector((state) => state.workoutName)

const loadTable = async () => {
  if (filter === undefined) filter = {}
  
  // create a query string
  let filterQueryString = ""
  
  // for filter specifications, loop through to add them to query
  for (let searchParam in filter) {
      filterQueryString += `${searchParam}=${filter[searchParam]}&`
      }
  
  // if none were added, we want them all! 
  if (filterQueryString === "") filterQueryString = "all"

  // if some were added, get rid of the last &
  else filterQueryString = filterQueryString.slice(0,-1)

  // for debugging
  
  // console.log(`filterQueryString`, filterQueryString)
  // console.log(`/api/load/${modelRef}/${filterQueryString}`)

// clear past table data from previous renders, then load new data
  setTableData([])
  setSpoofTableData([])
  setFilteredTableData([])
  let {data} = await axios.get(`/api/load/${routeModelRef}/${filterQueryString}`,)

  if (filter.order !== 'relativePosition') data = data.reverse()

  let nonStateWrongTimeRef  
  let nonStateTimeRef 

  if (routeModelRef === 'workout_instances' || routeModelRef === 'workout_step_data') {
    nonStateWrongTimeRef = `updatedAt`
    nonStateTimeRef = `createdAt`
  } else {
    nonStateWrongTimeRef = `createdAt`
    nonStateTimeRef = `updatedAt`

  }
  // console.log(`modelRef1`, modelRef)
  // console.log(`wrongTimeRef1`, wrongTimeRef)

  let dataCopy = [...data]
  let spoofData = []

  dataCopy.map( async (el, i) => {

    let record = el
  
      let createdDate = new Date(record.createdAt)
      let fullCreatedDate = new Intl.DateTimeFormat(
      'en-US').format(createdDate)
      record.createdAt = fullCreatedDate
      let updatedDate = new Date(record.updatedAt)
      let fullUpdatedDate = new Intl.DateTimeFormat(
      'en-US').format(updatedDate)
      record.updatedAt = fullUpdatedDate

    el = record
  })

  dataCopy.forEach((record, i) => {
    
    let fieldValuesArray = []
    let fieldKeysArray = []

  let recordObjectCopy = record
  // console.log(record)

  for (let key in recordObjectCopy) {
    if (recordObjectCopy[key] === undefined)
      delete recordObjectCopy[key]
    if (key === nonStateWrongTimeRef)
      delete recordObjectCopy[key]
    if (recordObjectCopy[key] === null)
      recordObjectCopy[key] = 0
    if (typeof recordObjectCopy[key] === 'object') {
      let nestedValues = Object.values(recordObjectCopy[key])
      let nestedKeys = Object.keys(recordObjectCopy[key])
      delete recordObjectCopy[key]
      fieldValuesArray = [...fieldValuesArray, ...nestedValues] 
      fieldKeysArray = [...fieldKeysArray, ...nestedKeys]
    }
  }
  let filteredRecordValuesArray = Object.values(recordObjectCopy)
  let filteredRecordKeysArray = Object.keys(recordObjectCopy)
  let cutoffIndex = filteredRecordKeysArray.indexOf(nonStateTimeRef)
  // console.log(cutoffIndex, nonStateTimeRef)
  let spoofFieldKeysArray = [ ...filteredRecordKeysArray.slice(0,1),  ...fieldKeysArray, ...filteredRecordKeysArray.slice(1, cutoffIndex + 1)]
  fieldValuesArray = [ ...filteredRecordValuesArray.slice(0,1), ...fieldValuesArray, ...filteredRecordValuesArray.slice(1, )]
  fieldKeysArray = [ ...filteredRecordKeysArray.slice(0,1),  ...fieldKeysArray, ...filteredRecordKeysArray.slice(1, )]

  // console.log(`1`, fieldKeysArray)

  const breakCamelCase=(camelString)=> {
    let normal = camelString.replace(/([A-Z].*)/g, '')
    normal = normal.toLowerCase()
    normal = normal.replace(`weight`, `lbs`)
    normal = normal.replace(`relative`, `#`)
    if (routeModelRef !== `users`) normal = normal.replace(`email`, `creator`)
    // normal = normal.replace( as, ' $1')
    return(normal)
  }

  let aliasKeysArray = [...spoofFieldKeysArray].map((el) => {
  return el = breakCamelCase(el)
  })

  // console.log(`2`, aliasKeysArray)
  setDisplayFieldKeys(['', ...aliasKeysArray.slice(1)])

  record = {}
  let spoofRecord = {}

  fieldValuesArray.forEach((el, i) => {
    record[fieldKeysArray[i]] = el
    spoofRecord[aliasKeysArray[i]] = el
  })
  // console.log(spoofRecord)
  // console.log(record)
  // console.log(`fieldKeysArray`, fieldKeysArray)
  // console.log(`fieldValuesArray`, fieldValuesArray)
  // console.log(`record`, record)
  dataCopy[i] = record
  spoofData[i] = spoofRecord
  })
  console.log(dataCopy)
  

  setTableData([...dataCopy])
  setSpoofTableData([...spoofData])
  setFilteredTableData([...dataCopy])
}
 
// add a record
  const addRecord = async (entry) => {
    console.log(`entry`, entry)
    let body = {}
    body.entry = entry
    await axios.post(`/api/add/${modelRef}`, body)
    await loadTable()

  }

 // remove a record
  const removeRecord = async (id) => {
    await axios.delete(`/api/remove/${modelRef}/${id}`)
    await loadTable()
}

// edit a record
const editRecord = async (id, entry) => {
  let body = {}
  body.entry = entry
  await axios.put(`/api/edit/${modelRef}/${id}`, body)
  await loadTable()
}

useEffect(() => {
    // console.log(`loader useEffect, passed ${routeModelRef} and filter: ${filter}`)
    setModelRef(routeModelRef)
    setSearchColumn(searchColumnDefault)
    setSearchValue(searchValueDefault)
    setSearchOffset(0)
    loadTable()
},[routeModelRef, filter, searchColumnDefault, searchValueDefault ])

useEffect(() => {
    // console.log(`search filter useEffect, passed ${routeModelRef}`)
    
    setFilteredTableData([...tableData])
    console.log(`searchColumn`, searchColumn)
    console.log(`searchValue`, searchValue)
    console.log(`searchOffset`, searchOffset)

    let newData = [...tableData]
    let actualSearchValue
    if (searchColumn === 'workout') actualSearchValue = workoutName
    else actualSearchValue = searchValue

    if (actualSearchValue !== undefined && searchColumn!== undefined)  
      newData = newData.map((el, i) => {
      // console.log('stage 1', el)
      // console.log('stage 2', el[searchColumn])
      // console.log('stage 3', String(el[searchColumn]).includes(searchValue))
      return String(spoofTableData[i][searchColumn]).includes(searchValue)? el = el : null
      })
      // console.log('stage 4', newData)
      // let finalData = newData.filter(el => el !== null)
    setFilteredTableData(newData.slice(searchOffset ?? 0))

    if (searchValue === "") {
      setSearchValue(undefined)
    }

},[searchColumn, searchValue, searchOffset, tableData])

const tableHead = displayFieldKeys.map((element, index) => 
     <div key={index} className='border-t-2 border-highlight bg-primary-dark text-primary-light text-center text-xl'>
          {element}
     </div>
)

const tableBody = filteredTableData.map((element, index) => {
   if (element !== null) {
    return element =
    < Record
    recordObject={element}
    modelRef={modelRef}
    parentIndex={index + 1}
    edit={editRecord}
    defaultEditing={defaultEditing}
    remove={removeRecord}
    cutoffIndex={displayFieldKeys.length}
    key={index}
  />
  }
})

const tailwindGridCutoff = () => { 
  if (routeModelRef === `workouts`) return `grid-cols-4` 
  if (routeModelRef === 'exercises') return `grid-cols-8 `
  if (routeModelRef === 'goals') return `grid-cols-8` 
  if (routeModelRef === `users`) return `grid-cols-4 `
  if (routeModelRef === `preferences`) return `grid-cols-5 `
  if (routeModelRef === `workout_instances`) return `grid-cols-4`
  if (routeModelRef === `workout_step_data`) return `grid-cols-7`
  if (routeModelRef === `workout_steps`) return `grid-cols-6`
  if (routeModelRef === `exercise_types`) return `grid-cols-4`
  if (routeModelRef === `muscle_groups`) return `grid-cols-4`
}

console.log(`yo please`,tailwindGridCutoff())

  return (
  <div className='flex flex-col w-[100vw]'>
    <div>
       < TableController 
          modelRef={routeModelRef} 
          searchColumn={searchColumn}
          setSearchColumn={setSearchColumn} 
          searchValue={searchValue}
          setSearchValue={setSearchValue}
          searchOffset={searchOffset}
          setSearchOffset={setSearchOffset}
          displayFieldKeys={displayFieldKeys}
          viewController={viewController}
          addRecord={addRecord}/>
      </div>
    <div className={`bg-neutral pt-[2vh] px-[5vw]`} >
      <div className={` text-md grid grid-flow-row ${tailwindGridCutoff()} grid-rows-20 auto-cols-auto gap-y-2 bg-secondary-light`}>
          {tableHead}
          {tableBody}
      </div>
    </div>
  </div>
  )
}

export default Table