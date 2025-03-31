import React from 'react';
import { DonutChart } from '@mantine/charts';
import { Box, Flex, Text } from '@mantine/core';

type DataProps = {
  invoiceData: {
    name: string;
    value: number;
    color: string;
  }[];
};

export default function CustomDonutChart({ invoiceData }: DataProps) {
  return (
    <Flex
      direction="column"
      h={300}
      align="center"
      py="1rem"
      style={{
        border: '3px solid #ccc',
        borderRadius: '10px',
        width: '300px',
        height: '350px',
      }}
    >
      <Text>
        {invoiceData.map((section, index) => (
          <span
            key={index}
            style={{
              color: section.color,
              display: 'inline-flex', // Consider using inline-flex instead of inline-block
              paddingInline: '1rem',
              justifyContent: 'space-between', // Align content as needed
            }}
          >
            <span style={{ width: '60px', display: 'inline-block' }}>{section.name}:</span>
            <span style={{ display: 'inline-block' }}>{section.value}</span>
            {/* <br /> */}
          </span>
        ))}
      </Text>

      <hr style={{ width: '50%' }} />

      <Box>
        <DonutChart
          // size={200}
          data={invoiceData}
          chartLabel="Invoice Data"
          withLabels
          withTooltip={false}
          startAngle={180}
          endAngle={0}
          style={{ width: '250px', height: '250px', alignSelf: 'center' }}
        />
      </Box>
    </Flex>
  );
}
