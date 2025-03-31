import { LineChart } from '@mantine/charts';
import { Box, Text } from '@mantine/core';
import CustomLegend from './CustomLegend';

type RespBody = {
  label: string;
  data: {
    year: string;
    annualSales: number;
    annualRevenue: number;
    annualBalanceDue: number;
  }[];
  series: {
    name: string;
    label: string;
    color: string;
  }[];
  dataKey: string;
  xAxisLabel: string;
};

export function LineGraph({ label, data, series, dataKey, xAxisLabel }: RespBody) {
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
        xAxisProps={{ padding: { left: 0, right: 30 } }}
        series={series}
        gridAxis="xy"
      />
      <CustomLegend series={series} />
    </Box>
  );
}
