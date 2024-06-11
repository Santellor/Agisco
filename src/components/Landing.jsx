import { useState, useEffect } from 'react'
import axios from 'axios'
import { useDispatch, useSelector } from 'react-redux'
import Register from './Register'

const Landing = () => {

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showRegister, setShowRegister] = useState(false)
  const [message, setMessage] = useState('')

   // to use Redux, we need to "subscribe" (useSelector()) to the store
  const userId = useSelector((state) => state.userId)

  const dispatch = useDispatch()

  
  const handleLogin = async (e) => {
    e.preventDefault()

    const loginAttempt = { email: email , password: password, }

    if (!email || !password) {
        setMessage(`please enter an email and password, or create an account`)
        return 
    }

    const {data} = await axios.post("/api/login", loginAttempt)

    console.log(data)
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

  const handleLogout = async () => {
    const {data} = await axios.get("/api/logout")

    if (data.success) {
      dispatch({
        type: "LOGOUT",
      })
    }
  }

  const sessionCheck = async () => {
    const {data} = await axios.get("/api/session-check")

    if (data.success) {
      dispatch({
        type: "USER_AUTH",
        payload: data.userId
      })
    } 
  }
  
  useEffect(() => {
    sessionCheck()
  }, [])
  
  
  return showRegister ? (
    <Register setShowRegister={setShowRegister} />
  ) : (
    <>
      <nav>
        <h1>Welcome to Agisco</h1>
        {userId &&
          <button onClick={handleLogout}>Logout</button>
          }
        {!userId &&
        <>
          <button onClick={() => setShowRegister(true)}>Create Account</button>
        </>
        }
      </nav>
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
      {userId && 
        <h3>Welcome, user # {userId}</h3>
      }
    </>
  )
}

export default Landing