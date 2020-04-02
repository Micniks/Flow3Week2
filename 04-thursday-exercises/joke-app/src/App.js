import React, {useState} from 'react';
import './App.css';

function App() {
  const[chuck, setChuck] = useState();
  const[dad, setDad] = useState();

  function getJokes(){
    let options = {
      'method': 'GET',
      'headers': {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    }
    fetch("http://localhost:8080/jokeFetcher/api/jokes", options)
    .then(res => res.json())
    .then(data => {
      console.log(data);
      setChuck(data.joke1);
      setDad(data.joke2);
    });
  }

  function chuckJoke(){
    return (chuck ? (<>
    <h3>Chuck Norris Joke:</h3>
    <i>{chuck}</i>
    </>):(<></>));
  }

  function dadJoke(){
    return (dad ? (<>
    <h3>Dad Joke:</h3>
    <i>{dad}</i>
    </>):(<></>));
  }

  return (
    <div className="App">
      {chuckJoke()}<br/>
      {dadJoke()}<br/><br/><br/>
      <button onClick={getJokes}>Get Jokes</button>
    </div>
  );
}



export default App;
