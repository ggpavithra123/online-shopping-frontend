import { useState } from "react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { useSelector } from "react-redux";
import api from "../../utils/axios";

export default function Payment() {

    const stripe = useStripe();
    const elements = useElements();

    const { items: cartItems } = useSelector(state => state.cartState);
    const orderInfo = JSON.parse(sessionStorage.getItem("orderInfo"));
    const [loading, setLoading] = useState(false);

    const submitHandler = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {

            const { data } = await api.post("/api/v1/payment/process", {
                amount: Math.round(orderInfo.totalPrice * 100)
            });

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
            } else {
                if (result.paymentIntent.status === "succeeded") {
                    alert("Payment Successful 🎉");
                }
            }

        } catch (error) {
            console.error(error);
            alert("Payment failed");
            setLoading(false);
        }
    };

    return (
        <div className="container mt-5">
            <div className="card p-4 shadow">
                <h3 className="mb-3">Pay ₹{orderInfo?.totalPrice}</h3>

                <form onSubmit={submitHandler}>
                    <div className="form-group mb-3">
                        <CardElement className="form-control p-3" />
                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary w-100"
                        disabled={!stripe || loading}
                    >
                        {loading ? "Processing..." : "Pay Now"}
                    </button>
                </form>
            </div>
        </div>
    );
}