import { useState, useEffect, useCallback } from 'react';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { visuallyHidden } from '@mui/utils';
import { ButtonVerMais, Container } from './styledComponents';
import {
  TableCellBorder,
  Pagination,
  FormSelectStyled,
  ButtonPage,
  TableCellStyled,
  TableRowStyled,
  TableSortLabelStyled,
} from 'src/shared/styledTables';
import { MdNavigateNext, MdNavigateBefore } from 'react-icons/md';
import { ModalActionDetail } from '../ModalActionDetail';
import { BiTrash } from 'react-icons/bi';
import ModalPergunta from 'src/components/modalPergunta';
import { ISchedule } from 'src/services/plano-trabalho.service';
import { getMonthsName } from 'src/utils/anos';

interface Data {
  month: string;
  year: string;
  action: string;
  delete?: boolean;
}

interface Props {
  schedules: ISchedule[];
  edit: boolean;
  changeSchedules: (schedule: ISchedule) => void;
  changedTable?: boolean;
  isUserFormer: boolean;
}

function createData(month: string, year: string, action: string): Data {
  return {
    month,
    year,
    action,
  };
}

interface HeadCell {
  id: keyof Data;
  label: string;
  numeric: boolean;
}

const headCells: HeadCell[] = [
  {
    id: 'month',
    numeric: false,
    label: 'MÊS',
  },
  {
    id: 'year',
    numeric: false,
    label: 'ANO',
  },
  {
    id: 'action',
    numeric: false,
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
  headCellsEdit: HeadCell[];
}

function EnhancedTableHead(props: EnhancedTableProps) {
  const { order, orderBy, onRequestSort, headCellsEdit } = props;
  const createSortHandler =
    (property: keyof Data) => (event: React.MouseEvent<unknown>) => {
      onRequestSort(event, property);
    };

  return (
    <TableHead>
      <TableRow>
        {headCellsEdit.map((headCell) => (
          <TableCellStyled
            key={headCell.id}
            align={headCell.numeric ? 'right' : 'left'}
            padding={'normal'}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            {headCell.id === 'month' ? (
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

export function TableSchedules({
  schedules,
  edit,
  changeSchedules,
  changedTable,
  isUserFormer,
}: Props) {
  const [order, setOrder] = useState<'asc' | 'desc'>('asc');
  const [orderBy] = useState('month');
  const [page, setPage] = useState(1);
  const [qntPage, setQntPage] = useState(1);
  const [limit, setLimit] = useState(5);
  const [disablePrev, setDisablePrev] = useState(true);
  const [disableNext, setDisableNext] = useState(false);
  // const { mobile } = useContext(ThemeContext);
  const [modalShowActionDetail, setModalShowActionDetail] = useState(false);
  const [modalShowActionDeleteSchedule, setModalShowActionDeleteSchedule] =
    useState(false);
  const [schedule, setSchedule] = useState(null);
  const [headCellsEdit, setHeadCellsEdit] = useState(headCells);
  const [isEdit, setIsEdit] = useState(false);
  const [rows, setRows] = useState([]);
  const [changedSchedule, setChangedSchedule] = useState(false);

  useEffect(() => {
    setIsEdit(edit);
    const list = headCells;
    if (edit && list.length === 3) {
      list.push({
        id: 'delete',
        numeric: false,
        label: '',
      });
      setHeadCellsEdit(list);
    } else {
      if (list.length === 4) {
        list.pop();
        setHeadCellsEdit(list);
      }
    }
  }, [edit]);

  const handleRequestSort = () => {
    const isAsc = order === 'asc';
    const formattedOrder = isAsc ? 'desc' : 'asc';
    setOrder(formattedOrder);
    setPage(1);
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

  async function loadSchedules() {
    let rowsPage = schedules.slice(
      limit * (page - 1),
      limit * (page - 1) + limit,
    );

    if (order === 'asc') rowsPage = rowsPage.sort((a, b) => a.month - b.month);
    if (order === 'desc') rowsPage = rowsPage.sort((a, b) => b.month - a.month);

    setRows(rowsPage);

    const qnt = Math.ceil(schedules.length / limit);

    setQntPage(qnt > 0 ? qnt : 1);
  }

  useEffect(() => {
    loadSchedules();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [changedTable, page, limit, order]);

  const handleOpenModalDetail = (row) => {
    setModalShowActionDetail(true);
    setSchedule(row);
    setChangedSchedule(!changedSchedule);
  };

  const handleOpenModalDeleteSchedule = (row) => {
    setModalShowActionDeleteSchedule(true);
    setSchedule(row);
  };

  const handleChangeSchedules = (schedule) => {
    schedules.forEach((row) => {
      if (row.id === schedule.id) {
        row.action = schedule.action;
        row.isFormer = schedule.isFormer;
        row.month = schedule.month;
        row.year = schedule.year;
      }
    });

    loadSchedules();
  };

  return (
    <>
      <Container>
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
                  headCellsEdit={headCellsEdit}
                />

                <TableBody>
                  {rows?.map((row, index) => {
                    const labelId = `enhanced-table-checkbox-${index}`;

                    return (
                      <TableRowStyled
                        key={index}
                        role="checkbox"
                        tabIndex={-1}
                        style={{ width: '100%' }}
                      >
                        <TableCell
                          component="th"
                          id={labelId}
                          scope="row"
                          padding="normal"
                        >
                          {getMonthsName(row?.month)}
                        </TableCell>
                        <TableCellBorder>{row?.year}</TableCellBorder>
                        <TableCellBorder
                          style={{ maxWidth: 350, maxHeight: 50 }}
                        >
                          <div
                            style={{
                              overflow: 'hidden',
                              whiteSpace: 'nowrap',
                              textOverflow: 'ellipsis',
                            }}
                          >
                            {row?.action}
                          </div>
                          <ButtonVerMais
                            type="button"
                            onClick={() => handleOpenModalDetail(row)}
                          >
                            Ver Mais
                          </ButtonVerMais>
                        </TableCellBorder>
                        {isEdit && (
                          <TableCellBorder align="center">
                            <button
                              type="button"
                              onClick={() => handleOpenModalDeleteSchedule(row)}
                            >
                              <BiTrash color={'#FF6868'} size={18} />
                            </button>
                          </TableCellBorder>
                        )}
                      </TableRowStyled>
                    );
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
      <ModalActionDetail
        show={modalShowActionDetail}
        onHide={() => {
          setModalShowActionDetail(false);
        }}
        schedule={schedule}
        edit={edit}
        changedSchedule={changedSchedule}
        isUserFormer={isUserFormer}
        changeSchedules={handleChangeSchedules}
      />
      <ModalPergunta
        show={modalShowActionDeleteSchedule}
        onHide={() => setModalShowActionDeleteSchedule(false)}
        onConfirm={() => {
          changeSchedules(schedule), setModalShowActionDeleteSchedule(false);
        }}
        buttonNo={'Não Excluir'}
        buttonYes={'Sim, tenho certeza'}
        text={`Atenção! Você está excluindo essa ação do cronograma. 
        Tem certeza que deseja continuar?`}
        status={false}
        warning={false}
        size="md"
      />
    </>
  );
}
