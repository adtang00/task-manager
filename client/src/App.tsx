import  {useState, useEffect} from 'react'
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import TaskManager from './TaskManager.tsx'
import Signin from './Signin.tsx';
import Signup from './Signup.tsx';


function App() {
    const [isAuth, setIsAuth] = useState<boolean>(false);

    //Check if user is logged in on page refresh
    useEffect(() => { 
        fetch('http://localhost:5000/auth/user', {
            method: "GET",
            credentials: 'include',
            headers: {
                "Content-Type": "application/json",
            }
        }).then((res) => {
            if(res.ok){
                setIsAuth(true)
            }
            else{
                setIsAuth(false)
            }
        })
    }, [])

    return (
        <Router>
            <Routes>
                <Route path = "/Signin" element = {<Signin setIsAuth={setIsAuth}></Signin>}> </Route>
                <Route path = "/Signup" element = {<Signup/>} />
                <Route 
                    path="/tasks" 
                    element={
                        isAuth ? (
                        <TaskManager setIsAuth={setIsAuth} />
                        ) : (
                        <Navigate to="/Signin" replace />
                        )
                    }
                />
                {/* Default route */}
                <Route path="*" element={<Navigate to={isAuth ? "/TaskManager" : "/Signin"} />} />
            </Routes>
        </Router>
    )
}

export default App;