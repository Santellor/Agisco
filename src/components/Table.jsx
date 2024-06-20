import { useEffect, useState, useCallback} from 'react'
import axios from 'axios'
import Record from './Record'
import TableController from './TableController'

const Table = ({routeModelRef}) => {

const [tableData, setTableData] = useState([])
const [modelRef, setModelRef] = useState()
const [filter, setFilter] = useState({})

const loadTable = async () => {

  console.log(`filter`, filter)
  console.log(`modelRef`, modelRef)
  console.log(`routeModelRef`, routeModelRef)
  let newFilter = {...filter}
  if (modelRef !== routeModelRef) {  
    console.log(`newFilter pre`, newFilter) 
    newFilter = {}
    console.log(`newFilter post`, newFilter) 
    setFilter(newFilter)
  }
  // create a query string
  let filterQueryString = ""
  
  // for filter specifications, loop through to add them to query
  for (let searchParam in newFilter) {
      filterQueryString += `${searchParam}=${newFilter[searchParam]}&`
      }
  
  // if none were added, we want them all! 
  if (filterQueryString === "") filterQueryString = "all"

  // if some were added, get rid of the last &
  else filterQueryString = filterQueryString.slice(0,-1)

  // for debugging
  
  console.log(`filterQueryString`, filterQueryString)
  // console.log(`/api/load/${modelRef}/${filterQueryString}`)

// clear past table data from previous renders, then load new data
  setTableData([])
  const {data} = await axios.get(`/api/load/${routeModelRef}/${filterQueryString}`,)
    setTableData(data)

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
    console.log(`loader useEffect, passed ${routeModelRef} and filter: ${filter}`)
    setModelRef(routeModelRef)
    loadTable()
},[routeModelRef, filter])



let timeRef, wrongTimeRef;
  if (modelRef !== 'workout_instances' || modelRef !== 'workout_step_data') {
    timeRef = 'updatedAt'
    wrongTimeRef = 'createdAt'
  } else {}
    timeRef = 'createdAt'
    wrongTimeRef= 'updatedAt'

  let fieldKeysArray = []
  
  let recordObjectCopy = {...tableData[0]}

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
  let filteredRecordValuesArray = Object.values(recordObjectCopy).slice(1,cutoffIndex)
  
  fieldKeysArray = [...fieldKeysArray, ...filteredRecordKeysArray]

  let displayFieldKeys = ['', ...fieldKeysArray]

const tableHead = displayFieldKeys.map((element, index) => 
     <th key={index}>
          {element}
     </th>
)

const tableBody = tableData.map((element, index) =>
    < Record
      recordObject={element}
      modelRef={modelRef}
      parentIndex={index + 1}
      edit={editRecord}
      remove={removeRecord}
      key={index}
    />
)

  return (
    <div>
       < TableController modelRef={routeModelRef} filter={filter} filterSetter={setFilter} addRecord={addRecord}/>
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