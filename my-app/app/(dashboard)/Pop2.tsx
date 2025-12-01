import React from 'react'
import { useState } from 'react'
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

type prop = {
  show2: boolean
  setshow2: React.Dispatch<React.SetStateAction<boolean>>,
  title: string,
  content: string,
  tags: string[],
  settags: React.Dispatch<React.SetStateAction<string[]>>,
  setnotes: React.Dispatch<React.SetStateAction<arr[]>>
}
const Pop2: React.FC<prop> = ({ show2, setshow2, title, content, tags, settags, setnotes }) => {
  const appState = useSelector((state: RootState) => state.slice.isEnabled);
  const [loading, setloading] = useState<boolean>(false);
  const [title2, settitle2] = useState<string>(title);
  const [content2, setcontent2] = useState<string>(content);
  const [cont, setcont] = useState<string>('');
  console.log(tags);
  function del(id: number) {
    const filtered = tags.filter((el, i) => i !== id)
    settags(filtered);
  }

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

  async function update() {
    const name: string | undefined = Cookies.get("name");
    if (title.length === 0 && content.length === 0) {
      return
    }
    try {
      setloading(true);
      const update = await axios.post('/api/update', {
        name: name,
        title: title2,
        content: content2,
        tags: tags
      });
      if (update.data.success === true) {
        const d = update.data.data;
        setnotes([...d]);
        toast.success('note updated');
        setshow2(false);
      }
      else {
        toast.error(update.data.message);
      }
    }
    catch (err) {
      toast.error(err);
    }
    finally {
      setloading(false)
    }
  }

  return (

    <div className={`absolute top-[50%] left-[50%]  shadow shadow-gray-400 translate-x-[-50%] translate-y-[-50%] z-10  rounded-[6px] p-4.5 w-[550px]
       max-sm:w-[90%] ${appState === false ? 'bg-white ' : 'bg-gray-800 '} transition-all
       ${show2 === false ? 'hidden' : 'block '}  
       `}>
      <div className='w-full flex justify-end' onClick={() => setshow2(!show2)}>
        <X />
      </div>

      <div>
        <p className={`${appState === false ? 'text-gray-500' : 'text-white'}`}>TITLE</p>
        <input value={title2} type="text" className={`w-full border-[1px] ${appState === false ? ' placeholder-gray-500' : 'placeholder-white'} border-gray-600  mt-[2px]  text-[30px] border-none focus:outline-none`} placeholder='Write The Title Here'
          onChange={(e) => settitle2(e.target.value)}
        />
      </div>

      <div className='mt-5 [@media(max-height:700px)]:mt-3'>
        <p className={`${appState === false ? 'text-gray-500' : 'text-white'}`}>CONTENT</p>
        <textarea value={content2} className={` mt-2.5 w-full h-60 rounded-[8px]  [@media(max-height:700px)]:mt-1.5 ${appState === false ? 'bg-blue-50' : 'bg-gray-700'} focus:outline-none pt-2 pl-2 [@media(max-height:700px)]:h-48`}
          onChange={(e) => setcontent2(e.target.value)}
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
             border-1'`}
            onChange={(e) => setcont(e.target.value)}
          />
          <span className={`p-2 rounded-[6px] border-2 ${appState === false ? 'border-blue-400 text-blue-600' : 'border-green-400 text-green-400'}`}
            onClick={change}
          ><Plus /></span>
        </div>

        <button onClick={update} className={`mt-6  [@media(max-height:700px)]:mt-4.5 w-full rounded-[6px] py-3 ${appState === false ? 'bg-blue-600 text-white' : 'bg-green-600 text-black'}`}
        >{loading === false ? <>UPDATE</> : <>Updating...</>}</button>
      </div>
    </div>
  )
}

export default Pop2         