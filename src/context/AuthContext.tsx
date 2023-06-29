import axios from 'axios';
import Router, { useRouter } from 'next/router';
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import { queryClient } from 'src/lib/react-query';
import { api } from 'src/services/api';
import { destroyCookie, parseCookies, setCookie } from '../utils/cookies';

export type IUser = {
  id: number;
  createdAt?: string;
  updatedAt?: string;
  name: string;
  email: string;
  city: string;
  telephone: string;
  role: string;
  subRole: string;
  image_profile: string;
  cpf: string;
  active: boolean;
  isChangePasswordWelcome: boolean;
  access_profile: IAcessProfile;
  image_profile_url: string;
  partner_state: IState;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  regionalPartner: any;
  isFormer?: boolean;
};

export type IAcessProfile = {
  id: number;
  createdAt: string;
  updatedAt: string;
  name: string;
  active: boolean;
  areas?: IArea[];
  role: string;
};

export type IArea = {
  createdAt: string;
  id: number;
  name: string;
  role: string;
  tag: string;
  updatedAt: string;
};

export type IState = {
  id?: number;
  name: string;
  cod_ibge: string;
  abbreviation: string;
  active?: boolean;
  logo: string;
  color: string;
  slug: string;
};

type ILogin = {
  access_token: string;
  expires_in: string;
  status: number;
  message: string;
};

type AuthContextData = {
  signIn(idState: number, values): Promise<ILogin>;
  signOut: () => void;
  user: IUser;
  changeUser: (values: IUser) => void;
};

type AuthProviderProps = {
  children: ReactNode;
};

const AuthContext = createContext({} as AuthContextData);

let authChannel: BroadcastChannel;

export const signOutt = () => {
  destroyCookie(null, 'USUARIO', {
    path: '/',
  });
  destroyCookie(null, 'USU_AREAS', {
    path: '/',
  });
  destroyCookie(null, '__session', {
    path: '/',
  });
  destroyCookie(null, 'USU_RETRY', {
    path: '/',
  });
  // setUser(null);

  api.defaults.headers['Authorization'] = null;

  queryClient.clear();

  localStorage.clear();

  // Router.push(`/painel/${query?.estado}/login`);

  // authChannel.postMessage('signOut');
};

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<IUser>({} as IUser);
  const { query } = useRouter();
  const { __session: token, USUARIO: usuario } = parseCookies();

  const signOut = useCallback(() => {
    signOutt();
    setUser(null);

    Router.push(`/painel/${query?.estado}/login`);
    // authChannel.postMessage('signOut');
  }, [query?.estado]);

  useEffect(() => {
    authChannel = new BroadcastChannel('auth');

    authChannel.onmessage = (message) => {
      switch (message.data) {
        case 'signOut':
          signOut();
          break;
        case 'signIn':
          Router.push(`/painel/${query?.estado}/`);
          break;
        default:
          break;
      }
    };
  }, [query?.estado, signOut]);

  useEffect(() => {
    if (token && usuario) {
      let usuarioUrl = JSON.parse(usuario);

      usuarioUrl = {
        ...usuarioUrl,
        image_profile_url: `${process.env.NEXT_PUBLIC_API_URL}/users/avatar/${usuarioUrl.image_profile}`,
      };
      // const decodeToken = jwt_decode(token) as any;
      setUser(usuarioUrl);

      api.defaults.headers['Authorization'] = `Bearer ${token}`;
    }
  }, [token, usuario]);

  async function signIn(idState: number, values) {
    queryClient.clear();

    let response;

    if (idState) {
      values = {
        ...values,
        idPartnerState: idState,
      };
      try {
        response = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/auth/login/state`,
          values,
        );

        const token = response.data.token;
        const areas = response?.data?.user?.access_profile?.areas;

        let _user = response.data.user as IUser;

        delete _user?.createdAt;
        delete _user?.updatedAt;
        delete _user?.access_profile?.areas;

        setCookie(null, '__session', token, {
          path: '/',
          maxAge: 28880,
        });

        setCookie(null, 'USU_AREAS', JSON.stringify(areas), {
          path: '/',
          maxAge: 28880,
        });

        setCookie(null, 'USUARIO', JSON.stringify(_user), {
          path: '/',
          maxAge: 28880,
        });

        _user = {
          ...response.data.user,
          image_profile_url: `${process.env.NEXT_PUBLIC_API_URL}/users/avatar/${_user?.image_profile}`,
        };

        setUser(_user);

        setCookie(null, 'USU_RETRY', '0', {
          path: '/',
        });

        api.defaults.headers['Authorization'] = `Bearer ${token}`;

        Router.push(`/painel/${query?.estado}/`);

        authChannel.postMessage('signIn');
      } catch (error) {
        console.log('error: ', error);
        return error;
      }
    }

    // if (response.status !== 201) {
    //   return response;
    // }
  }

  function changeUser(user: IUser) {
    setUser(user);
  }

  return (
    <AuthContext.Provider value={{ signIn, signOut, user, changeUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
