import React from 'react'

export default function Options({question, dispatch, answer}) {
    const hasAnswered = answer !== null
  return <div className='options'>
  {question.options.map((option,i)=> <button disabled={hasAnswered} key={option} className={`btn btn-option ${i === answer ? "answer" : ""} ${hasAnswered ? i === question.correctOption ? "correct" : "wrong" : "" }`} onClick={()=>dispatch({type : "newAnswer", payload : i })}>{option}</button>)}
</div>
}
