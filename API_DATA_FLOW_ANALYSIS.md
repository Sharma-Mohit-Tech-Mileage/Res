# API Data Flow & Call Analysis — Sparklight Residential App

---

## 1. GETTOKEN API (`api/mobile/gettoken`)

### 1.1 Where It's Called

| # | File | Function | Trigger |
|---|------|----------|---------|
| 1 | `splash/SplashScreen.js` | `callSSOLoginApi()` | After SSO login/authorize |
| 2 | `user/SplashScreen.js` | `callSSOLoginApi()` | After SSO authorize/refresh |
| 3 | `user/Session.js` | `retryRequest()` inside `RefreshToken()` | On 401 / token expired (up to 2 retries) |

### 1.2 Request Payload

```
{
  idToken:      SSO ID token
  accessToken:  SSO access token
  idTokenGuid:  session_state from SSO additionalParameters
  refreshToken: SSO refresh token
}
```

### 1.3 Response Structure

```
{
  jwtToken:      string    → JWT for API authorization
  userInfo: {
    accountNumber:            string
    userName:                 string
    authLevel:                string   ("HeadOfHousehold", "Admin", etc.)
    customerType:             string   ("COM" = business, "RES" = residential)
    acctStatus:               string   ("ACTIVE", "DISCONNECT", "VOLUNTARY DISC", etc.)
    daysSinceDisconnectDate:  number | null
    pending_activation:       boolean
    mobileTCAcceptanceFlag:   boolean
    email:                    string
  }
  idTokenGuid:   string    → Session state GUID
  refreshToken:  string    → For future SSO refresh
  custServices:  object    → Customer services data
}
```

### 1.4 How Data Is Stored

| Storage | Key | Object Shape |
|---------|-----|-------------|
| **AsyncStorage** | `resi_user` | `{ userInfo, token, tokenGuid, refreshToken, idToken, jwtTimestamp, idTokenTimestamp }` |
| **AsyncStorage** | `idToken` | `{ idToken, accessToken, idTokenGuid, refreshToken }` |
| **Redux** | `state.user.userData` | Same as `resi_user` object |

### 1.5 Field Consumption Map

| Field | Where Used | Purpose |
|-------|-----------|---------|
| `token` (jwtToken) | `RestApiClient.js` — every API request | Bearer token in Authorization header |
| `token` | `AutoPayPCIConnector`, `ArticalWindowUtility` | Injected into WebView localStorage |
| `userInfo.accountNumber` | All service files (`billings.service`, `profile.service`, `payments.service`, etc.) | URL parameter for account-specific endpoints |
| `userInfo.userName` | `SplashScreen` (analytics), push notifications, local storage key | User identification |
| `userInfo.acctStatus` | `SplashScreen` — `shouldBlockLogin()` | Block login for disconnected accounts |
| `userInfo.customerType` | `SplashScreen` | Block "COM" (business) users |
| `userInfo.authLevel` | `SplashScreen` | Only allow "HeadOfHousehold" |
| `userInfo.mobileTCAcceptanceFlag` | `SplashScreen` | Route to Terms page if `false` |
| `userInfo.pending_activation` | `NewBillerHome` | Show/hide Mobile Pilot section |
| `userInfo.daysSinceDisconnectDate` | `SplashScreen`, Home, ProfileSettings | Block login if >90 days |
| `refreshToken` | `Session.js` — `RefreshToken()` | Obtain new SSO tokens |
| `idToken` | `AutoPayPCIConnector`, `ArticalWindowUtility` | Cookie injection in WebView |
| `jwtTimestamp` | `Session.js`, WebView components | Token age calculation |
| `idTokenTimestamp` | `Session.js`, WebView components | Token age calculation |
| `tokenGuid` | Stored for session correlation | Audit/tracking |

### 1.6 Token Lifecycle

