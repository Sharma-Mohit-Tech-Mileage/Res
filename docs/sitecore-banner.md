# Sitecore offer banner

Home (`WelcomeCard`, behind `DASHBOARD_NEW_LAYOUT`) and the mobile landing page (`MobilePromo`, behind `DASHBOARD_SPARKLIGHT_MOBILE_SECTION`) share `SitecoreBanner`. Existing screen eligibility and legacy flag-disabled content are retained.

The request appends `api/Sitecore/Banner` to the selected build's `API_ACP_BASEURL`:

| Environment | Configured base URL |
| --- | --- |
| Development | https://customer.uat.cableone.net/apiWrapper/ |
| Staging | https://customer.uat.sparklight.com/apiWrapper/ |
| Production | https://publicservices.sparklight.com/Portalservices/ |

These values already exist in `.env.development`, `.env.staging`, and `.env.production`. The banner does not pin other builds to the development API. Environment selection follows the existing react-native-config build setup.

`eyebrow`, `headline`, `ctaLabel`, and `disclaimer` supply all displayed offer copy. `ctaLink` supplies the HTTP(S) destination. CTA and media fields support JSON-encoded objects or objects. Phone windows use `backgroundImagePhone`; tablet windows (768 points and wider) use `tabletViewImage`, with fallback to the other media field when absent. CMS media should contain background artwork only, because text and the CTA are rendered by the app.

`textTheme: Light` uses white text and a white button with purple lettering for dark artwork. `Dark` uses a purple eyebrow, blue headline, and purple button with white lettering for light artwork. The CMS author selects the theme; the app does not sample image pixels. `textAlignment` positions the content column (Left, Center, or Right); side columns use left-aligned copy and CTA, while Center centers both. The disclaimer remains dark on the page below the artwork.

Content refreshes on screen focus and app foreground. Inactive/empty banners and API failures hide the banner. Missing or failed images retain a contrasting solid background. Missing/invalid CTA destinations omit the button; failed navigation shows an inline message.

Validation: 13 focused tests cover environment URLs, field mapping, themes, alignment, tablet media, CTA navigation, refreshes, and failures. Component compilation checks also pass. Live CMS publishing and phone/tablet visual verification remain UAT checks: publish an edit, return to Home, and confirm it appears without rebuilding. Verify theme/artwork combinations and long text at enlarged accessibility sizes on both devices.

Artwork fills the banner using proportional cover scaling, which crops edges when its aspect ratio differs from the card. No panel obscures the artwork. Theme and alignment must match the chosen CMS image. For the supplied white artwork with a phone on the left, configure `textAlignment: Right` and `textTheme: Dark`; use Left with artwork whose open text area is on the left. The app does not infer or override editorial placement from image pixels.

The purple reference with a left-side phone requires purple background-only media plus `textAlignment: Right` and `textTheme: Light`. A reference JPEG containing text and a button cannot be used as background media without duplicating CMS-rendered content.

Home and the mobile landing placement explicitly select `presentation="phone-left-white"` to match the final approved white-background reference. This takes precedence over CMS theme/alignment for these placements: right-side content with dark text and a purple CTA. Copy, media, CTA destination, active state and disclaimer remain CMS-driven. The default shared component still supports CMS-controlled theme/alignment.
