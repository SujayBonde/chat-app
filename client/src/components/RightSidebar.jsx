import React, { useContext, useEffect, useState } from 'react'
import { ChatContext } from '../../context/ChatContext'
import { AuthContext } from '../../context/AuthContext';
import assets from '../assets/assets';

const RightSidebar = () => {
  const { selectedUser, messages } = useContext(ChatContext);
  const { logout, onlineUsers } = useContext(AuthContext);
  const [messageImages, setMessageImages] = useState([]);

  // get all the images from chat
  useEffect(() => {
    setMessageImages(
      messages.filter((msg) => msg.image).map((msg) => msg.image)
    );
  }, [messages]);

  return (
    <div className={`w-full h-full text-white relative flex flex-col overflow-hidden`}>
      {!selectedUser ? (
        // ---------- Placeholder when no user is selected ----------
        <div className="flex-1 flex flex-col items-center justify-center gap-4 text-center p-6">
           <div className="w-16 h-16 rounded-full bg-indigo-500/20 flex items-center justify-center animate-pulse">
              <span className="text-2xl">👋</span>
           </div>
           <div>
              <h3 className="text-lg font-medium text-slate-200">No Chat Selected</h3>
              <p className="text-sm text-slate-400 mt-1">Select a user to view their profile and shared media.</p>
           </div>
        </div>
      ) : (
        // ---------- User profile + media when user is selected ----------
        <div className="flex-1 flex flex-col h-full overflow-y-auto custom-scrollbar">
          
          {/* Profile Header */}
          <div className="pt-10 pb-6 flex flex-col items-center gap-3 w-full border-b border-indigo-500/20">
            <div className="relative">
              <img
                src={selectedUser?.profilePic || assets.avatar_icon}
                alt={selectedUser?.fullName}
                className="w-24 h-24 rounded-full object-cover border-4 border-indigo-500/30 p-1 shadow-lg"
              />
              {onlineUsers.includes(selectedUser._id) && (
                <div className="absolute bottom-1 right-1 w-5 h-5 bg-green-500 border-4 border-[#0f172a] rounded-full"></div>
              )}
            </div>

            <div className="text-center px-6">
              <h1 className="text-xl font-semibold text-white tracking-wide">
                {selectedUser.fullName}
              </h1>
              <p className="text-sm text-indigo-200/70 mt-1 font-light italic">
                {selectedUser.bio || "No bio available"}
              </p>
            </div>
          </div>

          {/* Media Section */}
          <div className="p-6 flex-1 overflow-y-auto">
            <h3 className="text-sm font-semibold text-slate-300 mb-4 sticky top-0 bg-[#0f172a]/80 backdrop-blur-sm py-2 z-10 w-full flex items-center gap-2">
              <span>🖼️</span> Shared Media
            </h3>
            
            {messageImages.length > 0 ? (
               <div className="grid grid-cols-2 md:grid-cols-2 gap-3">
                {messageImages.map((url, index) => (
                  <div
                    className="relative group cursor-pointer rounded-xl overflow-hidden aspect-square shadow-md border border-slate-700/50 hover:border-indigo-500/50 transition-all duration-300"
                    key={index}
                    onClick={() => window.open(url)}
                  >
                    <img src={url} alt="Shared" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                      <span className="text-white text-xs font-medium bg-black/50 px-2 py-1 rounded-full backdrop-blur-md">View</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="h-32 flex flex-col items-center justify-center text-slate-500 text-xs text-center border-2 border-dashed border-slate-700 rounded-xl">
                 <p>No media shared yet.</p>
              </div>
            )}
           
          </div>

          {/* Logout/Actions Footer */}
          <div className="p-6 mt-auto border-t border-indigo-500/20 bg-slate-900/30 backdrop-blur-md">
            <button
              onClick={() => logout()}
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-red-500/80 to-pink-600/80 hover:from-red-500 hover:to-pink-600 text-white text-sm font-medium py-3 rounded-xl shadow-lg hover:shadow-red-500/20 transition-all duration-300 transform active:scale-95"
            >
              <span>Logout</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default RightSidebar;