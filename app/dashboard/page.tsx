import React from 'react';
import { DonutChart } from '@mantine/charts';
import { Box, Flex } from '@mantine/core';
import { FetchedInvoiceData } from '../types/SpecializedTypes';
import CustomDonutChart from '../ui/CustomDonutChart';
import WidgetDisplay from '../ui/DisplayDetails/WidgetDisplay';
import { LineGraph } from '../ui/LineGraph';
import { formatCurrency } from '../utility/formatValues';
import { getBaseUrlServerSide } from '../utility/getBaseUrlServerSide';

type RespBody = {
  totalCustomers: number;
  pastXYearsFigures: {
    year: string;
    annualSales: number;
    annualRevenue: number;
    annualBalanceDue: number;
  }[];
  currentYearsFigures: {
    sales: number;
    balanceDue: number;
    totalInvoices: number;
    totalUnpaidInvoices: number;
  }[];
  ccurrentMonthlyFigures: {
    month: unknown;
    monthlySales: number;
    monthlyRevenue: number;
    monthlyBalanceDue: number;
  }[];
};

export default async function page() {
  const baseURL = await getBaseUrlServerSide();

  const response = await fetch(`${baseURL}/dashboard`);

  if (!response.ok) {
    throw new Error(`Error fetching data: ${response.statusText}`);
  }

  const data = await response.json();

  const {
    totalCustomers,
    pastXYearsFigures,
    currentYearsFigures,
    currentMonthlyFigures,
  }: RespBody = data;

  const currentFigures = currentYearsFigures[0];

  const currentYrSales = formatCurrency(String(currentFigures.sales));
  const balanceDueYrSales = formatCurrency(String(currentFigures.balanceDue));

  const currentYear = new Date().getFullYear();

  console.log(currentMonthlyFigures);

  // const currentYrGraphingInvoiceData = [
  //   {
  //     name: 'Paid',
  //     value: currentFigures.totalInvoices - currentFigures.totalUnpaidInvoices,
  //     color: 'royalBlue',
  //   },
  //   {
  //     name: 'Unpaid',
  //     value: currentFigures.totalUnpaidInvoices,
  //     color: 'red',
  //   },
  // ];

  return (
    <Box px="md">
      <Flex direction="row" columnGap="3rem">
        <Flex direction="column" rowGap="3rem">
          <WidgetDisplay widgetTitle="Total No. of Customers" value={totalCustomers} />
          <WidgetDisplay widgetTitle={`Sales of ${currentYear}`} value={currentYrSales} />
          <WidgetDisplay
            widgetTitle={`Pending Payments of ${currentYear}`}
            value={balanceDueYrSales}
          />
          <WidgetDisplay
            widgetTitle={`No. of Invoices in ${currentYear}`}
            value={currentFigures.totalInvoices}
          />
          <WidgetDisplay
            widgetTitle={`No. of Unpaid Invoices in ${currentYear}`}
            value={currentFigures.totalUnpaidInvoices}
          />
        </Flex>
        <Flex direction="column" style={{ flex: 1 }} rowGap="3rem">
          <LineGraph
            label="Sales Statistics Over 6 Years:"
            data={pastXYearsFigures}
            series={[
              { name: 'annualSales', label: 'Annual Sales', color: 'royalblue' },
              { name: 'annualRevenue', label: 'Annual Revenue', color: 'green' },
              { name: 'annualBalanceDue', label: 'Balance Remaining:', color: 'red' },
            ]}
            dataKey="year"
            xAxisLabel="Year"
          />
          <LineGraph
            label={`Sales Statistics of ${currentYear}`}
            data={currentMonthlyFigures}
            series={[
              { name: 'monthlySales', label: 'Monthly Sales', color: 'royalblue' },
              { name: 'monthlyRevenue', label: 'Monthly Revenue', color: 'green' },
              { name: 'monthlyBalanceDue', label: 'Balance Remaining:', color: 'red' },
            ]}
            dataKey="month"
            xAxisLabel="Month"
          />
        </Flex>
      </Flex>
    </Box>
  );
}
