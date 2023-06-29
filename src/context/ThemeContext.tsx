/* eslint-disable @typescript-eslint/no-explicit-any */
import { useRouter } from 'next/router';
import { createContext, useEffect, useState } from 'react';
import { getStateSlug } from 'src/services/estados-parceiro.service';
import { parc } from 'src/styles/themes';
import stateTheme from 'src/styles/themes/state';

type ThemeContextData = {
  changeTheme: (theme: string) => void;
  theme: any;
  state: any;
  mobile: boolean;
};

const ThemeContext = createContext({} as ThemeContextData);

const ThemeStore = ({ children }) => {
  const { query } = useRouter();

  const [theme, setTheme] = useState(stateTheme('#FFFFFF'));
  const [state, setState] = useState(null);
  const [mobile, setMobile] = useState(false);
  const loadState = async () => {
    const resp = await getStateSlug(query?.estado?.toString());

    setState(resp.data);
  };

  useEffect(() => {
    if (screen.width <= 480) {
      setMobile(true);
    } else setMobile(false);
  }, []);

  useEffect(() => {
    if (query?.estado) loadState();
  }, [query]);

  useEffect(() => {
    if (state?.color) setTheme(stateTheme(state?.color));
  }, [state]);

  const changeTheme = (theme) => setTheme(theme);

  return (
    <ThemeContext.Provider value={{ changeTheme, theme, state, mobile }}>
      {children}
    </ThemeContext.Provider>
  );
};

export { ThemeStore, ThemeContext };
