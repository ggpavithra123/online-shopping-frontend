import axios from "axios";
import { loadStripe } from "@stripe/stripe-js";
import { useSelector } from "react-redux";

const stripePromise = loadStripe("YOUR_PUBLISHABLE_KEY");

export default function Payment() {
    const { items: cartItems } = useSelector(state => state.cartState);
    const orderInfo = JSON.parse(sessionStorage.getItem("orderInfo"));

    const handleCheckout = async () => {
        const stripe = await stripePromise;

        const { data } = await axios.post("/api/v1/payment/process", {
            items: cartItems
        });

        await stripe.redirectToCheckout({
            sessionId: data.id
        });
    };

    return (
        <div className="row wrapper">
            <div className="col-10 col-lg-5 mx-auto">
                <button
                    onClick={handleCheckout}
                    className="btn btn-primary btn-block py-3"
                >
                    Pay ${orderInfo?.totalPrice}
                </button>
            </div>
        </div>
    );
}