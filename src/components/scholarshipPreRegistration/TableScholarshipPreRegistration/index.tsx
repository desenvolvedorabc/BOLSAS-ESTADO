import * as React from 'react';
import { useState, useEffect, useRef, useContext } from 'react';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Container, TopContainer } from './styledComponents';
import {
  InputSearch,
  IconSearch,
  TableCellBorder,
  Pagination,
  FormSelectStyled,
  ButtonPage,
  TableCellStyled,
  TableRowStyled,
  TableSortLabelStyled,
} from 'src/shared/styledTables';
import { MdNavigateNext, MdNavigateBefore } from 'react-icons/md';
import Link from 'next/link';

import { useAuth } from 'src/context/AuthContext';
import { ThemeContext } from 'src/context/ThemeContext';
import { ButtonDefault } from 'src/components/buttons/buttonDefault';
import Router from 'next/router';
import {
  getMonthReports,
  IGetMonthReport,
} from 'src/services/relatorio-mensal.service';
import { visuallyHidden } from '@mui/utils';

interface Data {
  id: string;
  name: string;
  email: string;
  county: string;
  regional: string;
  status: string;
}

function createData(
  id: string,
  name: string,
  email: string,
  county: string,
  regional: string,
  status: string,
): Data {
  return {
    id,
    name,
    email,
    county,
    regional,
    status,
  };
}

interface HeadCell {
  id: keyof Data;
  label: string;
  numeric: boolean;
}

const headCells: readonly HeadCell[] = [
  {
    id: 'name',
    numeric: false,
    label: 'NOME',
  },
  {
    id: 'email',
    numeric: false,
    label: 'EMAIL',
  },
  {
    id: 'county',
    numeric: false,
    label: 'MUNICÍPIO',
  },
  {
    id: 'regional',
    numeric: false,
    label: 'REGIONAL',
  },
  {
    id: 'status',
    numeric: false,
    label: 'STATUS',
  },
];

interface EnhancedTableProps {
  onRequestSort: (
    event: React.MouseEvent<unknown>,
    property: keyof Data,
  ) => void;
  order: 'asc' | 'desc';
  orderBy: string;
  rowCount: number;
}

function EnhancedTableHead(props: EnhancedTableProps) {
  const { order, orderBy, onRequestSort } = props;
  const createSortHandler =
    (property: keyof Data) => (event: React.MouseEvent<unknown>) => {
      onRequestSort(event, property);
    };

  return (
    <TableHead>
      <TableRow>
        {headCells.map((headCell) => (
          <TableCellStyled
            key={headCell.id}
            align={headCell.numeric ? 'right' : 'left'}
            padding={'normal'}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            {headCell.id === 'name' ? (
              <TableSortLabelStyled
                active={orderBy === headCell.id}
                direction={order === 'asc' ? 'desc' : 'asc'}
                onClick={createSortHandler(headCell.id)}
              >
                {headCell.label}
                {orderBy === headCell.id ? (
                  <Box component="span" sx={visuallyHidden}>
                    {order === 'desc'
                      ? 'sorted descending'
                      : 'sorted ascending'}
                  </Box>
                ) : null}
              </TableSortLabelStyled>
            ) : (
              <div style={{ fontWeight: 600 }}>{headCell.label}</div>
            )}
          </TableCellStyled>
        ))}
      </TableRow>
    </TableHead>
  );
}

