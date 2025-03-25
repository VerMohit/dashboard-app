export default function WidgetDisplay({
  widgetTitle,
  value,
}: {
  widgetTitle: string;
  value: string | number;
}) {
  return (
    <div
      style={{
        border: '3px solid #ccc', // Border around the table
        borderRadius: '10px',
        width: '200px',
        height: '100px',
        padding: '10px',
        textAlign: 'center',
      }}
    >
      <strong>{widgetTitle}</strong>
      <hr />
      <div>{value}</div>
    </div>
  );
}
