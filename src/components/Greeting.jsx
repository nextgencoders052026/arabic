import { useState } from 'react'
import { getStoredName } from '../utils/profile'

function Greeting() {
  const [name] = useState(getStoredName)

  return (
    <p className="screen__greeting">
      {name && <span className="screen__greeting-name">{name} </span>}
      <span className="arabic-text screen__greeting-ar" dir="rtl" lang="ar">
        السلام عليكم
      </span>
    </p>
  )
}

export default Greeting
