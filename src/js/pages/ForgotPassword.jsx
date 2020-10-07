import React, { useState } from 'react';
import Field from '../components/forms/Field';
import axios from "axios";

const ForgotPassword = (props) => {

    const [email, setEmail] = useState({
        email: ""
    })

    const [errors, setErrors] = useState({
        email: "",
    })



    //gestion des changements des inputs dans le formulaire
    const handleChange = (event) => {
        const { name, value } = event.currentTarget;
        setEmail({ ...email, [name]: value });
    };


    /**
     * requete HTTP pour créer un article ou le modifier
     */
    const handleSubmit = (event) => {
        event.preventDefault();

        axios.post('').then(response => console.log(response))
    }



    return (
        <>
            <h1>Réinitialiser votre mot de passe</h1>
            <form onSubmit={handleSubmit}>
                <Field
                    name="email"
                    label="Email"
                    placeholder="Votre email"
                    onChange={handleChange}
                    value={email.email}
                    error={errors.email}
                >
                </Field>
                <div className="form-group">
                    <button type="submit" className="btn btn-success">
                        Soumettre
                    </button>
                </div>
            </form>
        </>
    );
}

export default ForgotPassword;