const ROLE_LABELS = {
  client: 'Client',
  freelancer: 'Freelancer',
  GENERIC: 'General',
  admin: 'Admin',
};

export function roleLabel(role) {
  return ROLE_LABELS[role] ?? role;
}
