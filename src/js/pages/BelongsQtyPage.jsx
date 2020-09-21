import React, { useEffect, useState } from 'react';
import $ from "jquery";
import Field from '../components/forms/Field';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import CalloutStripLoader from "../components/loaders/CalloutStripLoader";

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

    const [loading, setLoading] = useState(true)

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
                setErrors({})
                const { article, stock, qty } = response
                setBelong({ article, stock, qty })
                setLoading(false)
            },
            error: function (response) {

                toast.error("Erreur interne lors du chargement du lien courant")
            },
        })
    }, [id])





    //bouton submit -> envoie de la requete de modif du belong
    const handleSubmit = (event) => {
        event.preventDefault();

        $.ajax({
            url: "http://localhost:8000/api/belongs/" + id,
            method: "PUT",
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
                setErrors({})
                toast.success("La quantité de l'article " + belong.article.ref + " a bien été modifié pour le stock " + belong.stock.label)
                props.history.replace('/belongs')
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
                toast.error("Erreur dans le formulaire...")
            },
        });
    }


    return (
        <>
            <div className="d-flex justify-content-between align-items-center mb-5">
                <h1>Modifier quantité d'un article</h1>
            </div>
            <div className="d-flex justify-content-between align-items-center mb-5">
                <h3>Article :  {!loading && belong.article.label} {loading && <CalloutStripLoader />}</h3>
            </div>
            <div className="d-flex justify-content-between align-items-center mb-5">
                <h3>Stock : {!loading && belong.stock.label} {loading && <CalloutStripLoader />}</h3>
            </div>
            <form onSubmit={handleSubmit}>
                {!loading &&
                    <Field name="qty"
                        label="Quantité"
                        onChange={handleChange}
                        value={belong.qty}
                        error={errors.qty} ></Field>
                }
                {loading && <CalloutStripLoader />}

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