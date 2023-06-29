import {
  MdList,
  MdOutlineHome,
  MdOutlineManageAccounts,
  MdOutlinePersonAdd,
  MdOutlineSettings,
} from 'react-icons/md';
import { BsCardChecklist, BsSliders } from 'react-icons/bs';
import { FaRegHandshake } from 'react-icons/fa';
import { CgProfile } from 'react-icons/cg';
import { TbMailForward } from 'react-icons/tb';
import { RiFileList3Line, RiUserFollowLine } from 'react-icons/ri';
import Log from 'public/assets/images/log.svg';
import Chart from 'public/assets/images/chart.svg';
import ChartCheck from 'public/assets/images/chartCheck.svg';
import Document from 'public/assets/images/document.svg';
import DocumentSign from 'public/assets/images/documentSign.svg';
import DocumentRemove from 'public/assets/images/documentRemove.svg';
import BankOut from 'public/assets/images/bankOut.svg';
import SendEmail from 'public/assets/images/sendEmail.svg';
import TextUser from 'public/assets/images/textUser.svg';

export const PERFISLINKS = [
  // {
  //   grupo: '',
  //   items: [
  //     {
  //       name: 'Home',
  //       path: '/',
  //       ARE_NOME: 'HOME',
  //       validate: true,
  //       icon: <MdOutlineHome size={22} />,
  //     },
  //   ],
  // },
  {
    grupo: 'Gestão de Parceiros',
    ARE_NOME: 'REL',
    items: [
      {
        name: 'Usuários Admin',
        ARE_NOME: 'USU_ADM',
        path: '/usuarios-admin',
        icon: <MdOutlineManageAccounts size={22} />,
        bolsista: false,
        reactIcons: true,
      },
      {
        name: 'Regionais Parceiras',
        ARE_NOME: 'REG_PAR',
        path: '/regionais-parceiras',
        icon: <FaRegHandshake size={22} />,
        bolsista: false,
        reactIcons: true,
      },
    ],
  },
  {
    ARE_NOME: 'GEST',
    grupo: 'Gestão de Acessos',
    items: [
      {
        name: 'Perfis de Acesso',
        ARE_NOME: 'PER_ACE',
        path: '/perfis-de-acesso',
        icon: <CgProfile size={22} />,
        bolsista: false,
        reactIcons: true,
      },
      {
        name: 'Minha Conta',
        ARE_NOME: 'MIN_CON',
        path: `/minha-conta`,
        validate: true,
        icon: <MdOutlineSettings size={22} />,
        bolsista: false,
        reactIcons: true,
      },
    ],
  },
  {
    ARE_NOME: 'GEST_PLN_TRAB',
    grupo: 'Gestão do Plano de Trabalho',
    items: [
      {
        name: 'Plano de Trabalho',
        ARE_NOME: 'PLN_TRAB',
        path: '/plano-de-trabalho',
        icon: <MdList size={22} />,
        bolsista: true,
        reactIcons: true,
      },
      {
        name: 'Aprovações de Planos de Trabalho',
        ARE_NOME: 'APRO_PLN_TRAB',
        path: `/aprovacoes-de-planos-de-trabalho`,
        icon: <BsCardChecklist size={22} />,
        bolsista: false,
        reactIcons: true,
      },
    ],
  },
  {
    ARE_NOME: 'REL_BOL',
    grupo: 'Relatórios do Bolsista',
    items: [
      {
        name: 'Relatórios Mensais',
        ARE_NOME: 'REL_MES',
        path: '/relatorios-mensais',
        icon: <Chart size={22} />,
        bolsista: true,
        reactIcons: false,
      },
      {
        name: 'Aprovação de Relatórios',
        ARE_NOME: 'APRO_REL',
        path: `/aprovacao-de-relatorios`,
        icon: <ChartCheck size={22} />,
        bolsista: false,
        reactIcons: false,
      },
    ],
  },
  {
    ARE_NOME: 'GES_CON',
    grupo: 'Gestão de Contratos',
    items: [
      {
        name: 'Termo de Compromisso',
        ARE_NOME: 'TER_ADS',
        path: '/termo-de-compromisso',
        icon: <Document size={22} />,
        bolsista: false,
        reactIcons: false,
      },
      {
        name: 'Assinatura do Termo de Compromisso',
        ARE_NOME: 'ASS_ADS',
        path: `/assinatura-de-termo-de-compromisso`,
        icon: <DocumentSign size={22} />,
        bolsista: true,
        reactIcons: false,
      },
      {
        name: 'Desistência do Termo de Compromisso',
        ARE_NOME: 'DES_ADS',
        path: `/desistencia-do-termo-de-compromisso`,
        icon: <DocumentRemove size={22} />,
        bolsista: true,
        reactIcons: false,
      },
    ],
  },
  {
    ARE_NOME: 'GES_PAG',
    grupo: 'Gestão de Pagamentos',
    items: [
      {
        name: 'Remessa bancária',
        ARE_NOME: 'REM_BAN',
        path: '/remessa-bancaria',
        icon: <BankOut size={22} />,
        bolsista: false,
        reactIcons: false,
      },
      {
        name: 'Receitas Anuais',
        ARE_NOME: 'REC_ANO',
        path: '/receitas-anuais',
        icon: <RiFileList3Line size={22} />,
        bolsista: true,
        reactIcons: true,
      },
    ],
  },
  {
    ARE_NOME: 'GES_MEN',
    grupo: 'Gestão de Mensagens',
    items: [
      {
        name: 'Envio de Mensagens',
        ARE_NOME: 'ENV_MEN',
        path: '/envio-de-mensagens',
        icon: <TbMailForward size={22} />,
        // icon: <SendEmail size={22} />,
        bolsista: false,
        reactIcons: true,
      },
      // {
      //   name: 'Recebimento de Mensagens',
      //   ARE_NOME: 'REC_MEN',
      //   path: '/recebimento-de-mensagens',
      //   icon: <OpenEmail size={22} />,
      //   bolsista: false,
      // },
    ],
  },
  // {
  //   ARE_NOME: 'GES_NOT',
  //   grupo: 'Gestão de Notificações',
  //   items: [
  //     {
  //       name: 'Envio de Notificações',
  //       ARE_NOME: 'ENV_NOT',
  //       path: '/envio-de-notificações',
  //       icon: <AddNotification size={22} />,
  //       bolsista: false,
  //     },
  //     {
  //       name: 'Recebimento de Notificações',
  //       ARE_NOME: 'REC_NOT',
  //       path: '/recebimento-de-notificações',
  //       icon: <ReceiveNotification size={22} />,
  //       bolsista: false,
  //     },
  //   ],
  // },
  {
    ARE_NOME: 'GES_BOL',
    grupo: 'Gestão de Bolsista',
    items: [
      {
        name: 'Pré Cadastro do Bolsista',
        ARE_NOME: 'PRE_CAD_BOL',
        path: '/pre-cadastro-dos-bolsistas',
        icon: <TextUser size={22} />,
        bolsista: false,
        reactIcons: false,
      },
      {
        name: 'Cadastro Completo do Bolsista',
        ARE_NOME: 'CAD_COM_BOL',
        path: '/cadastro-completo-do-bolsista',
        icon: <MdOutlinePersonAdd size={22} />,
        bolsista: false,
        reactIcons: true,
      },
      {
        name: 'Aprovação de Cadastro do Bolsista',
        ARE_NOME: 'APRO_CAD_BOL',
        path: '/aprovacao-de-cadastro-do-bolsista',
        icon: <RiUserFollowLine size={22} />,
        bolsista: false,
        reactIcons: true,
      },
    ],
  },
  {
    ARE_NOME: 'SUP',
    grupo: 'Suporte',
    items: [
      {
        name: 'Logs do Sistema',
        ARE_NOME: 'LOG_ST',
        path: `/logs`,
        icon: <Log size={22} />,
        bolsista: false,
        reactIcons: false,
      },
    ],
  },
];

