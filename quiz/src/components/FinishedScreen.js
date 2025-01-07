import React from 'react'

export default function FinishedScreen({points,  maxPossiblePoints, highscore}) {
    const percentage = (points / maxPossiblePoints) * 100
  return <>
        <div className='result'>
            <p>You Scored <strong>{points}</strong> out of {maxPossiblePoints} ({Math.ceil(percentage)}%)</p>
        </div>
            <p className='highscore'>(highscore : {highscore} points)</p>
        </>
}
