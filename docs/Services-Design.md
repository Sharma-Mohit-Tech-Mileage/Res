# Services design reference

The native application uses `src/styles/theme.js`, `AppStyles.js`, and React Native StyleSheet compositions. `styles/services.css` records the equivalent CSS tokens for web handoff.

| Design role | Native token | Value |
| --- | --- | --- |
| Secondary Surface | secondarySurface | #F8F8F8 |
| Purple Bright | purpleBright | #8D3B90 |
| Blue Bright | blueBright | #00B8D8 |
| Gray Medium | grayMedium | #4C5458 |
| Download/upload panel | speedPanel | #8D3B900C |

The speed panel retains the Internet plan card's Purple Bright at 12/255 opacity (about 4.7%) over white, approximately #FAF6FA. The Internet plan, Manage Equipment WiFi/Modem tabs, and modem speed results all reuse `cards/SpeedBanner.js`, including the same black values, Mbps units, purple icon labels, border, divider, and background. Only outer screen spacing differs.

Card icon badges, usage billing/remaining tiles, usage tab tracks and controls, equipment badges, and speed information/progress banners use Secondary Surface. Selected tabs remain white; both labels use Purple Bright. Remaining data uses solid Blue Bright.

Landing service headings use Field title. Modem Help uses H2 and Section title headings; links keep the content's 16px size and standard hyperlink styling. Modem Help and the security-question dropdown use the same close icon. Buttons and close controls retain at least 48dp touch targets. Reboot menus have 16px vertical padding. Reboot confirmation and failure banners use NotificationAlert with 16px title separation. Cancel uses the standard underlined action; Modem Help is centered with a leading help icon.

Rebooting uses a gray loading ring with a purple segment and stationary “Rebooting” label. Speed tests use a two-tone purple loader, standard success/error banners, a compact refresh hint, and a gray disabled action with dark text.

WiFi Test Speed opens https://cableone.speedtestcustom.com in an in-app WebView, with load failure and retry handling. Learn More opens the supplied Sparklight speed-test support article.

Modem speed/reboot remain existing UI previews when no service callback is supplied. Modem speed accepts `onRunSpeedTest`, with download/upload results or a rejected promise for failure; no live modem API is added. Supplied SVG artwork is preserved in the six `*ServiceIcon.js` components. Layout is based on the supplied screenshots; no native Figma file was provided.
