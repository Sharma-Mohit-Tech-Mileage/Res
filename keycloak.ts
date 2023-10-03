import { RNKeycloak } from '@react-keycloak/native';

// Setup Keycloak instance as needed
// Pass initialization options as required
const keycloak = new RNKeycloak({
  url: 'https://customer.uat.sparklight.com/SecureLogin/login.aspx',
  realm: 'kc-realm',
  clientId: 'web-portal',
});

export default keycloak;