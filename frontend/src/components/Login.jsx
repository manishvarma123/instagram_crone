import React, { useEffect, useState } from 'react'
import { Label } from './ui/label'
import { Input } from './ui/input'
import { Button } from './ui/button'
import axios from 'axios'
import { toast } from 'sonner'
import { Link, useNavigate } from 'react-router-dom'
import { Loader2 } from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'
import { setUser } from '@/redux/Slices/authSlice'

const Login = () => {
    const [input, setInput] = useState({
        email: '',
        password: ''
    })
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const {user} = useSelector(state=>state.auth)

    const changeEventHandler = (e) => {
        setInput({ ...input, [e.target.name]: e.target.value })
    }

    const loginHandler = async (e) => {
        e.preventDefault()
        try {
            setLoading(true)
            const res = await axios.post('http://localhost:8000/api/v1/user/login', input, {
                headers: {
                    'Content-Type': 'application/json'
                },
                withCredentials: true
            });

            if (res.data.success) {
                navigate("/")
                dispatch(setUser(res.data.user))
                toast.success(res.data.message)
                setInput({
                    email: '',
                    password: ''
                })
            }

        } catch (error) {
            console.log(error)
            toast.error(error.response.data.message)
        } finally {
            setLoading(false)
        }
    }

    useEffect(()=>{
        if(user){
            navigate("/")
        }
    },[])

    return (
        <div className='w-screen h-screen flex justify-center items-center'>
            <form onSubmit={loginHandler} className='shadow-lg flex flex-col gap-5 p-8 m-3 border-2 border-slate-200 rounded-md'>
                <div className='my-4'>
                    <h1 className='text-center font-bold text-xl'>LOGO</h1>
                    <p className='text-sm text-center'>Login to see photos & videos from your friends</p>
                </div>
                
                <div>
                    <Label htmlFor='email' className='my-2 block font-medium'>Email</Label>
                    <Input
                        type='email'
                        name='email'
                        id='email'
                        value={input.email}
                        onChange={changeEventHandler}
                        className='focus-visible:ring-transparent'
                    />
                </div>
                <div>
                    <Label htmlFor='password' className='my-2 block font-medium'>Password</Label>
                    <Input
                        type='password'
                        name='password'
                        id='password'
                        value={input.password}
                        onChange={changeEventHandler}
                        className='focus-visible:ring-transparent'
                    />
                </div>
                {
                    loading ? (
                        <Button>
                            <Loader2 className='mr-2 h-4 w-4 animate-spin'/>
                            Please wait
                        </Button>
                    ) : (
                        <Button type='submit'>Login</Button>
                    )
                }
                
                <span className='text-center'>Doesn't have an Account? <Link to='/signup' className='text-center text-blue-600'>Signup</Link></span>
            </form>
        </div>
    )
}

export default Login