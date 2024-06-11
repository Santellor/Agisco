import { useEffect, useState } from 'react'
import axios from 'axios'
import Record from './Record'

const Table = () => {

const [tableData, setTableData] = useState([])
const [modelRef, setModelRef] = useState('workout_steps')
const [filter, setFilter] = useState({})


useEffect(() => {
    console.log(`loader useEffect`)

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
      console.log(filterQueryString)
      console.log(`/api/load/${modelRef}/${filterQueryString}`)
    
    const {data} = await axios.get(`/api/load/${modelRef}/${filterQueryString}`,)
        console.log(data)
        setTableData(data)
    }
    loadTable()
}, [])

const headerArray = ["", ...Object.keys(tableData[0] ?? {})]

const tableHead = headerArray.map((element) => 
     <th>
       {element}
     </th>
)
const tableBody = tableData.map((element) =>
    < Record 
      values={element}
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