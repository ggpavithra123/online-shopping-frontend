import { useState } from "react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import api from "../../utils/axios";
import { orderCompleted } from "../../slices/cartSlice";

export default function Payment() {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { items: cartItems, shippingInfo } = useSelector(
    (state) => state.cartState
  );

  const orderInfo = JSON.parse(sessionStorage.getItem("orderInfo"));
  const [loading, setLoading] = useState(false);

  const submitHandler = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) return;

    if (!orderInfo) {
      alert("Order information missing. Please try again.");
      return;
    }

    setLoading(true);

    try {
      // 1️⃣ Create Stripe PaymentIntent
      const { data } = await api.post("/api/v1/payment/process", {
        amount: Math.round(orderInfo.totalPrice * 100), // convert to paise
      });

      // 2️⃣ Confirm Payment
      const result = await stripe.confirmCardPayment(
        data.client_secret,
        {
          payment_method: {
            card: elements.getElement(CardElement),
          },
        }
      );

      if (result.error) {
        alert(result.error.message);
        setLoading(false);
        return;
      }

      // 3️⃣ If Payment Successful → Create Order
      if (result.paymentIntent.status === "succeeded") {
        const order = {
          orderItems: cartItems,
          shippingInfo,
          itemsPrice: orderInfo.itemsPrice,
          shippingPrice: orderInfo.shippingPrice,
          taxPrice: orderInfo.taxPrice,
          totalPrice: orderInfo.totalPrice,
          paymentInfo: {
            id: result.paymentIntent.id,
            status: result.paymentIntent.status,
          },
        };

        const { data: orderData } = await api.post(
          "/api/v1/order/new",
          order
        );

        // 4️⃣ Clear cart + session
        dispatch(orderCompleted());
        sessionStorage.removeItem("orderInfo");

        // 5️⃣ Navigate to Order Details page
        navigate(`/order/${orderData.order._id}`);
      }
    } catch (error) {
      console.error("Payment Error:", error.response || error);
      alert(
        error.response?.data?.message ||
          "Payment failed. Please try again."
      );
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5">
      <div className="card shadow p-4">
        <h3 className="mb-4 text-center">
          Pay ₹{orderInfo?.totalPrice}
        </h3>

        <form onSubmit={submitHandler}>
          <div className="form-group mb-3">
            <CardElement
              className="form-control p-3"
              options={{ hidePostalCode: true }}
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary w-100 py-2"
            disabled={!stripe || loading}
          >
            {loading ? "Processing..." : "Pay Now"}
          </button>
        </form>
      </div>
    </div>
  );
}