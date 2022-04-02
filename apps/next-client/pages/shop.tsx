import { useState } from "react";
import { TPayment } from "../types/TPayment";

export default function shop() {        
    const [clickedButton, setClickedButton] = useState('');

    const buttonHandler = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();

        const button: HTMLButtonElement = event.currentTarget;
        setClickedButton(button.name);
    };

    const { IMP } = window;
    IMP.init('imp00000000'); // 'imp00000000' 대신 발급받은 가맹점 식별코드를 사용합니다.


    const testDate:TPayment = {
        pg: 'html5_inicis',                           // PG사
        pay_method: 'card',                           // 결제수단
        merchant_uid: `mid_${new Date().getTime()}`,   // 주문번호
        amount: 1000,                                 // 결제금액
        name: '아임포트 결제 데이터 분석',                  // 주문명
        buyer_name: '홍길동',                           // 구매자 이름
        buyer_tel: '01012341234',                     // 구매자 전화번호
        buyer_email: 'example@example',               // 구매자 이메일
        buyer_addr: '신사동 661-16',                    // 구매자 주소
        buyer_postcode: '06018',                      // 구매자 우편번호
    }

    const requestPay = () => {
         // IMP.request_pay(param, callback) 결제창 호출
        IMP.request_pay({ // param
            pg: "html5_inicis",
            pay_method: "card",
            merchant_uid: "ORD20180131-0000011",
            name: "노르웨이 회전 의자",
            amount: 64900,
            buyer_email: "gildong@gmail.com",
            buyer_name: "홍길동",
            buyer_tel: "010-4242-4242",
            buyer_addr: "서울특별시 강남구 신사동",
            buyer_postcode: "01181"
        }, rsp => { // callback
            if (rsp.success) {
            ...,
            // 결제 성공 시 로직,
            ...
            } else {
            ...,
            // 결제 실패 시 로직,
            ...
            }
        });
    }

    const callback = (response) => {
        const {
            success,
            merchant_uid,
            error_msg
        } = response;
        if (success) {
          alert('결제 성공');
        } else {
          alert(`결제 실패: ${error_msg}`);
        }
    }
    
    return <div>
        <head>
            <script type="text/javascript" src="https://code.jquery.com/jquery-1.12.4.min.js" ></script>
            <script type="text/javascript" src="https://cdn.iamport.kr/js/iamport.payment-{SDK-최신버전}.js"></script>
        </head>
        <div>
            <button onClick={buttonHandler}>결제창 오픈</button>
        </div>
    </div>
}
