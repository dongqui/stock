import axios from "axios";
import type { DART_DATA_TYPE, 최대_매수_수량_조회_응답 } from "./types";

// https://apiportal.koreainvestment.com/apiservice/apiservice-domestic-stock#L_aade4c72-5fb7-418a-9ff2-254b4d5f0ceb

const KIS_URL = "https://openapi.koreainvestment.com:9443";
const token =
  "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJ0b2tlbiIsImF1ZCI6ImVmNDUyNGY1LTI2ZDctNDQwNS04YTlmLTNiODRjODI3MWJkYSIsImlzcyI6InVub2d3IiwiZXhwIjoxNzA1OTA3NzI3LCJpYXQiOjE3MDU4MjEzMjcsImp0aSI6IlBTYU9nYTQ5ekFLbzNuUWlZWDZoazNDMnJuOVhDcFB4REhqVyJ9.12RmYHC7MnLC5MZzsAZ-IpLfQ83_pPpGcJWQ0n40tWO3gHLH7GVrIclY7_OOzNtKV3xXHPNdxnyu6q6k1Hxdmg";
const CANO = process.env.CANO;
const ACNT_PRDT_CD = process.env.ACNT_PRDT_CD;

async function pollingDataFromDart() {
  const results = await axios.get<DART_DATA_TYPE>(
    `https://opendart.fss.or.kr/api/list.json?crtfc_key=${process.env.DART_API_KEY}&page_no=1&page_count=100&end_de=20240115&pblntf_ty=I`
  );
  console.log(
    results.data.list.filter(
      (data) => data.report_nm === "단일판매ㆍ공급계약체결"
    )
  );
  console.log(results.data.list.length);
}

pollingDataFromDart();

async function orderStock(stockCode: string) {
  const result = await axios.post(
    `${KIS_URL}/uapi/domestic-stock/v1/trading/order-cash`,
    {
      CANO,
      ACNT_PRDT_CD,
      PDNO: stockCode,
      ORD_QTY: "",
      ORD_DVSN: "13",
      ORD_UNPR: "0",
    },
    {
      headers: {
        authorization: token,
        appkey: process.env.KIS_APP_KEY,
        appsecret: process.env.KIS_APP_SECRET,
        tr_id: "TTTC0802U",
      },
    }
  );
}

async function getKISToken() {
  const result = await axios.post(`${KIS_URL}/oauth2/tokenP`, {
    grant_type: "client_credentials",
    appkey: process.env.KIS_APP_KEY,
    appsecret: process.env.KIS_APP_SECRET,
  });
  console.log(result);
}

async function 최대_매수_수량_조회(stockCode: string) {
  const result = await axios.get<최대_매수_수량_조회_응답>(
    `${KIS_URL}/uapi/domestic-stock/v1/trading/inquire-psbl-order`,
    {
      params: {
        CANO,
        ACNT_PRDT_CD,
        PDNO: stockCode,
        ORD_UNPR: "",
        ORD_DVSN: "01",
        CMA_EVLU_AMT_ICLD_YN: "N",
        OVRS_ICLD_YN: "N",
      },
      headers: {
        authorization: token,
        appkey: process.env.KIS_APP_KEY,
        appsecret: process.env.KIS_APP_SECRET,
        tr_id: "TTTC8908R",
      },
    }
  );
  return result?.data?.output?.nrcvb_buy_qty;
}
