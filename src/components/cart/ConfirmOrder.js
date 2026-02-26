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

      <div className="row d-flex justify-content-between">
        {/* ------------------ LEFT SIDE ------------------ */}
        <div className="col-12 col-lg-8 mt-5 order-confirm">
          <h4 className="mb-3">Shipping Info</h4>

          <p><strong>Name:</strong> {user?.name}</p>
          <p><strong>Phone:</strong> {shippingInfo?.phoneNo}</p>
          <p className="mb-4">
            <strong>Address:</strong>{" "}
            {shippingInfo?.address}, {shippingInfo?.city},{" "}
            {shippingInfo?.postalCode}, {shippingInfo?.state},{" "}
            {shippingInfo?.country}
          </p>

          <hr />

          <h4 className="mt-4">Your Cart Items:</h4>

          {cartItems && cartItems.length > 0 ? (
            cartItems.map((item) => (
              <Fragment key={item.product}>
                <div className="cart-item my-1">
                  <div className="row align-items-center">
                    <div className="col-4 col-lg-2">
                      <img
                        src={item.image}
                        alt={item.name}
                        height="45"
                        width="65"
                      />
                    </div>

                    <div className="col-5 col-lg-6">
                      <Link to={`/product/${item.product}`}>
                        {item.name}
                      </Link>
                    </div>

                    <div className="col-3 col-lg-4 text-end">
                      <p className="mb-0">
                        {item.quantity} x ${item.price} ={" "}
                        <strong>
                          ${(item.quantity * item.price).toFixed(2)}
                        </strong>
                      </p>
                    </div>
                  </div>
                </div>
                <hr />
              </Fragment>
            ))
          ) : (
            <p>Your cart is empty.</p>
          )}
        </div>

        {/* ------------------ RIGHT SIDE ------------------ */}
        <div className="col-12 col-lg-3 my-4">
          <div id="order_summary">
            <h4>Order Summary</h4>
            <hr />

            <p>
              Subtotal:
              <span className="order-summary-values float-end">
                ${itemsPrice.toFixed(2)}
              </span>
            </p>

            <p>
              Shipping:
              <span className="order-summary-values float-end">
                ${shippingPrice.toFixed(2)}
              </span>
            </p>

            <p>
              Tax:
              <span className="order-summary-values float-end">
                ${taxPrice}
              </span>
            </p>

            <hr />

            <p>
              <strong>Total:</strong>
              <span className="order-summary-values float-end">
                ${totalPrice}
              </span>
            </p>

            <hr />

            <button
              id="checkout_btn"
              onClick={processPayment}
              className="btn btn-primary w-100"
              disabled={cartItems.length === 0}
            >
              Proceed to Payment
            </button>
          </div>
        </div>
      </div>
    </Fragment>
  );
}