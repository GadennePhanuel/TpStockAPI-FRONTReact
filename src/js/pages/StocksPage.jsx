import $ from "jquery";
import React, { useEffect, useState } from "react";
import Pagination from "../components/Pagination";

const StocksPage = (props) => {
  const [stocks, setStocks] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");

  //au chargement du composant, on va chercher notre liste des Stocks avec un call à notre API
  useEffect(() => {
    $.ajax({
      url: "http://localhost:8000/api/stocks",
      method: "GET",
      dataType: "json",
      success: function (response, textStatus, xhr) {
        setStocks(response);
      },
      error: function (response) {
        console.log(response);
        alert(response.status + " " + response.statusText);
      },
    });
  }, []);

  //au click on supprime un stock
  const handleDelete = (id) => {
    //je fais une copie du tableau original
    const originalStocks = [...stocks];

    //je supprime de l'affichage le stock supprimé immédiatement
    setStocks(stocks.filter((stock) => stock.id !== id));

    $.ajax({
      url: "http://localhost:8000/api/stocks/" + id,
      method: "DELETE",
      dataType: "json",
      success: function (response, textStatus, xhr) {
        console.log(response);
        console.log(textStatus);
        console.log(xhr);
      },
      error: function (response, textStatus, xhr) {
        //si ça n'as pas marché je rétabli le tableau des stocks dans son état original
        setStocks(originalStocks);
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
  const filteredStocks = stocks.filter((s) =>
    s.label.toLowerCase().includes(search.toLowerCase())
  );

  //pagination des données
  const itemsPerPage = 10;
  const paginatedStocks = Pagination.getData(
    filteredStocks,
    currentPage,
    itemsPerPage
  );

  return (
    <>
      <h1>Liste des Stocks</h1>

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
            <th>Label</th>
            <th className="text-center">Nombre de références d'articles</th>
            <th className="text-center">Montant total</th>
            <th></th>
          </tr>
        </thead>

        <tbody>
          {paginatedStocks.map((stock) => (
            <tr key={stock.label}>
              <td>{stock.label}</td>
              <td className="text-center">
                <span className="badge badge-primary">
                  {stock.totalArticleCurrentStock}
                </span>
              </td>
              <td className="text-center">
                {stock.totalAmountOfArticleInCurrentStock.toLocaleString()} €
              </td>
              <td>
                <button className="btn btn-sm btn-warning mr-1">Editer</button>
                <button
                  onClick={() => handleDelete(stock.id)}
                  disabled={stock.totalArticleCurrentStock > 0}
                  className="btn btn-sm btn-danger"
                >
                  Supprimer
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {itemsPerPage < filteredStocks.length && (
        <Pagination
          currentPage={currentPage}
          itemsPerPage={itemsPerPage}
          length={filteredStocks.length}
          onPageChanged={handlePageChange}
        />
      )}
    </>
  );
};

export default StocksPage;