export const ESTADOLINKS = [
  {
    grupo: '',
    items: [
      {
        name: 'Home',
        path: '/',
        ARE_NOME: 'HOME',
        validate: true,
        icon: <MdOutlineHome size={22} />,
      },
    ],
  },
  {
    grupo: 'Gestão de Parceiros',
    ARE_NOME: 'REL',
    items: [
      {
        name: 'Usuários Admin',
        ARE_NOME: 'USU_ADM',
        path: '/usuarios-admin',
        icon: <MdOutlineManageAccounts size={22} />,
      },
      {
        name: 'Regionais Parceiras',
        ARE_NOME: 'REG_PAR',
        path: '/regionais-parceiras',
        icon: <FaRegHandshake size={22} />,
      },
    ],
  },
  {
    ARE_NOME: 'GEST',
    grupo: 'Gestão de Acessos',
    items: [
      {
        name: 'Perfis de Acesso',
        ARE_NOME: 'PER_ACE',
        path: '/perfis-de-acesso',
        icon: <CgProfile size={22} />,
      },
    ],
  },
  {
    ARE_NOME: 'REL_BOL',
    grupo: 'Relatórios do Bolsista',
    items: [
      {
        name: 'Aprovação de Relatórios',
        ARE_NOME: 'APRO_REL',
        path: `/aprovacao-de-relatorios`,
        icon: <ChartCheck size={22} />,
      },
    ],
  },
  {
    ARE_NOME: 'GES_MEN',
    grupo: 'Gestão de Mensagens',
    items: [
      {
        name: 'Envio de Mensagens',
        ARE_NOME: 'ENV_MEN',
        path: '/envio-de-mensagens',
        icon: <SendEmail size={22} />,
      },
      // {
      //   name: 'Recebimento de Mensagens',
      //   ARE_NOME: 'REC_MEN',
      //   path: '/recebimento-de-mensagens',
      //   icon: <OpenEmail size={22} />,
      // },
    ],
  },
  {
    ARE_NOME: 'GES_PAG',
    grupo: 'Gestão de Pagamentos',
    items: [
      {
        name: 'Remessa bancária',
        ARE_NOME: 'REM_BAN',
        path: '/remessa-bancaria',
        icon: <BankOut size={22} />,
      },
    ],
  },
  {
    ARE_NOME: 'SUP',
    grupo: 'Suporte',
    items: [
      {
        name: 'Logs do Sistema',
        ARE_NOME: 'LOG_ST',
        path: `/logs`,
        icon: <Log size={22} />,
      },
    ],
  },
];

