// RETURN USER ROLE ggj and skij
export default async function({isRegister}) {
  try {
    return await this.GoGoHTTP.post('/api/accounts/v1/credential/validate', {
      email: this.email,
      password: this.password,
      isRegister,
      clientId: process.env.GGJ_CLIENT_ID
    })
  } catch(err) {
    return err
  }
}

export const EMAIL_REGISTED = 'EA004'
