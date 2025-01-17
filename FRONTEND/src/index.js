import React from "react";
import ReactDOM from "react-dom";
import "./css/style.css";
import App from "./App";
import * as serviceWorker from "./serviceWorker";
import View from "./components/View";
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter, Route, Link } from "react-browser-router";
ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <App>
        <View></View>
      </App>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