```
Login → SSO authorize() → POST gettoken → Store user → App navigates

API returns 401 → Session.RefreshToken() called
  → SSO refresh() with stored refreshToken
  → POST gettoken with new SSO tokens
  → Update stored user + Redux
  → Retry failed request with new JWT

Logout → clearAuthCookies() → cleanUserData() → Navigate to Splash
```

---

## 2. ACCOUNT API (`api/Accounts/GetAccountDetails`)

### 2.1 Endpoint Details

| Property | Value |
|----------|-------|
| **Endpoint** | `api/Accounts/GetAccountDetails` |
| **Method** | POST |
| **Service File** | `network/apis/account/profile.service.js` |
| **Redux Action** | `fetchACPUserAccountDetails()` |
| **Saga** | `fetchACPUserAccountDetailsSaga()` (uses `takeLeading`) |
| **Redux State** | `state.profile.accountDetails` |

### 2.2 Request Payload

```javascript
{
  accountNumber: "<from stored user>",
  fieldList: [
    "first_name", "last_name", "current_balance",
    "past_due_amount", "payment_due_date", "services",
    "email", "customer_type", "account_status",
    "days_since_disconnect_date", "legacy_brand_by_spa",
    "bill_to_address", "service_address",
    "homes_passed_id", "hierarchy"
  ]
}
```

### 2.3 Response Fields & Where They're Used

| Field | Used In | Purpose |
|-------|---------|---------|
| `current_balance` | BillingScreen | Display balance when no past due |
| `past_due_amount` | NewBillerHome, BillingScreen | Bill amount, urgency display |
| `payment_due_date` | NewBillerHome, BillingScreen | Due date formatted with moment("ll") |
| `payment_due_amount` | NewBillerHome | Dashboard bill card |
| `services` (`{ hsd, video, phone }`) | MyServices | Show/hide Internet, Video, Phone cards |
| `email` | Notifications, EmailNotification | Primary email via `getPrimaryEmail()` |
| `account_status` | Home — `isAccountDisconnected()` | Disconnect banner logic |
| `days_since_disconnect_date` | Home | Disconnect banner display |
| `legacy_brand_by_spa` | MyServices | Brand-specific display |
| `service_address` | MyServices | ZIP code extraction |
| `phoneNumber` | Notifications | SMS notification setup |
| `isAdmin` | Notifications | Email permission checks |
| `first_name`, `last_name` | (Available but not directly displayed from this API) | — |

### 2.4 Screen-by-Screen Call Tracking

| # | Screen | File | Trigger | When It Fires |
|---|--------|------|---------|---------------|
| 1 | **Home** | `NewBillerHome.js` | `useFocusEffect` | Every time Home tab gains focus |
| 2 | **Billing** | `BillingScreen.js` | `useFocusEffect` | Every time Billing screen gains focus |
| 3 | **Notifications** | `Notifications.js` | `useFocusEffect` | Every time Notifications screen gains focus |
| 4 | **Email Notification** | `EmailNotification.js` | `route.params?.updateSuccess` | After successful email update only |

### 2.5 Call Frequency During User Flows

| User Flow | # of Account API Calls | Details |
|-----------|----------------------|---------|
| **App Launch → Home** | 1 | Home `useFocusEffect` |
| **Home → Billing** | 1 | Billing `useFocusEffect` |
| **Billing → Home** | 1 | Home `useFocusEffect` fires again (REDUNDANT) |
| **Home → Notifications** | 1 | Notifications `useFocusEffect` |
| **Notifications → Home** | 1 | Home `useFocusEffect` fires again (REDUNDANT) |
| **Home → Billing → Home → Billing** | 4 | Each focus = 1 call (ALL REDUNDANT after first) |
| **Update email → Back to Notifications** | 2 | 1 on email update success + 1 on refocus |

### 2.6 Saga Side Effects

After `GetAccountDetails` returns, the saga also calls:
- `isPaperlessEnabled(email, signal)` → dispatches `setPaperlessStatus()`
- So each Account API call = **2 network requests** (GetAccountDetails + IsPaperless)

