import { useEffect, useState } from 'react'
import axios from 'axios'
import Record from './Record'

const Table = ({routeModelRef}) => {

const [tableData, setTableData] = useState([])
const [modelRef, setModelRef] = useState()
const [filter, setFilter] = useState({})


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
    
    const {data} = await axios.get(`/api/load/${routeModelRef}/${filterQueryString}`,)
        console.log(data)
        setTableData(data)
    }
    loadTable()
},[routeModelRef])

let headerArray = [...Object.keys(tableData[0] ?? {})]
headerArray[0] = ''
headerArray = headerArray.filter((el) => { return el !== 'createdAt' && el !== 'updatedAt'})


const tableHead = headerArray.map((element, index) => 
     <th key={index}>
          {element}
     </th>
)
const tableBody = tableData.map((element, index) =>
    < Record
      values={element}
      modelRef={modelRef}
      parentIndex={index + 1}
      key={index}
    />
)


  return (
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
  )
}

export default Table