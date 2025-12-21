import React, { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { addToPastes, updateToPastes } from '../redux/pasteSlice'
import { useDispatch, useSelector } from 'react-redux'
import toast from 'react-hot-toast'
import {Copy, PencilLine, PlusCircle} from 'lucide-react'

const Home = () => {

    const [title, setTitle] = useState('')
    const [value, setValue] = useState('')
    const [searchParams, setSearchParams] = useSearchParams()
    const pasteId = searchParams.get("pasteId")
    const dispatch = useDispatch()
    const allPastes = useSelector((state) => state.paste.pastes)

    useEffect(() => {
        if (pasteId) {
            const paste = allPastes.find((p) => p._id === pasteId)
            setTitle(paste.title)
            setValue(paste.content)
        }

    }, [pasteId])

    function createPaste() {
        const paste = {
            title: title,
            content: value,
            _id: pasteId || Date.now().toString(36),
            createdAt: new Date().toISOString(),
        }

        if (pasteId) {
            // update
            dispatch(updateToPastes(paste))
        }
        else {
            // create a paste
            dispatch(addToPastes(paste))
        }

        // after creation or updation
        setTitle('')
        setValue('')
        setSearchParams({})
    }

    function handleCopy() {
        if (!value.trim()) {
            toast.error("Nothing to copy")
            return
        }
        navigator.clipboard.writeText(value)
        toast.success("Content copied to clipboard")
    }
    return (
        <div>
            <div className='flex flex-row gap-7 place-content-between'>
                <input
                    className='p-1 rounded-2xl mt-2 w-[85%] pl-4'
                    type='text'
                    placeholder='enter title here'
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />

                <button 
                onClick={createPaste} 
                // className='p-2 rounded-2xl mt-2 whitespace-nowrap'
                className='group p-2 rounded-lg border border-gray-300 hover: bg-blue-50 transition'
                title =  {pasteId ? "Update My Paste" : "Create My Paste"}
                >
                   {
                    pasteId ? (
                        <PencilLine size={20} className="text-gray-600 group-hover:text-blue-500"/>
                    ) : (
                        <PlusCircle size={20} className="text-gray-600 group-hover:text-blue-500"/>
                    )
                   }
                </button>
            </div>

            <div className='mt-8 flex items-start gap-3'>
                <textarea
                    className='rounded-2xl  min-w-125 p-4  w-full'
                    value={value}
                    placeholder='Enter content here'
                    onChange={(e) => setValue(e.target.value)}
                    rows={20}
                />

                <button
                    onClick={handleCopy}
                    className='group p-2 rounded-lg border border-gray-300 hover: bg-blue-50 transition '>
                    <Copy size={20} className='text-gray-600 group-hover:text-blue-500'/>
                </button>
            </div>
        </div>
    )
}

export default Home
