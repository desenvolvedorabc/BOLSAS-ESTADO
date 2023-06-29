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
import { Autocomplete, TextField } from '@mui/material';
import { format } from 'date-fns';

import { useAuth } from 'src/context/AuthContext';
import { ThemeContext } from 'src/context/ThemeContext';
import { ButtonDefault } from 'src/components/buttons/buttonDefault';
import Router from 'next/router';
import { ButtonMenu } from 'src/components/ButtonMenu';
import { useGetMonthReportsMe } from 'src/services/relatorio-mensal.service';
import { Loading } from 'src/components/Loading';
import { getMonths } from 'src/utils/anos';
import { StatusReport } from 'src/utils/masks';

interface Data {
  id: string;
  name: string;
  createdAt: string;
  validationAt: string;
  status: string;
  levelApproveRegistration: string;
  exportLink: string;
}

function createData(
  id: string,
  name: string,
  createdAt: string,
  validationAt: string,
  status: string,
  levelApproveRegistration: string,
  exportLink: string,
): Data {
  return {
    id,
    name,
    createdAt,
    validationAt,
    status,
    levelApproveRegistration,
    exportLink,
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
    id: 'validationAt',
    numeric: false,
    label: 'DATA / HORA VALIDAÇÃO',
  },
  {
    id: 'status',
    numeric: false,
    label: 'STATUS',
  },
  {
    id: 'levelApproveRegistration',
    numeric: false,
    label: 'INSTÂNCIA',
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

  return (
    <TableHead>
      <TableRow>
        {headCells.map((headCell) => (
          <TableCellStyled
            key={headCell.id}
            align={headCell.numeric ? 'right' : 'left'}
            padding={'normal'}
            // sortDirection={orderBy === headCell.id ? order : false}
          >
            {/* {headCell.id === 'name' ? (
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
            )} */}
            <div style={{ fontWeight: 600 }}>{headCell.label}</div>
          </TableCellStyled>
        ))}
      </TableRow>
    </TableHead>
  );
}

export function TableMonthReport() {
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
  const [limit, setLimit] = useState(12);
  const [search, setSearch] = useState(null);
  const [showFilter, setShowFilter] = useState(false);
  const { mobile } = useContext(ThemeContext);
  const monthList = getMonths();
  const [isDisabledAddReport, setIsDisabledAddReport] = useState(false);

  const { data, isLoading } = useGetMonthReportsMe({
    page: page,
    limit: limit,
    order: 'ASC',
    year: filterYear,
    month: filterMonth?.number,
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
          user?.name,
          x.createdAt ? format(new Date(x?.createdAt), 'dd/MM/yyyy HH:mm') : '',
          x.validationAt
            ? format(new Date(x?.validationAt), 'dd/MM/yyyy HH:mm')
            : '',
          StatusReport[x.status],
          x?.levelApproveRegistration,
          x?.export,
        ),
      );
    });
    setRows(list);

    disableAddReport();
  }, [data?.items, data?.meta?.totalPages]);

  const handleRequestSort = (
    _event: React.MouseEvent<unknown>,
    property: keyof Data,
  ) => {
    const isAsc = order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    // setSelectedColumn(property);
  };

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

  const handleSelectYear = (newValue) => {
    setSelectedYear(newValue);
  };

  const handleSelectMonth = (newValue) => {
    setSelectedMonth(newValue);
  };

  const handleSelectStatus = (newValue) => {
    setSelectedStatus(newValue);
  };

  const filterSelected = () => {
    setPage(1);
    setFilterYear(selectedYear);
    setFilterMonth(selectedMonth);
    setFilterStatus(selectedStatus);
  };

  const changeShowFilter = () => {
    setShowFilter(!showFilter);
  };

  const setRow = (row, index) => {
    const labelId = `enhanced-table-checkbox-${index}`;

    return (
      <Link
        href={`/painel/${user?.partner_state?.slug}/relatorio-mensal/${row.id}`}
        key={row.id}
        passHref
      >
        <TableRowStyled role="checkbox" tabIndex={-1}>
          <TableCell component="th" id={labelId} scope="row" padding="normal">
            {row.name}
          </TableCell>

          <TableCellBorder>{row.createdAt}</TableCellBorder>
          <TableCellBorder>{row.validationAt}</TableCellBorder>
          <TableCellBorder>{row.status}</TableCellBorder>
          <TableCellBorder>{row.levelApproveRegistration}</TableCellBorder>
        </TableRowStyled>
      </Link>
    );
  };

  const disableAddReport = () => {
    let disabled = false;
    data?.items?.map((item) => {
      const itemDate = new Date(item.createdAt);

      if (
        itemDate.getMonth() === date.getMonth() &&
        itemDate.getFullYear() === date.getFullYear()
      ) {
        disabled = true;
      }
    });
    setIsDisabledAddReport(disabled);
  };

  const downloadCsv = async () => {
    // const resp = await getExportUsersExcel({
    //   page: 1,
    //   limit: 10,
    //   order: order?.toUpperCase(),
    //   search,
    //   profile: selectedProfile?.id,
    //   status: selectedStatus,
    // });
    // saveAs(resp?.data, 'Usuários PARC');
  };

  return (
    <Container>
      <TopContainer mobile={mobile}>
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
        <div style={{ marginRight: 30, display: 'flex' }}>
          <ButtonMenu handlePrint={null} handleCsv={downloadCsv} />
          <div style={{ marginLeft: 20 }}>
            <ButtonDefault
              disable={isDisabledAddReport}
              onClick={() =>
                Router.push(
                  `/painel/${user?.partner_state?.slug}/relatorio-mensal`,
                )
              }
            >
              Adicionar Relatório
            </ButtonDefault>
          </div>
        </div>
      </TopContainer>
      {showFilter && (
        <FilterSelectedContainer>
          <div className="pe-2 me-2 border-end border-white">
            <Autocomplete
              id="referenceYear"
              size="small"
              noOptionsText="Ano de Referência"
              value={selectedYear}
              options={[
                date.getFullYear() - 1,
                date.getFullYear(),
                date.getFullYear() + 1,
              ]}
              onChange={(_event, newValue) => {
                handleSelectYear(newValue);
              }}
              renderInput={(params) => (
                <TextField size="small" {...params} label="Ano de Referência" />
              )}
              sx={{ width: 142, backgroundColor: '#fff' }}
            />
          </div>
          <div className="pe-2 me-2 border-end border-white">
            <Autocomplete
              id="month"
              size="small"
              noOptionsText="Mês"
              value={selectedMonth}
              options={monthList}
              getOptionLabel={(opttion) => opttion.name}
              onChange={(_event, newValue) => {
                handleSelectMonth(newValue);
              }}
              renderInput={(params) => (
                <TextField size="small" {...params} label="Mês" />
              )}
              sx={{ width: 142, backgroundColor: '#fff' }}
            />
          </div>
          <div className="me-2">
            <Autocomplete
              id="Status"
              size="small"
              noOptionsText="Status"
              value={selectedStatus}
              options={[
                'APROVADO',
                'EM_VALIDACAO',
                'PENDENTE_VALIDACAO',
                'REPROVADO',
                'PENDENTE_ENVIO',
              ]}
              getOptionLabel={(option) => StatusReport[option]}
              onChange={(_event, newValue) => {
                handleSelectStatus(newValue);
              }}
              renderInput={(params) => (
                <TextField size="small" {...params} label="Status" />
              )}
              sx={{ width: 142, backgroundColor: '#fff' }}
            />
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
            <FormSelectStyled
              disabled
              value={limit}
              onChange={handleChangeLimit}
            >
              <option value={12}>12</option>
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
              disabled={true}
            >
              <MdNavigateBefore size={24} />
            </ButtonPage>
            <ButtonPage
              onClick={() => handleChangePage2('next')}
              disabled={true}
            >
              <MdNavigateNext size={24} />
            </ButtonPage>
          </Pagination>
        </Paper>
      </Box>
    </Container>
  );
}
