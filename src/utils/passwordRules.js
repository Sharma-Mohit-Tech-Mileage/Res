// Case-insensitive, so changing only the letter case of the username still counts as the username.
export const isSameAsUsername = (password, userName) => {
  const name = typeof userName === "string" ? userName.trim().toLowerCase() : "";
  return !!name && typeof password === "string" && password.trim().toLowerCase() === name;
};
