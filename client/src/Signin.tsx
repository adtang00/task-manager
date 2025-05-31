import {useState} from 'react'
import './App.css'

interface myProps {
    setIsAuth: React.Dispatch<React.SetStateAction<boolean>>
}

function Signin(props : myProps) {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [errorMsg, setErrorMsg] = useState('');

    const handleSignin = async () => {
        try {
            const res = await fetch('http://localhost:5000/auth/signin', {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
            })

            if (!res.ok) {
                const data = await res.json()
                setErrorMsg(data.message)
                console.log('handle signin failed')
                return
            }
            else {
                console.log('handle signin success')
                props.setIsAuth(true)
            }
        } catch (err) {
            props.setIsAuth(false)
            setErrorMsg('Network Error')
        }
    }


    return (
        <div className="p-4 max-w-md mx-auto mt-10">
        <h2 className="text-2xl font-bold mb-4">Task Manager</h2>
        <input
            className="border p-2 w-full mb-2"
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
        />
        <input
            className="border p-2 w-full mb-4"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
        />
        <button
            onClick={handleSignin}
            className="bg-blue-600 text-black px-4 py-2 rounded w-full"
        >
            Sign In
        </button>
        {errorMsg && <p className="text-red-600 mt-2">{errorMsg}</p>}
        </div>
    )
}

export default Signin;