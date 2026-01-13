import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../../context/AuthContext'
import { ChatContext } from '../../context/ChatContext'
import assets from '../assets/assets'

const Sidebar = () => {
  const { getUsers, users, selectedUser, setSelectedUser, unseenMessages, setUnseenMessages } = useContext(ChatContext)
  const { logout, onlineUsers } = useContext(AuthContext)

  const [input, setInput] = useState("")
  const [open, setOpen] = useState(false)

  const navigate = useNavigate()

  const filteredUser = input
    ? (users || []).filter(user =>
        user.fullName.toLowerCase().includes(input.toLowerCase())
      )
    : (users || [])

  useEffect(() => {
    getUsers()
  }, [onlineUsers])

  return (
    <div className="h-full flex flex-col w-full bg-slate-900/30">
      
      {/* Header / Search */}
      <div className='p-4 border-b border-slate-700/50'>
        <div className='flex items-center justify-between mb-4'>
            <h2 className='text-xl font-semibold text-white tracking-wide'>Quick Chat</h2>
             {/* Menu icon */}
            <div className="relative">
              <div 
                className="p-2 hover:bg-white/10 rounded-full transition-colors cursor-pointer"
                onClick={() => setOpen(!open)}
              >
                 <img src={assets.menu_icon} alt="menu" className="w-5 h-5 opacity-80" />
              </div>

              {open && (
                <div className="absolute top-10 right-0 z-50 w-48 p-2 rounded-xl bg-[#1e293b] border border-slate-600 shadow-xl animate-fade-in origin-top-right">
                  <p
                    onClick={() => {
                      navigate("/profile")
                      setOpen(false)
                    }}
                    className="cursor-pointer text-sm p-3 hover:bg-white/5 rounded-lg text-gray-200 transition-colors"
                  >
                    Edit Profile
                  </p>
                  <div className="h-[1px] bg-slate-600 my-1" />
                  <p
                    onClick={() => {
                      logout()
                      setOpen(false)
                    }}
                    className="cursor-pointer text-sm p-3 hover:bg-red-500/10 text-red-400 rounded-lg transition-colors"
                  >
                    Logout
                  </p>
                </div>
              )}
            </div>
        </div>

        <div className='bg-slate-800/50 rounded-xl flex items-center gap-2 px-4 py-3 border border-slate-700/50 focus-within:border-indigo-500/50 focus-within:bg-slate-800 transition-all'>
          <img src={assets.search_icon} alt="search" className='w-4 opacity-50' />
          <input
            onChange={(e) => setInput(e.target.value)}
            type="text"
            className='bg-transparent border-none outline-none text-white text-sm placeholder-slate-400 flex-1'
            placeholder='Search users...'
          />
        </div>
      </div>

      {/* Users list */}
      <div className='flex-1 overflow-y-auto custom-scrollbar p-3 space-y-1'>
        {filteredUser.map((user, index) => (
          <div
            key={index}
            onClick={() => {
              setSelectedUser(user)
              setUnseenMessages(prev => ({ ...prev, [user._id]: 0 }))
            }}
            className={`group relative flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all duration-200 
              ${selectedUser?._id === user._id ? 'bg-indigo-600/20 border border-indigo-500/30' : 'hover:bg-white/5 border border-transparent'}
            `}
          >
            <div className="relative">
              <img
                src={user?.profilePic || assets.avatar_icon}
                alt=""
                className='w-12 h-12 rounded-full object-cover border-2 border-transparent group-hover:border-indigo-500/50 transition-all'
              />
               {onlineUsers.includes(user._id) && (
                 <span className='absolute bottom-0.5 right-0.5 w-3 h-3 bg-green-500 border-2 border-[#0f172a] rounded-full'></span>
               )}
            </div>
            
            <div className='flex-1 min-w-0'>
              <div className='flex justify-between items-baseline mb-0.5'>
                 <p className='font-medium text-gray-100 truncate'>{user.fullName}</p>
                 {/* Placeholder for time if needed */}
              </div>
              <p className={`text-sm truncate ${selectedUser?._id === user._id ? 'text-indigo-200' : 'text-slate-400'}`}>
                 {onlineUsers.includes(user._id) ? 'Online' : 'Offline'}
              </p>
            </div>

            {unseenMessages[user._id] > 0 && (
              <div className='min-w-[20px] h-5 flex items-center justify-center rounded-full bg-indigo-500 text-[10px] font-bold text-white px-1.5'>
                {unseenMessages[user._id]}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default Sidebar
