import React, { useEffect, useState } from 'react';
import $ from "jquery";
import Field from '../components/forms/Field';
import { Link } from 'react-router-dom';

const BelongQtyPage = (props) => {

    const [belong, setBelong] = useState({
        article: "",
        stock: "",
        qty: ""
    })

    const [errors, setErrors] = useState({
        article: "",
        stock: "",
        qty: ""
    })

    const handleChange = (event) => {
        const { name, value } = event.currentTarget;
        setBelong({ ...belong, [name]: value });
    };


    // 1. récupére le belong courant
    const { id } = props.match.params

    useEffect(() => {

        //call ajax pour récuperer le belong courant
        $.ajax({
            url: "http://localhost:8000/api/belongs/" + id,
            method: "GET",
            headers: {
                Authorization: "Bearer " + window.localStorage.getItem("authToken"),
            },
            contentType: "application/json",
            dataType: "json",
            success: function (response, textStatus, xhr) {
                console.log(response)
                const { article, stock, qty } = response
                setBelong({ article, stock, qty })
            },
            error: function (response) {
                console.log(response.responseJSON)

            },
        })
    }, [id])





    //bouton submit -> envoie de la requete de modif du belong
    const handleSubmit = (event) => {
        event.preventDefault();

        $.ajax({
            url: "http://localhost:8000/api/belongs",
            method: "POST",
            headers: {
                Authorization: "Bearer " + window.localStorage.getItem("authToken"),
            },
            contentType: "application/json",
            dataType: "json",
            data: JSON.stringify({
                "article": '/api/articles/' + belong.article.id,
                "stock": '/api/stocks/' + belong.stock.id,
                "qty": parseFloat(belong.qty)
            }),
            success: function (response, textStatus, xhr) {
                console.log(response)
                props.history.replace('/belongs')
            },
            error: function (response) {
                console.log(response.responseJSON)

            },
        });
    }


    return (
        <>
            <div className="d-flex justify-content-between align-items-center mb-5">
                <h1>Modifier quantité d'un article</h1>
            </div>
            <div className="d-flex justify-content-between align-items-center mb-5">
                <h3>Article : {belong.article.label}</h3>
            </div>
            <div className="d-flex justify-content-between align-items-center mb-5">
                <h3>Stock : {belong.stock.label}</h3>
            </div>
            <form onSubmit={handleSubmit}>
                <Field name="qty"
                    label="Quantité"
                    onChange={handleChange}
                    value={belong.qty}
                    error={errors.ref} ></Field>
                <div className="form-group">
                    <button type="submit" className="btn btn-success">
                        Enregistrer
                </button>
                    <Link to="/belongs" className="btn btn-link" >
                        Retour aux détails stock
                </Link>
                </div>
            </form>
        </>
    );
}

export default BelongQtyPage;