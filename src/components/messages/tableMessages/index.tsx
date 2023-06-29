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
import { visuallyHidden } from '@mui/utils';
import { deleteMessage, useGetMessages } from 'src/services/mensagens.service';
import { MdNavigateNext, MdNavigateBefore } from 'react-icons/md';
import { BiTrash } from 'react-icons/bi';
import Router from 'next/router';
import {
  ButtonPage,
  FormSelectStyled,
  IconSearch,
  InputSearch,
  Pagination,
  TableCellBorder,
  TableCellStyled,
  TableRowStyled,
  TableSortLabelStyled,
} from 'src/shared/styledTables';
import { ModalDelete } from 'src/components/modalDelete';
import { ModalMessage } from '../modalMessage';
import { formatDate } from 'src/utils/date';
import useDebounce from 'src/utils/use-debounce';
import { ButtonDefault } from 'src/components/buttons/buttonDefault';
import {
  ButtonDelete,
  Container,
  Status,
  Text,
  Title,
  TopContainer,
} from './styledComponents';
import { ThemeContext } from 'src/context/ThemeContext';
import { Loading } from 'src/components/Loading';
import { queryClient } from 'src/lib/react-query';
import ModalConfirmacao from 'src/components/modalConfirmacao';

interface Data {
  id: string;
  title: string;
  text: string;
  createdAt: string;
  isDelete: boolean;
  action: string;
}

function createData(
  id: string,
  title: string,
  text: string,
  createdAt: string,
  isDelete: boolean,
  action: string,
): Data {
  return {
    id,
    title,
    text,
    createdAt,
    isDelete,
    action,
  };
}

interface HeadCell {
  id: keyof Data;
  label: string;
  centered: boolean;
}

const headCells: readonly HeadCell[] = [
  {
    id: 'title',
    centered: false,
    label: 'MENSAGEM',
  },
  {
    id: 'createdAt',
    centered: false,
    label: 'DATA',
  },
  {
    id: 'isDelete',
    centered: false,
    label: 'STATUS',
  },
  {
    id: 'action',
    centered: true,
    label: 'AÇÃO',
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
            align={headCell.centered ? 'center' : 'left'}
            padding={'normal'}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabelStyled
              active={orderBy === headCell.id}
              direction={order === 'asc' ? 'desc' : 'asc'}
              onClick={createSortHandler(headCell.id)}
              hideSortIcon={
                headCell.id != 'title' && headCell.id != 'createdAt'
              }
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <Box component="span" sx={visuallyHidden}>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </Box>
              ) : null}
            </TableSortLabelStyled>
          </TableCellStyled>
        ))}
      </TableRow>
    </TableHead>
  );
}

