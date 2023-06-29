import * as React from 'react';
import { useState, useEffect, useRef, useContext } from 'react';
import { saveAs } from 'file-saver';
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
  FilterSelectedContainer,
  Marker,
  InputSearch,
  IconSearch,
  TableCellBorder,
  Pagination,
  FormSelectStyled,
  ButtonPage,
  ButtonStyled,
  TableCellStyled,
  TableRowStyled,
} from 'src/shared/styledTables';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import {
  MdOutlineFilterAlt,
  MdNavigateNext,
  MdNavigateBefore,
} from 'react-icons/md';
import Link from 'next/link';
import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import { format } from 'date-fns';

import { useGetWorkPlans } from 'src/services/plano-trabalho.service';
import { useAuth } from 'src/context/AuthContext';
import { ThemeContext } from 'src/context/ThemeContext';
import { Loading } from 'src/components/Loading';

interface Data {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  sendValidationAt: string;
  validationAt: string;
  status: string;
}

function createData(
  id: string,
  name: string,
  createdAt: string,
  updatedAt: string,
  sendValidationAt: string,
  validationAt: string,
  status: string,
): Data {
  return {
    id,
    name,
    createdAt,
    updatedAt,
    sendValidationAt,
    validationAt,
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
    label: 'NOME DO BOLSISTA',
  },
  {
    id: 'createdAt',
    numeric: false,
    label: 'DATA / HORA CRIAÇÃO',
  },
  {
    id: 'updatedAt',
    numeric: false,
    label: 'DATA / HORA ALTERAÇÃO',
  },
  {
    id: 'sendValidationAt',
    numeric: false,
    label: 'DATA / HORA ENVIO',
  },
  {
    id: 'validationAt',
    numeric: false,
    label: 'DATA / HORA VALIDAÇÃO',
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
  return (
    <TableHead>
      <TableRow>
        {headCells.map((headCell) => (
          <TableCellStyled
            key={headCell.id}
            align={headCell.numeric ? 'right' : 'left'}
            padding={'normal'}
          >
            <div style={{ fontWeight: 600 }}>{headCell.label}</div>
          </TableCellStyled>
        ))}
      </TableRow>
    </TableHead>
  );
}

enum StatusName {
  APROVADO = 'Aprovado',
  EM_VALIDACAO = 'Em Validação',
  PENDENTE_VALIDACAO = 'Pendente Validação',
  REPROVADO = 'Reprovado',
}

export function TableWorkPlan() {
  const { user } = useAuth();
  const [order, setOrder] = useState<'asc' | 'desc'>('asc');
  const [orderBy] = useState('name');
  const [selectedYear, setSelectedYear] = useState(null);
  const [filterYear, setFilterYear] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [filterStatus, setFilterStatus] = useState(null);
  const [page, setPage] = useState(1);
  const [qntPage, setQntPage] = useState(1);
  const [limit, setLimit] = useState(5);
  const [search, setSearch] = useState(null);
  const [disablePrev, setDisablePrev] = useState(true);
  const [disableNext, setDisableNext] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const { mobile } = useContext(ThemeContext);
  const date = new Date();

  const { data, isLoading: isLoading } = useGetWorkPlans({
    page: page,
    limit: limit,
    order: 'ASC',
    referenceYear: filterYear,
    search: search,
    status: filterStatus,
  });

  useEffect(() => {
    const list = [];

    setQntPage(data?.meta?.totalPages);

    data?.items?.map((x) => {
      list.push(
        createData(
          x.id,
          x.scholar?.name,
          x.createdAt ? format(new Date(x?.createdAt), 'dd/MM/yyyy HH:mm') : '',
          x.updatedAt ? format(new Date(x?.updatedAt), 'dd/MM/yyyy HH:mm') : '',
          x.sendValidationAt
            ? format(new Date(x?.sendValidationAt), 'dd/MM/yyyy HH:mm')
            : '',
          x.validationAt
            ? format(new Date(x?.validationAt), 'dd/MM/yyyy HH:mm')
            : '',
          StatusName[x.status],
        ),
      );
    });
    setRows(list);
  }, [data?.items, data?.meta?.totalPages]);

  const handleRequestSort = (_event: React.MouseEvent<unknown>) => {
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

  const [rows, setRows] = useState([]);
  const tableBody = useRef();

  const handleChangeSearch = (e) => {
    setSearch(e.target.value);
    setPage(1);
  };

  const handleSelectYear = (e) => {
    setSelectedYear(e.target.value);
  };

  const handleSelectStatus = (e) => {
    setSelectedStatus(e.target.value);
  };

  const filterSelected = () => {
    setPage(1);
    setFilterYear(selectedYear);
    setFilterStatus(selectedStatus);
  };

  const changeShowFilter = () => {
    setShowFilter(!showFilter);
  };

  const setRow = (row, index) => {
    const labelId = `enhanced-table-checkbox-${index}`;

    return (
      <Link
        href={`/painel/${user?.partner_state?.slug}/aprovacoes-de-planos-de-trabalho/${row.id}`}
        key={row.id}
        passHref
      >
        <TableRowStyled role="checkbox" tabIndex={-1}>
          <TableCell component="th" id={labelId} scope="row" padding="normal">
            {row.name}
          </TableCell>
          <TableCellBorder>{row.createdAt}</TableCellBorder>
          <TableCellBorder>{row.updatedAt}</TableCellBorder>
          <TableCellBorder>{row.sendValidationAt}</TableCellBorder>
          <TableCellBorder>{row.validationAt}</TableCellBorder>
          <TableCellBorder>{row.status}</TableCellBorder>
        </TableRowStyled>
      </Link>
    );
  };

  // const downloadCsv = async () => {
  //   const resp = await getExportUsersExcel({
  //     page: 1,
  //     limit: 10,
  //     order: order?.toUpperCase(),
  //     search,
  //     profile: selectedProfile?.id,
  //     status: selectedStatus,
  //   });
  //   saveAs(resp?.data, 'Usuários PARC');
  // };

  return (
    <Container>
      <TopContainer>
        <div className="d-flex mb-2">
          <OverlayTrigger
            key={'toolTip'}
            placement={'top'}
            overlay={<Tooltip id={`tooltip-top`}>Filtro Avançado</Tooltip>}
          >
            <Marker onClick={changeShowFilter}>
              <MdOutlineFilterAlt color="#FFF" size={24} />
            </Marker>
          </OverlayTrigger>
          <div className="d-flex flex-row-reverse align-items-center ">
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
        </div>
        {/* <div style={{ marginRight: 30 }}>
          <ButtonMenu handlePrint={null} handleCsv={downloadCsv} />
        </div> */}
      </TopContainer>
      {showFilter && (
        <FilterSelectedContainer>
          <div className="pe-2 me-2 border-end border-white">
            <FormControl
              fullWidth
              size="small"
              style={{ width: 142, backgroundColor: '#FFFFFF' }}
            >
              <InputLabel id="referenceYear">Ano de Referência</InputLabel>
              <Select
                labelId="referenceYear"
                id="referenceYear"
                value={selectedYear}
                label="Ano de Referência"
                onChange={(e) => handleSelectYear(e)}
              >
                <MenuItem value={null}>Todos</MenuItem>
                <MenuItem value={date.getFullYear() - 1}>
                  {date.getFullYear() - 1}
                </MenuItem>
                <MenuItem value={date.getFullYear()}>
                  {date.getFullYear()}
                </MenuItem>
                <MenuItem value={date.getFullYear() + 1}>
                  {date.getFullYear() + 1}
                </MenuItem>
              </Select>
            </FormControl>
          </div>
          <div className="me-2">
            <FormControl
              fullWidth
              size="small"
              style={{ width: 142, backgroundColor: '#FFFFFF' }}
            >
              <InputLabel id="Status">Status</InputLabel>
              <Select
                labelId="Status"
                id="Status"
                value={selectedStatus}
                label="Status"
                onChange={(e) => handleSelectStatus(e)}
              >
                <MenuItem value={null}>Todos</MenuItem>
                <MenuItem value={'APROVADO'}>Aprovado</MenuItem>
                <MenuItem value={'EM_VALIDACAO'}>Em Validação</MenuItem>
                <MenuItem value={'PENDENTE_VALIDACAO'}>
                  Pendente Validação
                </MenuItem>
                <MenuItem value={'REPROVADO'}>Reprovado</MenuItem>
              </Select>
            </FormControl>
          </div>
          <div>
            <ButtonStyled
              onClick={() => {
                filterSelected();
              }}
            >
              Filtrar
            </ButtonStyled>
          </div>
        </FilterSelectedContainer>
      )}
      <Box sx={{ width: '100%' }}>
        <Paper
          sx={{
            width: '100%',
            mb: 2,
            borderBottomLeftRadius: '10px',
            borderBottomRightRadius: '10px',
          }}
        >
          {isLoading ? (
            <Loading />
          ) : (
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
          )}
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
