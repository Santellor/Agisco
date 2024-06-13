import React from 'react'

const Field = ({data, editing, setter}) => {
  return setter && editing?(
    <td>
    <input type="text" value={data} onChange={(e) => setter(e.target.value)}/>
    </td>
  ) : (
    <td>
        {data}
    </td>
  )
}

export default Field