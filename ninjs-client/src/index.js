import React from "react";
import ReactDOM from "react-dom";
import axios from "axios";
import { Provider } from "react-redux";
import * as serviceWorker from "./serviceWorker";

// App
import App from "./App";

// store
import store from "./store";

axios.defaults.headers.common["Authorization"] =
  "Bearer " + localStorage.getItem("token");

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
