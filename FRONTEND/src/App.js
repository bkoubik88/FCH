import React from "react";
import logo from "./logo.svg";
import "./App.css";
import { Redirect } from "react-router";

function App({ children }) {
  const [navigate, setNavigate] = React.useState(false);

  if (navigate) {
    return <Redirect to="/" push={true}></Redirect>;
  }

  return <div className="App">{children}</div>;
}

export default App;
