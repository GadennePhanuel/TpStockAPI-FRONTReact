import React, { useContext } from "react";
import { NavLink } from "react-router-dom";
import { toast } from "react-toastify";
import AuthContext from "../contexts/AuthContext";

const Navbar = ({ history }) => {
  const { isAuthenticated, setIsAuthenticated } = useContext(AuthContext);

  //supression du token du localStorage
  const handleLogout = () => {
    window.localStorage.removeItem("authToken");
    setIsAuthenticated(false);
    toast.dark("😱 Vous êtes déconnecté 😱")
    history.push("/login");
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
      <NavLink className="navbar-brand" to="/">
        SymReactFront !
      </NavLink>
      <button
        className="navbar-toggler"
        type="button"
        data-toggle="collapse"
        data-target="#navbarColor01"
        aria-controls="navbarColor01"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span className="navbar-toggler-icon"></span>
      </button>

      <div className="collapse navbar-collapse" id="navbarColor01">
        <ul className="navbar-nav mr-auto">
          <li className="nav-item">
            <NavLink className="nav-link" to="/stocks">
              Liste de mes Stocks
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink className="nav-link" to="/articles">
              Liste de mes Articles
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink className="nav-link" to="/belongs">
              Détails stock
            </NavLink>
          </li>
        </ul>
        <ul className="navbar-nav ml-auto">
          {(!isAuthenticated && (
            <>
              <li className="nav-item">
                <NavLink to="/register" className="nav-link">
                  Inscription !
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink to="/login" className="btn btn-success">
                  Connection !
                </NavLink>
              </li>{" "}
            </>
          )) || (
              <li className="nav-item">
                <button onClick={handleLogout} className="btn btn-danger">
                  Deconnection !
              </button>
              </li>
            )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
