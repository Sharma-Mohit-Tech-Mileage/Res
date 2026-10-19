import {
  residentialNameParts,
  residentialCustomerName,
  businessCustomerName,
} from "../src/utils/customerName";

describe("residentialCustomerName", () => {
  it("uses first_name + last_name from the account details cache", () => {
    const account = { first_name: " Sherman ", last_name: "Smith" };
    const profile = { firstName: "Old", lastName: "Name", fullName: "Old Name" };
    expect(residentialCustomerName(account, profile)).toBe("Sherman Smith");
    expect(residentialNameParts(account, profile)).toEqual({ first: "Sherman", last: "Smith" });
  });

  it("falls back to the Profile API name when the cache has no name", () => {
    const profile = { firstName: "Jane", lastName: "Doe" };
    expect(residentialCustomerName({}, profile)).toBe("Jane Doe");
    expect(residentialCustomerName({ first_name: "", last_name: null }, profile)).toBe("Jane Doe");
  });

  it("falls back to fullName, then empty", () => {
    expect(residentialCustomerName(undefined, { fullName: " Jane Doe " })).toBe("Jane Doe");
    expect(residentialCustomerName(undefined, undefined)).toBe("");
  });
});

describe("businessCustomerName", () => {
  it("uses business_name from the account details cache", () => {
    expect(businessCustomerName({ business_name: "Acme LLC" }, { businessName: "Old Co" })).toBe("Acme LLC");
  });

  it("falls back to the business name saved at login", () => {
    expect(businessCustomerName({ business_name: " " }, { businessName: "Old Co" })).toBe("Old Co");
    expect(businessCustomerName(undefined, undefined)).toBe("");
  });
});
