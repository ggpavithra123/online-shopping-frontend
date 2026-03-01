import { Fragment, useEffect } from "react";
import { Button } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { deleteOrder, adminOrders as adminOrdersAction } from "../../actions/orderActions";
import { clearError, clearOrderDeleted } from "../../slices/orderSlice";
import Loader from "../Layouts/Loader";
import { MDBDataTable } from "mdbreact";
import { toast } from "react-toastify";
import Sidebar from "./Sidebar";

export default function OrderList() {
    const dispatch = useDispatch();

    const { adminOrders = [], loading, error, isOrderDeleted } =
        useSelector((state) => state.orderState);

    // 🔎 DEBUG LOGS
    useEffect(() => {
        console.log("========== ORDER PAGE DEBUG ==========");
        console.log("Redux orderState:", {
            adminOrders,
            loading,
            error,
            isOrderDeleted
        });
        console.log("======================================");
    }, [adminOrders, loading, error, isOrderDeleted]);

    const deleteHandler = (id) => {
        console.log("Deleting Order ID:", id);
        dispatch(deleteOrder(id));
    };

    const setOrders = () => {
        const data = {
            columns: [
                { label: "ID", field: "id", sort: "asc" },
                { label: "Number of Items", field: "noOfItems", sort: "asc" },
                { label: "Amount", field: "amount", sort: "asc" },
                { label: "Status", field: "status", sort: "asc" },
                { label: "Actions", field: "actions", sort: "asc" }
            ],
            rows: []
        };

        adminOrders.forEach((order) => {
            data.rows.push({
                id: order._id,
                noOfItems: order.orderItems?.length || 0,
                amount: `$${order.totalPrice}`,
                status: (
                    <p
                        style={{
                            color: order.orderStatus === "Processing"
                                ? "red"
                                : "green"
                        }}
                    >
                        {order.orderStatus}
                    </p>
                ),
                actions: (
                    <Fragment>
                        <Link
                            to={`/admin/order/${order._id}`}
                            className="btn btn-primary btn-sm"
                        >
                            <i className="fa fa-pencil"></i>
                        </Link>

                        <Button
                            onClick={() => deleteHandler(order._id)}
                            className="btn btn-danger btn-sm ms-2"
                        >
                            <i className="fa fa-trash"></i>
                        </Button>
                    </Fragment>
                )
            });
        });

        return data;
    };

    useEffect(() => {
        if (error) {
            toast.error(error, {
                position: "bottom-center",
                onOpen: () => dispatch(clearError())
            });
            return;
        }

        if (isOrderDeleted) {
            toast.success("Order Deleted Successfully!", {
                position: "bottom-center",
                onOpen: () => dispatch(clearOrderDeleted())
            });
        }

        console.log("Fetching Admin Orders...");
        dispatch(adminOrdersAction()); // ✅ FIXED

    }, [dispatch, error, isOrderDeleted]);

    return (
        <div className="row">
            <div className="col-12 col-md-2">
                <Sidebar />
            </div>

            <div className="col-12 col-md-10">
                <h1 className="my-4">Order List</h1>

                {loading ? (
                    <Loader />
                ) : (
                    <MDBDataTable
                        data={setOrders()}
                        bordered
                        striped
                        hover
                        className="px-3"
                    />
                )}
            </div>
        </div>
    );
}