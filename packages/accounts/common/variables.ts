export const validEmail = new RegExp(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)
// eslint-disable-next-line no-useless-escape
export const validPassword = new RegExp(/^((?=.*[a-z])|(?=.*[A-Z]))(?=.*\d)[A-Za-z\d`~!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]{1,}$/)
export const appError = [
  // 'EA001',  // Multiple user role in case login/register with email
  // 'EA002',  // Multiple user role in case register/login with SNS
  'EA003',  // Nickname already existed
  'EA004',  // Invalid/Incorrect password/email
  'EA005',  // Password is not 7 or more single-byte alphabet & numbers
  // 'EA006',  // Multiple register request in 5 minutes
]
export const roleError = [
  'EA001',
  'EA002'
]
export const MULTI_REQUEST_IN_5_MINUTES = 'EA006'
export const resetPassError = [
  'ERE001',  // Invalid email
  'ERP004',  // Invalid password
]
export const URL = '/api/accounts/v1'
