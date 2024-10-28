const parseRoles = (rolesToParse) => {
  const roleNames = [];
  const roles = rolesToParse.map((x) => {
    roleNames.push((x.split(":"))[1]);
    return {
      relationshipId: (x.split(":"))[0],
      roleName: (x.split(":"))[1],
      status: (x.split(":"))[2],
    };
  });

  return { roles, roleNames };
};

export default parseRoles;