export const REGIONALLINKS = [
  {
    grupo: '',
    items: [
      {
        name: 'Home',
        path: '/',
        ARE_NOME: 'HOME',
        validate: true,
        icon: <MdOutlineHome size={22} />,
      },
    ],
  },
  {
    grupo: 'Gestão de Parceiros',
    ARE_NOME: 'REL',
    items: [
      {
        name: 'Usuários Admin',
        ARE_NOME: 'USU_ADM',
        path: '/usuarios-admin',
        icon: <MdOutlineManageAccounts size={22} />,
      },
    ],
  },
  {
    ARE_NOME: 'GEST',
    grupo: 'Gestão de Acessos',
    items: [
      {
        name: 'Perfis de Acesso',
        ARE_NOME: 'PER_ACE',
        path: '/perfis-de-acesso',
        icon: <CgProfile size={22} />,
      },
    ],
  },
  {
    ARE_NOME: 'GEST_PLN_TRAB',
    grupo: 'Gestão do Plano de Trabalho',
    items: [
      {
        name: 'Plano de Trabalho',
        ARE_NOME: 'PLN_TRAB',
        path: '/plano-de-trabalho',
        icon: <MdList size={22} />,
        bolsista: true,
      },
      {
        name: 'Aprovações de Planos de Trabalho',
        ARE_NOME: 'APRO_PLN_TRAB',
        path: `/aprovacoes-de-planos-de-trabalho`,
        icon: <BsCardChecklist size={22} />,
      },
    ],
  },
  {
    ARE_NOME: 'REL_BOL',
    grupo: 'Relatórios do Bolsista',
    items: [
      {
        name: 'Relatórios Mensais',
        ARE_NOME: 'REL_MES',
        path: '/relatorios-mensais',
        icon: <Chart size={22} />,
        bolsista: true,
      },
      {
        name: 'Aprovação de Relatórios',
        ARE_NOME: 'APRO_REL',
        path: `/aprovacao-de-relatorios`,
        icon: <ChartCheck size={22} />,
      },
    ],
  },
  {
    ARE_NOME: 'GES_CON',
    grupo: 'Gestão de Contratos',
    items: [
      {
        name: 'Termo de Compromisso',
        ARE_NOME: 'TER_ADS',
        path: '/termo-de-compromisso',
        icon: <Document size={22} />,
      },
      {
        name: 'Assinatura do Termo de Compromisso',
        ARE_NOME: 'ASS_ADS',
        path: `/assinatura-de-termo-de-compromisso`,
        icon: <DocumentSign size={22} />,
        bolsista: true,
      },
      {
        name: 'Desistência do Termo de Compromisso',
        ARE_NOME: 'DES_ADS',
        path: `/desistencia-do-termo-de-compromisso`,
        icon: <DocumentRemove size={22} />,
        bolsista: true,
      },
    ],
  },
  {
    ARE_NOME: 'GES_PAG',
    grupo: 'Gestão de Pagamentos',
    items: [
      {
        name: 'Receitas Anuais',
        ARE_NOME: 'REC_ANO',
        path: '/receitas-anuais',
        icon: <RiFileList3Line size={22} />,
        bolsista: true,
      },
    ],
  },
  {
    ARE_NOME: 'GES_MEN',
    grupo: 'Gestão de Mensagens',
    items: [
      {
        name: 'Envio de Mensagens',
        ARE_NOME: 'ENV_MEN',
        path: '/envio-de-mensagens',
        icon: <SendEmail size={22} />,
      },
      // {
      //   name: 'Recebimento de Mensagens',
      //   ARE_NOME: 'REC_MEN',
      //   path: '/recebimento-de-mensagens',
      //   icon: <OpenEmail size={22} />,
      // },
    ],
  },
  {
    ARE_NOME: 'GES_BOL',
    grupo: 'Gestão de Bolsista',
    items: [
      {
        name: 'Pré Cadastro do Bolsista',
        ARE_NOME: 'PRE_CAD_BOL',
        path: '/pre-cadastro-dos-bolsistas',
        icon: <TextUser size={22} />,
        bolsista: false,
        reactIcons: false,
      },
      {
        name: 'Aprovação de Cadastro do Bolsista',
        ARE_NOME: 'APRO_CAD_BOL',
        path: '/aprovacao-de-cadastro-do-bolsista',
        icon: <RiUserFollowLine size={22} />,
      },
    ],
  },
];

