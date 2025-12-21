import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { removeFromPastes } from '../redux/pasteSlice'
import toast from 'react-hot-toast'
import { NavLink } from 'react-router-dom'
import {Copy,Calendar, PencilLine, Eye, Trash2,Share2} from 'lucide-react'


const Paste = () => {

  const pastes = useSelector((state) => state.paste.pastes)
  const [searchTerm, setSearchTerm] = useState('')
  const dispatch = useDispatch()

  const filteredData = pastes.filter(
    (paste) => paste.title.toLowerCase().includes(searchTerm.toLowerCase())
  )

  function handleDelete(pasteId) {
    dispatch(removeFromPastes(pasteId))
  }
  function handleShare(paste) {
    if (navigator.share) {
      navigator.share({
        title: paste.title,
        text: paste.content,
        url: window.location.origin + `/pastes/${paste._id}`,
      })
        .then(() => toast.success("Shared successfully"))
        .catch(() => toast.error("Share failed"))
    }
    else {
      navigator.clipboard.writeText(
        window.location.origin + `/pastes/${paste._id}`
      )
      toast.success("Link copied to clipbord")
    }
  }

  return (
    <div>
      <input className='p-2 rounded-2xl min-w-125 mt-5' type="search" placeholder='search here' value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />

      <div className='flex flex-col gap-5 mt-5'>
        {
          filteredData.length > 0 && filteredData.map(
            (paste) => {
              return (
                <div className='border' key={paste?._id}>
                  <div>
                    {paste.title}
                  </div>
                  <div>
                    {paste.content}
                  </div>
                  <div className='flex flex-row gap-4 place-content-evenly'>
                    <NavLink to={`/?pasteId=${paste?._id}`}><button className='group p-2 rounded-lg border border-gray-300 hover: bg-blue-50 transition ' ><PencilLine size={18} className='text-gray-600 group-hover:text-blue-500'  /></button> </NavLink>
                    <NavLink to={`/pastes/${paste._id}`}> <button className='group p-2 rounded-lg border border-gray-300 hover: bg-blue-50 transition ' ><Eye  size={18} className='text-gray-600 group-hover:text-blue-500'/> </button> </NavLink>
                    <button onClick={() => handleDelete(paste?._id)} className='group p-2 rounded-lg border border-gray-300 hover: bg-blue-50 transition '><Trash2  size={18} className='text-gray-600 group-hover:text-blue-500'/></button>
                    <button className='group p-2 rounded-lg border border-gray-300 hover: bg-blue-50 transition ' onClick={() => {
                      navigator.clipboard.writeText(paste?.content)
                      toast.success("Copied to clipbord")
                    }}><Copy size={18} className='text-gray-600 group-hover:text-blue-500' /></button>
                    <button className='group p-2 rounded-lg border border-gray-300 hover: bg-blue-50 transition ' onClick={() => handleShare(paste)}><Share2 size={18} className='text-gray-600 group-hover:text-blue-500'/></button> 
                  </div>
                  <div className='flex justify-center items-center gap-2 text-sm text-gray-600 mt-2'>
                    <Calendar size={18} className= 'text-gray-600 group-hover:text-blue-500'/>
                    {new Date(paste.createdAt).toLocaleDateString("en-IN",{
                      day:"numeric",
                      month: "short",
                      year: "numeric"
                    })}
                  </div>
                </div>
              )
            }
          )
        }
      </div>
    </div>
  )
}

export default Paste