### 2.7 Redundancy Issues

| Issue | Impact | Recommendation |
|-------|--------|----------------|
| Every screen re-fetches on focus | 2 API calls per screen visit | Add timestamp check — skip if data <60s old |
| Home ↔ Billing round-trip = 2 redundant calls | Unnecessary network + battery | Use cached Redux state if fresh |
| No data freshness strategy | Always hits API even when data hasn't changed | Add `lastFetchedAt` timestamp to Redux state |

---

## 3. PROFILE API (`api/profile/{accountNumber}`)

### 3.1 Endpoint Details

| Property | Value |
|----------|-------|
| **Endpoint** | `api/profile/{accountNumber}` |
| **Method** | GET |
| **Service File** | `network/apis/account/profile.service.js` |
| **Redux Action** | `fetchProfileDetails()` |
| **Redux State** | `state.profile.profileDetails` |

### 3.2 Response Fields & Where They're Used

| Field | Used In | Purpose |
|-------|---------|---------|
| `fullName` | AccountOverview, ProfileSettings | User greeting, display name |
| `firstName` | ProfileSettingsEdit | Pre-populate edit form |
| `lastName` | ProfileSettingsEdit | Pre-populate edit form |
| `userName` | ProfileSettings | Display username |
| `accountNumber` | ProfileSettings | Display account number |
| `memberType` | ProfileSettings | Display membership type |
| `email` | ProfileSettingsEdit | Pre-populate edit form |
| `multipleEmails` | ProfileSettingsEdit | Secondary email management |
| `securityQuestion` | PasswordSecurity, PasswordSecurityEdit | Display/edit security question |
| `securityAnswer` | PasswordSecurityEdit | Edit security answer |

### 3.3 Screen-by-Screen Call Tracking

| # | Screen | File | Trigger | When It Fires |
|---|--------|------|---------|---------------|
| 1 | **Tab Navigation** | `MyTab.js` | `useFocusEffect` | **EVERY time any tab gains focus** |
| 2 | **Account Overview** | `AccountOverview.js` | `useEffect([], [])` | On component mount |
| 3 | **Profile Settings** | `ProfileSettings.js` | `route.params?.updateSuccess` | After successful profile update |
| 4 | **Password Security** | `PasswordSecurity.js` | `useEffect([], [])` + `route.params?.updateSuccess` | On mount (ALWAYS) + after update |

### 3.4 Call Frequency During User Flows

| User Flow | # of Profile API Calls | Details |
|-----------|----------------------|---------|
| **Login → Home** | 1 | MyTab `useFocusEffect` fires |
| **Switch any tab** | 1 | MyTab `useFocusEffect` fires again |
| **Home → Account** | 2 | MyTab focus (1) + AccountOverview mount (1) — REDUNDANT |
| **Account → Profile Settings** | 0 | Reads from Redux, no new call |
| **Profile Settings → Edit → Save → Back** | 1 | `updateSuccess` triggers refresh |
| **Account → Password Security** | 1 | Mount useEffect — REDUNDANT (MyTab already fetched) |
| **Rapid tab switching (4 tabs)** | 4 | Each tab focus = 1 call — ALL REDUNDANT |

### 3.5 Profile Update Endpoints

| Action | Endpoint | Method | Trigger |
|--------|----------|--------|---------|
| Edit Profile | `api/profile` | PUT | User saves profile edits |
| Change Password | `api/profile` | PUT | User saves new password |
| Update Security Q | `api/profile` | PUT | User saves security question |
| Accept T&C | `api/Mobile/UpdateMobileAspnetUserData` | PUT | User accepts terms |

### 3.6 Redundancy Issues

