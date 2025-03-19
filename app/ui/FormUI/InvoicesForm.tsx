'use client';

import { Dispatch, SetStateAction } from 'react';
import { UseFormReturnType } from '@mantine/form';
import { InvoiceFormValues } from '@/app/types/invoiceTypes';
import FormInputField from '@/app/ui/FormUI/FormInputField';
import { validateAndFormatAmount } from '@/app/utility/formatValues';
import Notes from './Notes';
import styles from './CustomerForm.module.css';

export default function InvoiceForm({
  invNoteCount,
  setInvNoteCount,
  invoiceForm,
}: {
  invNoteCount: number;
  setInvNoteCount: Dispatch<SetStateAction<number>>;
  invoiceForm: UseFormReturnType<InvoiceFormValues>;
}) {
  // const [invNoteCount, setInvNoteCount] = useState(0);

  return (
    <>
      <div className={styles.formRow}>
        <FormInputField
          labelName="Invoice Number"
          placeHolder="ex. INV-001"
          formVar="invoiceNo"
          form={invoiceForm}
          description="ex. INV-001"
        />
        <FormInputField
          labelName="Issue Date"
          formVar="invoiceDate"
          form={invoiceForm}
          description="ex. YYYY-MM-DD  (Note: If no date provided, defualts to todays date)"
          requiredProp={false}
        />
      </div>
      <div className={styles.formRow}>
        <FormInputField
          labelName="Amount"
          placeHolder="0.00"
          formVar="amount"
          formatFunc={validateAndFormatAmount}
          form={invoiceForm}
        />
        <FormInputField
          labelName="Amount Paid"
          placeHolder="0.00"
          formVar="amountPaid"
          formatFunc={validateAndFormatAmount}
          form={invoiceForm}
        />
      </div>
      <Notes
        formVar="invoiceNotes"
        form={invoiceForm}
        counter={invNoteCount}
        setFn={setInvNoteCount}
        maxCharLimit={1000}
      />
    </>
  );
}
