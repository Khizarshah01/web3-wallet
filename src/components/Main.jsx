import React from 'react'
import Auth from './pages/Auth'
const Main = () => {
  return (
    <div className='flex h-screen bg-blue-400 justify-center items-center'>
      <div className='w-[500px] h-[700px] bg-white rounded-2xl shadow-lg p-6 text-center'>
        <Auth />
      </div>
    </div>
  )
}

export default Main
