import React from "react";
import { NextPage } from "next";
import Head from "next/head";
import PaymentForm from "../../component/payment/PaymentForm";

const IndexPage: NextPage = () => (
  <>
    <Head>
      <script src="https://code.jquery.com/jquery-1.12.4.min.js" />
      <script src="https://cdn.iamport.kr/js/iamport.payment-1.1.8.js" />
    </Head>    

    <PaymentForm />
  </>
);

export default IndexPage;