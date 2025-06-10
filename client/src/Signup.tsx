import {useState} from 'react'
import { useNavigate } from 'react-router-dom';
import './App.css'

function Signin () {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errorMsg, setErrorMsg] = useState("");

    const handleSignup = async() => {
        try {
            const res = await fetch("http://localhost:5000/auth/signup", {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({email, password})
            })

            if (!res.ok) {
                const data = await res.json();
                setErrorMsg(data.message);
                console.log('handle signup failed');
                return
            }
            else {
                console.log('handle signup success');
                navigate('/signin');
            }
        }
        catch (err) {
            setErrorMsg('Network Error')
        }
    }

    return (
    <div className="p-4 max-w-md mx-auto mt-10">
      <h2 className="text-2xl font-bold mb-4">Sign Up</h2>
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
        onClick={handleSignup}
        className="!bg-blue-300 text-black px-4 py-2 rounded w-full"
      >
        Create Account
      </button>
      {errorMsg && <p className="text-red-600 mt-2">{errorMsg}</p>}

      {/* Sign in link */}
      <p className="mt-4 text-center text-sm text-gray-600">
        Already have an account?{' '}
        <a href="/signin" className="text-blue-600 hover:underline font-medium">
          Sign in
        </a>
      </p>
    </div>
  );
}

export default Signin;