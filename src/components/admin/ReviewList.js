import { Fragment, useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { deleteReview, getReviews } from "../../actions/productAction";
import { clearError, clearReviewDeleted } from "../../slices/productSlice";
import Loader from "../Layouts/Loader";
import { MDBDataTable } from "mdbreact";
import { toast } from "react-toastify";
import Sidebar from "./Sidebar";

export default function ReviewList() {

    const { reviews, loading, error, isReviewDeleted } =
        useSelector(state => state.product);

    const [productId, setProductId] = useState("");
    const dispatch = useDispatch();

    // 🔹 Prepare table data
    const setReviews = () => {
        const data = {
            columns: [
                { label: "ID", field: "id", sort: "asc" },
                { label: "Rating", field: "rating", sort: "asc" },
                { label: "User", field: "user", sort: "asc" },
                { label: "Comment", field: "comment", sort: "asc" },
                { label: "Actions", field: "actions" }
            ],
            rows: []
        };

        reviews?.forEach(review => {
            data.rows.push({
                id: review._id,
                rating: review.rating,
                user: review.user?.name || "Deleted User",
                comment: review.comment,
                actions: (
                    <Fragment>
                        <Button
                            onClick={(e) => deleteHandler(e, review._id)}
                            className="btn btn-danger py-1 px-2"
                        >
                            <i className="fa fa-trash"></i>
                        </Button>
                    </Fragment>
                )
            });
        });

        return data;
    };

    // 🔹 Delete handler
    const deleteHandler = (e, id) => {
        e.currentTarget.disabled = true;
        dispatch(deleteReview(productId, id));
    };

    // 🔹 Search reviews
    const submitHandler = (e) => {
        e.preventDefault();

        if (!productId.trim()) {
            toast("Please enter a Product ID", {
                type: "warning",
                position: toast.POSITION.BOTTOM_CENTER
            });
            return;
        }

        dispatch(getReviews(productId));
    };

    // 🔹 Handle errors & delete success
    useEffect(() => {

        if (error) {
            toast(error, {
                position: toast.POSITION.BOTTOM_CENTER,
                type: "error",
                onOpen: () => dispatch(clearError())
            });
        }

        if (isReviewDeleted) {
            toast("Review Deleted Successfully!", {
                type: "success",
                position: toast.POSITION.BOTTOM_CENTER,
                onOpen: () => dispatch(clearReviewDeleted())
            });

            dispatch(getReviews(productId));
        }

    }, [dispatch, error, isReviewDeleted, productId]);

    return (
        <div className="row">
            <div className="col-12 col-md-2">
                <Sidebar />
            </div>

            <div className="col-12 col-md-10">
                <h1 className="my-4">Review List</h1>

                {/* Search Form */}
                <div className="row justify-content-center mt-4">
                    <div className="col-6">
                        <form onSubmit={submitHandler}>
                            <div className="form-group">
                                <label>Product ID</label>
                                <input
                                    type="text"
                                    value={productId}
                                    onChange={(e) => setProductId(e.target.value)}
                                    className="form-control"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="btn btn-primary btn-block py-2"
                            >
                                Search
                            </button>
                        </form>
                    </div>
                </div>

                {/* Table */}
                <div className="mt-4">
                    {loading ? (
                        <Loader />
                    ) : (
                        <MDBDataTable
                            data={setReviews()}
                            bordered
                            striped
                            hover
                            className="px-3"
                        />
                    )}
                </div>

            </div>
        </div>
    );
}