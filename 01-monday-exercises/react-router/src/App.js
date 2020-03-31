import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  NavLink,
  Link,
  useParams,
  useRouteMatch
} from "react-router-dom";
import "./style.css";

// Since routes are regular React components, they
// may be rendered anywhere in the app, including in
// child elements.
//
// This helps when it's time to code-split your app
// into multiple bundles because code-splitting a
// React Router app is the same as code-splitting
// any other React app.

export default function NestingExample({info}) {
  return (
    <Router>
      <div>
        <ul className="header">>
          <li>
            <NavLink exact activeClassName="selected" to="/">Home</NavLink>
          </li>
          <li>
            <NavLink exact activeClassName="selected" to="/topics">Topics</NavLink>
          </li>
        </ul>

        <hr />

        <Switch>
          <Route exact path="/">
            <Home />
          </Route>
          <Route path="/topics">
            <Topics info={info}/>
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

function Home() {
  return (
    <div>
      <h2>Home</h2>
    </div>
  );
}

function Topics({info}) {
  let { path, url } = useRouteMatch();
  const listItems = (
  <ul>
    {info.map(item => {
      return (
        <li>
          <NavLink to={`${url}/${item.id}`}>{item.title}</NavLink>
        </li>
      );
    })}
  </ul>
  );

  return (
    <div>
      <h2>Topics</h2>
      <p>Size: {info.length}</p>
      {listItems}
      {/* <ul>
        <li>
          <Link to={`${url}/rendering`}>Rendering with React</Link>
        </li>
        <li>
          <Link to={`${url}/components`}>Components</Link>
        </li>
        <li>
          <Link to={`${url}/props-v-state`}>Props v. State</Link>
        </li>
      </ul> */}

      <Switch>
        <Route exact path={path}>
          <h3>Please select a topic.</h3>
        </Route>
        <Route path={`${path}/:topicId`}>
          <Topic info={info}/>
        </Route>
      </Switch>
    </div>
  );
}

function Topic({info}) {
  let { topicId } = useParams();
  const topic = info.find(topic => topicId === topic.id);

  return (
    <div>
      <h3>{topicId}</h3>
      <h3>Title</h3>
      {topic.title}
      <h3>Info</h3>
      {topic.info}
    </div>
  );
}
