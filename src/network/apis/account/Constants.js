

export const config={
 PRODUCTION:{
    URL:'https://customer.sparklight.com',
    SSO_LOGIN:'https://login.cableone.net/auth/realms/external-sso-realm',
    API_BASEURL:'https://publicservices.sparklight.com/portalservices/',

 },
 UAT:{
    URL:'https://customer.uat.sparklight.com',
    SSO_LOGIN:'https://login.uat.cableone.net/auth/realms/external-sso-realm',
    API_BASEURL:'https://customer.uat.sparklight.com/apiWrapper/',
 }

}

export const Env=config.PRODUCTION
//export const Env=config.UAT