import $ from "jquery";
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from "react-toastify";
import Select from '../components/forms/Select'
import CalloutStripLoader from "../components/loaders/CalloutStripLoader";
import TableLoader from "../components/loaders/TableLoader";
import Pagination from "../components/Pagination";

const BelongsPage = (props) => {

    const [stocks, setStocks] = useState([]);
    const [belongs, setBelongs] = useState([]);
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
                toast.error("Erreur lors du chargement...")
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
                setLoading2(false)
            },
            error: function (response) {
                toast.error("Erreur losr du chargement...")
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
     * redirection pour modifier la quantité de l'article en question dans le sotck en question
     * @param {*} id 
     */
    const handleEdit = (id) => {
        props.history.replace("/belongs/" + id + "/qty")
    }


    /**
     * call ajax pour supprimer l'article du sotck selectionné
     * @param {*} id 
     */
    const handleDelete = (id) => {

        //copie du tableau original
        const originalBelongs = [...belongs];

        //je supprime de l'affichage le stock supprimé immédiatement
        setBelongs(belongs.filter((belong) => belong.id !== id));

        $.ajax({
            url: "http://localhost:8000/api/belongs/" + id,
            method: "DELETE",
            dataType: "json",
            headers: {
                Authorization: "Bearer " + window.localStorage.getItem("authToken"),
            },
            success: function (response, textStatus, xhr) {
                toast.success("L'article  a bien été supprimé du stock")
            },
            error: function (response, textStatus, xhr) {
                //si ça n'as pas marché je rétabli le tableau des stocks dans son état original
                setBelongs(originalBelongs);
                toast.error("Erreur interne...")
                console.log("error " + response);
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
    const filteredBelongs = belongs.filter(
        (b) =>
            b.article.label.toLowerCase().includes(search.toLowerCase()) ||
            b.article.ref.toLowerCase().includes(search.toLowerCase()) ||
            b.article.price.toString().includes(search.toLowerCase())
    );

    //pagination des données
    const itemsPerPage = 10;
    const paginatedBelongs = Pagination.getData(
        filteredBelongs,
        currentPage,
        itemsPerPage
    );



    return (<>
        <div className="d-flex justify-content-between align-items-center mb-5">
            <h1>Liste des articles d'un stock</h1>
            <Link to="/belongs/new" className="btn btn-primary">
                Ajouter article à un stock
        </Link>
        </div>

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
            <thead >
                <tr>
                    <th>Référence</th>
                    <th>label</th>
                    <th className="text-center">Prix</th>
                    <th>Quantité</th>
                    <th></th>
                </tr>
            </thead>
            {!loading2 &&
                <tbody>
                    {paginatedBelongs.map((belong) => (
                        <tr key={belong.id}>
                            <td>{belong.article.ref}</td>
                            <td>{belong.article.label}</td>
                            <td>{belong.article.price}</td>
                            <td>{belong.qty}</td>
                            <td>
                                <button onClick={() => handleEdit(belong.id)} className="btn btn-sm btn-warning mr-1">Editer</button>
                                <button
                                    onClick={() => handleDelete(belong.id)}
                                    disabled={belong.qty > 0}
                                    className="btn btn-sm btn-danger"
                                >
                                    Supprimer
                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            }
        </table>
        {loading2 && <TableLoader />}

        {itemsPerPage < filteredBelongs.length && (
            <Pagination
                currentPage={currentPage}
                itemsPerPage={itemsPerPage}
                length={filteredBelongs.length}
                onPageChanged={handlePageChange}
            />
        )}

    </>);
}

export default BelongsPage;