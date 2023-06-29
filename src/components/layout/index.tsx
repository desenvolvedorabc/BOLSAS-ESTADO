import Navigation from 'src/components/navigation';
import { Header } from 'src/components/header';
import { useContext, useState } from 'react';
import { Drawer } from '@mui/material';
import { ButtonDrawer } from '../buttons/ButtonDrawer';
import { AreaButtonDrawer } from './styledComponents';
import { ThemeContext } from 'src/context/ThemeContext';

export default function Layout({ children, ...props }) {
  const { mobile } = useContext(ThemeContext);
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <div>
      <Header title={props.header} />
      {mobile ? (
        <div>
          <Drawer open={menuOpen} onClose={toggleMenu}>
            <div
              style={{
                display: 'flex',
              }}
            >
              <Navigation toggleMenu={toggleMenu} />
              {/* <div style={{ position: 'fixed', left: '290px', top: '32px' }}>
                <ButtonDrawer onClick={toggleMenu} active={false} />
              </div> */}
            </div>
          </Drawer>
          <AreaButtonDrawer>
            <ButtonDrawer onClick={toggleMenu} />
          </AreaButtonDrawer>
          <main style={{ width: '100%' }}>{children}</main>
        </div>
      ) : (
        <div style={{ display: 'flex' }}>
          <Navigation toggleMenu={null} />
          <main style={{ width: '100%' }}>{children}</main>
        </div>
      )}
    </div>
  );
}
