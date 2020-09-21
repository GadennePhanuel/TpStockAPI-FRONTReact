import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Field from '../components/forms/Field';
import $ from "jquery";
import { toast } from 'react-toastify';



const RegisterPage = (props) => {

    const [user, setUser] = useState({
        username: "",
        firstName: "",
        lastName: "",
        password: "",
    })

    const [errors, setErrors] = useState({
        username: "",
        firstName: "",
        lastName: "",
        password: "",
    })


    //gestion des changements des inputs dans le formulaire
    const handleChange = (event) => {
        const { name, value } = event.currentTarget;
        setUser({ ...user, [name]: value })
    }

    const handleSubmit = (event) => {
        event.preventDefault()

        $.ajax({
            url: "http://localhost:8000/api/users",
            method: "POST",
            contentType: "application/json",
            dataType: "json",
            data: JSON.stringify({
                "username": user.username,
                "firstName": user.firstName,
                "lastName": user.lastName,
                "password": user.password
            }),
            success: function (response, textStatus, xhr) {
                setErrors({})
                toast.success("Vous êtes inscrit, vsou pouvez vous connecter ➡")
                props.history.replace('/login')
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
                toast.error("Erreur dans votre formulaire 😂")
            },
        })
    }













    return (<>
        <h1>Inscription</h1>
        <form onSubmit={handleSubmit}>
            <Field name="username"
                label="Nom d'utilisateur"
                placeholder="Votre identifiant de connection..."
                error={errors.username}
                value={user.username}
                onChange={handleChange}
            ></Field>
            <Field name="firstName"
                label="Prénom"
                placeholder="Votre prénom..."
                error={errors.firstName}
                value={user.firstName}
                onChange={handleChange}
            ></Field>
            <Field name="lastName"
                label="Nom de famille"
                placeholder="Votre nom..."
                error={errors.lastName}
                value={user.lastName}
                onChange={handleChange}
            ></Field>
            <Field name="password"
                label="Mot de passe"
                placeholder="votre mot de passe..."
                error={errors.password}
                value={user.password}
                type="password"
                onChange={handleChange}
            ></Field>
            <div className="form-group">
                <button type="submit" className="btn btn-success">
                    Confirmation
                </button>
                <Link to="/login" className="btn btn-link" >J'ai déjà un compte</Link>
            </div>
        </form>
    </>);
}

export default RegisterPage;