| Issue | Impact | Recommendation |
|-------|--------|----------------|
| **MyTab.js calls on EVERY tab focus** | Profile API hit on every tab switch | Move to app startup only + refresh after updates |
| **AccountOverview.js calls on mount** | Overlaps with MyTab call | Remove — already fetched by MyTab |
| **PasswordSecurity.js calls unconditionally** | Always fetches even if just navigated from Account | Remove mount fetch — use Redux state |
| **4 tab switches = 4 API calls** | Massive redundancy | Debounce or add freshness check |

---

## 4. RELATED API CALLS SUMMARY

### 4.1 Other Profile-Related APIs

| API | Endpoint | Called From | Trigger |
|-----|----------|------------|---------|
| Fetch User List | `api/account/{acct}/users` | ProfileSaga | With profile fetch |
| Fetch SMS Prefs | `api/SMS/sms?AccountNumber={acct}` | Terms.jsx, Notifications | Screen mount/focus |
| Fetch Push Prefs | `api/mobilenotificationpreferences/...` | Terms.jsx, Notifications | Screen mount/focus |
| Paperless Status | `account/api/account/{acct}/paperless/status` | ProfileSaga | After account details fetch |
| IsPaperless | `api/Paperless/IsPaperless?account={acct}&email={email}` | ProfileSaga | After account details fetch |
| All SV Emails | `api/email/{acct}/GetAllSVEmails` | EmailNotification | Email management screen |

### 4.2 Notifications Screen — Triple Call Problem

When Notifications screen gains focus, **3 API calls** fire simultaneously:

```
useFocusEffect fires:
  ├─ dispatch(fetchACPUserAccountDetails())     ← Redux saga
  ├─ getInAppNotificationsData()                ← Direct API (GetApiRequest)
  └─ getTextNotificationsData()                 ← Direct API (GetApiRequest)
```

**Issue**: Mixed Redux and direct API patterns. InApp and Text notification data is fetched directly bypassing Redux, so it's not cached or shareable.

---

## 5. OVERALL CALL FLOW — TYPICAL USER SESSION

```
┌─────────────────────────────────────────────────────────┐
│ APP LAUNCH                                              │
│                                                         │
│  SSO Login → POST gettoken → Store user                 │
│  Navigate to Home                                       │
│    ├─ MyTab focus     → fetchProfileDetails()      [1]  │
│    ├─ NewBillerHome   → fetchACPUserAccountDetails  [2] │
│    │                  → checOutagStatus()            [3] │
│    │                  → getStatus() (AutoPay)        [4] │
│    └─ Zendesk login                                 [5] │
│                                                         │
│  Total API calls on app start: 5+                       │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│ USER TAPS BILLING TAB                                   │
│                                                         │
│    ├─ MyTab focus     → fetchProfileDetails()      [1]  │
│    ├─ BillingScreen   → fetchACPUserAccountDetails  [2] │
│    │                  → getStatus() (AutoPay)        [3] │
│                                                         │
│  Total: 3 calls (Profile + Account are REDUNDANT)       │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│ USER TAPS ACCOUNT TAB → NOTIFICATIONS                   │
│                                                         │
│    ├─ MyTab focus        → fetchProfileDetails()   [1]  │
│    ├─ AccountOverview    → fetchProfileDetails()   [2]  │  ← REDUNDANT
│    │                                                    │
│    │  User taps Notifications:                          │
│    ├─ Notifications      → fetchACPUserAccountDetails [3]│
│    │                     → getInAppNotifData()     [4]  │
│    │                     → getTextNotifData()      [5]  │
│                                                         │
│  Total: 5 calls (2 are redundant Profile calls)         │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│ USER GOES BACK TO HOME                                  │
│                                                         │
│    ├─ MyTab focus     → fetchProfileDetails()      [1]  │  ← REDUNDANT
│    ├─ NewBillerHome   → fetchACPUserAccountDetails  [2] │  ← REDUNDANT
│    │                  → checOutagStatus()            [3] │
│    │                  → getStatus()                  [4] │
│                                                         │
│  Total: 4 calls (2 are completely redundant)            │
└─────────────────────────────────────────────────────────┘
```

---

