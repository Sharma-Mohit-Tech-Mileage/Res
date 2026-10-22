import { useEffect, useState } from "react";
import { PostApiRequest } from "../network/RestApiClient";
import { getEndpoint, ENDPOINTS } from "../network/apis/endpoints/Endpoints";

// Same eligibility rule as BillingBreakDownScreen: only accounts without a hierarchy id, and only when the API says eligible.
export const useBillExplainerLink = (accountDetails, accountNumber) => {
  const [explainerUrl, setExplainerUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const loaded = !!accountDetails;
  const hierarchyId = accountDetails?.hierarchy?.hierarchy_id;
  const customerType = accountDetails?.customer_type;
  const video = accountDetails?.services?.video;
  const homesPassedId = accountDetails?.homes_passed_id || null;

  useEffect(() => {
    setExplainerUrl(null);
    setLoading(false);
    if (!loaded || hierarchyId || !accountNumber) return;
    let active = true;
    setLoading(true);
    PostApiRequest(
      getEndpoint(ENDPOINTS.GET_BILL_EXPLAINER),
      {
        customer_type: customerType,
        hierarchy_id: hierarchyId,
        account: accountNumber,
        utmMedium: "web",
        utmSource: "selfcare_mobile",
        video,
        homesPassedId,
      },
      (res) => {
        if (!active) return;
        if (res?.eligibility && res?.be_url) setExplainerUrl(res.be_url);
        setLoading(false);
      },
      () => {
        if (active) setLoading(false);
      }
    );
    return () => {
      active = false;
    };
  }, [loaded, hierarchyId, customerType, video, homesPassedId, accountNumber]);

  return { url: explainerUrl, loading };
};

export default useBillExplainerLink;
