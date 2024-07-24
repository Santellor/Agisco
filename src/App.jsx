import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react'
import axios from 'axios';
import { 
  createBrowserRouter,
  Route,
  createRoutesFromElements,
  RouterProvider,
  useNavigate,
  Outlet
  
  } from 'react-router-dom';
  
import Login from './components/Login';
import Navbar from './components/Navbar';

function App() {

  const userId = useSelector((state) => state.userId);
  const workingOut = useSelector((state) => state.workingOut);
  const dark = useSelector((state) => state.dark);
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const sessionCheck = async () => {
    const {data} = await axios.get("/api/session-check")

    if (data.success) {
      dispatch({
        type: "USER_AUTH",
        payload: data.userId
      })
    } else {
      navigate("/login")
    }
  }
  
  useEffect(() => {
    sessionCheck()
  }, [userId])

  const handleDark = () => {
    console.log(`dark`, dark)
    return dark ? 'dark' :'' 
  }
  
  return (
  <div className={`${handleDark()}`}>
    <main>
      < Navbar />
      <div className={`flex text-center justify-start content-center h-max min-h-[88.6vh] max-w-[100vw] dark:bg-slate-900 bg-neutral`}>
            <Outlet/>
      </div>
    </main>
  </div>
  )
}

export default App