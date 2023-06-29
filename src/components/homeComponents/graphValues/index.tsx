import { useContext, useEffect, useState } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { ThemeContext } from 'src/context/ThemeContext';
import { useGetIndicatorsValues } from 'src/services/indicadores';
import { Loading } from 'src/components/Loading';

export function GraphValues({ year, regional, cities }) {
  const { theme } = useContext(ThemeContext);
  const [seriesData, setSeriesData] = useState([]);
  const [isEmpty, setIsEmpty] = useState(false);

  const { data: indicators, isLoading: isLoadingIndicators } =
    useGetIndicatorsValues(
      {
        year: year,
        regionalPartnerId: regional?.id,
        cities: cities,
      },
      true,
    );

  const getDataSeries = () => {
    const series = [];
    let empty = true;
    if (indicators?.data?.length > 0) {
      indicators.data?.forEach((indicator) => {
        if (indicator.averageValueOfBagsInCents > 0) {
          empty = false;
        }
        if (regional) {
          series.push({
            name: indicator.city,
            y: indicator.averageValueOfBagsInCents / 100,
            drilldown: indicator.city,
            color: theme.colors.primary,
          });
        } else {
          series.push({
            name: indicator.name,
            y: indicator.averageValueOfBagsInCents / 100,
            drilldown: indicator.name,
            color: theme.colors.primary,
          });
        }
      });
    }
    setIsEmpty(empty);
    setSeriesData(series);
  };

  useEffect(() => {
    getDataSeries();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [indicators]);

  const options = {
    chart: {
      type: 'column',
      style: {
        fontFamily: 'Inter',
        fontWeight: '600',
      },
    },
    tooltip: {
      shared: true,
      useHTML: true,
      headerFormat:
        '<table><tr><th colspan="2" style="text-align: center">Valor da Bolsa (Média)</th></tr>',
      pointFormat:
        '<td><br/></td>' +
        '<tr style="border-top: 0.619403px dashed #7C7C7C;border-bottom: 0.619403px dashed #7C7C7C;"><td>{point.name}:&nbsp;&nbsp;</td>' +
        '<td style="text-align: right"><b>R$ {point.y}</b></td></tr>',
      footerFormat: '</table>',
      valueDecimals: 2,
    },
    plotOptions: {
      column: {
        grouping: true,
        shadow: false,
        borderWidth: 0,
        groupPadding: 0.03,
      },
      series: {
        groupPadding: 0,
        events: {
          legendItemClick: function () {
            return false;
          },
        },
      },
    },
    yAxis: [
      {
        min: 0,
        // max: 100,
        title: {
          text: 'R$',
        },
      },
      {
        title: {
          text: '',
        },
        opposite: true,
        linkedTo: 0,
      },
    ],
    legend: {
      squareSymbol: true,
      symbolHeight: 12,
      symbolRadius: 0,
    },
    title: {
      text: '',
    },
    xAxis: {
      categories: seriesData?.map((x) => x.name),
      crosshair: true,
    },
    series: [
      {
        name: regional ? 'Municipios' : 'Regionais',
        data: seriesData,
      },
    ],
  };

  return (
    <>
      {isLoadingIndicators ? (
        <Loading />
      ) : (
        <>
          {isEmpty && (
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                padding: '40px',
              }}
            >
              <div
                style={{
                  textAlign: 'center',
                  border: '1px solid #d5d5d5',
                  padding: '20px',
                  borderRadius: '8px',
                  color: '#A9A9A9',
                }}
              >
                <em>Não há resultados para o filtro aplicado.</em>
              </div>
            </div>
          )}
          <HighchartsReact highcharts={Highcharts} options={options} />
        </>
      )}
    </>
  );
}