export const MUNICIPIOLINKS = [
  {
    grupo: '',
    items: [
      {
        name: 'Home',
        path: '/',
        ARE_NOME: 'HOME',
        validate: true,
        icon: <MdOutlineHome size={22} />,
      },
    ],
  },
  {
    grupo: 'Gestão de Parceiros',
    ARE_NOME: 'REL',
    items: [
      {
        name: 'Usuários Admin',
        ARE_NOME: 'USU_ADM',
        path: '/usuarios-admin',
        icon: <MdOutlineManageAccounts size={22} />,
      },
    ],
  },
  {
    ARE_NOME: 'GEST',
    grupo: 'Gestão de Acessos',
    items: [
      {
        name: 'Perfis de Acesso',
        ARE_NOME: 'PER_ACE',
        path: '/perfis-de-acesso',
        icon: <CgProfile size={22} />,
      },
    ],
  },
  {
    ARE_NOME: 'GEST_PLN_TRAB',
    grupo: 'Gestão do Plano de Trabalho',
    items: [
      {
        name: 'Plano de Trabalho',
        ARE_NOME: 'PLN_TRAB',
        path: '/plano-de-trabalho',
        icon: <MdList size={22} />,
        bolsista: true,
      },
      {
        name: 'Aprovações de Planos de Trabalho',
        ARE_NOME: 'APRO_PLN_TRAB',
        path: `/aprovacoes-de-planos-de-trabalho`,
        icon: <BsCardChecklist size={22} />,
      },
    ],
  },
  {
    ARE_NOME: 'REL_BOL',
    grupo: 'Relatórios do Bolsista',
    items: [
      {
        name: 'Relatórios Mensais',
        ARE_NOME: 'REL_MES',
        path: '/relatorios-mensais',
        icon: <Chart size={22} />,
        bolsista: true,
      },
      {
        name: 'Aprovação de Relatórios',
        ARE_NOME: 'APRO_REL',
        path: `/aprovacao-de-relatorios`,
        icon: <ChartCheck size={22} />,
      },
    ],
  },
  {
    ARE_NOME: 'GES_CON',
    grupo: 'Gestão de Contratos',
    items: [
      {
        name: 'Assinatura do Termo de Compromisso',
        ARE_NOME: 'ASS_ADS',
        path: `/assinatura-de-termo-de-compromisso`,
        icon: <DocumentSign size={22} />,
        bolsista: true,
      },
      {
        name: 'Desistência do Termo de Compromisso',
        ARE_NOME: 'DES_ADS',
        path: `/desistencia-do-termo-de-compromisso`,
        icon: <DocumentRemove size={22} />,
        bolsista: true,
      },
    ],
  },
  {
    ARE_NOME: 'GES_PAG',
    grupo: 'Gestão de Pagamentos',
    items: [
      {
        name: 'Receitas Anuais',
        ARE_NOME: 'REC_ANO',
        path: '/receitas-anuais',
        icon: <RiFileList3Line size={22} />,
        bolsista: true,
      },
    ],
  },
  {
    ARE_NOME: 'GES_MEN',
    grupo: 'Gestão de Mensagens',
    items: [
      {
        name: 'Envio de Mensagens',
        ARE_NOME: 'ENV_MEN',
        path: '/envio-de-mensagens',
        icon: <SendEmail size={22} />,
      },
      // {
      //   name: 'Recebimento de Mensagens',
      //   ARE_NOME: 'REC_MEN',
      //   path: '/recebimento-de-mensagens',
      //   icon: <OpenEmail size={22} />,
      // },
    ],
  },
  {
    ARE_NOME: 'GES_BOL',
    grupo: 'Gestão de Bolsista',
    items: [
      {
        name: 'Pré Cadastro do Bolsista',
        ARE_NOME: 'PRE_CAD_BOL',
        path: '/pre-cadastro-dos-bolsistas',
        icon: <TextUser size={22} />,
      },
      {
        name: 'Aprovação de Cadastro do Bolsista',
        ARE_NOME: 'APRO_CAD_BOL',
        path: '/aprovacao-de-cadastro-do-bolsista',
        icon: <RiUserFollowLine size={22} />,
      },
    ],
  },
];

