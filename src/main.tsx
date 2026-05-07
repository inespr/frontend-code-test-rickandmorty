import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "urql";
import { client } from "./lib/urqlClient";
import App from "./App";
import "./styles/tw-animate.css";
import "./styles/global.scss";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Provider value={client}>
      <App />
    </Provider>
  </React.StrictMode>
);