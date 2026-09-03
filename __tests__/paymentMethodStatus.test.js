jest.mock("../src/config/Remoteconfigmanager", () => ({
  getFeatureFlag: (_key, fallback) => fallback,
  subscribeToFeatures: () => () => {},
}));
jest.mock("../src/network/apis/account/paymentMethods.service", () => ({ calculateFee: jest.fn() }));

import { isMethodInactive, isMethodUnusable, isMethodExpired } from "../src/components/billing/payments/paymentsShared";

const FUNDING_ACCOUNTS = [
  { id: "496587563", status: "deleted", nickname: null, account_holder_name: "WEBTEAM ALLTHREE" },
  { id: "483872778", status: "deleted", nickname: null, account_holder_name: "THE WEBTEAM ALLTHREE" },
  { id: "494090148", status: "deleted", nickname: null, account_holder_name: "Sumanth" },
  { id: "364129668", status: "deleted", nickname: null, account_holder_name: "THE WEBTEAM ALLTHREE" },
  { id: "466427033", status: "deleted", nickname: null, account_holder_name: "THE WEBTEAM ALLTHREE" },
  { id: "428549078", status: "inactive", nickname: "Test", account_holder_name: "WEBTEAM D'ALLTHREE" },
  { id: "321622928", status: "deleted", nickname: "Stephen's Visa", account_holder_name: "Stephen A Hankerson" },
  { id: "431750968", status: "inactive", nickname: "Test1", account_holder_name: "WEBTEAM D'ALLTHREE" },
  { id: "435519368", status: "deleted", nickname: null, account_holder_name: "WEBTEAM D'ALLTHREE" },
  { id: "428558003", status: "inactive", nickname: "Testing", account_holder_name: "WEBTEAM D'ALLTHREE" },
];

const visible = (list) => list.filter((m) => m.id && m.status !== "deleted");

describe("funding account visibility matches the portal", () => {
  it("hides deleted and keeps inactive", () => {
    const shown = visible(FUNDING_ACCOUNTS);
    expect(shown).toHaveLength(3);
    expect(shown.map((m) => m.nickname)).toEqual(["Test", "Test1", "Testing"]);
  });

  it("would have shown nothing under the old active-only filter", () => {
    expect(FUNDING_ACCOUNTS.filter((m) => m.status === "active")).toHaveLength(0);
  });

  it("keeps a status the API has not used yet, rather than dropping it silently", () => {
    const future = [{ id: "1", status: "suspended" }, { id: "2", status: "deleted" }];
    expect(visible(future).map((m) => m.id)).toEqual(["1"]);
  });
});

describe("isMethodInactive", () => {
  it("is true for any non-active status", () => {
    expect(isMethodInactive({ status: "inactive" })).toBe(true);
    expect(isMethodInactive({ status: "suspended" })).toBe(true);
  });

  it("is false for active, and for a method with no status at all", () => {
    expect(isMethodInactive({ status: "active" })).toBe(false);
    expect(isMethodInactive({})).toBe(false);
    expect(isMethodInactive(null)).toBe(false);
  });
});

describe("isMethodUnusable", () => {
  const activeCard = { status: "active", type: "card", expiry: "12/40" };

  it("blocks an inactive bank account even though it can never expire", () => {
    const bank = { status: "inactive", type: "bank", expiry: "" };
    expect(isMethodExpired(bank)).toBe(false);
    expect(isMethodUnusable(bank)).toBe(true);
  });

  it("blocks an expired card that is still active", () => {
    expect(isMethodUnusable({ status: "active", type: "card", expiry: "01/20" })).toBe(true);
  });

  it("allows an active, unexpired method", () => {
    expect(isMethodUnusable(activeCard)).toBe(false);
  });
});

describe("PaymentMethodCard actions", () => {
  const React = require("react");
  const renderer = require("react-test-renderer");
  const PaymentMethodCard = require("../src/components/billing/payments/PaymentMethodCard").default;

  const textOf = (tree) => JSON.stringify(tree.toJSON());

  const render = (method) =>
    renderer.create(
      React.createElement(PaymentMethodCard, {
        method,
        variant: "actions",
        onEdit: () => {},
      })
    );

  it("offers Edit on an inactive bank account", () => {
    const tree = render({ id: "1", status: "inactive", type: "bank", lastFour: "1987", nickname: "Test" });
    expect(textOf(tree)).toContain("Edit");
    expect(textOf(tree)).toContain("Inactive");
  });

  it("offers Edit on an expired card — the case that used to hide it", () => {
    const tree = render({ id: "2", status: "active", type: "card", expiry: "01/20", lastFour: "9954" });
    expect(textOf(tree)).toContain("Edit");
    expect(textOf(tree)).toContain("Expired");
  });

  it("offers Edit on an active method", () => {
    const tree = render({ id: "3", status: "active", type: "card", expiry: "12/40", lastFour: "1234" });
    expect(textOf(tree)).toContain("Edit");
  });

  it("shows one badge only when a method is both expired and inactive", () => {
    const tree = render({ id: "4", status: "inactive", type: "card", expiry: "01/20", lastFour: "5555" });
    const json = textOf(tree);
    expect(json).toContain("Expired");
    expect(json).not.toContain("Inactive");
    expect(json).toContain("Edit");
  });
});

describe("Delete visibility", () => {
  const React = require("react");
  const renderer = require("react-test-renderer");
  const PaymentMethodCard = require("../src/components/billing/payments/PaymentMethodCard").default;

  const textOf = (tree) => JSON.stringify(tree.toJSON());

  const render = (method, showAutoPayBadge = false) =>
    renderer.create(
      React.createElement(PaymentMethodCard, {
        method,
        variant: "actions",
        showAutoPayBadge,
        onEdit: () => {},
        onDelete: () => {},
      })
    );

  it("hides Delete on an inactive method and shows the Inactive badge instead", () => {
    const json = textOf(render({ id: "1", status: "inactive", type: "bank", lastFour: "1987" }));
    expect(json).not.toContain("Delete");
    expect(json).toContain("Inactive");
    expect(json).toContain("Edit");
  });

  it("keeps Delete on an active method", () => {
    const json = textOf(render({ id: "2", status: "active", type: "card", expiry: "12/40", lastFour: "1234" }));
    expect(json).toContain("Delete");
  });

  it("keeps Delete on an expired but active method — only inactive loses it", () => {
    const json = textOf(render({ id: "3", status: "active", type: "card", expiry: "01/20", lastFour: "9954" }));
    expect(json).toContain("Delete");
    expect(json).toContain("Expired");
  });

  it("still hides Delete on the current AutoPay method", () => {
    const json = textOf(render({ id: "4", status: "active", type: "card", expiry: "12/40", lastFour: "5555" }, true));
    expect(json).not.toContain("Delete");
    expect(json).toContain("Auto Pay");
  });

  it("hides Delete on a method that is both inactive and expired", () => {
    const json = textOf(render({ id: "5", status: "inactive", type: "card", expiry: "01/20", lastFour: "7777" }));
    expect(json).not.toContain("Delete");
    expect(json).toContain("Expired");
  });
});
