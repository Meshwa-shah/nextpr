'use client'
import { RootState, Appdispatch } from '../src/redux/store';
import { useSelector } from 'react-redux';
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import { toast } from 'react-toastify';
import { useRouter } from "next/navigation";
import Navbar from "./Navbar";
import Pop from './Pop';
import { Plus } from 'lucide-react';
import axios from 'axios';
import { Pen } from 'lucide-react';
import { Pin } from 'lucide-react';
import { Trash2 } from 'lucide-react';
import Pop2 from './Pop2';
type arr = {
  id: number,
  name: string,
  title: string,
  content: string,
  time: string,
  tags: [string, string],
  pinned: number
}
export default function Home() {
  const appState = useSelector((state: RootState) => state.slice.isEnabled);
  const router = useRouter();
  const name = Cookies.get("name");
  const [notes, setnotes] = useState<Array<arr>>([]);
  const [search, setsearch] = useState<Array<arr>>([]);
  const [show, setshow] = useState<boolean>(false);
  const [show2, setshow2] = useState<boolean>(false);
  const [tags, settags] = useState<Array<string>>([])
  const [cont, setcont] = useState<string>('');
  const [title, settitle] = useState<string>('');
  const [content, setcontent] = useState<string>('');
  const [loading, setloading] = useState<boolean>(false);
     
  useEffect(() => {
    if (name === undefined) {
      router.push("login");
      toast.error("Pleas login or signup to continue");
    }
  }, [])

  useEffect(() => {
    async function fetch() {
      try {
        const fet = await axios.post("/api/note", {
          name: name
        });
        if (fet.data.success === true) {
          setnotes([...fet.data.data]);
          setshow(false)
        }
      }

      catch (err: unknown) {
        console.log(err.message);
      }
    }

    fetch();
  }, [])

  async function del(id: number) {

    try {
      if (name === undefined) {
        return
      }
      const formdata: FormData = new FormData();
      formdata.append("id", String(id));
      formdata.append("name", name)
      const submit = await axios.post('/api/delete', formdata, {
        headers: {
          "Content-Type": "multipart/form-data",
        }
      });

      if (submit.data.success === true) {
        setnotes([...submit.data.data]);
        toast.success("Your note deleted successfully");
      }
      else {
        toast.error(submit.data.message);
      }
    }

    catch (err: unknown) {
      toast.error(err.message as string);
    }
  }
  function upd(id: number) {
    console.log(id)
    const find = notes.find((el, i) => i === id);
    if (find?.tags === undefined || find.title === undefined || find.content === undefined) {
      return
    }
    setshow2(true);
    settitle(find?.title);
    setcontent(find?.content);
    settags([...find?.tags]);
    console.log(tags);
  }

  function ser(s: string){
    if(s.length > 0){
     const find = notes.find((el) => el.title === s);
      if(find){
       setsearch([find]);
      }
    }
  }

  return (
    <div className={`h-full ${appState === false ? 'bg-white' : 'bg-black text-white'} transition-colors 

      `}>
      <Navbar />
      {notes.length <= 0 ? <h2 className='text-2xl text-center pt-5'></h2> :
        <div className='flex gap-6 pt-10 pl-25 flex-wrap max-sm:pl-0'>
          {notes.map((el, i) => {
            return <div key={i} className={`max-sm:w-[340px] flex justify-between rounded shadow shadow-gray-400  ${appState === false ? 'bg-white' : 'bg-gray-800'} p-4 w-[400px] flex`}>
              <div className='w-[90%]'>
                <p className={`text-[21px] font-bold ${appState === false ? 'text-black' : 'text-white'}`}>{el.title}</p>
                <p className={`text-[15px] font-bold mt-1.5 ${appState === false ? 'text-gray-500' : 'text-gray-300'}`}>{el.time}</p>
                <p className={`${appState === false ? 'text-gray-500' : 'text-gray-300'} text-[15px] font-bold mt-3 whitespace-nowrap overflow-hidden`}>{el.content}</p>
                <div className='flex gap-3 justify-between items-end'>
                  <div className='mt-1.5 flex gap-1.5'>{el.tags.map((e, i) => {
                    return <p key={i} className={`text-[15px] font-bold mt-1.5 ${appState === false ? 'text-gray-500' : 'text-gray-300'}`}>#{e}</p>
                  })} </div>
                  {/* <div className='text-gray-400'><Pen size={15} fill={"#99a1af"} onClick={() => upd(i)}/></div> */}

                </div>
              </div>
              <div className='py-2.5 flex flex-col justify-between items-center'>
                <span className={`text-gray-400 ${appState === false ? 'hover:text-blue-600' : 'hover:text-green-700'}`}><Pen size={15} fill={`#99a1af`} onClick={() => upd(i)} /></span>
                <span className={`text-gray-400 ${appState === false ? 'hover:text-blue-600' : 'hover:text-green-700'}`}><Trash2 size={15} fill={"#99a1af"} onClick={() => del(el.id)} /></span>
              </div>
            </div>
          })}

        </div>
      }
      <div className={`rounded-2xl w-20 h-20 flex items-center justify-center absolute bottom-5 right-5
          ${appState === false ? 'bg-[#007BFF] text-white' : 'bg-green-300 text-[#121212]'}
          `} onClick={() => setshow(!show)}>
        <Plus size={45} />
      </div>
      {show === false ? <></> :
        <>
          <Pop show={show} setshow={setshow} setnotes={setnotes} />
        </>
      }

      {show2 === false ? <></> :
        <>
          <Pop2 show2={show2} setshow2={setshow2} title={title} content={content} tags={tags} settags={settags} setnotes={setnotes} />
        </>
      }
    </div>

  );
}