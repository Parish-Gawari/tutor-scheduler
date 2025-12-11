/* eslint-disable @typescript-eslint/no-explicit-any */
export function isAdmin(user: any) {
  return user?.role === "admin";
}

export function isTutor(user: any) {
  return user?.role === "tutor";
}

export function isStudent(user: any) {
  return user?.role === "student";
}

export function canCreate(user: any) {
  return isAdmin(user) || isTutor(user);
}

export function canEdit(user: any) {
  return isAdmin(user) || isTutor(user);
}

export function canDelete(user: any) {
  return isAdmin(user);
}
