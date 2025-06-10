import  {useState, useEffect} from 'react'
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import TaskManager from './TaskManager.tsx'
import Signin from './Signin.tsx';
import Signup from './Signup.tsx';


function App() {
    const [isAuth, setIsAuth] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(true); 

    //Check if user is logged in on page refresh
    useEffect(() => {
        fetch('http://localhost:5000/auth/user', {
        method: "GET",
        credentials: 'include',
        headers: {
            "Content-Type": "application/json",
        }
        }).then((res) => {
        setIsAuth(res.ok);
        setLoading(false); // Done checking auth
        }).catch(() => {
        setIsAuth(false);
        setLoading(false);
        });
  }, []);

    if (loading) {
        return <div className="text-center p-4">Loading...</div>; 
    }

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
                <Route path="*" element={<Navigate to={isAuth ? "/tasks" : "/Signin"} replace />} />
            </Routes>
        </Router>
    )
}

export default App;