import React from 'react';

export default async function page({
  params,
}: {
  params: {
    id: string;
  };
}) {
  const resolvedParams = await params;
  const custId = resolvedParams.id;
  return <div>CustomerID: {custId}</div>;
}
