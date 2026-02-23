import { Fragment, useEffect, useState } from "react";
import MetaData from "../Layouts/MetaData";
import { useDispatch, useSelector } from "react-redux";
import { getProducts } from "../../actions/productsActions";
import Loader from "../Layouts/Loader";
import Product from "../product/Product";
import { toast } from "react-toastify";
import ReactPaginate from "react-paginate";
import { useParams, useNavigate } from "react-router-dom";
import Slider from "rc-slider";
import Tooltip from "rc-tooltip";
import "rc-slider/assets/index.css";
import "rc-tooltip/assets/bootstrap.css";

export default function ProductSearch() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { keyword } = useParams();

  const { products, loading, error, productsCount, resPerPage } = useSelector(
    (state) => state.products,
  );

  const [currentPage, setCurrentPage] = useState(1);
  const [price, setPrice] = useState([1, 1000]);
  const [priceChanged, setPriceChanged] = useState([1, 1000]);
  const [category, setCategory] = useState(null);
  const [rating, setRating] = useState(0);

  const categories = [
    "Electronics",
    "MobilePhones",
    "Laptops",
    "Accessories",
    "Headphones",
    "Food",
    "Books",
    "Clothes/Shoes",
    "Beauty/Health",
    "Sports",
    "Outdoor",
    "Home",
  ];

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [priceChanged, category, rating]);

  // Fetch Products
  useEffect(() => {
    if (error) {
      toast.error(error);
      return;
    }

    const searchKeyword = keyword || "";

    dispatch(
      getProducts(searchKeyword, currentPage, priceChanged, category, rating),
    );
  }, [dispatch, currentPage, keyword, priceChanged, category, rating, error]);

  // SAFE page count
  const pageCount =
    resPerPage && resPerPage > 0 ? Math.ceil(productsCount / resPerPage) : 0;

  const clearFilters = () => {
    setPrice([1, 1000]);
    setPriceChanged([1, 1000]);
    setCategory(null);
    setRating(0);
    navigate("/search");
  };

  return (
    <Fragment>
      {loading ? (
        <Loader />
      ) : (
        <Fragment>
          <MetaData title={"Buy Best Products"} />
          <h1 id="products_heading">Search Products</h1>

          <section id="products" className="container mt-5">
            <div className="row">
              {/* Filters */}
              <div className="col-6 col-md-3 mb-5 mt-5">
                {/* Price */}
                <div className="px-5" onMouseUp={() => setPriceChanged(price)}>
                  <Slider
                    range
                    min={1}
                    max={1000}
                    value={price}
                    onChange={(val) => setPrice(val)}
                    marks={{ 1: "$1", 1000: "$1000" }}
                    handleRender={(props) => (
                      <Tooltip overlay={`$${props.props["aria-valuenow"]}`}>
                        <div {...props.props} />
                      </Tooltip>
                    )}
                  />
                </div>

                <hr className="my-5" />

                {/* Category */}
                <h3>Categories</h3>
                <ul className="pl-0">
                  {categories.map((cat) => (
                    <li
                      key={cat}
                      style={{ cursor: "pointer", listStyle: "none" }}
                      onClick={() => {
                        setCategory(cat);
                        setCurrentPage(1);
                      }}
                    >
                      {cat}
                    </li>
                  ))}
                </ul>

                <hr />

                {/* Rating */}
                <h4>Ratings</h4>
                {[5, 4, 3, 2, 1].map((star) => (
                  <div
                    key={star}
                    style={{ cursor: "pointer" }}
                    onClick={() => setRating(star)}
                  >
                    <div className="rating-outer">
                      <div
                        className="rating-inner"
                        style={{ width: `${star * 20}%` }}
                      />
                    </div>
                  </div>
                ))}

                <hr />

                <button
                  className="btn btn-secondary w-100"
                  onClick={clearFilters}
                >
                  Clear Filters
                </button>
              </div>

              {/* Products */}
              <div className="col-6 col-md-9">
                <div className="row">
                  {products?.map((product) => (
                    <Product col={4} key={product._id} product={product} />
                  ))}
                </div>
              </div>
            </div>
          </section>

          {productsCount && resPerPage && productsCount > resPerPage && (
            <div className="d-flex justify-content-center mt-5">
              <ReactPaginate
                previousLabel={"Previous"}
                nextLabel={"Next"}
                pageCount={Math.ceil(
                  Number(productsCount) / Number(resPerPage),
                )}
                onPageChange={(event) => {
                  const selectedPage = event.selected + 1;
                  setCurrentPage(selectedPage);
                }}
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
