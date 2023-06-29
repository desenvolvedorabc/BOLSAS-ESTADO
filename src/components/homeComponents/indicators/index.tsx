import { InfoIndicator } from '../infoIndicator';
import { Card } from './styledComponents';

import PeopleGroup from 'public/assets/images/people-group.svg';
import ReportData from 'public/assets/images/report-data.svg';
import { useContext, useEffect, useState } from 'react';
import { useGetMacroIndicators } from 'src/services/indicadores';
import { ThemeContext } from 'src/context/ThemeContext';

export function Indicators() {
  const { mobile } = useContext(ThemeContext);
  const [indicators, setIndicators] = useState(null);

  const { data, isLoading: isLoading } = useGetMacroIndicators();

  useEffect(() => {
    if (data) setIndicators(data);
  }, [data]);

  return (
    !isLoading && (
      <Card mobile={mobile}>
        <InfoIndicator
          icon={<PeopleGroup />}
          value={indicators?.totalScholars}
          title={'Número total de bolsistas ativos'}
          border={true}
        />
        <InfoIndicator
          icon={<ReportData />}
          value={`${
            indicators?.deliveryAverageMonthReports !== 'NaN'
              ? indicators?.deliveryAverageMonthReports + '%'
              : 'N/A'
          }`}
          title={'Taxa de entrega do relatório'}
          border={false}
        />
      </Card>
    )
  );
}
