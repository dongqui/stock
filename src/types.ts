export type DART_DATA_TYPE = {
  status: string;
  message: string;
  page_no: number;
  page_count: number;
  total_count: number;
  total_page: number;
  list: Array<{
    corp_code: string;
    corp_name: string;
    stock_code: string;
    corp_cls: string;
    report_nm: string;
    rcept_no: string;
    flr_nm: string;
    rcept_dt: string;
    rm: string;
  }>;
};

export type 최대_매수_수량_조회_응답 = {
  output: {
    ord_psbl_cash: string;
    ord_psbl_sbst: string;
    ruse_psbl_amt: string;
    fund_rpch_chgs: string;
    psbl_qty_calc_unpr: string;
    nrcvb_buy_amt: string;
    nrcvb_buy_qty: string;
    max_buy_amt: string;
    max_buy_qty: string;
    cma_evlu_amt: string;
    ovrs_re_use_amt_wcrc: string;
    ord_psbl_frcr_amt_wcrc: string;
  };
  rt_cd: string;
  msg_cd: string;
  msg1: string;
};
