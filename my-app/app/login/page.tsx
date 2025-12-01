'use client'
import React, { useRef } from 'react'
import { useState, useEffect } from 'react'
import axios from 'axios';
import { toast } from 'react-toastify'
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import { useSelector } from 'react-redux'
import { RootState } from '../src/redux/store'
const Login: React.FC = () => {
    const appState = useSelector((state: RootState) => state.slice.isEnabled);
    console.log(appState);
    const [state, setState] = useState<string>("login");
    const [name, setName] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [img, setimg] = useState<File | null>(null);
    const [loading, setloading] = useState<boolean>(false);
    
    const router = useRouter();

    function setf(e: React.ChangeEvent<HTMLInputElement>) {
        if (e.target.files && e.target.files.length > 0) {
            setimg(e.target.files[0]);
        }
    }

    async function signup(e: React.FormEvent<HTMLFormElement>): Promise<void> {
        e.preventDefault();
        if (!img || email.length === 0 || password.length === 0 || name.length === 0) {
            toast.error("Please fill it correctly")
            return
        }
        try {
            setloading(true);
            const formdata: FormData = new FormData();
            formdata.append("name", name);
            formdata.append("email", email);
            formdata.append("password", password);
            formdata.append("image", img);
            const submit = await axios.post('/api/signup', formdata, {
                headers: {
                    "Content-Type": "multipart/form-data",
                }
            })
            if (submit.data.success === true) {
                toast.success(submit.data.message);
                console.log(submit.data.data);
                Cookies.set("name", submit.data.data[0].name);
                Cookies.set("image", submit.data.data[0].image);
                router.push("/");
            }
            else {
                toast.error(submit.data.message);
            }

        }

        catch (err: unknown) {
            toast.error(err.message as string)
        }

        finally {
            setloading(false);
        }
    }


    async function login(e: React.FormEvent<HTMLFormElement>): Promise<void> {

        e.preventDefault();
        if(email.length === 0 || password.length === 0) {
            toast.error('Please fill it correctly');
            return;
        }
        try {               
            setloading(true);
            const submit = await axios.post('/api/login', {
                email: email,
                password: password
            });
            if (submit.data.success === true) {
                toast.success(submit.data.message);
                Cookies.set("name", submit.data.data.name)
                Cookies.set("image", submit.data.data.image)
                router.push("/")
            }
            else {
                toast.error(submit.data.message);
            }
        }

        catch (err: unknown) {
            toast.error(err.message as string)
        }

        finally {
            setloading(false);
        }
    }
    
    return (
        <div className={`h-[100vh] w-full`}>
            <div className='absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] z-10'>
                <form className="transition-all flex flex-col gap-4 m-auto items-start p-8 py-12 w-80 sm:w-[352px] text-gray-500 rounded-lg shadow-2xl shadow-indigo-500 border border-gray-200 bg-white">
                    <p className="text-2xl font-medium m-auto">
                        <span className="text-indigo-500">User</span> {state === "login" ? "Login" : "Sign Up"}
                    </p>
                    {state === "register" && (
                        <div className="w-full">
                            <p>Name</p>
                            <input onChange={(e) => setName(e.target.value)} value={name} placeholder="type here" className="border border-gray-200 rounded w-full p-2 mt-1 outline-indigo-500" type="text" required />
                        </div>
                    )}
                    <div className="w-full ">
                        <p>Email</p>
                        <input onChange={(e) => setEmail(e.target.value)} value={email} placeholder="type here" className="border border-gray-200 rounded w-full p-2 mt-1 outline-indigo-500" type="email" required />
                    </div>
                    <div className="w-full ">
                        <p>Password</p>
                        <input onChange={(e) => setPassword(e.target.value)} value={password} placeholder="type here" className="border border-gray-200 rounded w-full p-2 mt-1 outline-indigo-500" type="password" required />
                    </div>
                    {state === "register" && (
                        <div className="w-full">
                            <p>Image</p>
                            <input onChange={setf} placeholder="type here" className="border border-gray-200 rounded w-full p-2 mt-1 outline-indigo-500" type="file" required
                                accept="image/*"
                            />
                        </div>
                    )}
                    {state === "register" ? (
                        <p>
                            Already have account? <span onClick={() => setState("login")} className="text-indigo-500 cursor-pointer">click here</span>
                        </p>
                    ) : (
                        <p>
                            Create an account? <span onClick={() => setState("register")} className="text-indigo-500 cursor-pointer">click here</span>
                        </p>
                    )}
                    <button className="bg-indigo-500 hover:bg-indigo-600 transition-all text-white w-full py-2 rounded-md cursor-pointer"
                        onClick={state === 'login' ? login : signup}
                    >
                        <p>
                            {loading ? "wait..." :
                                state === "register" ? "Create Account" : "Login"}
                        </p>
                    </button>
                </form>
            </div>
        </div>
    )
}

export default Login