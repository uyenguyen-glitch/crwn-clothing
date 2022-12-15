import { useState } from "react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { useSelector } from "react-redux";

import { selectCurrentUser } from "../../store/user/user.selector";
import { selectCartTotal } from "../../store/cart/cart.selector";
import { BUTTON_TYPE_CLASSES } from "../button/button.component";
import {
  FormContainer,
  PaymentFormContainer,
  PaymentButton,
} from "./payment-form.styles";

const PaymentForm = () => {
  // useStripe: make requests in the format that Stripe needs it to be.
  const stripe = useStripe();
  const elements = useElements();
  const amount = useSelector(selectCartTotal);
  const currentUser = useSelector(selectCurrentUser);
  const [isLoadingProcessPayment, setIsLoadingProcessPayment] = useState(false);

  const paymentHandler = async (evt) => {
    evt.preventDefault();
    if (!stripe || !elements) {
      return;
    }

    setIsLoadingProcessPayment(true);

    const response = await fetch("/.netlify/functions/create-payment-intent", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ amount: amount * 100 }),
    }).then((res) => {
      return res.json();
    });

    // get client-secret to create actual payment
    const {
      paymentIntent: { client_secret },
    } = response;

    // creating payment

    // confirmCardPayment is the card payment method specifically for cards.
    // 2 arguments:
    //    + 1: client_secret
    //    + 2: a configuration object where payment method
    const paymentResult = await stripe.confirmCardPayment(client_secret, {
      payment_method: {
        card: elements.getElement(CardElement),
        billing_details: {
          name: currentUser ? currentUser.displayName : "Guest",
        },
      },
    });

    setIsLoadingProcessPayment(false);

    if (paymentResult.error) {
      alert(paymentResult.error);
    } else {
      if (paymentResult.paymentIntent.status === "succeeded") {
        alert("Payment success");
      }
    }
  };

  return (
    <PaymentFormContainer>
      <FormContainer onSubmit={paymentHandler}>
        <h2>Credit Card Payment: </h2>
        <CardElement />
        <PaymentButton
          isLoading={isLoadingProcessPayment}
          buttonType={BUTTON_TYPE_CLASSES.inverted}
        >
          Pay now
        </PaymentButton>
      </FormContainer>
    </PaymentFormContainer>
  );
};

export default PaymentForm;
