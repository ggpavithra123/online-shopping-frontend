import { Fragment, useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { deleteReview, getReviews } from "../../actions/productAction";
import { clearError, clearReviewDeleted } from "../../slices/productSlice";
import Loader from "../Layouts/Loader";
import { MDBDataTable } from "mdbreact";
import { toast } from "react-toastify";
import Sidebar from "./Sidebar";

export default function ReviewList() {

    const { id } = useParams(); // ✅ get productId from URL
    const dispatch = useDispatch();

    const { reviews, loading, error, isReviewDeleted } =
        useSelector(state => state.product);

    const [productId, setProductId] = useState(id || "");

    // ✅ AUTO LOAD ON PAGE LOAD
    useEffect(() => {
        if (productId) {
            dispatch(getReviews(productId));
        }
    }, [dispatch, productId]);

    const deleteHandler = (e, reviewId) => {
        e.currentTarget.disabled = true;
        dispatch(deleteReview(productId, reviewId));
    };

    const submitHandler = (e) => {
        e.preventDefault();
        if (productId.trim()) {
            dispatch(getReviews(productId));
        }
    };

    useEffect(() => {
        if (error) {
            toast(error, {
                type: "error",
                position: "bottom-center",
                onOpen: () => dispatch(clearError())
            });
        }

        if (isReviewDeleted) {
            toast("Review Deleted Successfully!", {
                type: "success",
                position: "bottom-center",
                onOpen: () => dispatch(clearReviewDeleted())
            });

            dispatch(getReviews(productId));
        }

    }, [dispatch, error, isReviewDeleted, productId]);

    const data = {
        columns: [
            { label: "ID", field: "id" },
            { label: "Rating", field: "rating" },
            { label: "User", field: "user" },
            { label: "Comment", field: "comment" },
            { label: "Actions", field: "actions" }
        ],
        rows: reviews?.map(review => ({
            id: review._id,
            rating: review.rating,
            user: review.user?.name || review.user,
            comment: review.comment,
            actions: (
                <Button
                    onClick={(e) => deleteHandler(e, review._id)}
                    className="btn btn-danger py-1 px-2"
                >
                    <i className="fa fa-trash"></i>
                </Button>
            )
        })) || []
    };

    return (
        <div className="row">
            <div className="col-12 col-md-2">
                <Sidebar />
            </div>

            <div className="col-12 col-md-10">
                <h1 className="my-4">Review List</h1>

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

                <div className="mt-4">
                    {loading ? (
                        <Loader />
                    ) : (
                        <MDBDataTable
                            data={data}
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