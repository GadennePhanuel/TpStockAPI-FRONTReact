import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import $ from "jquery";
import Select from '../components/forms/Select'
import { toast } from 'react-toastify';
import TableLoader from "../components/loaders/TableLoader";
import CalloutStripLoader from "../components/loaders/CalloutStripLoader";
import Pagination from '../components/Pagination';

const BelongPage = (props) => {

    const [stocks, setStocks] = useState([]);
    const [articles, setArticles] = useState([]);
    const [stockCurrent] = useState({});
    const [loading, setLoading] = useState(true)
    const [loading2, setLoading2] = useState(false)
    const [currentPage, setCurrentPage] = useState(1);
    const [search, setSearch] = useState("");




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
                setLoading(false)
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
                setLoading2(false)
            },
            error: function (response) {
                toast.error("Erreur lors du chargement des articles")
            },
        })
    }


    //je crée ma fonction handleChange, pour qu'au moment où un stock est selectionné, le tableau de ses articles se remplissent
    const handleChange = (event) => {
        const idStockSelect = event.currentTarget.value  //ici on arrive a récupére l'id du stock selectionné
        setLoading2(true)
        //on appelle notre fonction de call ajax pour récupérer les article
        fetchArticle(idStockSelect);
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


    //PAGINATION && Champ de recherche du tableau
    const handlePageChange = (page) => {
        setCurrentPage(page);
    };
    const handleSearch = (event) => {
        setSearch(event.currentTarget.value);
        setCurrentPage(1);
    };
    //filtrage des stocks en fonction de la recherche
    const filteredArticles = articles.filter(
        (a) =>
            a.label.toLowerCase().includes(search.toLowerCase()) ||
            a.ref.toLowerCase().includes(search.toLowerCase()) ||
            a.price.toString().includes(search.toLowerCase())
    );
    //pagination des données
    const itemsPerPage = 10;
    const paginatedArticles = Pagination.getData(
        filteredArticles,
        currentPage,
        itemsPerPage
    );

    return (<>
        <h1>Ajouter un article à un stock</h1>
        {!loading &&
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
        }
        <form >
            <div className="form-group">
                <Link to="/belongs" className="btn btn-link" >
                    Retour aux détails des stocks
                </Link>
            </div>
        </form>

        <div className="form-group">
            <input
                type="text"
                onChange={handleSearch}
                value={search}
                className="form-control"
                placeholder="Rechercher"
            />
        </div>

        {loading && <CalloutStripLoader />}
        <table className="table table-hover mt-1">
            <thead>
                <tr>
                    <th>Référence</th>
                    <th>label</th>
                    <th className="text-center">Prix</th>
                    <th></th>
                </tr>
            </thead>
            {!loading2 &&
                <tbody>
                    {paginatedArticles.map((article) => (
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
            }
        </table>
        {loading2 && <TableLoader />}

        {itemsPerPage < filteredArticles.length && (
            <Pagination
                currentPage={currentPage}
                itemsPerPage={itemsPerPage}
                length={filteredArticles.length}
                onPageChanged={handlePageChange}
            />
        )}

    </>);
}

export default BelongPage;