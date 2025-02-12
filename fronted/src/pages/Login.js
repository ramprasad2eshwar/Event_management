import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';


const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    // useEffect(() => {
    //     if(localStorage.getItem('token')){
    //         navigate('/dashboard')
    //     }
    // }, [])
    

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const { data } = await axios.post('https://api.render.com/deploy/srv-cumdbptds78s73b5lbtg?key=qedK_tg1dDQ/api/auth/login', {
                email,
                password,
            });
            localStorage.setItem('token', data.token); // Store token in localStorage
            navigate('/dashboard'); // Redirect to dashboard
        } catch (error) {
            console.log(error);
            alert('Invalid credentials');
        }
    };

    return (
        <div className='h-[100vh] flex items-center'>
                <form onSubmit={handleLogin} className="max-w-sm mx-auto">
                    <h1 className="py-4 text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                        Sign in to your account
                    </h1>
                    <div className="mb-5">
                        <label for="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your email</label>
                        <input value={email}
                            onChange={(e) => setEmail(e.target.value)} type="email" id="email" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="name@flowbite.com" required />
                    </div>
                    <div className="mb-5">
                        <label for="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your password</label>
                        <input value={password}
                            onChange={(e) => setPassword(e.target.value)} type="password" id="password" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required />
                    </div>
                    <button type="submit" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Submit</button>
                    <p className='text-white'>Not have acoount? <a className='text-blue-400' href="" onClick={()=>{navigate('/register')}}>Register</a></p>
                </form>
            </div>
    );
};

export default Login;
