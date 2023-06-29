import styled from 'styled-components';
import TableCell from '@mui/material/TableCell';

export const Container = styled.div`
  background-color: #fff;
  border-radius: 10px;
  border-bottom-right-radius: 50px;
  border-bottom-left-radius: 50px;
`;

export const TopContainer = styled.div`
  padding: 15px 10px 5px 10px;
  display: flex;
  justify-content: space-between;
`;

export const FilterStatusContainer = styled.div`
  background-color: #f2f0f9;
  display: flex;
  padding: 10px;
  align-items: end;
`;

export const TableCellBorder = styled(TableCell)`
  border-left: 1px solid #d4d4d4;
  max-width: 250px;
`;

export const Text = styled.div`
  max-height: 100px;
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: 12px;
`;
