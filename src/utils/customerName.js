const clean = (value) => (typeof value === "string" ? value.trim() : "");

// Residential name from the account details cache (ACSR), falling back to the Profile API name.
export const residentialNameParts = (accountDetails, profileDetails) => {
  const first = clean(accountDetails?.first_name);
  const last = clean(accountDetails?.last_name);
  if (first || last) return { first, last };
  return { first: clean(profileDetails?.firstName), last: clean(profileDetails?.lastName) };
};

export const residentialCustomerName = (accountDetails, profileDetails) => {
  const { first, last } = residentialNameParts(accountDetails, profileDetails);
  return `${first} ${last}`.trim() || clean(profileDetails?.fullName);
};

// Business name from the account details cache (ACSR), falling back to the name saved at login.
export const businessCustomerName = (accountDetails, userInfo) =>
  clean(accountDetails?.business_name) || clean(userInfo?.businessName);
