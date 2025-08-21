import React from 'react'

const EmptyCard = ({imgSrc, message}) => {
  return (
    <div className='flex flex-col items-center justify-center mt-40 ml-[35%]'>
        <img src={imgSrc} alt="No Story Available" className='w-24' />
        <p className="w-1/2 text-lg font-medium text-slate-700 text-center leading-7 mt-5">{message}</p>
    </div>
  )
}

export default EmptyCard