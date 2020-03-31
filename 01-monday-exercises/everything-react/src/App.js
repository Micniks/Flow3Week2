import React, {useState} from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  NavLink,
  useParams,
  useRouteMatch,
  Prompt
} from "react-router-dom";
import './App.css';

function App({bookFacade}) {
  const[loginStatus, setLoginStatus] = useState(false);

  const login = (loginState) => {
    setLoginStatus(loginState);
  };

  return (
    <div>
      <Header loginStatus={loginStatus} />
      <Switch>
        <Route exact path="/">
          <Home />
        </Route>
        <Route path="/products">
          <Products bookFacade={bookFacade}/>
        </Route>
        <Route path="/company">
          <Company />
        </Route>
        <Route path="/add-book">
          <AddBook bookFacade={bookFacade}/>
        </Route>
        <Route path="/find-book">
          <FindBook bookFacade={bookFacade}/>
        </Route>
        <Route path="/login">
          <Login loginStatus={loginStatus} login={login}/>
        </Route>
        <Route path="/:area">
          <NoMatch/>
        </Route>
      </Switch>
    </div>

  );
}

function Header({loginStatus, login}){

  return(
    <ul className="header">
      <li><NavLink exact activeClassName="active" to="/">Home</NavLink></li>
      <li><NavLink activeClassName="active" to="/products">Products</NavLink></li>
      {loginStatus ? (<>
      <li><NavLink activeClassName="active" to="/add-book">Add Book</NavLink></li>
      <li><NavLink activeClassName="active" to="/find-book">Find Book</NavLink></li>
      </>): (<></>)}
      <li><NavLink activeClassName="active" to="/company">Company</NavLink></li>
      {loginStatus ? 
      (<li><NavLink activeClassName="active" to="/login">Logout</NavLink></li>): 
      (<li><NavLink activeClassName="active" to="/login">Login</NavLink></li>)}
    </ul>
  );
};

function Login({loginStatus, login}){
  function submitHandle(evt){
    evt.target.id == 'login' ? login(true) : login(false);
  }

  return(
    <p>
      {!loginStatus ?
        (<>Click here to log in: <Link to="/"><button id='login' onClick={submitHandle}>Login</button></Link></>):
        (<>Click here to log out: <Link to="/"><button id='logout' onClick={submitHandle}>Logout</button></Link></>)
      }
    </p>
  );
}

function Home(){
  return(
    <div>
      <p>This is the Home component</p>
    </div>
  );
};

function Products({bookFacade}){
  let { path, url } = useRouteMatch();
  return(
    <div>
      <p>There are {bookFacade.getBooks().length} books</p>
      <ul>
      {bookFacade.getBooks().map(book => {
        return (
          <li key={book.id}>
            {book.title}, <NavLink exact activeClassName="active" to={`${url}/${book.id}`}>details</NavLink>
          </li>
        );
      })}
      </ul>
      <Route exact path={path}>
        <p>Book details for selected book will go here</p>
      </Route>
      <Route path={`${path}/:id`}>
        <Details bookFacade={bookFacade}/>
      </Route>
      
    </div>
  );
};

function Details({bookFacade}){
  let { id } = useParams();
  let searchedBook = bookFacade.findBook(id);
  return (
    <p>
      <b>ID:</b> {searchedBook.id}<br/>
      <b>Title:</b> {searchedBook.title}<br/>
      <b>Info:</b> {searchedBook.info}
    </p>
  );
};

function FindBook({bookFacade}){
  const[id, setId] = useState();
  const[book, setBook] = useState();
  const[searched, setSearched] = useState(false);

  function changeHandler(evt){
    setId(evt.target.value);
  };

  function submitHandler(evt){
    evt.preventDefault();
    setBook(bookFacade.findBook(id));
    setSearched(true);
  };

  function deletingBook(evt){
    evt.preventDefault();
    bookFacade.deleteBook(book.id);
    setSearched(false);
    setId('');
  }

  function readBook(){
    return !book ? (<p>No matching book</p>) : (
      <p>
        <b>ID:</b> {book.id}<br/>
        <b>Title:</b> {book.title}<br/>
        <b>Info:</b> {book.info}<br/>
        <button onClick={deletingBook}>Delete Book</button>
      </p>
    )
  };

  return(<form onSubmit={submitHandler}>
    <input type='number' placeholder='Enter book id' value={id} onChange={changeHandler}/>
    <input type='submit' value='Find book'/><br/>
    {searched ? readBook() : <p>Enter ID for book to see</p>}
  </form>);
};

function Company(){
  return(
    <div>
      <p>This is the Company component</p>
    </div>
  );
};

function AddBook({bookFacade}){
  const initialBook = {id:"", title: "", info: ""};
  const[book, setBook] = useState(initialBook);
  const[isBlocked, setIsBlocked] = useState(false);

  function updateBook(evt){
    let t = evt.target
    let updatedBook = {...book};
    updatedBook[t.id] = t.value;
    // console.log('Field changed was: ' + t.id);
    // console.log('updated value was: ' + t.value);
    // console.log('updated book looks like:');
    // console.log(updatedBook);
    setIsBlocked(updatedBook.title.length > 0 || updatedBook.info.length > 0)
    setBook(updatedBook);
  }

  function saveBook(evt){
    evt.preventDefault();
    bookFacade.addBook(book);
    setBook(initialBook);
  }

  return(
    <div>
      <h2>Add Book</h2>
      <form onSubmit={saveBook}>
      <Prompt
        when={isBlocked}
        message={() =>
          `If you leave the page, your new book will be lost!\n                  Do you wish to continue?`
        }
      />
        <input id='title' type='text' placeholder='Add title' value={book.title} onChange={updateBook}/><br/>
        <input id='info' type='text' placeholder='Add info' value={book.info} onChange={updateBook}/><br/>
        <input type='submit' value='Save'/>
        {/* <p>{isBlocked ? 'Blocked' : 'Clear'}</p> */}
      </form>
    </div>
  );
};

function NoMatch(){
  let { area } = useParams();
  return (
    <div>
      <p>No site matching: <b>/{area}</b></p>
    </div>
  );  
}

export default App;