## 6. OPTIMIZATION OPPORTUNITIES

### 6.1 High-Priority — Eliminate Redundant Calls

| Change | Files | Impact |
|--------|-------|--------|
| **Remove `fetchProfileDetails` from MyTab `useFocusEffect`** | `MyTab.js` | Eliminates 1 call per tab switch. Fetch on app start only + after updates. |
| **Remove `fetchProfileDetails` from AccountOverview mount** | `AccountOverview.js` | Overlaps with MyTab. Use Redux state. |
| **Remove unconditional fetch from PasswordSecurity mount** | `PasswordSecurity.js` | Only fetch after `updateSuccess`, not on every mount. |
| **Add freshness check to Account API calls** | `NewBillerHome.js`, `BillingScreen.js`, `Notifications.js` | Skip fetch if data is <60s old. Add `lastFetchedAt` to Redux. |

### 6.2 Medium-Priority — Consolidate Patterns

| Change | Files | Impact |
|--------|-------|--------|
| **Move notification data into Redux** | `Notifications.js` | Replace direct `getInAppNotificationsData()` / `getTextNotificationsData()` with Redux actions — data becomes cacheable & shareable |
| **Combine Account + Profile fetch** | Saga layer | If both are needed on Home, combine into single dispatch that does both, reducing re-render cycles |

### 6.3 Proposed Data Freshness Strategy

```javascript
// In Redux reducer
case SAVE_ACP_USER_ACCOUNT_DETAILS:
  return {
    ...state,
    accountDetails: action.payload,
    accountDetailsFetchedAt: Date.now(),  // ← Add timestamp
  };

// In component
const STALE_THRESHOLD = 60000; // 60 seconds
const isFresh = accountDetailsFetchedAt && (Date.now() - accountDetailsFetchedAt < STALE_THRESHOLD);

useFocusEffect(useCallback(() => {
  if (!isFresh) {
    dispatch(fetchACPUserAccountDetails());
  }
}, [isFresh]));
```

### 6.4 Estimated Call Reduction

| Scenario | Current Calls | After Optimization | Savings |
|----------|--------------|-------------------|---------|
| App start → Home | 5 | 5 | 0% (all necessary) |
| Home → Billing → Home | 7 | 2 | **71%** |
| Home → Account → Notifications → Home | 10 | 4 | **60%** |
| 4 tab round-trip | 16+ | 5 | **69%** |

---

## 7. GLOBAL DATA AVAILABILITY (Redux Store Snapshot)

```
state
├── user
│   └── userData
│       ├── token            ← JWT for all API calls
│       ├── userInfo
│       │   ├── accountNumber
│       │   ├── userName
│       │   ├── acctStatus
│       │   ├── customerType
│       │   ├── authLevel
│       │   └── ...
│       ├── refreshToken
│       ├── idToken
│       ├── jwtTimestamp
│       └── idTokenTimestamp
│
├── profile
│   ├── profileDetails       ← From api/profile/{acct}
│   │   ├── fullName
│   │   ├── firstName / lastName
│   │   ├── userName
│   │   ├── email
│   │   ├── securityQuestion
│   │   └── memberType
│   │
│   ├── accountDetails       ← From api/Accounts/GetAccountDetails
│   │   ├── current_balance
│   │   ├── past_due_amount
│   │   ├── payment_due_date
│   │   ├── services { hsd, video, phone }
│   │   ├── email
│   │   ├── account_status
│   │   └── service_address
│   │
│   ├── smsSubscription      ← From api/SMS/sms
│   ├── pushNotifications    ← From notification preferences API
│   ├── paperlessStatusAcp   ← From IsPaperless API
│   ├── userList             ← From api/account/{acct}/users
│   └── allSvEmailAssociated ← From GetAllSVEmails
│
└── (billing, dashboard, etc. — separate reducers)
```

All this data is globally available via `useSelector()`. Most screens don't need to re-fetch — they can read from Redux if data is fresh.
