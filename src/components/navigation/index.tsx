import { Collapse, List, ListItemButton } from '@mui/material';
import Image from 'next/image';
import Link from 'next/link';
import Router, { useRouter } from 'next/router';
import { useEffect, useMemo, useState } from 'react';
import {
  MdExitToApp,
  MdExpandLess,
  MdExpandMore,
  MdOutlineHome,
  MdOutlinePersonAdd,
} from 'react-icons/md';
import { IArea, useAuth } from 'src/context/AuthContext';
import { parseCookies } from '../../utils/cookies';
import { ADMINLINKS, PERFISLINKS } from '../../utils/menu';
import {
  ButtonLogout,
  ButtonText,
  IconButton,
  ImageStyled,
  Nav,
  SubTitle,
  TitleGroup,
  UserInfo,
  UserWrapper,
} from './styledComponents';

export default function Navigation({ toggleMenu }) {
  const { pathname } = useRouter();
  const [open, setOpen] = useState(null);
  const { user } = useAuth();
  const cookies = parseCookies();

  let areas = [] as IArea[];
  if (user?.access_profile) {
    const userAreas = cookies['USU_AREAS'];
    if (userAreas !== undefined) {
      areas = JSON.parse(userAreas) as IArea[];
    }
  }

  useEffect(() => {
    const list = [];
    PERFISLINKS.map((x) => {
      list.push({
        name: x?.grupo,
        open: false,
      });
    });
    setOpen(list);
  }, []);

  const handleOpen = (grupo) => {
    if (open) {
      const list = open.map((x) => {
        if (x?.name === grupo) x.open = !x.open;
        return x;
      });
      setOpen(list);
    }
    return false;
  };

  const getOpen = (grupo) => {
    if (open) {
      const find = open?.find((x) => x?.name === grupo);
      return find?.open;
    }
    return false;
  };

  const getPath = (pathname: string) => {
    const path = pathname.split('/');

    const lastPath = path[path.length - 1];

    return '/' + lastPath;
  };

  const { signOut } = useAuth();

  const filterLinks = useMemo(() => {
    if (user?.subRole === 'ADMIN') return ADMINLINKS;
    const filter = PERFISLINKS.map((data) => {
      let isVerify = false;
      areas?.forEach((area) => {
        if (area.tag === data?.ARE_NOME) {
          isVerify = true;
        }
      });

      if (isVerify) {
        return data;
      } else {
        const options = data.items.filter((item) => {
          let verifyItem = false;

          areas?.forEach((area) => {
            if (item.validate || area.tag === item.ARE_NOME) {
              if (item?.bolsista && user?.subRole !== 'BOLSISTA')
                verifyItem = false;
              else verifyItem = true;
            }
          });

          return verifyItem;
        });

        if (options.length) {
          return {
            grupo: data.grupo,
            items: options,
          };
        }
      }
    });
    return filter;
  }, [user]);

  return (
    <Nav>
      <UserWrapper>
        <>
          <div className="d-flex pb-2">
            <Image
              src="/assets/images/logoParc.png"
              width={41}
              height={28.8}
              alt=""
            />
            <SubTitle>
              <strong>
                SISTEMA DE GESTÃO
                <br />
                DE BOLSAS
              </strong>
            </SubTitle>
          </div>
          <Link
            href={`/painel/${user?.partner_state?.slug}/minha-conta`}
            passHref
          >
            {user?.image_profile ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                style={{ cursor: 'pointer' }}
                src={user?.image_profile_url}
                className="rounded-circle"
                width={42}
                height={42}
                alt="foto usuário"
              />
            ) : (
              <ImageStyled
                src="/assets/images/avatar.png"
                className="rounded-circle"
                width={42}
                height={42}
              />
            )}
          </Link>
          <div className="d-flex justify-content-between align-items-center flex-wrap py-2">
            <Link
              href={`/painel/${user?.partner_state?.slug}/minha-conta`}
              passHref
            >
              <UserInfo style={{ cursor: 'pointer' }}>
                <strong>{user?.name}</strong>
                <br />
                {user?.subRole === 'ADMIN'
                  ? 'ADMIN'
                  : user?.access_profile?.name}
              </UserInfo>
            </Link>
            <div>
              <ButtonLogout onClick={signOut}>
                <MdExitToApp color={'#FFF'} size={24} />
              </ButtonLogout>
            </div>
          </div>
        </>
      </UserWrapper>
      <List
        sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}
        component="nav"
        aria-labelledby="nested-list-subheader"
      >
        <ListItemButton
          sx={{
            pl: 4,
            backgroundColor:
              getPath(pathname) === `/[estado]` ? '#f4f2ff' : '#fff',
          }}
          onClick={() => {
            toggleMenu && toggleMenu();
            Router.push(`/painel/${user?.partner_state?.slug}/`);
          }}
        >
          <IconButton
            active={`/[estado]` === getPath(pathname)}
            reactIcon={true}
          >
            <MdOutlineHome size={22} />
          </IconButton>
          <ButtonText
            primary="Home"
            active={`/[estado]` === getPath(pathname)}
            sx={{
              '.MuiListItemText-primary': {
                fontSize: ' 0.75rem !important',
                fontWeight: 500,
              },
            }}
          />
        </ListItemButton>
        {user?.subRole === 'BOLSISTA' && !user?.access_profile && (
          <ListItemButton
            sx={{
              pl: 4,
              backgroundColor:
                getPath(pathname) === '/cadastro-completo-do-bolsista'
                  ? '#f4f2ff'
                  : '#fff',
            }}
            onClick={() => {
              toggleMenu && toggleMenu();
              Router.push(
                `/painel/${user?.partner_state?.slug}/cadastro-completo-do-bolsista`,
              );
            }}
          >
            <IconButton
              active={'/cadastro-completo-do-bolsista' === getPath(pathname)}
              reactIcon={true}
            >
              <MdOutlinePersonAdd size={22} />
            </IconButton>
            <ButtonText
              active={'/cadastro-completo-do-bolsista' === getPath(pathname)}
              primary="Cadastro Completo do Bolsista"
              sx={{
                '.MuiListItemText-primary': {
                  fontSize: ' 0.75rem !important',
                  fontWeight: 500,
                },
              }}
            />
          </ListItemButton>
        )}
        {filterLinks?.map((x) => (
          <>
            {x && (
              <>
                <ListItemButton
                  onClick={() => handleOpen(x?.grupo)}
                  sx={{ borderTop: '1px solid #D5D5D5' }}
                >
                  <TitleGroup
                    primary={x?.grupo}
                    sx={{
                      '.MuiListItemText-primary': {
                        fontSize: ' 0.75rem !important',
                        fontWeight: 600,
                      },
                    }}
                  />
                  {getOpen(x?.grupo) ? <MdExpandLess /> : <MdExpandMore />}
                </ListItemButton>
                <Collapse in={getOpen(x?.grupo)} timeout="auto" unmountOnExit>
                  <List component="div" disablePadding>
                    {x?.items.map(({ name, path, icon, reactIcons }) => (
                      <ListItemButton
                        key={name}
                        sx={{
                          pl: 4,
                          backgroundColor:
                            getPath(pathname) === path ? '#f4f2ff' : '#fff',
                        }}
                        onClick={() => {
                          toggleMenu && toggleMenu();
                          Router.push(
                            `/painel/${user?.partner_state?.slug}/${path}`,
                          );
                        }}
                      >
                        <IconButton
                          active={getPath(pathname) === path}
                          sx={{ maxWidth: 'none' }}
                          reactIcon={reactIcons}
                        >
                          {icon}
                        </IconButton>
                        <ButtonText
                          primary={name}
                          active={path === getPath(pathname)}
                          sx={{
                            '.MuiListItemText-primary': {
                              fontSize: ' 0.75rem !important',
                              fontWeight: 500,
                            },
                          }}
                        />
                      </ListItemButton>
                    ))}
                  </List>
                </Collapse>
              </>
            )}
          </>
        ))}
      </List>
    </Nav>
  );
}
