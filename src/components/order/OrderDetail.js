import { Fragment, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import Loader from '../Layouts/Loader';
import { orderDetail as orderDetailAction } from '../../actions/orderActions';

export default function OrderDetail() {
    const { orderDetail, loading } = useSelector(state => state.orderState);

    const {
        shippingInfo = {},
        user = {},
        orderStatus = "Processing",
        orderItems = [],
        totalPrice = 0,
        paymentInfo = {}
    } = orderDetail;

    const isPaid = paymentInfo && paymentInfo.status === "succeeded";
    const dispatch = useDispatch();
    const { id } = useParams();

    useEffect(() => {
        if (id) {
            dispatch(orderDetailAction(id));
        }
    }, [dispatch, id]);

    return (
        <Fragment>
            {loading ? <Loader /> :
                <div className="container my-5">
                    <div className="row">

                        {/* LEFT SIDE */}
                        <div className="col-lg-8">

                            {/* Order Header */}
                            <div className="card shadow-sm mb-4 border-0">
                                <div className="card-body">
                                    <h2 className="mb-3">
                                        Order Details
                                    </h2>
                                    <h5 className="text-muted">
                                        Order ID: <span className="text-dark">{orderDetail._id}</span>
                                    </h5>
                                </div>
                            </div>

                            {/* Shipping Info */}
                            <div className="card shadow-sm mb-4 border-0">
                                <div className="card-body">
                                    <h4 className="mb-3 text-primary">
                                        <i className="fa fa-truck me-2"></i> Shipping Information
                                    </h4>
                                    <p><strong>Name:</strong> {user.name}</p>
                                    <p><strong>Phone:</strong> {shippingInfo.phoneNo}</p>
                                    <p>
                                        <strong>Address:</strong><br />
                                        {shippingInfo.address}, {shippingInfo.city},<br />
                                        {shippingInfo.postalCode}, {shippingInfo.state}, {shippingInfo.country}
                                    </p>
                                </div>
                            </div>

                            {/* Payment Info */}
                            <div className="card shadow-sm mb-4 border-0">
                                <div className="card-body">
                                    <h4 className="mb-3 text-success">
                                        <i className="fa fa-credit-card me-2"></i> Payment Status
                                    </h4>
                                    <span className={`badge ${isPaid ? "bg-success" : "bg-danger"} p-2`}>
                                        {isPaid ? "PAID" : "NOT PAID"}
                                    </span>
                                </div>
                            </div>

                            {/* Order Status */}
                            <div className="card shadow-sm mb-4 border-0">
                                <div className="card-body">
                                    <h4 className="mb-3 text-warning">
                                        <i className="fa fa-info-circle me-2"></i> Order Status
                                    </h4>
                                    <span className={`badge ${orderStatus.includes("Delivered") ? "bg-success" : "bg-warning text-dark"} p-2`}>
                                        {orderStatus}
                                    </span>
                                </div>
                            </div>

                            {/* Order Items */}
                            <div className="card shadow-sm border-0">
                                <div className="card-body">
                                    <h4 className="mb-4 text-dark">
                                        <i className="fa fa-shopping-cart me-2"></i> Ordered Items
                                    </h4>

                                    {orderItems.map((item, index) => (
                                        <div key={index} className="row align-items-center mb-4 border-bottom pb-3">
                                            <div className="col-3 col-md-2">
                                                <img
                                                    src={item.image}
                                                    alt={item.name}
                                                    className="img-fluid rounded"
                                                />
                                            </div>

                                            <div className="col-9 col-md-4">
                                                <Link
                                                    to={`/product/${item.product}`}
                                                    className="text-decoration-none fw-bold text-dark"
                                                >
                                                    {item.name}
                                                </Link>
                                            </div>

                                            <div className="col-6 col-md-3 mt-2 mt-md-0">
                                                <span className="text-muted">
                                                    ${item.price}
                                                </span>
                                            </div>

                                            <div className="col-6 col-md-3 mt-2 mt-md-0">
                                                <span className="badge bg-secondary">
                                                    Qty: {item.quantity}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* RIGHT SIDE - ORDER SUMMARY */}
                        <div className="col-lg-4">
                            <div className="card shadow-lg border-0 sticky-top" style={{ top: "100px" }}>
                                <div className="card-body">
                                    <h4 className="mb-4 text-center">Order Summary</h4>

                                    <div className="d-flex justify-content-between mb-2">
                                        <span>Items:</span>
                                        <span>{orderItems.length}</span>
                                    </div>

                                    <div className="d-flex justify-content-between mb-3">
                                        <span>Total Price:</span>
                                        <strong>${totalPrice}</strong>
                                    </div>

                                    <hr />

                                    <div className="text-center">
                                        <span className="badge bg-dark p-2">
                                            Thank you for shopping with us!
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            }
        </Fragment>
    );
}