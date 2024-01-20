import axios from "axios";
import type { DART_DATA_TYPE } from "./types";

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
