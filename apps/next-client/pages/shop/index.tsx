import React from "react";
import { NextPage } from "next";
import Head from "next/head";
import PaymentForm from "../../components/payment/PaymentForm";
import Script from "next/script";

const IndexPage: NextPage = () => (
  <>
    <div>
      <Script src="https://code.jquery.com/jquery-1.12.4.min.js" />
      <Script src="https://cdn.iamport.kr/js/iamport.payment-1.1.8.js" />
    </div>    
s
    <PaymentForm />
  </>
);

export default IndexPage;