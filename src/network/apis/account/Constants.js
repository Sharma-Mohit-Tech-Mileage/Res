

export const config={

 PRODUCTION:{
    URL:'https://customer.sparklight.com',
    SSO_LOGIN:'https://login.cableone.net/auth/realms/external-sso-realm',
    API_BASEURL:'https://publicservices.sparklight.com/portalservices/',
    ZENDESK_FEEDBACK:{
      Url:'https://cableone.zendesk.com/api/v2/requests.json',
      ticket_form_id: "360000052934",
      recipient: "400018994093",
      assignee_id: "400018994093",
      group_id: "360000672214",
      category_id: "360022798993",
      feedbackValue_id: "1900000846365",
      email_id: "36003617614",
   }

 },
 UAT:{
    URL:'https://customer.uat.sparklight.com',
    SSO_LOGIN:'https://login.uat.cableone.net/auth/realms/external-sso-realm',
    API_BASEURL:'https://customer.uat.sparklight.com/apiWrapper/',
    ZENDESK_FEEDBACK:{
      Url:'https://cableone1615402851.zendesk.com/api/v2/requests.json',
      ticket_form_id: "1500000315922",
      recipient: "1503384311321",
      assignee_id: "1503384311321",
      group_id: "360017953054",
      category_id: "1500002176201",
      feedbackValue_id: "18708581262999",
      email_id: "1500002222302",
   }
 }

}

export const ISUAT = true

export const Env=(ISUAT)? config.UAT : config.PRODUCTION