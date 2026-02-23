import { Fragment, useEffect, useState } from "react";
import MetaData from "./Layouts/MetaData";
import { useDispatch, useSelector } from "react-redux";
import { getProducts } from "../actions/productsActions";
import Loader from "./Layouts/Loader";
import Product from "./product/Product";
import { toast } from "react-toastify";
import ReactPaginate from "react-paginate";

export default function Home() {
  const dispatch = useDispatch();

  const { products, loading, error, productsCount, resPerPage } = useSelector(
    (state) => state.products,
  );

  const [currentPage, setCurrentPage] = useState(1);

  // Fetch Products
  useEffect(() => {
    if (error) {
      toast.error(error);
      return;
    }

    dispatch(getProducts("", currentPage));
  }, [dispatch, error, currentPage]);

  // Pagination Click Handler
  const handlePageClick = (event) => {
    setCurrentPage(event.selected + 1);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <Fragment>
      {loading ? (
        <Loader />
      ) : (
        <Fragment>
          <MetaData title={"Buy Best Products Online"} />

          <h1 id="products_heading" style={{ color: "red" }}>
            Latest Products
          </h1>

          {/* Products */}
          <section id="products" className="container mt-5">
            <div className="row">
              {products &&
                products.map((product) => (
                  <Product key={product._id} product={product} col={3} />
                ))}
            </div>
          </section>

          {productsCount && resPerPage && (
            <div className="d-flex justify-content-center mt-5">
              <ReactPaginate
                previousLabel={"Previous"}
                nextLabel={"Next"}
                pageCount={Math.ceil(
                  Number(productsCount) / Number(resPerPage),
                )}
                onPageChange={(e) => setCurrentPage(e.selected + 1)}
                containerClassName={"pagination"}
                pageClassName={"page-item"}
                pageLinkClassName={"page-link"}
                previousClassName={"page-item"}
                nextClassName={"page-item"}
                previousLinkClassName={"page-link"}
                nextLinkClassName={"page-link"}
                activeClassName={"active"}
                forcePage={currentPage - 1}
              />
            </div>
          )}
        </Fragment>
      )}
    </Fragment>
  );
}
