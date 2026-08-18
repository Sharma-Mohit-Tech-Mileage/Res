// transfer_details.status "T" means this account was transferred to another one.
// Every other status ("F", "D", "I", "P") and a null/absent object are ignored.

export const TRANSFERRED_TO = "T";

export const getTransferInfo = (accountDetails) => {
  const details = accountDetails?.transfer_details;
  const newAccountNumber = details?.account_number;
  const isTransferred = details?.status === TRANSFERRED_TO && !!newAccountNumber;

  return {
    isTransferred,
    newAccountNumber: isTransferred ? String(newAccountNumber) : null,
  };
};
