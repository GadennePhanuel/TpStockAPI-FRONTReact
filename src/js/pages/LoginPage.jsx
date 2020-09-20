import axios from "axios";
import React, { useContext, useState } from "react";
import AuthContext from "../contexts/AuthContext";

const LoginPage = ({ history }) => {
  const { setIsAuthenticated } = useContext(AuthContext);

  const [credentials, setCredential] = useState({
    username: "",
    password: "",
  });

  const [error, setError] = useState("");

  const handleChange = (event) => {
    const value = event.currentTarget.value;
    const name = event.currentTarget.name;

    setCredential({ ...credentials, [name]: value });
  };

  //requete HTTP d'authentification et stockage du token dans le localStorage
  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const token = await axios
        .post("http://localhost:8000/api/login_check", credentials)
        .then((response) => response.data.token);

      setError("");

      setIsAuthenticated(true);
      //je stocke mon token dans le localStorage
      window.localStorage.setItem("authToken", token);

      //je fait la redirection
      history.replace("/stocks");
    } catch (error) {
      console.log(error.response);
      setError(
        "Aucun compte pour cette utilisateur ou alors les informations ne correspondent pas"
      );
    }
  };

  return (
    <>
      <h1>Connection à l'application</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="username">Nom d'utilisateur</label>
          <input
            value={credentials.username}
            onChange={handleChange}
            type="text"
            placeholder="identifiant de connection..."
            name="username"
            id="username"
            className={"form-control" + (error && " is-invalid")}
          />
          {error && <p className="invalid-feedback">{error}</p>}
        </div>
        <div className="form-group">
          <label htmlFor="password">Mot de passe</label>
          <input
            value={credentials.password}
            onChange={handleChange}
            type="password"
            placeholder="mot de passe..."
            name="password"
            id="password"
            className={"form-control" + (error && " is-invalid")}
          />
          {error && <p className="invalid-feedback">{error}</p>}
        </div>
        <div className="form-group">
          <button type="submit" className="btn btn-success">
            Je me connecter
          </button>
        </div>
      </form>
    </>
  );
};

export default LoginPage;
