'use client';

import { Dispatch, SetStateAction, useState } from 'react';
import { Select, TextInput } from '@mantine/core';
import { UseFormReturnType } from '@mantine/form';
import { CustomerFormValues } from '@/app/types/customerTypes';
import FormInputField from '@/app/ui/FormUI/FormInputField';
import {
  formatCapitalizeString,
  validateAndFormatPhone,
  validateAndFormatZip,
} from '@/app/utility/formatValues';
import Notes from './Notes';
import styles from './CustomerForm.module.css';

export default function CustomerForm({
  custNoteCount,
  setcustNoteCount,
  custForm,
  formUsage = 'newCustomer',
}: {
  custNoteCount: number;
  setcustNoteCount: Dispatch<SetStateAction<number>>;
  custForm: UseFormReturnType<CustomerFormValues>;
  formUsage: string;
}) {
  const provincesAndTerritories = [
    'Alberta',
    'British Columbia',
    'Manitoba',
    'New Brunswick',
    'Newfoundland and Labrador',
    'Nova Scotia',
    'Ontario',
    'Prince Edward Island',
    'Quebec',
    'Saskatchewan',
    'Northwest Territories',
    'Nunavut',
    'Yukon',
  ];

  // const [custNoteCount, setcustNoteCount] = useState(0);

  // // Using debounce callback to set the notes field in the customerForm object
  // const changeNotesField = useDebouncedCallback((value: string) => {
  //   custForm.setFieldValue('notes', value);
  // }, 50);

  return (
    <>
      <div className={styles.formRow}>
        <FormInputField
          labelName="First Name"
          placeHolder="John"
          formVar="firstName"
          formatFunc={formatCapitalizeString}
          form={custForm}
        />
        <FormInputField
          labelName="Last Name"
          placeHolder="Doe"
          formVar="lastName"
          formatFunc={formatCapitalizeString}
          form={custForm}
        />
      </div>
      <div className={styles.formRow}>
        <FormInputField
          labelName="Phone Number"
          placeHolder="4162223333"
          formVar="phoneNo"
          form={custForm}
          formatFunc={validateAndFormatPhone}
          description="ex: 4162223333 (do not include spaces)"
        />
        <FormInputField
          labelName="Email"
          placeHolder="email@example.ca"
          formVar="email"
          form={custForm}
          description="ex: myEmail@exmaple.ca"
        />
      </div>

      <FormInputField labelName="Company Name" formVar="companyName" form={custForm} />

      {formUsage !== 'newInvoice' && (
        <>
          <div className={styles.formRow}>
            {/* <div className={styles.unitNo}> */}
            <TextInput
              radius="50px"
              width="50px"
              className={styles.unitNo}
              w="21px"
              mt="md"
              label="Unit Number"
              key={custForm.key('unitNo')}
              {...custForm.getInputProps('unitNo')}
            />
            {/* </div> */}

            <FormInputField
              labelName="Street Name"
              formVar="street"
              formatFunc={formatCapitalizeString}
              form={custForm}
            />
            <FormInputField
              labelName="City"
              formVar="city"
              formatFunc={formatCapitalizeString}
              form={custForm}
            />
          </div>
          <div className={styles.formRow}>
            <FormInputField
              labelName="Zip/Postal Code"
              placeHolder="A1A 2B2"
              formVar="postalCode"
              formatFunc={validateAndFormatZip}
              form={custForm}
              description="ex: A1A 2B2"
            />
            <FormInputField
              labelName="Country"
              formVar="country"
              formatFunc={formatCapitalizeString}
              form={custForm}
            />
            <Select
              radius="50px"
              label="Province"
              withAsterisk
              placeholder="Select province"
              data={provincesAndTerritories}
              {...custForm.getInputProps('state')}
              withScrollArea={false}
              styles={{ dropdown: { maxHeight: 150, overflowY: 'auto' } }}
              mt="md"
              searchable
              allowDeselect
              clearable
            />
          </div>
          <Notes
            formVar="notes"
            form={custForm}
            counter={custNoteCount}
            setFn={setcustNoteCount}
            maxCharLimit={50}
          />
          {/* <Textarea
            autosize
            minRows={2} // Adjusts minimum height
            maxRows={6} // Optional: Prevents excessive growth
            mt="md"
            label="Notes"
            key={custForm.key('notes')}
            {...custForm.getInputProps('notes')}
            onChange={(e) => {
              const newValue = e.target.value;
              setCharCount(newValue.length);
            }}
            onBlur={(e) => {
              const newValue = e.target.value;
              changeNotesField(newValue); // Call the debounced function when user leaves the input
            }}
          />
          <div style={{ fontSize: '12px', color: '#6B7280', marginTop: '4px' }}>{charCount}/50</div> */}
        </>
      )}
    </>
  );
}
