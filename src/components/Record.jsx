import React from 'react'
import Field from './Field'
import EditButtons from './EditButtons'
const Record = ({values}) => {

let dynamicRecord = [ <EditButtons />]
for (let fieldData in values) {
    dynamicRecord.push (<Field data={values[fieldData]}/>)
}

  return (
    <tr>
        {dynamicRecord}
    </tr>
  )
}

export default Record