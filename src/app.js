import React, { useState } from "react";
import { HashRouter, Route, Switch, withRouter } from "react-router-dom";
import Navbar from "./js/components/Navbar";
import PrivateRoute from "./js/components/PrivateRoute";
import AuthContext from "./js/contexts/AuthContext";
import ArticlesPage from "./js/pages/ArticlesPage";
import HomePage from "./js/pages/HomePage";
import LoginPage from "./js/pages/LoginPage";
import StocksPage from "./js/pages/StocksPage";
import AuthAPI from "./js/services/authAPI";

const App = () => {
  AuthAPI.setup();

  const [isAuthenticated, setIsAuthenticated] = useState(
    AuthAPI.isAuthenticated()
  );

  const NavbarWithRouter = withRouter(Navbar);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: isAuthenticated,
        setIsAuthenticated: setIsAuthenticated,
      }}
    >
      <HashRouter>
        <NavbarWithRouter />

        <main className="container pt-5">
          <Switch>
            <Route path="/login" component={LoginPage} />
            <PrivateRoute path="/stocks" component={StocksPage} />
            <PrivateRoute path="/articles" component={ArticlesPage} />
            <Route path="/" component={HomePage} />
          </Switch>
        </main>
      </HashRouter>
    </AuthContext.Provider>
  );
};

export default App;
