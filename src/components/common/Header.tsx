import React from 'react'

const SKHeader = ({ text, children = <></>, className = '', ...rest }) => {
  return (
    <div className="flex items-center justify-between">
      <h1 className={`text-xl font-semibold text-gray-700 mb-4${className}`}>{text}</h1>
      {children}
    </div>
  )
}

export default SKHeader 