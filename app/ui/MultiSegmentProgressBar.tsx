import { Box, Text } from '@mantine/core';

type DataProps = {
  invoiceData: {
    name: string;
    value: number;
    color: string;
    progressWidth: string;
  }[];
};

export default function MultiSegmentProgressBar({ invoiceData }: DataProps) {
  // Calculate the total value of all sections
  const totalValue = invoiceData.reduce((acc, section) => acc + section.value, 0);

  const updatedInvoiceData = invoiceData.map((section, index) => {
    let progressWidth = `${(section.value / totalValue) * 100}%`;

    if (section.value === 0) {
      progressWidth = index === 0 ? '0%' : '100%';
    } else if (invoiceData[1 - index].value === 0) {
      progressWidth = index === 0 ? '100%' : '0%';
    }

    return { ...section, progressWidth };
  });

  console.log(updatedInvoiceData);
  console.log(typeof updatedInvoiceData[0].value);

  // const segmentWidthinvoiceData.map((section) => )

  return (
    <Box style={{ width: '100%', border: '1px solid #ccc', borderRadius: '5px' }}>
      <Box
        style={{
          display: 'flex',
          height: '20px',
          borderRadius: '5px',
        }}
      >
        {updatedInvoiceData.map((section, index) => (
          <Box
            key={index}
            style={{
              width: section.progressWidth,
              // `${(section.value / totalValue) * 100}%`, // Relative width based on total value
              backgroundColor: section.color,
              height: '100%',
              borderRadius:
                index === 0
                  ? '5px 0 0 5px'
                  : index === updatedInvoiceData.length - 1
                    ? '0 5px 5px 0'
                    : '0',
            }}
          />
        ))}
      </Box>

      <Text size="sm" style={{ marginTop: '8px' }}>
        {updatedInvoiceData.map((section, index) => (
          <span key={index} style={{ color: section.color }}>
            {/* {section.name}: {section.value}%{index < updatedInvoiceData.length - 1 && ' | '} */}
            {section.name}: {section.value}
            {index < updatedInvoiceData.length - 1 && ' | '}
          </span>
        ))}
      </Text>
    </Box>
  );
}