export default function TableMessages() {
  const { state, mobile } = useContext(ThemeContext);
  const [order, setOrder] = useState<'asc' | 'desc'>('desc');
  const [orderBy] = useState('ANO_NOME');
  const [selectedColumn, setSelectedColumn] = useState(null);
  const [page, setPage] = useState(1);
  const [qntPage, setQntPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState(null);
  const [searchTerm, setSearchTerm] = useState(null);
  const [disablePrev, setDisablePrev] = useState(true);
  const [disableNext, setDisableNext] = useState(false);
  const [modalShowMessage, setModalShowMessage] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [modalShowDelete, setModalShowDelete] = useState(false);
  const [idDeleteMessage, setIdDeleteMessage] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const [ModalShowConfirm, setModalShowConfirm] = useState(false);
  const [modalStatus, setModalStatus] = useState(true);
  const [errorMessage, setErrorMessage] = useState(true);

  const { data, isLoading: isLoading } = useGetMessages({
    search: search,
    page: page,
    limit: limit,
    order: order.toUpperCase(),
    column: selectedColumn,
    status: null,
  });

  useEffect(() => {
    const list = [];

    setQntPage(data?.meta?.totalPages);

    data?.items?.map((x) => {
      list.push(
        createData(x.id, x.title, x.text, x.createdAt, !!x.deletedAt, null),
      );
    });
    setRows(list);
  }, [data?.items, data?.meta?.totalPages]);

  const handleRequestSort = (
    _event: React.MouseEvent<unknown>,
    property: keyof Data,
  ) => {
    const isAsc = order === 'asc';
    const orderNew = isAsc ? 'desc' : 'asc';
    setOrder(orderNew);
    setSelectedColumn(property);
  };

  async function handleDeleteMessage() {
    let response;
    try {
      response = await deleteMessage(idDeleteMessage);
    } catch (error) {
      console.log(error.data?.data?.message);
    }

    if (!response?.data?.message) {
      setModalShowDelete(false);
      setIdDeleteMessage('');
      queryClient.invalidateQueries(['messages']);
      setModalStatus(true);
      setModalShowConfirm(true);
    } else {
      setModalStatus(false);
      setModalShowConfirm(true);
      setErrorMessage(response.data?.message || 'Erro ao enviar mensagem');
    }
    setModalShowMessage(false);
  }

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

  useEffect(() => {
    if (debouncedSearchTerm) {
      setSearch(debouncedSearchTerm);
    } else setSearch('');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearchTerm]);

  const handleChangeSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleShowMessage = (mensagem) => {
    setSelectedMessage(mensagem);
    setModalShowMessage(true);
  };

  const setRow = (row, index) => {
    const labelId = `enhanced-table-checkbox-${index}`;

    return (
      <TableRowStyled
        role="checkbox"
        tabIndex={-1}
        onClick={() => {
          handleShowMessage(row);
        }}
        key={row.id}
      >
        <TableCell
          component="th"
          id={labelId}
          scope="row"
          padding="normal"
          style={{ maxWidth: 400 }}
        >
          <Title>
            {row.title} <br />
          </Title>
          <Text mobile={mobile}>
            <div dangerouslySetInnerHTML={{ __html: row.text }} />
          </Text>
        </TableCell>
        <TableCellBorder>
          {formatDate(row.createdAt, 'dd/MM/yyyy')}
        </TableCellBorder>
        <TableCellBorder>
          {!row.isDelete ? (
            <Status sent={!row.isDelete}>Enviada</Status>
          ) : (
            <Status sent={false}>Deletada</Status>
          )}
        </TableCellBorder>
        <TableCellBorder align="center">
          {!row.isDelete && (
            <ButtonDelete
              type="button"
              onClick={(e) => {
                setModalShowDelete(true);
                setIdDeleteMessage(row.id);
                e.stopPropagation();
              }}
            >
              <BiTrash color={'#FF6868'} size={16} />
            </ButtonDelete>
          )}
        </TableCellBorder>
      </TableRowStyled>
    );
  };

  return (
    <>
      <Container>
        {mobile && (
          <div style={{ width: 137, paddingLeft: 10, paddingTop: 10 }}>
            <ButtonDefault
              onClick={() => {
                Router.push(`/painel/${state.slug}/nova-mensagem`);
              }}
            >
              Enviar Mensagem
            </ButtonDefault>
          </div>
        )}
        <TopContainer>
          <div className="d-flex ms-2 mb-2">
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
          {!mobile && (
            <div style={{ width: 137 }}>
              <ButtonDefault
                onClick={() => {
                  Router.push(`/painel/${state.slug}/nova-mensagem`);
                }}
              >
                Enviar Mensagem
              </ButtonDefault>
            </div>
          )}
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
                <option value={10}>10</option>
                <option value={25}>25</option>
              </FormSelectStyled>
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
      <ModalDelete
        show={modalShowDelete}
        onHide={() => setModalShowDelete(false)}
        onConfirm={handleDeleteMessage}
        buttonNo={'Manter Mensagem'}
        buttonYes={'Deletar Mensagem'}
        text={`Você está deletando a mensagem e não ficará mais visível aos municípios.`}
      />
      <ModalMessage
        show={modalShowMessage}
        onHide={() => setModalShowMessage(false)}
        message={selectedMessage}
      />
      <ModalConfirmacao
        show={ModalShowConfirm}
        onHide={() => {
          setModalShowConfirm(false), modalStatus && Router.reload();
        }}
        text={
          modalStatus ? `Mensagem deletada com sucesso.` : errorMessage
          //errorMessage
        }
        status={modalStatus}
      />
    </>
  );
}
