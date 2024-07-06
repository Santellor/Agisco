import { useState } from 'react'
import axios from 'axios'
import { useDispatch, useSelector } from 'react-redux'
import Register from './Register'
import { useNavigate } from 'react-router-dom'

const Login = ({ loggedOut }) => {

   // subscribe to store and call dispatch as a variable so we can use it inside functions
   const defaultMessage = useSelector((state) => state.message)
   const dispatch = useDispatch()
   const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showRegister, setShowRegister] = useState(false)
  const [message, setMessage] = useState(defaultMessage ?? '')

  
  
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
      navigate("/")
    } else setMessage(data.message)

  }

  
  
  
  return (
  <div className='flex items-center h-[100vh] w-[100vw]'>
    <div className='flex flex-col items-center h-[100vh] w-[60vw] bg-primary-dark text-primary-light'>
      <h1 className='text-6xl p-20 align-middle text-highlight' >Welcome to Agisco</h1>
        <h4 className='text-4xl px-20 text-center'>
        {message}
        </h4>
    </div>
    <div className='flex flex-col items-center h-[100vh] w-[40vw] bg-primary-light text-primary-dark'>
       <button className=' text-3xl text-primary dark mt-20 mb-2 py-2 px-3 rounded bg-primary-dark text-primary-light hover:text-highlight' onClick={() => navigate("/register")}>Create Account</button>
        <form className='flex flex-col items-center bg-primary-light text-primary-dark'>
          <input className='bg-neutral text-xl text-primary-dark pt-3 pb-3 py-10 my-2 rounded'
            type='text' 
            value={email} 
            placeholder=' email...' 
            onChange={(e) => setEmail(e.target.value)}
            />
          <input className='bg-neutral text-xl text-primary-dark pt-3 pb-3 py-10 my-2 rounded'
            type='password'
            value={password}
            placeholder=' password...'
            onChange={(e) => setPassword(e.target.value)}
            />
          <button className=' text-3xl text-primary dark mt-2 py-2 px-3 rounded bg-primary-dark text-primary-light hover:text-highlight' onClick={handleLogin}> Log in </button>
        </form>
    </div>
    </div>
  )
}

export default Login