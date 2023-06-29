import { useContext } from 'react';
import { Box } from './styledComponents';
import { ThemeContext } from 'src/context/ThemeContext';

export function InfoIndicator({ icon, value, title, border }) {
  const { mobile } = useContext(ThemeContext);

  return (
    <Box border={border} mobile={mobile}>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: 3 }}>
        <div>{icon}</div>
        <div style={{ marginLeft: 10, fontSize: 21 }}>{value}</div>
      </div>
      <div style={{ fontSize: 11 }}>{title}</div>
    </Box>
  );
}