export const BOLSISTALINKS = [
  {
    grupo: '',
    items: [
      {
        name: 'Home',
        path: '/',
        ARE_NOME: 'HOME',
        validate: true,
        icon: <MdOutlineHome size={22} />,
      },
    ],
  },
  {
    ARE_NOME: 'GEST_PLN_TRAB',
    grupo: 'Gestão do Plano de Trabalho',
    items: [
      {
        name: 'Plano de Trabalho',
        ARE_NOME: 'PLN_TRAB',
        path: '/plano-de-trabalho',
        icon: <MdList size={22} />,
        bolsista: true,
      },
    ],
  },
  {
    ARE_NOME: 'REL_BOL',
    grupo: 'Relatórios do Bolsista',
    items: [
      {
        name: 'Relatórios Mensais',
        ARE_NOME: 'REL_MES',
        path: '/relatorios-mensais',
        icon: <Chart size={22} />,
        bolsista: true,
      },
    ],
  },
  {
    ARE_NOME: 'GES_CON',
    grupo: 'Gestão de Contratos',
    items: [
      {
        name: 'Assinatura do Termo de Compromisso',
        ARE_NOME: 'ASS_ADS',
        path: `/assinatura-de-termo-de-compromisso`,
        icon: <DocumentSign size={22} />,
        bolsista: true,
      },
      {
        name: 'Desistência do Termo de Compromisso',
        ARE_NOME: 'DES_ADS',
        path: `/desistencia-do-termo-de-compromisso`,
        icon: <DocumentRemove size={22} />,
        bolsista: true,
      },
    ],
  },
  {
    ARE_NOME: 'GES_PAG',
    grupo: 'Gestão de Pagamentos',
    items: [
      {
        name: 'Receitas Anuais',
        ARE_NOME: 'REC_ANO',
        path: '/receitas-anuais',
        icon: <RiFileList3Line size={22} />,
        bolsista: true,
      },
    ],
  },
];

