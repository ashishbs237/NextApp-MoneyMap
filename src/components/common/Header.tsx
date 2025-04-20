import React from 'react'

const SKHeader = ({ text, children = <></>, className, ...rest }) => {
  return (
    <div className="flex items-center justify-between">
      <h1 className={`text-xl w-full font-bold mb-3 ${className}`}>{text}</h1>
      {children}
    </div>
  )
}

export default SKHeader 