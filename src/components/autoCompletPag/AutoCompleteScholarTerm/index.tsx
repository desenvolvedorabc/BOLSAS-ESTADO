import { Autocomplete, TextField } from '@mui/material';
import { useState, useEffect } from 'react';
import { getScholarshipTerm } from 'src/services/bolsista.service';
import useDebounce from 'src/utils/use-debounce';

export function AutoCompleteScholarTerm({
  scholar,
  changeScholar,
  width = '100%',
  active = null,
  error,
  disable,
}) {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState(null);
  const [limit, setLimit] = useState(false);
  const [list, setList] = useState([]);

  const [position, setPosition] = useState(0);
  const [listboxNode, setListboxNode] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const debouncedSearchTerm = useDebounce(search, 500);

  const loadCounties = async () => {
    setIsLoading(true);
    const params = {
      search: debouncedSearchTerm,
      page: page,
      limit: 10,
      order: 'ASC',
      active: 1,
    };
    const resp = await getScholarshipTerm(params);

    if (!resp?.items?.length) {
      setLimit(true);
      setIsLoading(false);
      return;
    }
    setPage(page + 1);
    setList([...list, ...resp.items]);

    setIsLoading(false);
  };

  useEffect(() => {
    if (listboxNode !== null) {
      listboxNode.scrollTop = position;
    }
  }, [position, listboxNode]);

  useEffect(() => {
    if (debouncedSearchTerm) {
      setPage(1);
      setList([]);
      loadCounties();
    } else {
      loadCounties();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearchTerm]);

  const handleScroll = async (event) => {
    setListboxNode(event.currentTarget);

    const x = event.currentTarget.scrollTop + event.currentTarget.clientHeight;

    if (event.currentTarget.scrollHeight - x <= 1 && !limit) {
      await loadCounties();
      setPosition(x);
    }
  };

  return (
    <Autocomplete
      style={{ width: width, background: '#FFF' }}
      fullWidth
      className="col"
      id="scholar"
      size="small"
      value={scholar}
      noOptionsText="Nenhum bolsista encontrado"
      options={list}
      disabled={disable}
      getOptionLabel={(option) =>
        `${option?.user?.name} - ${option?.user?.cpf}`
      }
      isOptionEqualToValue={(option, value) => option.user?.id === value?.id}
      onChange={(_event, newValue) => {
        changeScholar(newValue);
      }}
      onInputChange={(_event, newValue) => {
        setPage(1);
        setList([]);
        setLimit(false);
        setSearch(newValue);
      }}
      ListboxProps={{
        onScroll: handleScroll,
      }}
      loading={isLoading}
      sx={{
        '& .Mui-disabled': {
          background: '#D3D3D3',
        },
      }}
      renderInput={(params) => (
        <TextField
          size="small"
          {...params}
          label="Faça uma busca do bolsista por CPF ou Nome"
          error={!!error}
          helperText={
            error
              ? error?.type === 'typeError'
                ? 'Campo obrigatório'
                : error?.message
              : ''
          }
        />
      )}
    />
  );
}
