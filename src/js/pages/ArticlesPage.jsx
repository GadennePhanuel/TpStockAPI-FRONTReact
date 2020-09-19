import $ from "jquery";
import React, { useEffect, useState } from "react";
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
      success: function (response, textStatus, xhr) {
        console.log(response);
        setArticles(response);
      },
      error: function (response) {
        console.log(response);
        alert(response.status + " " + response.statusText);
      },
    });
  }, []);

  //au click on supprime un article
  const handleDelete = (id) => {
    //je fais une copie du tableau original
    const originalArticles = [...articles];

    //je supprime de l'affichage le stock supprimé immédiatement
    setArticles(articles.filter((article) => article.id !== id));

    $.ajax({
      url: "http://localhost:8000/api/articles/" + id,
      method: "DELETE",
      dataType: "json",
      success: function (response, textStatus, xhr) {
        console.log(response);
        console.log(textStatus);
        console.log(xhr);
      },
      error: function (response, textStatus, xhr) {
        //si ça n'as pas marché je rétabli le tableau des stocks dans son état original
        setArticles(originalArticles);
        console.log("error " + response);
      },
    });
  };

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
      <h1>Liste des articles</h1>

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
                <button className="btn btn-sm btn-warning mr-1">Editer</button>
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
