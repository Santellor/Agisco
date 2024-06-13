import axios from 'axios'
import { useState } from 'react'
import { useDispatch } from 'react-redux'

function Register({ setShowRegister }) {

  const [email, setEmail] = useState('')
  const [password1, setPassword1] = useState('')
  const [password2, setPassword2] = useState('')
  const [message, setMessage] = useState('')
  

  const dispatch = useDispatch()

  const handleRegister = async (e) => {
    e.preventDefault()
    const bodyObj = {
        email: email,
        password1: password1,
        password2: password2
    }
    const {data} = await axios.post('/api/register', bodyObj)
    
      if (data.success) {
          dispatch({
            type: "USER_AUTH",
            payload: data.userId
          })
          setShowRegister(false)
          setEmail("")
          setPassword1("")
          setPassword2("")
      }

      setMessage(data.message)
  }
  

  return (
    <div id='register'>
      <form>
        <h1>Register</h1>
        <button onClick={() => setShowRegister(false)}> Back </button>
        <h4>{message}</h4>
        <input
          type='text'
          placeholder='email'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type='password'
          placeholder='password1'
          value={password1}
          onChange={(e) => setPassword1(e.target.value)}
        />
        <input
          type='password'
          placeholder='password2'
          value={password2}
          onChange={(e) => setPassword2(e.target.value)}
        />
        <button onClick={handleRegister}> Submit </button>
      </form>
    </div>
  )
}

export default Register