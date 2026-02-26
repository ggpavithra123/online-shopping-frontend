import { Fragment, useEffect } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

import MetaData from "../Layouts/MetaData";
import CheckoutSteps from "./CheckoutStep";
import { validateShipping } from "./Shipping";

export default function ConfirmOrder() {
  const navigate = useNavigate();

  const { shippingInfo, items: cartItems } = useSelector(
    (state) => state.cartState
  );

  const { user } = useSelector((state) => state.authState);

  // ------------------ PRICE CALCULATIONS ------------------
  const itemsPrice = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const shippingPrice = itemsPrice > 200 ? 0 : 25;
  const taxPrice = Number(itemsPrice * 0.05).toFixed(2);

  const totalPrice = (
    itemsPrice +
    shippingPrice +
    Number(taxPrice)
  ).toFixed(2);

  // ------------------ HANDLE PAYMENT ------------------
  const processPayment = () => {
    const orderData = {
      itemsPrice,
      shippingPrice,
      taxPrice,
      totalPrice,
    };

    try {
      sessionStorage.setItem("orderInfo", JSON.stringify(orderData));
      navigate("/payment");
    } catch (error) {
      console.error("Session storage error:", error);
    }
  };

  // ------------------ VALIDATE SHIPPING ------------------
  useEffect(() => {
    validateShipping(shippingInfo, navigate);
  }, [shippingInfo, navigate]);

  return (
    <Fragment>
      <MetaData title="Confirm Order" />
      <CheckoutSteps shipping confirmOrder />

      <div className="container my-5">
        <div className="row">

          {/* LEFT SIDE */}
          <div className="col-lg-8">

            {/* SHIPPING CARD */}
            <div className="card shadow-sm mb-4 border-0">
              <div className="card-body">
                <h4 className="text-primary mb-3">
                  <i className="fa fa-truck me-2"></i> Shipping Information
                </h4>

                <p><strong>Name:</strong> {user?.name}</p>
                <p><strong>Phone:</strong> {shippingInfo?.phoneNo}</p>
                <p>
                  <strong>Address:</strong><br />
                  {shippingInfo?.address}, {shippingInfo?.city},<br />
                  {shippingInfo?.postalCode}, {shippingInfo?.state},{" "}
                  {shippingInfo?.country}
                </p>

                <span className="badge bg-info mt-2">
                  Cash on Delivery / Online Payment
                </span>
              </div>
            </div>

            {/* CART ITEMS CARD */}
            <div className="card shadow-sm border-0">
              <div className="card-body">
                <h4 className="mb-4">
                  <i className="fa fa-shopping-cart me-2"></i> Cart Items
                </h4>

                {cartItems && cartItems.length > 0 ? (
                  cartItems.map((item) => (
                    <div
                      key={item.product}
                      className="row align-items-center mb-4 border-bottom pb-3"
                    >
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
                          className="fw-bold text-dark text-decoration-none"
                        >
                          {item.name}
                        </Link>
                      </div>

                      <div className="col-6 col-md-3 mt-2 mt-md-0">
                        <span className="text-muted">
                          ${item.price} x {item.quantity}
                        </span>
                      </div>

                      <div className="col-6 col-md-3 mt-2 mt-md-0 text-md-end">
                        <strong>
                          ${(item.price * item.quantity).toFixed(2)}
                        </strong>
                      </div>
                    </div>
                  ))
                ) : (
                  <p>Your cart is empty.</p>
                )}
              </div>
            </div>

          </div>

          {/* RIGHT SIDE - ORDER SUMMARY */}
          <div className="col-lg-4">
            <div
              className="card shadow-lg border-0 sticky-top"
              style={{ top: "100px" }}
            >
              <div className="card-body">
                <h4 className="mb-4 text-center">Order Summary</h4>

                <div className="d-flex justify-content-between mb-2">
                  <span>Subtotal</span>
                  <span>${itemsPrice.toFixed(2)}</span>
                </div>

                <div className="d-flex justify-content-between mb-2">
                  <span>Shipping</span>
                  <span>
                    {shippingPrice === 0 ? (
                      <span className="text-success">FREE</span>
                    ) : (
                      `$${shippingPrice.toFixed(2)}`
                    )}
                  </span>
                </div>

                <div className="d-flex justify-content-between mb-3">
                  <span>Tax (5%)</span>
                  <span>${taxPrice}</span>
                </div>

                <hr />

                <div className="d-flex justify-content-between mb-3">
                  <strong>Total</strong>
                  <strong className="text-primary">
                    ${totalPrice}
                  </strong>
                </div>

                <button
                  onClick={processPayment}
                  className="btn btn-primary w-100 py-2"
                  disabled={cartItems.length === 0}
                >
                  Proceed to Payment
                </button>

                <div className="text-center mt-3">
                  <small className="text-muted">
                    Secure Checkout • Encrypted Payment
                  </small>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </Fragment>
  );
}