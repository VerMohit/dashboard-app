'use client';

import React, { forwardRef, useImperativeHandle, useState } from 'react';
import { hasLength, isNotEmpty, useForm } from '@mantine/form';
import { InvoiceFormValues } from '@/app/types/invoiceTypes';
import { validateAndFormatAmount } from '@/app/utility/formatValues';
import { validateAmountFormat, validateDateFormat } from '@/app/utility/validateValues';
import FormInputField from './FormInputField';
import Notes from './Notes';
import styles from './CustomerForm.module.css';

export type InvoiceFormHandle = {
  validateAndGetValues: () => Promise<any>;
  reset: () => void;
};

type InvoiceFormProps = {
  invoiceInitialValues: InvoiceFormValues;
};

const InvoiceForm = forwardRef<InvoiceFormHandle, InvoiceFormProps>(
  ({ invoiceInitialValues }, ref) => {
    const [noteCount, setNoteCount] = useState(0);

    const invoiceForm = useForm<InvoiceFormValues>({
      mode: 'uncontrolled',
      initialValues: invoiceInitialValues,
      validate: {
        invoiceNumber: isNotEmpty('Invoice number is required'),
        invoiceDate: validateDateFormat,
        amount: validateAmountFormat,
        amountPaid: validateAmountFormat,
        invoiceNotes: hasLength({ max: 1000 }, 'Cannot exceed 1000 characters'),
      },
    });

    useImperativeHandle(ref, () => ({
      validateAndGetValues: async () => {
        const validation = invoiceForm.validate();
        if (validation.hasErrors) {
          return null;
        }
        return invoiceForm.getTransformedValues();
      },
      reset: () => {
        invoiceForm.reset();
      },
    }));

    return (
      <>
        <div className={styles.formRow}>
          <FormInputField
            labelName="Invoice Number"
            placeHolder="ex. INV-001"
            formVar="invoiceNumber"
            form={invoiceForm}
            description="ex. INV-001"
          />
          <FormInputField
            labelName="Issue Date"
            formVar="invoiceDate"
            form={invoiceForm}
            description="ex. YYYY-MM-DD (Note: If no date provided, defaults to today's date)"
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
            formatFunc={validateAndFormatAmount}
            formVar="amountPaid"
            form={invoiceForm}
          />
        </div>
        <Notes
          formVar="invoiceNotes"
          form={invoiceForm}
          counter={noteCount}
          setFn={setNoteCount}
          maxCharLimit={1000}
        />
      </>
    );
  }
);

// Labelling makes it easier to identify the form during debugging when using React DevTools
InvoiceForm.displayName = 'InvoiceForm';

export default InvoiceForm;
