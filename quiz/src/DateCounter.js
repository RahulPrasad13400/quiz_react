import { useReducer } from "react";

function reducer(state, action){
  console.log(action)
  switch(action.type){
    case 'inc':
      return {...state, count : state.count + state.step}
    case 'dec':
      return {...state, count : state.count - state.step};
    case 'setCount':
      return {...state, count : action.payload};
    case "setStep":
      return {...state, step : action.payload}
    case "reset":
      return {count : 0, state : 0}
    default:
      return state
  }
}

function DateCounter() {
  const initialState = {count : 0, step : 1}
  const [state, dispath] = useReducer(reducer, initialState)
  const {count, step} = state

  // This mutates the date object.
  const date = new Date("june 21 2027");
  date.setDate(date.getDate() + count);

  const dec = function () {
    dispath({type : 'dec'})
    // setCount((count) => count - 1);
    // setCount((count) => count - step);
  };

  const inc = function () {
    dispath({type : 'inc'})
    // setCount((count) => count + 1);
    // setCount((count) => count + step);
  };

  const defineCount = function (e) {
    dispath({type : "setCount", payload : Number(e.target.value)})
    // setCount(Number(e.target.value));
  };

  const defineStep = function (e) {
    dispath({type : "setStep" , payload : Number(e.target.value)})
    // setStep(Number(e.target.value));
  };

  const reset = function () {
    dispath({type : "reset"})
    // setCount(0);
    // setStep(1);
  }; 

  return (
    <div className="counter">
      <div>
        <input
          type="range"
          min="0"
          max="10"
          value={step}
          onChange={defineStep}
        />
        <span>{step}</span>
      </div>

      <div>
        <button onClick={dec}>-</button>
        <input value={count} onChange={defineCount} />
        <button onClick={inc}>+</button>
      </div>

      <p>{date.toDateString()}</p>

      <div>
        <button onClick={reset}>Reset</button>
      </div>
    </div>
  );
}
export default DateCounter;
