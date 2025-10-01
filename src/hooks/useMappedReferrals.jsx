import { useMemo } from "react";

export const useMappedReferrals = ({
  referrals,
  referralsItem,
  services,
  clinics,
  doctors,
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

        const doctor = doctors?.find(
          (d) => +d.codeid === +referral.doctor_codeid
        );

        return {
          ...referral,
          clinicName: clinics?.find(
            (c) => +c.codeid === +referral.clinic_codeid
          )?.nameid,
          doctorName: doctor?.nameid || "-",
          doctorPhone: doctor?.phone || "-",
          items: items?.map((item) => {
            const service = services?.find((s) => +s.codeid === +item.services);
            return {
              ...item,
              serviceName: service?.nameid || "",
              price: service?.price || "",
            };
          }),
        };
      });
  }, [referrals, referralsItem, services, clinics, doctors]);
};
