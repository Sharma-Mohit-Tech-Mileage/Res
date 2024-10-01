

export const config = {

  PRODUCTION: {
    URL: 'https://customer.sparklight.com/residential',
    SSO_LOGIN: 'https://login.cableone.net/auth/realms/external-sso-realm',
    API_BASEURL: 'https://publicservices.sparklight.com/portalservices/',
    API_ACP_BASEURL: 'https://publicservices.sparklight.com/PortalSvc/',
    API_SHOPPING_CART_BASEURL: 'https://publicservices.sparklight.com/ShoppingCart',
    MODEM_BASE_URL: "https://mule-gateway.cableone.net/customer-api",
    TRUCK_ROLL_BASE_URL: 'https://adb-1771418802186593.13.azuredatabricks.net/model/lgb_model_fs_mobile/Production/invocations',
    PAYMENTURL_V2 : 'https://payment.sparklight.com/PortalsV2/PortalsPayment',
    URL_EASYPAY_SETUP_V2 : 'https://payment.sparklight.com/portalsV2/setup-auto-pay',
    URL_EASYPAY_MANAGE_V2 : 'https://payment.sparklight.com/portalsV2/manage-auto-pay',
    PAYMENTURL_V3 : 'https://payment.sparklight.com/portalsV3-Demo/PortalsBiller',
    URL_EASYPAY_SETUP_V3 : 'https://payment.sparklight.com/portalsV3/activate-auto-pay',
    URL_EASYPAY_MANAGE_V3 : 'https://payment.sparklight.com/portalsV3/manage-auto-pay',
    PAYMENTURLNEW: 'https://customer.sparklight.com/portals/app-secure/billing',
    encryptvalPassword: '1 0 7 2 8 3 3634',
    ZENDESK_FEEDBACK: {
      Url: 'https://cableone.zendesk.com/api/v2/requests.json',
      ticket_form_id: "360000052934",
      recipient: "400018994093",
      assignee_id: "400018994093",
      group_id: "360000672214",
      category_id: "360022798993",
      feedbackValue_id: "1900000846365",
      email_id: "36003617614",
    },
    ZENDESK_CHAT_KEY: '4DZVK5GTMjPKd6rXN0jDsc2iPDdwVLgC'
  },
  UAT: {
    URL: 'https://customer.uat.sparklight.com/residential',
    SSO_LOGIN: 'https://login.uat.cableone.net/auth/realms/external-sso-realm',
    API_BASEURL: 'https://customer.uat.sparklight.com/apiWrapper/',
    API_SHOPPING_CART_BASEURL: 'https://secure.uat.cableone.net/ShoppingCartBackBoneAPIWrapperDemo',
    API_ACP_BASEURL: 'https://customer.uat.sparklight.com/apiWrapper/',
    MODEM_BASE_URL: "https://mule-gateway.cableone.net/customer-api",
    TRUCK_ROLL_BASE_URL: 'https://adb-1771418802186593.13.azuredatabricks.net/model/lgb_model_fs/Staging/invocations',
    PAYMENTURL_V2 : 'https://payment.uat.sparklight.com/PortalsV2/PortalsPayment',
    URL_EASYPAY_SETUP_V2 : 'https://payment.uat.sparklight.com/PortalsV2/setup-auto-pay',
    URL_EASYPAY_MANAGE_V2 : 'https://payment.uat.sparklight.com/PortalsV2/manage-auto-pay',

    PAYMENTURL_V3 : 'https://payment.uat.sparklight.com/portalsV3-Demo/PortalsBiller',
    URL_EASYPAY_SETUP_V3 : 'https://payment.uat.sparklight.com/portalsV3-Demo/activate-autopay',
    URL_EASYPAY_MANAGE_V3 : 'https://payment.uat.sparklight.com/portalsV3-Demo/manage-autopay',

    encryptvalPassword: '1 0 7 2 8 3 3634',
    PAYMENTURLNEW: 'https://customer.uat.sparklight.com/portals/app-secure/billing',
    ZENDESK_FEEDBACK: {
      Url: 'https://cableone1718812169.zendesk.com/api/v2/requests.json',
      ticket_form_id: "24297809981847",
      recipient: "24290572271767",
      assignee_id: "24290572271767",
      group_id: "360017953054",
      category_id: "24347657899927",
      feedbackValue_id: "24297761149335",
      email_id: "24297758328599",
    },
    ZENDESK_CHAT_KEY: '84AFF64rwYVgQS35EsTakO03d98WTdJb'
  }

}

export const ISUAT = false

export const Env = (ISUAT) ? config.UAT : config.PRODUCTION