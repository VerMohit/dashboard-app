import { Box, Text } from '@mantine/core';

type SereisProps = {
  series: {
    name: string;
    label: string;
    color: string;
  }[];
};

export default function CustomLegend({ series }: SereisProps) {
  return (
    <Box
      style={{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingBottom: '10px',
      }}
    >
      {series.map((item) => (
        <Box
          key={item.name}
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            marginRight: '20px',
          }}
        >
          <div
            style={{
              width: '12px',
              height: '12px',
              borderRadius: '50%',
              border: '1px solid black',
              backgroundColor: item.color, // Use the series color
              marginRight: '5px',
            }}
          />
          <Text>{item.label}</Text>
        </Box>
      ))}
    </Box>
  );
}
