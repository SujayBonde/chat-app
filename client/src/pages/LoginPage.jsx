import React, { useContext, useState } from 'react'
import assets from '../assets/assets'
import { AuthContext } from '../../context/AuthContext';

const LoginPage = () => {

  const [currentState, setCurrentState] =useState("Sign Up");
  const [fullName, setFullName] =useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [bio, setBio] = useState("");
  const [isDataSubmitted, setIsDataSubmitted] = useState(false);

  const {login} = useContext(AuthContext);

  const onSubmitHandler = (event)=>{
    event.preventDefault();

    if(currentState === 'Sign Up' && !isDataSubmitted){
      setIsDataSubmitted(true);
      return;
    }

    login(currentState ==="Sign Up" ? 'signup':'login', {fullName, email,password,bio})
  }

  return (
    <div className='min-h-screen flex items-center justify-center gap-10 px-4 sm:px-10 lg:px-20 overflow-hidden relative backdrop-blur-[30px]'>
      
      {/* Background Decor */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-purple-500/20 rounded-full blur-[100px]" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-[100px]" />

      {/* Left side - Logo/Welcome (Hidden on small screens) */}
      <div className='hidden md:flex flex-col items-center justify-center gap-6 text-center animate-fade-in-up'>
         <img src={assets.logo_big} alt="Logo" className='w-[200px] lg:w-[250px] drop-shadow-2xl hover:scale-105 transition-transform duration-500'/>
         <div>
            <h1 className='text-2xl font-bold text-white mb-2 tracking-tight'>Connect Instantly</h1>
            <p className='text-slate-400 text-lg'>Experience seamless messaging like never before.</p>
         </div>
      </div>

      {/* Right side - Form */}
      <form onSubmit={onSubmitHandler} className='w-full max-w-md bg-slate-900/60 backdrop-blur-2xl border border-slate-700/50 p-8 rounded-2xl shadow-2xl flex flex-col gap-6 animate-fade-in relative z-10'>
        
        <div className='flex flex-col gap-1 mb-2'>
           <h2 className='font-bold text-3xl text-white tracking-wide'>
             {currentState === "Sign Up" ? "Create Account" : "Welcome Back"}
           </h2>
           <p className='text-slate-400 text-sm'>
             {currentState === "Sign Up" ? "Get started with your free account" : "Sign in to continue your conversations"}
           </p>
        </div>

        {currentState === "Sign Up" && !isDataSubmitted && (
           <div className='flex flex-col gap-2'>
              <label className='text-slate-300 text-sm font-medium ml-1'>Full Name</label>
              <input 
                onChange={(e)=>setFullName(e.target.value)} 
                value={fullName} 
                type="text" 
                placeholder='e.g. John Doe' 
                required 
                className='p-3 bg-slate-800/100 border border-slate-700/50 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all' 
              />
           </div>
        )}

        {!isDataSubmitted && (
          <div className='flex flex-col gap-4'>
             <div className='flex flex-col gap-2'>
                <label className='text-slate-300 text-sm font-medium ml-1'>Email Address</label>
                <input 
                  onChange={(e)=>setEmail(e.target.value)} 
                  value={email} 
                  type="email" 
                  placeholder='john@example.com' 
                  required 
                  className='p-3 bg-slate-800/80 border border-slate-700/50 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all' 
                />
             </div>
             
             <div className='flex flex-col gap-2'>
                <label className='text-slate-300 text-sm font-medium ml-1'>Password</label>
                <input 
                  onChange={(e)=>setPassword(e.target.value)} 
                  value={password} 
                  type="password" 
                  placeholder='••••••••' 
                  required 
                  className='p-3 bg-slate-800/80 border border-slate-700/50 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all' 
                />
             </div>
          </div>
        )}

        {currentState === "Sign Up" && isDataSubmitted && (
           <div className='flex flex-col gap-2 animate-fade-in'>
              <label className='text-slate-300 text-sm font-medium ml-1'>Bio</label>
              <textarea 
                onChange={(e)=> setBio(e.target.value)} 
                value={bio} 
                rows={4} 
                className='p-3 bg-slate-800/80 border border-slate-700/50 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all resize-none' 
                placeholder='Tell us a bit about yourself...' 
                required
              ></textarea>
           </div>
        )}

        <button type='submit' className='py-3.5 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-semibold rounded-xl transition-all shadow-lg hover:shadow-indigo-500/25 active:scale-[0.98]'>
          {currentState ==="Sign Up" ? (isDataSubmitted ? "Complete Signup" : "Continue") : "Login"}
        </button>

        {!isDataSubmitted && currentState === "Sign Up" ? (
             <div className='flex items-center gap-3 text-xs text-slate-400 mx-auto'>
                <input type="checkbox" id="terms" className="accent-indigo-500 w-4 h-4 rounded border-slate-700 bg-slate-800" />
                <label htmlFor="terms">I agree to the <span className="text-indigo-400 cursor-pointer hover:underline">Terms of Service</span> & <span className="text-indigo-400 cursor-pointer hover:underline">Privacy Policy</span>.</label>
             </div>
        ) : null}

        <div className='flex flex-col gap-3 text-center mt-2'>
           {currentState === "Sign Up" ? (
              <p className='text-slate-400'>
                 Already have an account? <span onClick={()=>{setCurrentState("Login"); setIsDataSubmitted(false)}} className='font-semibold text-indigo-400 hover:text-indigo-300 cursor-pointer transition-colors'>Login here</span>
              </p>
           ) : (
              <p className='text-slate-400'>
                 Don't have an account? <span onClick={()=> setCurrentState("Sign Up")} className='font-semibold text-indigo-400 hover:text-indigo-300 cursor-pointer transition-colors'>Sign up</span>
              </p>
           )}
        </div>

        {/* Back button if data submitted */}
        {isDataSubmitted && (
           <div 
             onClick={()=> setIsDataSubmitted(false)}
             className="absolute top-8 right-8 text-slate-400 hover:text-white cursor-pointer transition-colors"
           >
             <span className="text-sm font-medium">Back</span>
           </div>
        )}
        
      </form>
    </div>
  )
}

export default LoginPage