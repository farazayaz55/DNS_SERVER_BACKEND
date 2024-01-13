const allRoles = {
  user: ['connect'],
  admin: ['getUsers', 'manageUsers','connect'],
};

const roles = Object.keys(allRoles);
const roleRights = new Map(Object.entries(allRoles));

module.exports = {
  roles,
  roleRights,
};
