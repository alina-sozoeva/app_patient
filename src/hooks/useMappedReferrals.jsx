import { useMemo } from "react";

export const useMappedReferrals = ({
  referrals,
  referralsItem,
  services,
  clinics,
}) => {
  return useMemo(() => {
    if (!Array.isArray(referrals)) return [];

    return referrals
      .filter(Boolean)
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
      .map((referral) => {
        const items = referralsItem?.filter(
          (item) => +item.referral_codeid === +referral.codeid
        );

        return {
          ...referral,
          clinicName: clinics?.find(
            (c) => +c.codeid === +referral.clinic_codeid
          )?.nameid,
          items: items?.map((item) => {
            const service = services?.find((s) => +s.codeid === +item.services);
            return {
              ...item,
              serviceName: service?.nameid || "",
            };
          }),
        };
      });
  }, [referrals, referralsItem, services, clinics]);
};
