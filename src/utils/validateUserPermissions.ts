import { IArea, IUser } from 'src/context/AuthContext';

type ValidateUserPermissionsParams = {
  areas: IArea[];
  user: IUser;
  roles?: string[];
  profiles?: string[];
};

export function validateUserPermissions({
  user,
  areas,
  roles,
  profiles,
}: ValidateUserPermissionsParams) {
  if (user?.subRole === 'ADMIN') return true;

  if (roles?.length > 0) {
    const hasAllRoles = areas?.some((area) => {
      return roles.includes(area.tag);
    });

    if (!hasAllRoles) {
      return false;
    }
  }

  if (profiles?.length > 0) {
    if (!profiles.includes(user?.subRole)) {
      return false;
    }
  }

  return true;
}
