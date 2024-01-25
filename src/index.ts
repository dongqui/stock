import axios from "axios";
import type { DART_DATA_TYPE, 최대_매수_수량_조회_응답 } from "./types";
import { exec } from "child_process";

// https://apiportal.koreainvestment.com/apiservice/apiservice-domestic-stock#L_aade4c72-5fb7-418a-9ff2-254b4d5f0ceb

const KIS_URL = "https://openapi.koreainvestment.com:9443";
const token =
  "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJ0b2tlbiIsImF1ZCI6IjgwODQyYzQyLWEzNjAtNDA2OC04YTlhLWJhZTgxYmJlMTVhOSIsImlzcyI6InVub2d3IiwiZXhwIjoxNzA2MjI3OTUwLCJpYXQiOjE3MDYxNDE1NTAsImp0aSI6IlBTMDdITmJIeFJlT21Rc3hNc1FoNFlKZ1FNSHlodU92RkdCUiJ9.zCBpY6LMj7Om4yoNXf3ODwIFRcRiAdx-LbywbRlF3m3-fSMnrSlcZiiG1fvxxzcjIImifjy9C2KFSW-L3ZEgRg";
const CANO = process.env.CANO;
const ACNT_PRDT_CD = process.env.ACNT_PRDT_CD;

let dartReportIdList = ["20240123800109"];

async function pollingDataFromDart() {
  const results = await axios.get<DART_DATA_TYPE>(
    `https://opendart.fss.or.kr/api/list.json?crtfc_key=${process.env.DART_API_KEY}&page_no=1&page_count=100&pblntf_ty=I`
  );

  const reportList = results.data.list.filter((data) =>
    data.report_nm.includes("단일판매ㆍ공급계약체결")
  );

  const newReports = reportList.filter(
    (report) => !dartReportIdList.includes(report.rcept_no)
  );

  dartReportIdList = reportList.map((report) => report.rcept_no);
  if (newReports.length && new Date().getHours() >= 9) {
    await Promise.allSettled(
      newReports.map(async (report) => {
        const 매수_가능_수량 = await 최대_매수_수량_조회(report.stock_code);
        await orderStock(report.stock_code, 매수_가능_수량);
      })
    );
  }
}

async function orderStock(stockCode: string, quantity: string) {
  const result = await axios.post(
    `${KIS_URL}/uapi/domestic-stock/v1/trading/order-cash`,
    {
      CANO,
      ACNT_PRDT_CD,
      PDNO: stockCode,
      ORD_QTY: quantity,
      ORD_DVSN: "01",
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
  exec("powershell.exe [console]::beep(500, 1000)");

  console.log("-----주문 완료-----");
  console.log(result.data);
  console.log("------------------");
}

async function getKISToken() {
  const result = await axios.post(`${KIS_URL}/oauth2/tokenP`, {
    grant_type: "client_credentials",
    appkey: process.env.KIS_APP_KEY,
    appsecret: process.env.KIS_APP_SECRET,
  });

  console.log(result.data);
}

async function 최대_매수_수량_조회(stockCode: string) {
  try {
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
    console.log(result);
    return result?.data?.output?.nrcvb_buy_qty;
  } catch (e) {
    console.log(e);
  }
}

setInterval(() => {
  pollingDataFromDart();
}, 5000);

// getKISToken();
// pollingDataFromDart();
