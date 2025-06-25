import { environment } from "../environments/environment";

const url = environment.apiBaseUrl;

export const api = {


  customer: {
    verifyOauthToken: `${url}/auth/verify-oauth-token`,
    sendCustomerEmailOtpForRegistration: `${url}/auth/register/send-customer-email-otp`,
    verifyCustomerEmailOtp: `${url}/auth/verify-customer-email-otp`,
    createCustomer : url+'/customer/create-customer',
    loginCustomer : url+'/auth/customer-login',
    sendResetOtp:url+'/auth/send-reset-otp',
    updateCustomer:url+'/customer/update-customer',
    getProfile:url+'/customer/me',
    address:url+'/customer-address',
    getAllStates: `${url}/customer-address/get-all-states`,
    logout: `${url}/auth/logout`,
    createOrder:url+'/orders/create-order',
    getCustomerOrders:url+'/orders/customer-orders'
  },
  product:{
    getLatestStockPerProduct: `${url}/stocks/latest-by-product`,
    getStocksByIds: `${url}/stocks/get-stocks-by-ids`,
  }
};