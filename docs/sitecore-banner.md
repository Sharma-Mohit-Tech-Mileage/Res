# Sitecore offer banner

Home (`WelcomeCard`, behind `DASHBOARD_NEW_LAYOUT`) and the mobile landing page (`MobilePromo`, behind `DASHBOARD_SPARKLIGHT_MOBILE_SECTION`) share `SitecoreBanner`. Existing screen eligibility and legacy flag-disabled content are retained.

The request appends `api/Sitecore/Banner` to the selected build's `API_ACP_BASEURL`:

| Environment | Configured base URL                                   |
| ----------- | ----------------------------------------------------- |
| Development | https://customer.uat.cableone.net/apiWrapper/         |
| Staging     | https://customer.uat.sparklight.com/apiWrapper/       |
| Production  | https://publicservices.sparklight.com/Portalservices/ |

These values already exist in `.env.development`, `.env.staging`, and `.env.production`. The banner does not pin other builds to the development API. Environment selection follows the existing react-native-config build setup.

`eyebrow`, `headline`, `ctaLabel`, and `disclaimer` supply all displayed offer copy. `ctaLink` supplies the HTTP(S) destination. CTA and media fields support JSON-encoded objects or objects. `tabletViewImage` supplies the background on all devices. `backgroundImagePhone` supplies a separate phone image rendered with contain scaling in a 36% column opposite the text: Left text places the phone on the right; Right text places it on the left. Center text defaults the phone to the right. Alignment ignores casing and surrounding spaces. Missing or failed layers are handled independently. CMS background artwork should omit the phone, text, and CTA because those are rendered separately by the app.

`textTheme: Light` uses purple (`#79246C`) headline and eyebrow text and a purple button with white lettering. `Dark` uses white (`#FFFFFF`) headline and eyebrow text and a white button with purple lettering. These colors apply to the default CMS presentation. The CMS author selects the theme; the app does not sample image pixels. `textAlignment` positions the content column (Left, Center, or Right); copy and CTA follow the same Left, Center, or Right alignment. The disclaimer remains dark on the page below the artwork.

Content refreshes on screen focus and app foreground. Inactive/empty banners hide the banner. API failures (including timeouts) show the static offer from `Prod_Release_Sep_28_2026` for the corresponding Home or mobile landing placement, including its artwork, copy, CTA destination and disclaimer. A subsequent successful refresh replaces the fallback with CMS content. Missing or failed images retain a contrasting solid background. Missing/invalid CTA destinations omit the button; failed navigation shows an inline message.

Validation: Focused tests cover environment URLs, field mapping, themes, alignment, tablet media, CTA navigation, refreshes, and failures. Component compilation checks also pass. Live CMS publishing and phone/tablet visual verification remain UAT checks: publish an edit, return to Home, and confirm it appears without rebuilding. Verify theme/artwork combinations and long text at enlarged accessibility sizes on both devices.

Artwork fills the banner using proportional cover scaling, which crops edges when its aspect ratio differs from the card. No panel obscures the artwork. Theme and alignment must match the chosen CMS background. Configure `textAlignment: Right` to place the separate phone on the left, or Left to place it on the right. The app does not infer or override editorial placement from image pixels.

The purple reference with a left-side phone requires purple background-only media plus `textAlignment: Right` and `textTheme: Dark`. A reference JPEG containing text and a button cannot be used as background media without duplicating CMS-rendered content.

Home and the mobile landing placement explicitly select `presentation="phone-left-white"` to match the final approved white-background reference. This presentation honors CMS alignment and theme: Light artwork uses a blue headline, purple eyebrow and purple CTA; Dark artwork uses white copy and a white CTA with purple lettering. Copy, media, CTA destination, active state and disclaimer remain CMS-driven. The default shared component still supports CMS-controlled theme/alignment.

The phone-left-white presentation uses cover scaling without zoom or translation, with a minimum height based on the selected phone/tablet artwork proportions. Its CMS-selected content column stays in normal layout flow, allowing wrapped text and the CTA to increase the card height. Phone typography is reduced to fit the composition; the headline is blue, the eyebrow purple, and the CTA purple with white text.

In the reference presentation, Right places the content in the right column with a shared left edge for copy and CTA, matching the supplied composition. Spacing scales from the reference artwork dimensions. Typography uses fixed device styles in every alignment: mobile eyebrow 16 semibold, headline 20 bold, CTA 18 semibold; tablet (window width >= 768) eyebrow 18 semibold, headline 28 bold, CTA 20 semibold. Font sizes use React Native logical units and retain accessibility font scaling.

The CTA fits its label with horizontal padding and uses the same 48-point minimum height and 8-point vertical padding as dashboard feature buttons. It has no artwork-scaled width or height.
