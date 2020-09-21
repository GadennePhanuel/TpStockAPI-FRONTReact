import $ from "jquery";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Field from "../components/forms/Field";

const StockPage = (props) => {
  const { id } = props.match.params


  const [stock, setStock] = useState({
    label: "",
  });

  const [errors, setErrors] = useState({
    label: "",
  });


  const [editing, setEditing] = useState(false);

  /**
   * recupération du stock en fonction de l'id
   * @param {} id 
   */
  const fetchStock = async id => {
    //si on est sur la modif d'un stock, on lance une requete HTTP pour récuperer le stock en question
    await $.ajax({
      url: "http://localhost:8000/api/stocks/" + id,
      method: "GET",
      headers: {
        Authorization: "Bearer " + window.localStorage.getItem("authToken"),
      },
      contentType: "application/json",
      dataType: "json",
      success: function (response, textStatus, xhr) {
        const { label } = xhr.responseJSON
        setStock({ label })
      },
      error: function (response) {
        console.log("error, 404 not found")
      },
    })
  }

  useEffect(() => {
    if (id !== "new") {
      setEditing(true)
      fetchStock(id)
    }
  }, [id])



  const handleChange = (event) => {
    const { name, value } = event.currentTarget;
    setStock({ ...stock, [name]: value });
  };

  /**
   * Requete HTTP pour créer un stock ou le modifier
   * @param {*} event 
   */
  const handleSubmit = (event) => {
    event.preventDefault();


    if (editing) {
      $.ajax({
        url: "http://localhost:8000/api/stocks/" + id,
        method: "PUT",
        headers: {
          Authorization: "Bearer " + window.localStorage.getItem("authToken"),
        },
        contentType: "application/json",
        dataType: "json",
        data: JSON.stringify({
          "label": stock.label,
        }),
        success: function (response, textStatus, xhr) {
          setErrors({})
          props.history.replace('/stocks')
        },
        error: function (response) {
          if (response.responseJSON['violations']) {
            const apiErrors = {};
            response.responseJSON['violations'].forEach(violation => {
              if ((apiErrors[violation.propertyPath]) === undefined) {
                apiErrors[violation.propertyPath] = violation.message;
              }
            })
            setErrors(apiErrors)
          }
        },
      });


    } else {
      $.ajax({
        url: "http://localhost:8000/api/stocks",
        method: "POST",
        headers: {
          Authorization: "Bearer " + window.localStorage.getItem("authToken"),
        },
        contentType: "application/json",
        dataType: "json",
        data: JSON.stringify({
          "label": stock.label,
        }),
        success: function (response, textStatus, xhr) {
          setErrors({})
          props.history.replace('/stocks')
        },
        error: function (response) {
          if (response.responseJSON['violations']) {
            const apiErrors = {};
            response.responseJSON['violations'].forEach(violation => {
              if ((apiErrors[violation.propertyPath]) === undefined) {
                apiErrors[violation.propertyPath] = violation.message;
              }
            })
            setErrors(apiErrors)
          }
        },
      });
    }
  };

  return (
    <>

      {(!editing && <h1>Création d'un stock</h1>) || <h1>Modification du stock</h1>}

      <form onSubmit={handleSubmit}>
        <Field
          name="label"
          label="Nom"
          placeholder="Nom du stock..."
          value={stock.label}
          onChange={handleChange}
          error={errors.label}
        />

        <div className="form-group">
          <button type="submit" className="btn btn-success">
            Enregistrer
          </button>
          <Link to="/stocks" className="btn btn-link">
            Retourner à la liste des stocks
          </Link>
        </div>
      </form>
    </>
  );
};

export default StockPage;
