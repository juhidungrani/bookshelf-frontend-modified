import React, { useEffect } from "react";
import PropTypes from "prop-types";
import Loader from "../ui/Loader/Loader";
import Shelf from "./Shelf";
import * as BooksAPI from "../BooksAPI";

const Home = ({
  shelfs,
  initializeHomeLoader,
  handleShelfs,
  shelfOptionSelected,
  selectingOption,
  selectMenuDisabled,
  homeLoader,
  isAuthenticated,
  history,
}) => {
  useEffect(() => {
    initializeHomeLoader();
    BooksAPI.getAll().then((data) => {
      handleShelfs(data, "home");
    });

    const callHomePage = async () => {
      try {
        if (!isAuthenticated) {
          history.push("/signin");
        }

        const res = await fetch(
          "https://bookshelf-backend-e2pg.onrender.com/",
          {
            method: "GET",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
            },
          }
        );

        const data = await res.json();
        console.log(data);

        if (res.status !== 200) {
          const error = new Error(res.error);
          throw error;
        }
        // }
      } catch (err) {
        console.log(err);
      }
    };

    callHomePage();
  }, [initializeHomeLoader, handleShelfs, isAuthenticated, history]);

  useEffect(() => {
    window.localStorage.setItem("shelfs", JSON.stringify(shelfs));
  }, [shelfs]);

  return (
    <div className="home-screen">
      {homeLoader ? (
        <Loader />
      ) : (
        <>
          {selectMenuDisabled && <Loader className="select-shelf-loader" />}
          <div>
            {Object.keys(shelfs).map((shelf) => (
              <Shelf
                key={shelf}
                id={shelf}
                shelfs={shelfs}
                shelfOptionSelected={shelfOptionSelected}
                selectingOption={selectingOption}
                selectMenuDisabled={selectMenuDisabled}
              />
            ))}
          </div>
          <div className="open-search">
            <a href="/search">
              <button>Add a book</button>
            </a>
          </div>
        </>
      )}
    </div>
  );
};

Home.propTypes = {
  shelfs: PropTypes.object.isRequired,
  initializeHomeLoader: PropTypes.func.isRequired,
  handleShelfs: PropTypes.func.isRequired,
  shelfOptionSelected: PropTypes.func.isRequired,
};

export default Home;
