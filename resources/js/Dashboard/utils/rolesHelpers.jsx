export const checkIfRolesInUserRoles = ({roles, user}) => {
  if (user?.roles && roles?.length > 0) {
    return roles?.some(role => user?.roles?.includes(role))
  }
  return false
}
