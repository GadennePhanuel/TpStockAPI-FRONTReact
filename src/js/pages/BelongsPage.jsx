import $ from "jquery";
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Select from '../components/forms/Select'

const BelongsPage = (props) => {

    const [stocks, setStocks] = useState([]);
    const [belongs, setBelongs] = useState([]);


    //1- Auchargement requéte HTTP pour récupérer la liste de mes stocks
    useEffect(() => {
        $.ajax({
            url: "http://localhost:8000/api/stocks",
            method: "GET",
            dataType: "json",
            headers: {
                Authorization: "Bearer " + window.localStorage.getItem("authToken"),
            },
            success: function (response, textStatus, xhr) {
                setStocks(response);
            },
            error: function (response) {
                console.log(response);
                alert(response.status + " " + response.statusText);
            },
        });
    }, []);


    const fetchArticle = async id => {
        //on fait le call ajax pour obtenir tout les articles du stock
        await $.ajax({
            url: 'http://localhost:8000/api/stocks/' + id + '/belongs',
            method: "GET",
            headers: {
                Authorization: "Bearer " + window.localStorage.getItem("authToken"),
            },
            contentType: "application/json",
            dataType: "json",
            success: function (response, textStatus, xhr) {
                setBelongs(response)
            },
            error: function (response) {
                console.log(response)
            },
        })
    }

    //je crée ma fonction handleChange, pour qu'au moment où un stock est selectionné, le tableau de ses articles se remplissent
    const handleChange = (event) => {
        const idStockSelect = event.currentTarget.value  //ici on arrive a récupére l'id du stock selectionné

        //on appelle notre fonction de call ajax pour récupérer les article
        fetchArticle(idStockSelect);
    }

    const handleEdit = (id) => {
        props.history.replace("/belongs/" + id + "/qty")
    }




    return (<>
        <div className="d-flex justify-content-between align-items-center mb-5">
            <h1>Liste des articles d'un stock</h1>
            <Link to="/belongs/new" className="btn btn-primary">
                Ajouter article à un stock
        </Link>
        </div>

        <div className="text-center pt-3">
            <h3 className="mb-5">Selectionnez un stock</h3>
            <Select
                name='stock'
                label='Votre stock :'
                value={stocks.label}
                //error={errors.stocks}
                onChange={handleChange}
            >
                <option>---Liste déroulante---</option>
                {stocks.map((stock) => (
                    <option key={stock.id} value={stock.id}>{stock.label}</option>
                ))}
            </Select>
        </div>

        <table className="table table-hover mt-1">
            <thead>
                <tr>
                    <th>Référence</th>
                    <th>label</th>
                    <th className="text-center">Prix</th>
                    <th>Quantité</th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
                {belongs.map((belong) => (
                    <tr key={belong.id}>
                        <td>{belong.article.ref}</td>
                        <td>{belong.article.label}</td>
                        <td>{belong.article.price}</td>
                        <td>{belong.qty}</td>
                        <td>
                            <button onClick={() => handleEdit(belong.id)} className="btn btn-sm btn-warning mr-1">Editer</button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>





    </>);
}

export default BelongsPage;