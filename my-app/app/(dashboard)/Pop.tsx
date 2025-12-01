import React, { useState } from 'react'
import { Divide, X } from 'lucide-react'
import { useSelector } from 'react-redux'
import { RootState } from '../src/redux/store'
import { Hash } from 'lucide-react'
import { Plus } from 'lucide-react'
import { toast } from 'react-toastify'
import axios from 'axios'
import Cookies from 'js-cookie'
interface arr {
  id: number,
  name: string,
  title: string,
  content: string,
  time: string,
  tags: [string, string],
  pinned: number
}

interface prop {
  show: boolean
  setshow: React.Dispatch<React.SetStateAction<boolean>>
  setnotes: React.Dispatch<React.SetStateAction<arr[]>>

}

const Pop: React.FC<prop> = ({ show, setshow, setnotes }) => {
  const appState = useSelector((state: RootState) => state.slice.isEnabled);
  console.log(appState)
  const [tags, settags] = useState<Array<string>>([])
  const [cont, setcont] = useState<string>('');
  const [title, settitle] = useState<string>('');
  const [content, setcontent] = useState<string>('');
  const [loading, setloading] = useState<boolean>(false);
  const change = () => {
    if (tags.length === 2) {
      toast.error("Cannot add more tags");
      return
    }
    if (cont.length >= 12) {
      toast.error('Add a word lower then 12 letters');
      return
    }
    else {
      if (cont !== null) {
        settags(prev => [...prev, cont]);
      }
      else {
        toast.error("Tags cannot be empty")
      }
    }
  }

  const del = (id: number) => {
    console.log(id)
    const filtered = tags.filter((el, i) => i !== id)
    settags(filtered);
  }

  async function submit() {
    const name: string | undefined = Cookies.get("name");
    if (title.length === 0 && content.length === 0) {
      return
    }
    try {
      setloading(true);
      const add = await axios.post('/api/notes', {
        name: name,
        title: title,
        content: content,
        tags: tags
      });
      if (add.data.success === true) {
        const d = add.data.data;
        setnotes([...d]);
        toast.success('note added');
        setshow(false);
      }
      else {
        toast.error(add.data.message);
      }
    }

    catch (err) {
      toast.error(err.message as string)
    }
    finally {
      setloading(false);
    }
  }
  return (
    <div className={`absolute top-[50%] left-[50%]  shadow shadow-gray-400 translate-x-[-50%] translate-y-[-50%] z-10  rounded-[6px] p-4.5 w-[550px]
    max-sm:w-[90%] ${appState === false ? 'bg-white ' : 'bg-gray-800 '} transition-all
    ${show === false ? 'hidden' : 'block '}  
    `}>
      <div className='w-full flex justify-end' onClick={() => setshow(!show)}>
        <X />
      </div>

      <div>
        <p className={`${appState === false ? 'text-gray-500' : 'text-white'}`}>TITLE</p>
        <input type="text" className={`w-full border-[1px] ${appState === false ? ' placeholder-gray-500' : 'placeholder-white'} border-gray-600  mt-[2px]  text-[30px] border-none focus:outline-none`} placeholder='Write The Title Here'
          onChange={(e) => settitle(e.target.value)}
        />
      </div>

      <div className='mt-5 [@media(max-height:700px)]:mt-3'>
        <p className={`${appState === false ? 'text-gray-500' : 'text-white'}`}>CONTENT</p>
        <textarea className={` mt-2.5 w-full h-60 rounded-[8px]  [@media(max-height:700px)]:mt-1.5 ${appState === false ? 'bg-blue-50' : 'bg-gray-700'} focus:outline-none pt-2 pl-2 [@media(max-height:700px)]:h-48`}
          onChange={(e) => setcontent(e.target.value)}
        ></textarea>
      </div>

      <div className='mt-5  [@media(max-height:700px)]:mt-3'>
        <p className={`${appState === false ? 'text-gray-500' : 'text-white'}`}>TAGS</p>
        {tags.length === 0 ? <></> : <div className='flex gap-2.5 flex-wrap'>{tags.map((el, i) => {
          return <span key={i} className={` mt-2  [@media(max-height:700px)]:mt-1 inline-block rounded-[6px] ${appState === false ? 'bg-gray-200' : 'bg-gray-600'}`}>
            <div className='w-full h-full flex items-center gap-2 p-2 px-5'>
              <Hash size={17} /> <p className='text-[17px] '>{el}</p> <X size={17} onClick={() => del(i)} />
            </div>
          </span>
        })}</div>}
        <div className='mt-4 flex items-center gap-5  [@media(max-height:700px)]:mt-2.5'>
          <input type="text" placeholder='Add tags' className={`w-56 p-2.5 shadow  rounded-[6px] outline-none 
           ${appState === false ? 'shadow-gray-300  border-gray-300 placeholder:text-gray-400' : 'shadow-gray-600 border-gray-600 bg-gray-700 placeholder:text-gray-400'}
          border-1' `}
            onChange={(e) => setcont(e.target.value)}
          />
          <span className={`p-2 rounded-[6px] border-2 ${appState === false ? 'border-blue-400 text-blue-600' : 'border-green-400 text-green-400'}`}
            onClick={change}
          ><Plus /></span>
        </div>

        <button className={`mt-6  [@media(max-height:700px)]:mt-4.5 w-full rounded-[6px] py-3 ${appState === false ? 'bg-blue-600 text-white' : 'bg-green-600 text-black'}`}
          onClick={submit}
        >{loading === false ? <>ADD</> : <>Adding...</>}</button>
      </div>

    </div>
  )
}

export default Pop                       