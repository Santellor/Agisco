import { useEffect, useState } from 'react'
import axios from 'axios'
import Record from './Record'

const Table = ({routeModelRef}) => {

const [tableData, setTableData] = useState([])
const [modelRef, setModelRef] = useState()
const [filter, setFilter] = useState({})


 // remove a record
 const removeRecord = async (id) => {
  await axios.delete(`/api/remove/${modelRef}/${id}`)
}

// edit a record
const editRecord = async (id, entry) => {
  const {data} = await axios.put(`/api/edit/${modelRef}/${id}`, entry)
}

useEffect(() => {
    console.log(`loader useEffect, passed ${routeModelRef} and filter: ${filter}`)
    
    setModelRef(routeModelRef)
    
    const loadTable = async () => {
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
      console.log(`modelRef`, modelRef)
      console.log(`filterQueryString`, filterQueryString)
      console.log(`/api/load/${modelRef}/${filterQueryString}`)
    
    // clear past table data from previous renders, then load new data
    setTableData([])
    const {data} = await axios.get(`/api/load/${routeModelRef}/${filterQueryString}`,)
        console.log(data)
        setTableData(data)
    }
    loadTable()
},[routeModelRef])



let headerArray = [``, ...Object.keys(tableData[0] ?? {})]

// headerArray = headerArray.filter((el) => { return el !== 'createdAt' && el !== 'updatedAt'})

const tableHead = headerArray.map((element, index) => 
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
        <p>insert search bar (columns dropdown, value text input), add new, and arrows for determining offset</p>
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