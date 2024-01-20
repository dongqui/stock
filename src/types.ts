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
