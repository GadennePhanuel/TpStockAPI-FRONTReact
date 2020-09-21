import $ from "jquery";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import Pagination from "../components/Pagination";

const ArticlesPage = (props) => {
  const [articles, setArticles] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");

  //au chargement du composant, on va chercher notre liste des Articles avec un call à notre API
  useEffect(() => {
    $.ajax({
      url: "http://localhost:8000/api/articles",
      method: "GET",
      dataType: "json",
      headers: {
        Authorization: "Bearer " + window.localStorage.getItem("authToken"),
      },
      success: function (response, textStatus, xhr) {
        setArticles(response);
      },
      error: function (response) {
        toast.error("Erreur lors du chargements des articles...")
      },
    });
  }, []);

  /**
   * au click on supprime un article
   * @param {*} id 
   */
  const handleDelete = (id) => {
    //je fais une copie du tableau original
    const originalArticles = [...articles];

    //je supprime de l'affichage le stock supprimé immédiatement
    setArticles(articles.filter((article) => article.id !== id));

    $.ajax({
      url: "http://localhost:8000/api/articles/" + id,
      method: "DELETE",
      dataType: "json",
      headers: {
        Authorization: "Bearer " + window.localStorage.getItem("authToken"),
      },
      success: function (response, textStatus, xhr) {
        toast.success("L'article a bien été supprimé")
      },
      error: function (response, textStatus, xhr) {
        //si ça n'as pas marché je rétabli le tableau des stocks dans son état original
        setArticles(originalArticles);
        toast.error("Erreur interne lors de la supression...")
      },
    });
  };

  /**
 * redirection quand on veut editer un article
 * @param {*} page 
 */
  const handleEdit = (id) => {
    props.history.replace("/articles/" + id)
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

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h1>Liste des Articles</h1>
        <Link to="/articles/new" className="btn btn-primary">
          Créer un article
        </Link>
      </div>

      <div className="form-group">
        <input
          type="text"
          onChange={handleSearch}
          value={search}
          className="form-control"
          placeholder="Rechercher"
        />
      </div>

      <table className="table table-hover">
        <thead>
          <tr>
            <th>Référence</th>
            <th>label</th>
            <th>Stock/Quantité</th>
            <th className="text-center">Prix</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {paginatedArticles.map((article) => (
            <tr key={article.id}>
              <td>{article.ref}</td>
              <td>{article.label}</td>
              <td>
                <table className="table">
                  <tbody className="table">
                    {article.belongs.map((belong) => (
                      <tr key={belong.id}>
                        <td>{belong.stock.label}</td>
                        <td>{belong.qty}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </td>
              <td className="text-center">
                <span className="badge badge-primary">
                  {article.price.toLocaleString()} €
                </span>
              </td>
              <td>
                <button onClick={() => handleEdit(article.id)} className="btn btn-sm btn-warning mr-1">Editer</button>
                <button
                  onClick={() => handleDelete(article.id)}
                  disabled={article.belongs.length > 0}
                  className="btn btn-sm btn-danger"
                >
                  Supprimer
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {itemsPerPage < filteredArticles.length && (
        <Pagination
          currentPage={currentPage}
          itemsPerPage={itemsPerPage}
          length={filteredArticles.length}
          onPageChanged={handlePageChange}
        />
      )}
    </>
  );
};

export default ArticlesPage;
