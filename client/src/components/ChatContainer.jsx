import React, { useContext, useEffect, useRef, useState } from "react";
import assets, { messagesDummyData } from "../assets/assets";
import { formatMessageTime } from "../lib/utils";
import { ChatContext } from "../../context/ChatContext";
import { AuthContext } from "../../context/AuthContext";
import toast from 'react-hot-toast'

const ChatContainer = () => {

  const { messages, selectedUser, setSelectedUser, sendMessage, getMessages}= useContext(ChatContext);

  const {authUser, onlineUsers}= useContext(AuthContext);

  const scrollEnd = useRef();

  const [input, setInput] = useState("");

  //handle sending a message
  const handleSendMessage = async (e)=>{
    e.preventDefault();
    if(input.trim() ==="") return null;
    await sendMessage({text: input.trim()});
    setInput("");
  }

  //handle sending a image
  const handleSendImage = async (e)=>{
    const file = e.target.files[0];
    if(!file || !file.type.startsWith("image/")){
      toast.error("Select an Image File")
      return;
    }

    const reader = new FileReader();

    reader.onloadend = async ()=>{
      await sendMessage({image: reader.result})
      e.target.value ="";
    }
    reader.readAsDataURL(file);
  }

  useEffect(()=>{
    if(selectedUser){
      getMessages(selectedUser._id)
    }
  },[selectedUser])

  useEffect(() => {
    if (scrollEnd.current && messages) {
      scrollEnd.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  return selectedUser ? (
    <div className="flex flex-col h-full w-full bg-slate-900/50 backdrop-blur-lg relative">
      
      {/* Header */}
      <div className="flex items-center gap-4 px-4 py-3 border-b border-slate-700/50 bg-slate-900/50 backdrop-blur-md sticky top-0 z-10">
        <button 
          onClick={() => setSelectedUser(null)}
          className="md:hidden p-2 -ml-2 hover:bg-white/10 rounded-full transition-colors"
        >
          <img src={assets.arrow_icon} alt="Back" className="w-5 h-5 invert opacity-80" />
        </button>

        <div className="relative">
          <img 
            className="w-10 h-10 rounded-full object-cover border-2 border-slate-700" 
            src={selectedUser.profilePic || assets.avatar_icon} 
            alt={selectedUser.fullName} 
          />
           {onlineUsers.includes(selectedUser._id) && (
             <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-slate-900 rounded-full"></span> 
           )}
        </div>
        
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-white text-lg truncate">{selectedUser.fullName}</h3>
          <p className="text-xs text-slate-400">
            {onlineUsers.includes(selectedUser._id) ? "Active now" : "Offline"}
          </p>
        </div>

        <img src={assets.help_icon} alt="Help" className="w-6 h-6 opacity-60 hover:opacity-100 cursor-pointer transition-opacity" />
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
        {messages.map((msg, index) => {
           const isSender = msg.senderId === authUser._id;
           return (
            <div key={index} className={`flex ${isSender ? "justify-end" : "justify-start"}`}>
              <div className={`flex flex-col max-w-[85%] md:max-w-[70%] ${isSender ? "items-end" : "items-start"}`}>
                
                {msg.image && (
                   <img
                    src={msg.image}
                    alt="attachment"
                    className="max-w-[250px] w-full rounded-xl border border-slate-700/50 mb-2 cursor-pointer hover:scale-[1.02] transition-transform"
                   />
                )}

                {msg.text && (
                  <div
                    className={`px-4 py-2.5 rounded-2xl text-sm md:text-[15px] leading-relaxed break-words shadow-sm ${
                      isSender 
                        ? "bg-gradient-to-br from-indigo-600 to-violet-600 text-white rounded-br-sm" 
                        : "bg-slate-800/80 text-gray-100 border border-slate-700/50 rounded-bl-sm"
                    }`}
                  >
                    {msg.text}
                  </div>
                )}
                
                <div className="text-[10px] text-slate-500 mt-1 px-1 font-medium">
                  {formatMessageTime(msg.createdAt)}
                </div>
              </div>
            </div>
          );
        })}
        <div ref={scrollEnd} className="h-1" />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-slate-900/50 border-t border-slate-700/50">
         <form 
           onSubmit={handleSendMessage}
           className="flex items-center gap-3 bg-slate-800/80 p-1.5 rounded-full border border-slate-700/50 focus-within:border-indigo-500/50 focus-within:bg-slate-800 transition-all shadow-lg"
         >
            <div className="flex items-center gap-1 pl-2">
               <label htmlFor="image" className="p-2 hover:bg-white/10 rounded-full cursor-pointer transition-colors group">
                 <img src={assets.gallery_icon} alt="gallery" className="w-5 h-5 opacity-60 group-hover:opacity-100 group-hover:scale-110 transition-all" />
                 <input onChange={handleSendImage} type="file" id="image" accept="image/png, image/jpeg" hidden />
               </label>
            </div>

            <input 
              onChange={(e) => setInput(e.target.value)} 
              value={input} 
              type="text" 
              placeholder="Type a message..." 
              className="flex-1 bg-transparent border-none outline-none text-white text-sm placeholder-slate-400 h-9"
            />
            
            <button 
              type="submit"
              disabled={!input.trim()}
              className={`p-2.5 rounded-full transition-all duration-300 ${
                 input.trim() 
                  ? "bg-indigo-600 hover:bg-indigo-500 text-white shadow-md hover:shadow-indigo-500/30 rotate-0" 
                  : "bg-slate-700/50 text-slate-400 cursor-not-allowed rotate-90 opacity-50"
              }`}
            >
               <img src={assets.send_button} alt="send" className="w-4 h-4 translate-x-0.5" />
            </button>
         </form>
      </div>

    </div>
  ) : (
    <div className="h-full flex flex-col items-center justify-center p-8 text-center bg-slate-900/30">
      <div className="w-24 h-24 bg-indigo-500/10 rounded-full flex items-center justify-center mb-6 animate-pulse-slow">
         <img src={assets.logo_icon} alt="Logo" className="w-12 h-12 opacity-80" />
      </div>
      <h2 className="text-2xl font-bold text-white mb-2">Welcome to Quick Chat App</h2>
      <p className="text-slate-400 max-w-xs leading-relaxed">
        Select a chat to start messaging instantly with your friends and family.
      </p>
    </div>
  );
};

export default ChatContainer;
