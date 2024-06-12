import { useState } from 'react'
import axios from 'axios'
import { useDispatch, useSelector } from 'react-redux'
import Register from './Register'
import { useNavigate } from 'react-router-dom'

const Login = ({ loggedOut }) => {

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showRegister, setShowRegister] = useState(false)
  const [message, setMessage] = useState('')

   // subscribe to store and call dispatch as a variable so we can use it inside functions
  const userId = useSelector((state) => state.userId)
  const dispatch = useDispatch()
  
  const handleLogin = async (e) => {
    e.preventDefault()
    //take the data from tables below to attempt a login
    const loginAttempt = { email: email , password: password, }

    //ensure that the fields are populated
    if (!email || !password) {
        setMessage(`please enter an email and password, or create an account`)
        return 
    }

    //search our database for matching credentials
    const {data} = await axios.post("/api/login", loginAttempt)

    // if successful, clear all feedback fields. if not, provide a message explaining why
    if (data.success) {
      dispatch({
        type: "USER_AUTH",
        payload: data.userId
      })
      
      setEmail("")
      setPassword("")
      setMessage("")
    } else setMessage(data.message)

  }

  
  
  
  return showRegister ? (
    <Register setShowRegister={setShowRegister} />
  ) : (
    <>
        <h1>Welcome to Agisco</h1>
          <button onClick={() => setShowRegister(true)}>Create Account</button>
        <h4>
        {message}
        </h4>
      {!userId &&
        <form>
          <input 
            type='text' 
            value={email} 
            placeholder='email' 
            onChange={(e) => setEmail(e.target.value)}
            />
          <input 
            type='password'
            value={password}
            placeholder='Password'
            onChange={(e) => setPassword(e.target.value)}
            />
          <button onClick={handleLogin}> Login </button>
        </form>
    }
    </>
  )
}

export default Login