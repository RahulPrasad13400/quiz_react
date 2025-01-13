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
import questionsObj from './questions.json'
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
        // const res = await fetch('http://localhost:9000/questions')
        // const data = await res.json()
        const data = [
          {
            "question": "Who is the first character to be crowned King of Westeros in Game of Thrones?",
            "options": ["Robert Baratheon", "Joffrey Baratheon", "Stannis Baratheon", "Renly Baratheon"],
            "correctOption": 0,
            "points": 10
          },
          {
            "question": "Who kills King Joffrey Baratheon?",
            "options": ["Sansa Stark", "Tyrion Lannister", "Olenna Tyrell", "Petyr Baelish"],
            "correctOption": 2,
            "points": 10
          },
          {
            "question": "What is the name of Jon Snow's direwolf?",
            "options": ["Summer", "Ghost", "Nymeria", "Shaggydog"],
            "correctOption": 1,
            "points": 10
          },
          {
            "question": "Who was the last person to sit on the Iron Throne?",
            "options": ["Daenerys Targaryen", "Cersei Lannister", "Aerys II Targaryen", "Bran Stark"],
            "correctOption": 1,
            "points": 10
          },
          {
            "question": "What is the name of Arya Stark's sword?",
            "options": ["Oathkeeper", "Needle", "Longclaw", "Ice"],
            "correctOption": 1,
            "points": 10
          },
          {
            "question": "Who is known as 'The Hound'?",
            "options": ["Sandor Clegane", "Gregor Clegane", "Jaime Lannister", "Brienne of Tarth"],
            "correctOption": 0,
            "points": 10
          },
          {
            "question": "What is the name of Daenerys Targaryen’s second dragon?",
            "options": ["Drogon", "Viserion", "Rhaegal", "Balerion"],
            "correctOption": 2,
            "points": 10
          },
          {
            "question": "Who was the first character to be killed in the Battle of the Bastards?",
            "options": ["Rickon Stark", "Wun Wun", "Jon Snow", "Sansa Stark"],
            "correctOption": 0,
            "points": 10
          },
          {
            "question": "What is the name of the city where Daenerys is crowned Queen of the Dothraki?",
            "options": ["Qarth", "Astapor", "Vaes Dothrak", "Meereen"],
            "correctOption": 2,
            "points": 10
          },
          {
            "question": "Which of the following characters is NOT a Stark?",
            "options": ["Jon Snow", "Robb Stark", "Benjen Stark", "Theon Greyjoy"],
            "correctOption": 3,
            "points": 10
          },
          {
            "question": "What was the name of the ancient Stark sword that was melted down by the Lannisters?",
            "options": ["Ice", "Oathkeeper", "Longclaw", "Dawn"],
            "correctOption": 0,
            "points": 10
          },
          {
            "question": "Who was the Mother of Dragons?",
            "options": ["Sansa Stark", "Margaery Tyrell", "Cersei Lannister", "Daenerys Targaryen"],
            "correctOption": 3,
            "points": 10
          },
          {
            "question": "What is the name of the Night King's dragon?",
            "options": ["Viserion", "Drogon", "Rhaegal", "Balerion"],
            "correctOption": 0,
            "points": 10
          },
          {
            "question": "Who does Tyrion Lannister marry?",
            "options": ["Sansa Stark", "Shae", "Margaery Tyrell", "Selyse Baratheon"],
            "correctOption": 1,
            "points": 10
          },
          {
            "question": "Which city is the capital of the Seven Kingdoms?",
            "options": ["Winterfell", "Dragonstone", "King's Landing", "Riverrun"],
            "correctOption": 2,
            "points": 10
          }
        ]
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
