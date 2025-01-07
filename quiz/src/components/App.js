import { useEffect, useReducer } from 'react';
import Header from './Header'
import Main from './Main';
import Loader from './Loader'
import Error from './Error'
import StartScreen from './StartScreen';
import Questions from './Questions';
import NextButton from './NextButton';
import Progress from './Progress';
import FinishedScreen from './FinishedScreen';
import RestartQuiz from './RestartQuiz';
import Timer from './Timer';
import Footer from './Footer';

function reducer(state, action){
  switch(action.type){
    case 'dataRecieved':
      return {...state, questions : action.payload, status : 'ready' };
    case "dataFailed":
      return {...state, status : 'error'}
    case "start":
      return {...state, status : 'active', secondsRemaining : state.questions.length * 30}
    case "newAnswer":
      const question = state.questions.at(state.index)
      return {...state, answer : action.payload, points : question.correctOption === action.payload ? state.points + question.points : state.points }
    case "nextQuestion":
      return {...state,answer : null, index : state.index + 1}
    case "finish":
      return {...state , status : "finished", highscore : state.points > state.highscore ? state.points : state.highscore}
    case "restart":
      return {...initalState, status : 'ready', questions : state.questions, highscore : state.highscore }
    case "tick":
      return {...state, secondsRemaining : state.secondsRemaining - 1, status : state.secondsRemaining === 0 ? "finished" : state.status}  
      default: 
      throw new Error("some error occured")
  }
}

const initalState = {
  questions : [],
  status : 'loading' ,
  index : 0,
  answer : null, 
  points : 0,
  highscore : 0,
  secondsRemaining : null
}

function App() {
  const [{questions, status, index, answer, points, highscore, secondsRemaining}, dispatch] = useReducer(reducer, initalState)
  const numQuestions = questions.length 
  const totalPoints = questions.reduce((acc, question)=> acc + question.points,0)
  useEffect(function(){
    async function fetchQuestions(){
      try{
        const res = await fetch('http://localhost:9000/questions')
        const data = await res.json()
        dispatch({type : 'dataRecieved', payload : data})
      }catch(error){
        dispatch({type : 'dataFailed'})
      }
    }
    fetchQuestions()
  },[])
  return <div className='app'>
    <Header />
    <Main>
      {status === 'loading' && <Loader />}
      {status === "error" && <Error />}
      {status === 'ready' && <StartScreen dispatch={dispatch} numQuestions={numQuestions} />}
      {status === "active" && 
      <>
      <Progress index={index} numQuestions={numQuestions} points={points} totalPoints={totalPoints} answer={answer}/>
      <Questions question={questions[index]} dispatch={dispatch} answer={answer}/>
      <Footer>
        <Timer secondsRemaining={secondsRemaining} dispatch={dispatch} />
        <NextButton dispatch={dispatch} answer={answer} index={index} numQuestions={numQuestions} />
      </Footer>
      </>
      }
      {status === 'finished' && 
      <>
        <FinishedScreen points={points} maxPossiblePoints={totalPoints} highscore={highscore}/>
        <RestartQuiz dispatch={dispatch} />
        </>
      } 
    </Main>

  </div>
}

export default App;
