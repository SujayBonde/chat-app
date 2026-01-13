import { useContext } from 'react'
import Sidebar from '../components/Sidebar'
import ChatContainer from '../components/ChatContainer'
import RightSidebar from '../components/RightSidebar'
import { ChatContext } from '../../context/ChatContext'

const HomePage = () => {
  const { selectedUser } = useContext(ChatContext);

  return (
    <div className='h-[100dvh] bg-transparent overflow-hidden flex flex-col'>
       <div className={`flex-1 w-full md:w-[95%] xl:w-[90%] mx-auto md:pt-4 md:pb-2 overflow-hidden`}>
        <div className={`bg-slate-900/50 backdrop-blur-3xl md:border border-slate-700/50 md:rounded-2xl overflow-hidden h-full grid grid-cols-1 md:grid-cols-[320px_1fr] lg:grid-cols-[380px_1fr_320px] shadow-2xl transition-all duration-300`}>
          
          {/* Sidebar - Hidden on mobile if user is selected */}
          <div className={`${selectedUser ? 'hidden md:block' : 'block'} h-full border-r border-slate-700/50`}>
            <Sidebar />
          </div>

          {/* Chat Container - Hidden on mobile if NO user selected */}
          <div className={`${!selectedUser ? 'hidden md:block' : 'block'} h-full flex`}>
             <ChatContainer />
          </div>

           {/* Right Sidebar - Only visible on Large screens */}
          <div className='hidden lg:block border-l border-slate-700/50'>
             <RightSidebar />
          </div>
          
        </div>
      </div>
      
      {/* Footer */}
      <footer className="hidden md:block w-full text-center pb-2 pt-1 text-slate-400/80 text-xs font-light tracking-wide">
        <p className="flex items-center justify-center gap-1">
          Made with <span className="text-red-500 animate-pulse text-sm">❤️</span> by 
          <span className="text-indigo-400 font-medium hover:text-indigo-300 transition-colors cursor-pointer">Sujay</span> 
          <span className="opacity-50">|</span> 
           &copy; {new Date().getFullYear()} Quick Chat
        </p>
      </footer>
    </div>
  )
}

export default HomePage