export function TableScholarshipPreRegistration() {
  const date = new Date();
  const { user } = useAuth();
  const [order, setOrder] = useState<'asc' | 'desc'>('asc');
  const [orderBy] = useState('name');
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [filterMonth, setFilterMonth] = useState(null);
  const [selectedYear, setSelectedYear] = useState(date.getFullYear());
  const [filterYear, setFilterYear] = useState(date.getFullYear());
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [filterStatus, setFilterStatus] = useState(null);
  const [page, setPage] = useState(1);
  const [qntPage, setQntPage] = useState(1);
  const [limit, setLimit] = useState(5);
  const [disablePrev, setDisablePrev] = useState(true);
  const [disableNext, setDisableNext] = useState(false);
  const [search, setSearch] = useState(null);
  const [showFilter, setShowFilter] = useState(false);
  const { mobile } = useContext(ThemeContext);

  const handleRequestSort = (
    _event: React.MouseEvent<unknown>,
    property: keyof Data,
  ) => {
    const isAsc = order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    // setSelectedColumn(property);
  };

  useEffect(() => {
    setDisablePrev(page === 1 ? true : false);
    setDisableNext(page === qntPage ? true : false);
  }, [qntPage, page]);

  const handleChangePage2 = (direction) => {
    if (direction === 'prev') {
      setPage(page - 1);
    } else {
      setPage(page + 1);
    }
  };
  const handleChangeLimit = (event) => {
    setLimit(parseInt(event.target.value));
    setPage(1);
  };

  useEffect(() => {
    loadWorkPlan();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, page, limit, order]);

  const [rows, setRows] = useState([]);
  const tableBody = useRef();

  async function loadWorkPlan() {
    const data: IGetMonthReport = {
      page: page,
      limit: limit,
      order: 'ASC',
      month: filterMonth,
      search: search,
      status: filterStatus,
    };
    const resp = await getMonthReports(data);

    setQntPage(resp.data?.meta?.totalPages);

    const list = [];
    resp.data.items?.map((x) => {
      list.push(
        createData(x.id, x.name, x.email, x.county, x.regional, x.status),
      );
    });

    setRows(list);
  }

  useEffect(() => {
    loadWorkPlan();
  }, []);

  const handleChangeSearch = (e) => {
    setSearch(e.target.value);
    setPage(1);
  };

  const filterSelected = () => {
    setPage(1);
    setFilterYear(selectedYear);
    setFilterMonth(selectedMonth);
    setFilterStatus(selectedStatus);
  };

  useEffect(() => {
    loadWorkPlan();
  }, [filterMonth, filterStatus]);

  const changeShowFilter = () => {
    setShowFilter(!showFilter);
  };

  const setRow = (row, index) => {
    const labelId = `enhanced-table-checkbox-${index}`;

    return (
      <Link
        href={`/painel/${user?.partner_state?.slug}/aprovacao-de-relatorio/${row.id}`}
        key={row.id}
        passHref
      >
        <TableRowStyled role="checkbox" tabIndex={-1}>
          <TableCell component="th" id={labelId} scope="row" padding="normal">
            {row.name}
          </TableCell>
          <TableCellBorder>{row.email}</TableCellBorder>
          <TableCellBorder>{row.county}</TableCellBorder>
          <TableCellBorder>{row.regional}</TableCellBorder>
          <TableCellBorder>{row.status}</TableCellBorder>
        </TableRowStyled>
      </Link>
    );
  };

  return (
    <Container>
      <TopContainer>
        <div
          className="d-flex flex-row-reverse align-items-center"
          style={{ marginLeft: 15, marginBottom: 10 }}
        >
          <InputSearch
            size={16}
            type="text"
            placeholder="Pesquise"
            name="searchTerm"
            onChange={handleChangeSearch}
            mobile={mobile}
          />
          <IconSearch color={'#7C7C7C'} />
        </div>
        <div style={{ width: 177 }}>
          <ButtonDefault
            onClick={() =>
              Router.push(
                `/painel/${user?.partner_state?.slug}/pre-cadastro-do-bolsista`,
              )
            }
          >
            Adicionar Novo Bolsista
          </ButtonDefault>
        </div>
      </TopContainer>
      <Box sx={{ width: '100%' }}>
        <Paper
          sx={{
            width: '100%',
            mb: 2,
            borderBottomLeftRadius: '10px',
            borderBottomRightRadius: '10px',
          }}
        >
          <TableContainer>
            <Table
              sx={{ minWidth: 750 }}
              aria-labelledby="tableTitle"
              size={'medium'}
            >
              <EnhancedTableHead
                order={order}
                orderBy={orderBy}
                onRequestSort={handleRequestSort}
                rowCount={rows.length}
              />
              <TableBody id="tableBody" ref={tableBody}>
                {rows.map((row, index) => {
                  return setRow(row, index);
                })}
              </TableBody>
            </Table>
          </TableContainer>
          <Pagination>
            Linhas por página:
            <FormSelectStyled value={limit} onChange={handleChangeLimit}>
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={25}>25</option>
            </FormSelectStyled>
            <p
              style={{
                marginLeft: '25px',
              }}
            ></p>
            {page} - {qntPage}
            <p
              style={{
                marginRight: '25px',
              }}
            ></p>
            <ButtonPage
              onClick={() => handleChangePage2('prev')}
              disabled={disablePrev}
            >
              <MdNavigateBefore size={24} />
            </ButtonPage>
            <ButtonPage
              onClick={() => handleChangePage2('next')}
              disabled={disableNext}
            >
              <MdNavigateNext size={24} />
            </ButtonPage>
          </Pagination>
        </Paper>
      </Box>
    </Container>
  );
}
