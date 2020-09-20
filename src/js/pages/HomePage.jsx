import React from "react";
import { NavLink } from "react-router-dom";

const HomePage = (props) => {
  return (
    <div className="jumbotron">
      <h1 className="display-3">Hello, world!</h1>
      <p className="lead">
        This is a simple hero unit, a simple jumbotron-style component for
        calling extra attention to featured content or information.
      </p>
      <hr className="my-4" />
      <p>
        It uses utility classes for typography and spacing to space content out
        within the larger container.
      </p>
      <p className="lead">
        <NavLink className="btn btn-primary btn-lg" to="#" role="button">
          Learn more
        </NavLink>
      </p>
    </div>
  );
};

export default HomePage;
