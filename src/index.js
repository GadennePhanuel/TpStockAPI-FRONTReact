import React from "react";
import ReactDOM from "react-dom";
import "./css/bootstrap.min.css";
import Navbar from "./js/components/Navbar";
import HomePage from "./js/pages/HomePage";
import { HashRouter, Switch, Route } from "react-router-dom";
import StocksPage from "./js/pages/StocksPage";
import ArticlesPage from "./js/pages/ArticlesPage";

ReactDOM.render(
  <React.StrictMode>
    <HashRouter>
      <Navbar />

      <main className="container pt-5">
        <Switch>
          <Route path="/stocks" component={StocksPage}></Route>
          <Route path="/articles" component={ArticlesPage}></Route>
          <Route path="/" component={HomePage}></Route>
        </Switch>
      </main>
    </HashRouter>
  </React.StrictMode>,

  document.getElementById("root")
);
