export const USERS_CACHE_KEYS = {
  LIST: "users:list",
  BY_ID: (id: number | string) => `users:by-id:${id}`,
};