export const gender = {
  1: "муж.",
  0: "жен.",
};

export const pathname = {
  other: "*",
  home: "/",
  patients: "/patients",
  patient: "/patient/:guid",
  newRx: "/new-rx/:guid",
  login: "/login",
  rxDetails: "/rx-details/:guid",
  prescriptions: "/prescriptions-written",
  reports: "/reports",
  diagnostics: "/diagnostics",
  notifications: "/notifications",
  prescriptionsId: "/prescriptions-written/:codeid/:guid",
  referral: "/referral",
  diagnosticId: "/diagnostics/:guid",
  newReferral: "/new-referral/:guid",
  referralDetails: "/referral-details/:guid",
  reportsPrescrip: "/reports/prescriptions/:date",
  reportsDrugs: "/reports/drugs/:date/:drug",
};
