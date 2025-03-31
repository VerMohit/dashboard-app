import { LineChart } from '@mantine/charts';
import { Box, Text } from '@mantine/core';
import CustomLegend from './CustomLegend';

type RespBody = {
  label: string;
  data:
    | {
        year: string;
        annualSales: number;
        annualRevenue: number;
        annualBalanceDue: number;
      }[]
    | {
        month: unknown;
        monthlySales: number;
        monthlyRevenue: number;
        monthlyBalanceDue: number;
      }[];
  series: {
    name: string;
    label: string;
    color: string;
  }[];
  dataKey: string;
  xAxisLabel: string;
  maxYAxis: number;
};

export function LineGraph({ label, data, series, dataKey, xAxisLabel, maxYAxis }: RespBody) {
  return (
    <Box>
      <Text style={{ fontWeight: '600', textAlign: 'center' }}>{label}</Text>

      <LineChart
        h={300}
        data={data}
        dataKey={dataKey}
        withPointLabels
        xAxisLabel={xAxisLabel}
        yAxisLabel="$"
        xAxisProps={{ padding: { right: 30 } }}
        yAxisProps={{ padding: { top: 30 }, domain: [0, maxYAxis] }}
        series={series}
        gridAxis="xy"
      />
      <CustomLegend series={series} />
    </Box>
  );
}
