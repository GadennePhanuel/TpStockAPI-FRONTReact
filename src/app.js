import React, { useState } from "react";
import { HashRouter, Route, Switch, withRouter } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import Navbar from "./js/components/Navbar";
import PrivateRoute from "./js/components/PrivateRoute";
import AuthContext from "./js/contexts/AuthContext";
import ArticlePage from "./js/pages/ArticlePage";
import ArticlesPage from "./js/pages/ArticlesPage";
import BelongPage from "./js/pages/BelongPage";
import BelongsPage from "./js/pages/BelongsPage";
import BelongQtyPage from "./js/pages/BelongsQtyPage";
import ForgotPassword from "./js/pages/ForgotPassword";
import HomePage from "./js/pages/HomePage";
import LoginPage from "./js/pages/LoginPage";
import RegisterPage from "./js/pages/RegisterPage";
import StockPage from "./js/pages/StockPage";
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
            <Route path="/register" component={RegisterPage} />
            <PrivateRoute path="/stocks/:id" component={StockPage} />
            <PrivateRoute path="/articles/:id" component={ArticlePage} />
            <PrivateRoute path="/belongs/:id/qty" component={BelongQtyPage} />
            <PrivateRoute path="/belongs/:id" component={BelongPage} />
            <PrivateRoute path="/belongs" component={BelongsPage} />
            <PrivateRoute path="/stocks" component={StocksPage} />
            <PrivateRoute path="/articles" component={ArticlesPage} />
            <Route path="/forgotPassword" component={ForgotPassword} />
            <Route path="/" component={HomePage} />
          </Switch>
        </main>
      </HashRouter>
      <ToastContainer position={toast.POSITION.TOP_CENTER} autoClose={1500} />
    </AuthContext.Provider>
  );
};

export default App;
