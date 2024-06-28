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
    <div className='flex items-center h-[100vh] w-[100vw]'>
    
    <div className='flex flex-col items-center h-[100vh] w-[60vw] bg-primary-dark text-primary-light'>
      <h1 className='text-6xl p-20 align-middle text-highlight' >Welcome to Agisco</h1>
        <h4 className='text-4xl px-20 text-center'>
        {message}
        </h4>
    </div>
    <div className='flex flex-col items-center h-[100vh] w-[40vw] bg-primary-light text-primary-dark'>
      <form className='flex flex-col items-center bg-primary-light text-primary-dark'>
        <h1 className=' text-4xl text-primary dark align-middle mt-20 mb-2 py-2 px-3'>New Account</h1>
        <button className=' text-3xl text-primary dark mt-2 py-2 px-3 rounded bg-primary-dark text-primary-light hover:text-highlight' onClick={() => setShowRegister(false)}> Back </button>
        <input className='bg-neutral text-xl text-primary-dark pt-3 pb-3 py-10 my-2 rounded'
          type='text'
          placeholder='email'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input className='bg-neutral text-xl text-primary-dark pt-3 pb-3 py-10 my-2 rounded'
          type='password'
          placeholder='password1'
          value={password1}
          onChange={(e) => setPassword1(e.target.value)}
        />
        <input className='bg-neutral text-xl text-primary-dark pt-3 pb-3 py-10 my-2 rounded'
          type='password'
          placeholder='password2'
          value={password2}
          onChange={(e) => setPassword2(e.target.value)}
        />
        <button className=' text-3xl text-primary dark mt-2 py-2 px-3 rounded bg-primary-dark text-primary-light hover:text-highlight' onClick={handleRegister}> Submit </button>
      </form>
    </div>
    </div>
  )
}

export default Register