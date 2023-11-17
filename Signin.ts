// import React, {useEffect, useState} from 'react';
// import {NODE_ENV} from '@env';
// import WebView from 'react-native-webview';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import {Linking} from 'react-native';
// import {useRoute, RouteProp, useNavigation} from '@react-navigation/native';
// import {ActivityIndicator} from 'react-native-paper';
// import jwtDecode from 'jwt-decode';
// import {VStack} from '@react-native-material/core';
// import {asyncStoreSetWrapper} from 'asyncStorageWrappers';
// interface IClientAttrs {
//   id: string;
//   secret: string;
//   loginRedirectTo: URL;
//   logoutRedirectTo: URL;
//   scopes: string;
// }

// interface IRequestOptions {
//   method: string;
//   headers: Headers;
//   body: string;
//   redirect: string;
// }

// interface IKeycloakAuth {
//   keycloakBaseUrl: URL;
//   realmName: string;
//   clientAttrs: IClientAttrs;
// }

// interface IWebViewState {
//   url: string;
//   [key: string]: any;
// }

// function extractCodeFromUrl(url: string): string | null {
//   const regex = /[?&]code=([^&#]*)/i;
//   const match = regex.exec(url as string);
//   if (match) {
//     return decodeURIComponent(match[1]);
//   }
//   console.log('Could not retrive code from url: ' + url);
//   return null;
// }

// async function getAcessToken(
//   keycloakBaseUrl: URL,
//   realmName: string,
//   client: IKeycloakAuth['clientAttrs'],
//   code: string,
// ) {
//   const myHeaders: Headers = new Headers();
//   myHeaders.append('Content-Type', 'application/x-www-form-urlencoded');

//   const urlencoded: URLSearchParams = new URLSearchParams();
//   urlencoded.append('grant_type', 'authorization_code');
//   urlencoded.append('client_id', client.id);
//   urlencoded.append('client_secret', client.secret);
//   urlencoded.append('code', code.toString());
//   urlencoded.append(
//     'redirect_uri',
//     client.loginRedirectTo as unknown as string,
//   );

//   const requestOptions: IRequestOptions = {
//     method: 'POST',
//     headers: myHeaders,
//     body: (urlencoded as URLSearchParams).toString(),
//     redirect: 'follow',
//   };
//   try {
//     const response = await fetch(
//       `${keycloakBaseUrl}/realms/${realmName}/protocol/openid-connect/token`,
//       requestOptions,
//     );
//     const result = await response.json();
//     return result;
//   } catch (error) {
//     console.log('Could not receive access token: ', error);
//   }
// }
// type ParamList = {
//   KEYCLOAK: {
//     logout: boolean;
//   };
// };

// const KeycloakAuth = ({
//   keycloakBaseUrl,
//   realmName,
//   clientAttrs,
// }: IKeycloakAuth) => {
//   const {params}: RouteProp<ParamList, 'KEYCLOAK'> = useRoute();
//   const navigation = useNavigation();
//   const handleOnShouldStartLoadWithRequest = (event: any) => {
//     if (
//       event.url.startsWith(clientAttrs.loginRedirectTo as unknown as string) ||
//       event.url.startsWith(clientAttrs.logoutRedirectTo as unknown as string)
//     ) {
//       Linking.openURL(event.url);
//       return false;
//     } else {
//       return true;
//     }
//     //TODO: Remove this when deep links work properly
//   };
//   const handleWebViewStateChange = async (webViewState: IWebViewState) => {
//     if (params?.logout) {
//       return;
//     }
//     try {
//       //TODO: Improve error handling
//       const {url}: {url: string} = webViewState;

//       if (url && (url.startsWith('http://') || url.startsWith('https://'))) {
//         const code = extractCodeFromUrl(url);
//         if (code !== null) {
//           let authResponse;
//           authResponse = await getAcessToken(
//             keycloakBaseUrl,
//             realmName,
//             clientAttrs,
//             code,
//           );
//           if (NODE_ENV === 'production') {
//             console.info('Auth response from keycloak is :', authResponse);
//           }
//           await asyncStoreSetWrapper('keycloak', authResponse);
//           if (authResponse.id_token) {
//             const userInfo = jwtDecode(authResponse.id_token) as Record<
//               string,
//               any
//             >;
//             await asyncStoreSetWrapper('user', userInfo);
//           }
//         }
//       }
//     } catch (error) {
//       console.log('Error getting code: ', error);
//     }
//   };
//   const [authUrl, setAuthUrl] = useState<null | string>(null);

//   useEffect(() => {
//     const getAuthUrl = async () => {
//       let url;
//       if (params?.logout) {
//         url = getLogoutURL(keycloakBaseUrl, realmName, clientAttrs);
//       } else {
//         url = getLoginURL(keycloakBaseUrl, realmName, clientAttrs);
//       }
//       setAuthUrl(url);
//     };

//     getAuthUrl();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [params?.logout]);

//   if (authUrl === null) {
//     return (
//       <VStack style={{width: '100%', height: '100%'}}>
//         <ActivityIndicator animating={true} color="#990000" />
//       </VStack>
//     );
//   }
//   //not required as of now since idToke is being parsed to get user identity
//   // eslint-disable-next-line @typescript-eslint/no-unused-vars
//   const userInfoEndpoint = `${keycloakBaseUrl}/realms/${realmName}/protocol/openid-connect/userInfo`;

//   return (
//     <WebView
//       source={{
//         uri: authUrl as string,
//       }}
//       style={{flex: 1}}
//       onNavigationStateChange={handleWebViewStateChange}
//       javaScriptEnabled
//       sharedCookiesEnabled={true}
//       onShouldStartLoadWithRequest={handleOnShouldStartLoadWithRequest}
//     />
//   );
// };
// export default KeycloakAuth;

// function getLoginURL(
//   keycloakBaseUrl: URL,
//   realmName: string,
//   clientAttrs: IClientAttrs,
// ) {
//   const responseType = 'code'; // Use 'code' for Authorization Code flow
//   const authEndPoint = `${keycloakBaseUrl}/realms/${realmName}/protocol/openid-connect/auth`;
//   const authUrl = `${authEndPoint}?client_id=${
//     clientAttrs.id
//   }&redirect_uri=${encodeURIComponent(
//     clientAttrs.loginRedirectTo as unknown as string,
//   )}&response_type=${responseType}&scope=${encodeURIComponent(
//     clientAttrs.scopes,
//   )}`;
//   return authUrl;
// }

// function getLogoutURL(
//   keycloakBaseUrl: URL,
//   realmName: string,
//   clientAttrs: IClientAttrs,
// ) {
//   const authEndPoint = `${keycloakBaseUrl}/realms/${realmName}/protocol/openid-connect/logout`;
//   const authUrl = `${authEndPoint}?client_id=${
//     clientAttrs.id
//   }&post_logout_redirect_uri =${encodeURIComponent(
//     clientAttrs.logoutRedirectTo as unknown as string,
//   )}`;

//   return authUrl;
// }