export const ADMINLINKS = [
  {
    grupo: 'Gestão de Parceiros',
    ARE_NOME: 'REL',
    items: [
      {
        name: 'Usuários Admin',
        ARE_NOME: 'USU_ADM',
        path: '/usuarios-admin',
        icon: <MdOutlineManageAccounts size={22} />,
        reactIcons: true,
      },
      {
        name: 'Regionais Parceiras',
        ARE_NOME: 'REG_PAR',
        path: '/regionais-parceiras',
        icon: <FaRegHandshake size={22} />,
        reactIcons: true,
      },
    ],
  },
  {
    ARE_NOME: 'GEST',
    grupo: 'Gestão de Acessos',
    items: [
      {
        name: 'Perfis de Acesso',
        ARE_NOME: 'PER_ACE',
        path: '/perfis-de-acesso',
        icon: <CgProfile size={22} />,
        reactIcons: true,
      },
      {
        name: 'Minha Conta',
        ARE_NOME: 'MIN_CON',
        path: `/minha-conta`,
        validate: true,
        icon: <MdOutlineSettings size={22} />,
        reactIcons: true,
      },
    ],
  },
  {
    ARE_NOME: 'GEST_PLN_TRAB',
    grupo: 'Gestão do Plano de Trabalho',
    items: [
      {
        name: 'Aprovações de Planos de Trabalho',
        ARE_NOME: 'APRO_PLN_TRAB',
        path: `/aprovacoes-de-planos-de-trabalho`,
        icon: <BsCardChecklist size={22} />,
        reactIcons: true,
      },
    ],
  },
  {
    ARE_NOME: 'REL_BOL',
    grupo: 'Relatórios do Bolsista',
    items: [
      {
        name: 'Aprovação de Relatórios',
        ARE_NOME: 'APRO_REL',
        path: `/aprovacao-de-relatorios`,
        icon: <ChartCheck size={22} />,
        reactIcons: false,
      },
    ],
  },
  {
    ARE_NOME: 'GES_CON',
    grupo: 'Gestão de Contratos',
    items: [
      {
        name: 'Termo de Compromisso',
        ARE_NOME: 'TER_ADS',
        path: '/termo-de-compromisso',
        icon: <Document size={22} />,
        reactIcons: false,
      },
    ],
  },
  {
    ARE_NOME: 'GES_PAG',
    grupo: 'Gestão de Pagamentos',
    items: [
      {
        name: 'Remessa bancária',
        ARE_NOME: 'REM_BAN',
        path: '/remessa-bancaria',
        icon: <BankOut size={22} />,
        reactIcons: false,
      },
    ],
  },
  {
    ARE_NOME: 'GES_MEN',
    grupo: 'Gestão de Mensagens',
    items: [
      {
        name: 'Envio de Mensagens',
        ARE_NOME: 'ENV_MEN',
        path: '/envio-de-mensagens',
        icon: <TbMailForward size={22} />,
        reactIcons: true,
      },
      // {
      //   name: 'Recebimento de Mensagens',
      //   ARE_NOME: 'REC_MEN',
      //   path: '/recebimento-de-mensagens',
      //   icon: <OpenEmail size={22} />,
      // },
    ],
  },
  // {
  //   ARE_NOME: 'GES_NOT',
  //   grupo: 'Gestão de Notificações',
  //   items: [
  //     {
  //       name: 'Envio de Notificações',
  //       ARE_NOME: 'ENV_NOT',
  //       path: '/envio-de-notificações',
  //       icon: <AddNotification size={22} />,
  //     },
  // {
  //   name: 'Recebimento de Notificações',
  //   ARE_NOME: 'REC_NOT',
  //   path: '/recebimento-de-notificações',
  //   icon: <ReceiveNotification size={22} />,
  // },
  //   ],
  // },
  {
    ARE_NOME: 'GES_BOL',
    grupo: 'Gestão de Bolsista',
    items: [
      {
        name: 'Aprovação de Cadastro do Bolsista',
        ARE_NOME: 'APRO_CAD_BOL',
        path: '/aprovacao-de-cadastro-do-bolsista',
        icon: <RiUserFollowLine size={22} />,
        reactIcons: true,
      },
    ],
  },
  {
    ARE_NOME: 'SUP',
    grupo: 'Suporte',
    items: [
      {
        name: 'Logs do Sistema',
        ARE_NOME: 'LOG_ST',
        path: `/logs`,
        icon: <Log size={22} />,
        reactIcons: false,
      },
      {
        name: 'Parâmetros do Sistema',
        ARE_NOME: 'PAR_ST',
        path: `/parametros-do-sistema`,
        icon: <BsSliders size={18} />,
        reactIcons: true,
      },
    ],
  },
];
