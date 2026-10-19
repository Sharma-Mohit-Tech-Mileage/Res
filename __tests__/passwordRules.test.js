import { isSameAsUsername } from "../src/utils/passwordRules";
import { passwordSchema } from "../src/components/utility/validationSchema";

describe("isSameAsUsername", () => {
  it("matches the username regardless of letter case or surrounding spaces", () => {
    expect(isSameAsUsername("John.Doe@Mail1", "john.doe@mail1")).toBe(true);
    expect(isSameAsUsername(" John.Doe@Mail1 ", "John.Doe@Mail1")).toBe(true);
  });

  it("does not match a different password or a missing username", () => {
    expect(isSameAsUsername("Secret#123", "johndoe")).toBe(false);
    expect(isSameAsUsername("Secret#123", "")).toBe(false);
    expect(isSameAsUsername("Secret#123", undefined)).toBe(false);
    expect(isSameAsUsername(undefined, "johndoe")).toBe(false);
  });
});

describe("passwordSchema username rule", () => {
  const form = (newPassword) => ({ securityAnswer: "answer", newPassword });

  it("rejects a password equal to the username on save", () => {
    const schema = passwordSchema(false, () => "John.Doe@Mail1");
    expect(() => schema.validateSync(form("john.doe@mail1"))).toThrow("Password must be different from your username");
  });

  it("accepts a valid password that is not the username", () => {
    const schema = passwordSchema(false, () => "John.Doe@Mail1");
    expect(schema.validateSync(form("Secret#123"))).toBeTruthy();
  });

  it("also accepts the username as a plain string", () => {
    expect(() => passwordSchema(false, "John.Doe@Mail1").validateSync(form("John.Doe@Mail1"))).toThrow();
  });
});
