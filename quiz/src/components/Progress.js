import React from 'react'

export default function Progress({index, numQuestions, points, totalPoints, answer }) {
  return (
    <div className='progress'>
        <progress max={numQuestions} value={index + Boolean(answer !== null)}></progress>
      <p>Question {index + 1} / {numQuestions}</p>
      <p>{points} / <bold> {totalPoints}</bold></p>
    </div>
  )
}
