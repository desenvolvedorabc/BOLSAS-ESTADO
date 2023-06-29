import {
  GetServerSideProps,
  GetServerSidePropsContext,
  GetServerSidePropsResult,
} from 'next';
import { destroyCookie, parseCookies } from '../utils/cookies';

import { IArea, IUser } from 'src/context/AuthContext';
import { AuthTokenError } from '../services/errors/AuthTokenError';
import { validateUserPermissions } from './validateUserPermissions';

type WithSSRAuthOptions = {
  roles: string[];
  profiles?: string[];
};

export function withSSRAuth<P>(
  fn: GetServerSideProps<P>,
  options: WithSSRAuthOptions,
) {
  return async (
    ctx: GetServerSidePropsContext,
  ): Promise<GetServerSidePropsResult<P>> => {
    const cookies = parseCookies(ctx);
    const token = cookies['__session'];

    if (!token) {
      return {
        redirect: {
          destination: `/painel/${ctx.query.estado}/login`,
          permanent: false,
        },
      };
    }

    if (options) {
      const userCookie = cookies['USUARIO'];
      const userAreas = cookies['USU_AREAS'];

      let user;
      let usuAreas;
      if (userCookie) user = JSON.parse(userCookie) as IUser;
      // const user = {} as IUser

      const { roles, profiles } = options;

      let areas = [] as IArea[];

      if (user?.subRole === 'BOLSISTA' && !user?.access_profile) {
        areas = [
          {
            createdAt: null,
            id: null,
            tag: 'CAD_COM_BOL',
            name: 'Cadastro Completo do Bolsista',
            role: null,
            updatedAt: null,
          },
        ];
      } else if (user?.subRole !== 'ADMIN') {
        if (userAreas !== undefined) {
          usuAreas = JSON.parse(userAreas) as IArea;
        }

        areas = usuAreas as IArea[];
      }

      const userHasValidPermissions = validateUserPermissions({
        user,
        areas,
        roles,
        profiles,
      });

      if (!userHasValidPermissions) {
        const destination = `/painel/${ctx.query.estado}/`;

        return {
          redirect: {
            destination,
            permanent: false,
          },
        };
      }
    }

    try {
      return await fn(ctx);
    } catch (err) {
      if (err instanceof AuthTokenError) {
        destroyCookie(ctx, '__session');

        return {
          redirect: {
            destination: `/painel/${ctx.query.estado}/login`,
            permanent: false,
          },
        };
      }
    }
  };
}
