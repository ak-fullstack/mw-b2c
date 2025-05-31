import { environment } from "../environments/environment";

const url = environment.apiBaseUrl;

export const api = {

  admin: {
    sendOtp: `${url}/auth/send-otp`,
    verifyOtp: `${url}/auth/verify-otp`,
    getRoles: `${url}/auth/roles`,
    getPermissions: `${url}/role-permission/get-all-permissions`,
    createRole: `${url}/role/create-role`,
    getallRolesWithPermissions: `${url}/role/get-all-roles-with-permissions`,
    uploadUserImage: `${url}/google-cloud-storage/upload`,
    addNewUser: `${url}/user/add-new-user`,
    getAllUsers: `${url}/user/get-all-users`,
  },
  customer: {
    verifyOauthToken: `${url}/auth/verify-oauth-token`,
    sendCustomerEmailOtpForRegistration: `${url}/auth/register/send-customer-email-otp`,
    verifyCustomerEmailOtp: `${url}/auth/verify-customer-email-otp`,
    createCustomer : url+'/customer/create-customer',
    loginCustomer : url+'/auth/customer-login',
    sendResetOtp:url+'/auth/send-reset-otp',
    updateCustomer:url+'/customer/update-customer'
  },
  product:{
    getLatestStockPerProduct: `${url}/stocks/latest-by-product`,
  }
};