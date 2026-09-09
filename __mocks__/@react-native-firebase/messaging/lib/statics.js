// Manual mock: the real v22 package ships ESM and is not transformed by Jest.
module.exports = {
  __esModule: true,
  AuthorizationStatus: { NOT_DETERMINED: -1, DENIED: 0, AUTHORIZED: 1, PROVISIONAL: 2 },
  NotificationAndroidPriority: { PRIORITY_MIN: -2, PRIORITY_LOW: -1, PRIORITY_DEFAULT: 0, PRIORITY_HIGH: 1, PRIORITY_MAX: 2 },
  NotificationAndroidVisibility: { VISIBILITY_SECRET: -1, VISIBILITY_PRIVATE: 0, VISIBILITY_PUBLIC: 1 },
};
