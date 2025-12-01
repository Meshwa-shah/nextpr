"use client"
import { useDispatch, UseDispatch, useSelector } from 'react-redux';
import { RootState, Appdispatch } from '../src/redux/store';
import { setFeature, changeFeature } from '../src/slice/slice';
import { useState } from 'react';
import { useEffect } from 'react';
import Cookies from 'js-cookie';
import React from 'react';
import Image from 'next/image';
import { Sun } from 'lucide-react';
import { Moon } from 'lucide-react';
import { useRouter } from 'next/navigation';


const Navbar: React.FC = () => {

  const image = Cookies.get("image");
  const appState = useSelector((state: RootState) => state.slice.isEnabled);
  const dispatch: Appdispatch = useDispatch();
  const router = useRouter();
  const [isMounted, setIsMounted] = useState<boolean>(false);
  const [show, setshow] = useState<boolean>(true);

  useEffect(() => {
    setIsMounted(true);
    const color = Cookies.get("theme");
    if (color === "false") {
      dispatch(setFeature(false));
      Cookies.set("theme", "false");
    }
    else {
      dispatch(setFeature(true));
      Cookies.set("theme", "true");
    }
  }, []);
 

  if (!isMounted) return null;

  function logout() {
    if(window.confirm("Are you sure you want to logout")){
      Cookies.remove("name");
      Cookies.remove("image");
      router.push("login");
    }
  }
  
  function changecolor() {
    const color = Cookies.get("theme");
    if (color === "false") {
      dispatch(setFeature(true));
      Cookies.set("theme", "true");
    }
    else {
      dispatch(setFeature(false));
      Cookies.set("theme", "false");
    }
  }

  return (
    <header className={`flex items-center justify-between px-6 py-3 md:py-4 shadow  mx-auto w-full ${appState === false ?
      'bg-white shadow-gray-200' : 'bg-gray-800 border-b-gray-400 border-1'
      } transition-colors h-21`}>
      <a href="https://prebuiltui.com">
        <h1 className="text-3xl font-bold">
          Notes<span className={` text-3xl ${appState === false ? 'text-indigo-600' : 'text-green-600'}`}>App</span>
        </h1>
      </a>
      <nav id="menu" className="max-md:absolute max-md:top-0 max-md:left-0 max-md:overflow-hidden items-center justify-center max-md:h-full max-md:w-0 transition-[width] bg-white/50 backdrop-blur flex-col md:flex-row flex gap-8 text-gray-900 text-sm font-normal">
         
        <button id="closeMenu" className="md:hidden text-gray-600">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </nav>
      <div className="flex items-center space-x-4">
        {/* <div className="flex items-center border pl-4 gap-2 bg-white border-gray-500/30 h-[46px] rounded-full overflow-hidden max-w-md w-full">
          <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 30 30" fill="#6B7280">
            <path d="M13 3C7.489 3 3 7.489 3 13s4.489 10 10 10a9.95 9.95 0 0 0 6.322-2.264l5.971 5.971a1 1 0 1 0 1.414-1.414l-5.97-5.97A9.95 9.95 0 0 0 23 13c0-5.511-4.489-10-10-10m0 2c4.43 0 8 3.57 8 8s-3.57 8-8 8-8-3.57-8-8 3.57-8 8-8" />
          </svg>
          <input type="text" className="w-full h-full outline-none text-sm text-gray-500" placeholder='Search by title' />
          <button type="submit" className="bg-indigo-500 w-32 h-9 rounded-full text-sm text-white mr-[5px]">Search</button>
        </div> */}
        <button className={`size-8 flex items-center justify-center  transition border border-none rounded-md 
              ${appState === false ?
            'bg-gray-200' : 'bg-gray-700'
          }`}
          onClick={changecolor}
        >
          {appState === false ?
            <><Moon height={15} width={15} fill='true' /></> :
            <><Sun height={15} width={15} fill='true' /></>
          }

        </button>
        {image === undefined ?
          <a className="hidden md:flex bg-indigo-600 text-white px-5 py-2 rounded-full text-sm font-medium hover:bg-indigo-700 transition" href="#">
            Sign up
          </a> :
          <>
            <img src={image} className='size-9 rounded-full' onClick={logout} />
          </>
          }
        {/* <button id="openMenu" className="md:hidden text-gray-600">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button> 
        */}

      </div>
    </header>
  )
}

export default Navbar