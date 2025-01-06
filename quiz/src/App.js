import { useEffect, useReducer } from 'react';
import Header from './Header'
import Main from './Main';
import Loader from './Loader'
import Error from './Error'
import StartScreen from './StartScreen';

function reducer(state, action){
  switch(action.type){
    case 'dataRecieved':
      return {...state, questions : action.payload, status : 'ready' };
    case "dataFailed":
      return {...state, status : 'error'}
    default: 
      throw new Error("some error occured")
  }
}

const initalState = {
  questions : 0,
  status : 'loading' 
}

function App() {
  const [{questions, status}, dispatch] = useReducer(reducer, initalState)
  const numQuestions = questions.length 
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
      {status === 'ready' && <StartScreen numQuestions={numQuestions} />}
    </Main>

  </div>
}

export default App;
