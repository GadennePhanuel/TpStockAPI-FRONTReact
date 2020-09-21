import $ from "jquery";
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from "react-toastify";
import Field from '../components/forms/Field';
import CalloutStripLoader from "../components/loaders/CalloutStripLoader";

const ArticlePage = (props) => {
    const { id } = props.match.params
    const [loading, setLoading] = useState(false)

    const [article, setArticle] = useState({
        label: "",
        price: "",
        ref: ""
    })

    const [errors, setErrors] = useState({
        label: "",
        price: "",
        ref: ""
    })

    const [editing, setEditing] = useState(false);


    /**
 * recupération de l'article en fonction de l'id
 * @param {} id 
 */
    const fetchArticle = async id => {
        //si on est sur la modif d'un stock, on lance une requete HTTP pour récuperer le stock en question
        await $.ajax({
            url: "http://localhost:8000/api/articles/" + id,
            method: "GET",
            headers: {
                Authorization: "Bearer " + window.localStorage.getItem("authToken"),
            },
            contentType: "application/json",
            dataType: "json",
            success: function (response, textStatus, xhr) {
                const { label, price, ref } = xhr.responseJSON
                setArticle({ label, price, ref })
                setLoading(false)
            },
            error: function (response) {
                toast.error("Erreur lors du chargement...")
            },
        })
    }

    useEffect(() => {
        if (id !== "new") {
            setLoading(true)
            setEditing(true)
            fetchArticle(id)
        }
    }, [id])


    //gestion des changements des inputs dans le formulaire
    const handleChange = (event) => {
        const { name, value } = event.currentTarget;
        setArticle({ ...article, [name]: value });
    };


    /**
     * requete HTTP pour créer un article ou le modifier
     */
    const handleSubmit = (event) => {
        event.preventDefault();
        if (article.price === undefined) {
            article.price = 0
        }

        if (editing) {
            $.ajax({
                url: "http://localhost:8000/api/articles/" + id,
                method: "PUT",
                headers: {
                    Authorization: "Bearer " + window.localStorage.getItem("authToken"),
                },
                contentType: "application/json",
                dataType: "json",
                data: JSON.stringify({
                    "label": article.label,
                    "price": parseFloat(article.price),
                    "ref": article.ref
                }),
                success: function (response, textStatus, xhr) {
                    setErrors({})
                    toast.success("L'article a bien été modifié !")
                    props.history.replace('/articles')
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
                    toast.error("Erreur dans votre formulaire...")
                },
            });


        } else {
            $.ajax({
                url: "http://localhost:8000/api/articles",
                method: "POST",
                headers: {
                    Authorization: "Bearer " + window.localStorage.getItem("authToken"),
                },
                contentType: "application/json",
                dataType: "json",
                data: JSON.stringify({
                    "label": article.label,
                    "price": parseFloat(article.price),
                    "ref": article.ref
                }),
                success: function (response, textStatus, xhr) {
                    setErrors({})
                    toast.success("Votre article a bien été créé !")
                    props.history.replace('/articles')
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
                    toast.error("Erreur dans votre formulaire...")
                },
            });
        }

    }

    return (
        <>
            <h1>Création d'un article</h1>
            <form onSubmit={handleSubmit}>
                {!loading &&
                    <Field name="label"
                        label="Nom"
                        placeholder="Nom de l'article..."
                        onChange={handleChange}
                        value={article.label}
                        error={errors.label} ></Field>
                }
                {loading && <CalloutStripLoader />}
                {!loading &&
                    <Field name="price"
                        label="Prix"
                        placeholder="Prix de l'article..."
                        onChange={handleChange}
                        value={article.price}
                        error={errors.price} ></Field>
                }
                {loading && <CalloutStripLoader />}
                {!loading &&
                    <Field name="ref"
                        label="Référence"
                        placeholder="Référence de l'article..."
                        onChange={handleChange}
                        value={article.ref}
                        error={errors.ref} ></Field>
                }
                {loading && <CalloutStripLoader />}

                <div className="form-group">
                    <button type="submit" className="btn btn-success">
                        Enregistrer
                </button>
                    <Link to="/articles" className="btn btn-link" >
                        Retour aux articles
                </Link>
                </div>
            </form>
        </>
    );
}

export default ArticlePage;