export const isAccountDisconnected = (acctStatus, daysSinceDisconnectDate) => {
  if (!acctStatus) return false;
  
  const disconnectedStatuses = ["DISCONNECT", "VOLUNTARY DISC", "NON-PAY DISC", "CHARGED OFF"];
  const isDisconnected = disconnectedStatuses.includes(acctStatus.toUpperCase());
  
  if (isDisconnected) {
    return daysSinceDisconnectDate <= 90 || daysSinceDisconnectDate === null;
  }
  
  return false;
};

export const shouldBlockLogin = (acctStatus, daysSinceDisconnectDate) => {
  //if (!acctStatus) return false;
  
  const disconnectedStatuses = ["DISCONNECT", "VOLUNTARY DISC", "NON-PAY DISC", "CHARGED OFF"];
  const isDisconnected = disconnectedStatuses?.includes(acctStatus?.toUpperCase());
  if(daysSinceDisconnectDate > -1 && daysSinceDisconnectDate<=90){
    return false;
  }else if(daysSinceDisconnectDate == -1 && isDisconnected){
      return true;
  }else if(daysSinceDisconnectDate>90){
    return true
  }
  
  return false;
};