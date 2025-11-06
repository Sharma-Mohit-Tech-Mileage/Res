export const config = {
  PRODUCTION: {
    URL: "https://customer.sparklight.com/residential",
    SSO_LOGIN: "https://login.cableone.net/auth/realms/external-sso-realm",
    API_BASEURL: "https://publicservices.sparklight.com/portalservices/",
    API_ACP_BASEURL: "https://publicservices.sparklight.com/PortalSvcs/",
    API_SHOPPING_CART_BASEURL:
      "https://publicservices.sparklight.com/ShoppingCart",
    MODEM_BASE_URL: "https://mule-gateway.cableone.net/customer-api",
    TRUCK_ROLL_BASE_URL:
      "https://adb-1771418802186593.13.azuredatabricks.net/model/lgb_model_fs_mobile/Production/invocations",
    PAYMENTURL_V2: "https://payment.sparklight.com/PortalsV2/PortalsPayment",
    URL_EASYPAY_SETUP_V2:
      "https://payment.sparklight.com/portalsV2/setup-auto-pay",
    URL_EASYPAY_MANAGE_V2:
      "https://payment.sparklight.com/portalsV2/manage-auto-pay",
    PAYMENTURL_V3:
      "https://payment.sparklight.com/portalsV3/PortalsBiller/GetPostDataWithKey",
    URL_EASYPAY_SETUP_V3:
      "https://payment.sparklight.com/portalsV3/activate-autopay",
    URL_EASYPAY_MANAGE_V3:
      "https://payment.sparklight.com/portalsV3/manage-autopay",
    PAYMENTURLNEW: "https://customer.sparklight.com/portals/app-secure/billing",
    VIEW_BILLINGS: "https://customer.sparklight.com/residential/billing",
    VIEW_PAYMENT:
      "https://customer.sparklight.com/residential/billing/all-payments",
    BILLING_HISTORY:
      "https://customer.sparklight.com/residential/billing/statement",
    PAY_METHOD: "https://payment.sparklight.com/portalsV3/billing-payment",
    ACP_BILLING: "https://customer.sparklight.com/portals/app-secure",
    encryptvalPassword: "1 0 7 2 8 3 3634",
    secretKey: "6LeG6bEUAAAAAM7vlsL7QL6xw2IFhvtbgbQng-za",
    ZENDESK_FEEDBACK: {
      Url: "https://cableone.zendesk.com/api/v2/requests.json",
      ticket_form_id: "360000052934",
      recipient: "400018994093",
      assignee_id: "400018994093",
      group_id: "360000672214",
      category_id: "360022798993",
      feedbackValue_id: "1900000846365",
      email_id: "36003617614",
      app_version_id: "TBD_PROD",
      platform_id: "TBD_PROD",
      os_version_id: "TBD_PROD",
      device_model_id: "TBD_PROD",
      area_of_concern_id: "TBD_PROD",
      account_no: "35310872274455",
    },
    ZENDESK_AUTH: {
      email: "Kapil.Kumar@cableone.biz",
      api_token: "3mslmxH8LUW4HOxEwu4exYDJVtESsrBmFImKCjPH",
    },
    ZENDESK_CHAT_KEY: "4DZVK5GTMjPKd6rXN0jDsc2iPDdwVLgC",
  },
  UAT: {
    URL: "https://customer.uat.sparklight.com/residential",
    SSO_LOGIN: "https://login.uat.cableone.net/auth/realms/external-sso-realm",
    API_BASEURL: "https://customer.uat.sparklight.com/apiWrapper/",
    API_SHOPPING_CART_BASEURL:
      "https://secure.uat.cableone.net/ShoppingCartBackBoneAPIWrapperDemo",
    API_ACP_BASEURL: "https://customer.uat.sparklight.com/apiWrapper/",
    MODEM_BASE_URL: "https://mule-gateway.cableone.net/customer-api",
    TRUCK_ROLL_BASE_URL:
      "https://adb-1771418802186593.13.azuredatabricks.net/model/lgb_model_fs/Staging/invocations",
    PAYMENTURL_V2:
      "https://payment.uat.sparklight.com/PortalsV2/PortalsPayment",
    URL_EASYPAY_SETUP_V2:
      "https://payment.uat.sparklight.com/PortalsV2/setup-auto-pay",
    URL_EASYPAY_MANAGE_V2:
      "https://payment.uat.sparklight.com/PortalsV2/manage-auto-pay",

    PAYMENTURL_V3:
      "https://payment.uat.sparklight.com/portalsV3-Demo/PortalsBiller/GetPostDataWithKey",
    URL_EASYPAY_SETUP_V3:
      "https://payment.uat.sparklight.com/portalsV3-Demo/activate-autopay",
    URL_EASYPAY_MANAGE_V3:
      "https://payment.uat.sparklight.com/portalsV3-Demo/manage-autopay",
    VIEW_BILLINGS: "https://customer.uat.sparklight.com/residential/billing",
    VIEW_PAYMENT:
      "https://customer.uat.sparklight.com/residential/billing/all-payments",
    BILLING_HISTORY:
      "https://customer.uat.sparklight.com/residential/billing/statement",
    PAY_METHOD:
      "https://payment.uat.sparklight.com/portalsV3-Demo/billing-payment",
    ACP_BILLING: "https://customer.uat.sparklight.com/portals/app-secure",
    encryptvalPassword: "1 0 7 2 8 3 3634",
    secretKey: "6LeG6bEUAAAAAM7vlsL7QL6xw2IFhvtbgbQng-za",
    PAYMENTURLNEW:
      "https://customer.uat.sparklight.com/portals/app-secure/billing",
    ZENDESK_FEEDBACK: {
      Url: "https://cableone1718812169.zendesk.com/api/v2/requests.json",
      ticket_form_id: "24297809981847",
      recipient: "24290572271767",
      assignee_id: "24290572766743",
      group_id: "360017953054",
      category_id: "24297731666839",
      feedbackValue_id: "24297761149335",
      email_id: "24297758328599",
      app_version_id: "33744205015191",
      platform_id: "33744206980503",
      os_version_id: "33744250028439",
      device_model_id: "33744244857239",
      area_of_concern_id: "33731342867479",
      account_no: "35310872274455",
    },
    ZENDESK_AUTH: {
      email: "Kapil.Kumar@cableone.biz",
      api_token: "3mslmxH8LUW4HOxEwu4exYDJVtESsrBmFImKCjPH",
    },
  },
};

export const ISUAT = false;

export const Env = ISUAT ? config.UAT : config.PRODUCTION;
