import { useState } from "react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import api from "../../utils/axios";

export default function Payment() {
    const stripe = useStripe();
    const elements = useElements();
    const navigate = useNavigate();

    const { items: cartItems } = useSelector(state => state.cartState);
    const orderInfo = JSON.parse(sessionStorage.getItem("orderInfo"));
    const [loading, setLoading] = useState(false);

    const submitHandler = async (e) => {
        e.preventDefault();

        if (!stripe || !elements) {
            return;
        }

        setLoading(true);

        try {
            const { data } = await api.post("api/v1/payment/process", {
                amount: Math.round(orderInfo.totalPrice * 100),
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
            } else if (result.paymentIntent.status === "succeeded") {

                // Clear cart or store order here if needed

                navigate("/order/success");
            }

        } catch (error) {
            console.error(error);
            alert("Payment failed. Please try again.");
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
                            options={{
                                hidePostalCode: true,
                            }}
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