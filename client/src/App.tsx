import  {useState, useEffect} from 'react'
import TaskManager from './TaskManager.tsx'
import Signin from './Signin.tsx';


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
        <div>
            {isAuth ? (<TaskManager setIsAuth={setIsAuth}></TaskManager>):(<Signin setIsAuth={setIsAuth}></Signin>)}
        </div>
    )
}

export default App;