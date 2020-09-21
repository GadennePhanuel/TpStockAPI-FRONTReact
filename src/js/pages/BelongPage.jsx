import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import $ from "jquery";
import Select from '../components/forms/Select'
import { toast } from 'react-toastify';

const BelongPage = (props) => {

    const [stocks, setStocks] = useState([]);
    const [articles, setArticles] = useState([]);
    const [stockCurrent, setStockCurrent] = useState({});






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
                toast.error("Erreur lors du chargement des stocks...")
            },
        });
    }, []);



    const fetchArticle = async id => {
        //on fait le call ajax pour obtenir tout les articles du stock
        await $.ajax({
            url: 'http://localhost:8000/api/stocks/' + id + '/notBelongs',
            method: "GET",
            headers: {
                Authorization: "Bearer " + window.localStorage.getItem("authToken"),
            },
            contentType: "application/json",
            dataType: "json",
            success: function (response, textStatus, xhr) {
                setArticles(response)
            },
            error: function (response) {
                toast.error("Erreur lors du chargement des articles")
            },
        })
    }

    const fetchStockCurrent = async id => {
        //on fait le call ajax pour obtenir tout les articles du stock
        await $.ajax({
            url: 'http://localhost:8000/api/stocks/' + id,
            method: "GET",
            headers: {
                Authorization: "Bearer " + window.localStorage.getItem("authToken"),
            },
            contentType: "application/json",
            dataType: "json",
            success: function (response, textStatus, xhr) {
                setStockCurrent(response)
            },
            error: function (response) {
                toast.error("Erreur lors du chargement des articles")
            },
        })
    }

    //je crée ma fonction handleChange, pour qu'au moment où un stock est selectionné, le tableau de ses articles se remplissent
    const handleChange = (event) => {
        const idStockSelect = event.currentTarget.value  //ici on arrive a récupére l'id du stock selectionné
        //on appelle notre fonction de call ajax pour récupérer les article
        fetchArticle(idStockSelect);
        fetchStockCurrent(idStockSelect);
    }


    /**
     * call ajax pour ajouter l'article selectionner dans le stock selectionné
     */
    const handleEdit = (article, stock) => {
        $.ajax({
            url: "http://localhost:8000/api/belongs",
            method: "POST",
            headers: {
                Authorization: "Bearer " + window.localStorage.getItem("authToken"),
            },
            contentType: "application/json",
            dataType: "json",
            data: JSON.stringify({
                "article": '/api/articles/' + article.id,
                "stock": '/api/stocks/' + stock.id,
                "qty": 0
            }),
            success: function (response, textStatus, xhr) {
                toast.success("L'article " + article.ref + " a été ajouter au stock " + stock.label)
                props.history.replace('/belongs')
            },
            error: function (response) {
                toast.error("Erreur interne...")

            },
        });
    }


    return (<>
        <h1>Ajouter un article à un stock</h1>

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
                    <th></th>
                </tr>
            </thead>
            <tbody>
                {articles.map((article) => (
                    <tr key={article.id}>
                        <td>{article.ref}</td>
                        <td>{article.label}</td>
                        <td>{article.price}</td>
                        <td>
                            <button onClick={() => handleEdit(article, stockCurrent)} className="btn btn-sm btn-warning mr-1">Ajouter</button>

                        </td>
                    </tr>
                ))}
            </tbody>
        </table>


        <form >
            <div className="form-group">
                <Link to="/belongs" className="btn btn-link" >
                    Retour aux détails des stocks
                </Link>
            </div>
        </form>
    </>);
}

export default BelongPage;