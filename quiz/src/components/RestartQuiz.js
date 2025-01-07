import React from 'react'

export default function RestartQuiz({dispatch}) {
  return <button className='btn btn-ui' onClick={()=>dispatch({type : "restart"})}>Restart</button>
}
