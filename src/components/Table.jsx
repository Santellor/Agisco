import { useEffect, useState, useCallback} from 'react'
import axios from 'axios'
import Record from './Record'
import TableController from './TableController'

const Table = ({routeModelRef , filter, searchColumnDefault, searchValueDefault, viewController }) => {

const [tableData, setTableData] = useState([])
const [filteredTableData, setFilteredTableData] = useState([])
const [modelRef, setModelRef] = useState()
const [searchColumn, setSearchColumn] = useState(searchColumnDefault)
const [searchValue, setSearchValue] = useState(searchValueDefault)
const [searchOffset, setSearchOffset] = useState(0)
const [displayFieldKeys, setDisplayFieldKeys] = useState([])
const [timeRef, setTimeRef] = useState('updatedAt')
const [wrongTimeRef, setWrongTimeRef] = useState('createdAt')

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
  setFilteredTableData([])
  let {data} = await axios.get(`/api/load/${routeModelRef}/${filterQueryString}`,)

  if (modelRef === 'workout_instances' || modelRef === 'workout_step_data') {
    setWrongTimeRef('updatedAt')
    setTimeRef('createdAt')
  } else {
    setWrongTimeRef('createdAt')
    setTimeRef('updatedAt')

  }
  // console.log(`modelRef1`, modelRef)
  // console.log(`wrongTimeRef1`, wrongTimeRef)

  let dataCopy = [...data]

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

  for (let key in recordObjectCopy) {
    if (recordObjectCopy[key] === undefined)
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
  fieldValuesArray = [ ...filteredRecordValuesArray.slice(0,1), ...fieldValuesArray, ...filteredRecordValuesArray.slice(1)]
  fieldKeysArray = [ ...filteredRecordKeysArray.slice(0,1),  ...fieldKeysArray, ...filteredRecordKeysArray.slice(1)]


  record = {}

  fieldKeysArray.forEach((el, i) => {
    record[el] = fieldValuesArray[i]
  })
  // console.log(`fieldKeysArray`, fieldKeysArray)
  // console.log(`fieldValuesArray`, fieldValuesArray)
  // console.log(`record`, record)
  dataCopy[i] = record
  })
  // console.log(dataCopy)
  setDisplayFieldKeys(['', ...Object.keys(dataCopy[0]).slice(1)])

  setTableData([...dataCopy])
 
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
    setModelRef(routeModelRef)
    
    setFilteredTableData([...tableData])
    // console.log(`searchColumn`, searchColumn)
    // console.log(`searchValue`, searchValue)
    // console.log(`searchOffset`, searchOffset)

    let newData = [...tableData]

    if (searchValue !== undefined && searchColumn!== undefined)  
      newData = tableData.map((el) => {
      // console.log('stage 1', el)
      // console.log('stage 2', el[searchColumn])
      // console.log('stage 3', String(el[searchColumn]).includes(searchValue))
      return String(el[searchColumn]).includes(searchValue)? el = el : null
      })
      // console.log('stage 4', newData)
      // let finalData = newData.filter(el => el !== null)
    setFilteredTableData(newData.slice(searchOffset ?? 0))

    if (searchValue === "") {
      setSearchValue(undefined)
    }

},[searchColumn, searchValue, searchOffset, tableData])

const tableHead = displayFieldKeys.map((element, index) => 
     <th key={index}>
          {element}
     </th>
)

const tableBody = filteredTableData.map((element, index) => {
   if (element !== null) {
    return element =
    < Record
    recordObject={element}
    modelRef={modelRef}
    parentIndex={index + 1}
    edit={editRecord}
    remove={removeRecord}
    key={index}
  />
  }
})

  return (
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
  <table>
    <thead>
        <tr>
      {tableHead}
        </tr>
    </thead>
    <tbody>
      {tableBody}
    </tbody>
  </table>
  </div>
  )
}

export default Table