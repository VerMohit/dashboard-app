'use client';

import { useState } from 'react';
import { useDebouncedCallback } from 'use-debounce';
import { Select, TextInput } from '@mantine/core';
import { UseFormReturnType } from '@mantine/form';
import { CustomerFormValues } from '@/app/types/customerTypes';
import FormInputField from '@/app/ui/FormUI/FormInputField';
import {
  formatCapitalizeString,
  validateAndFormatPhone,
  validateAndFormatZip,
} from '@/app/utility/formatValues';

export default function CustomerForm({
  custForm,
  formUsage = 'newCustomer',
}: {
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

  const [charCount, setCharCount] = useState(0);

  // Using debounce callback to set the notes field in the customerForm object
  const changeNotesField = useDebouncedCallback((value: string) => {
    custForm.setFieldValue('notes', value);
  }, 50);

  return (
    <>
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
      <FormInputField
        labelName="Phone Number"
        placeHolder="+1 (000)-000-0000"
        formVar="phoneNo"
        form={custForm}
        formatFunc={validateAndFormatPhone}
        description="ex: +1 (000) 000-0000"
      />
      <FormInputField
        labelName="Email"
        placeHolder="email@example.ca"
        formVar="email"
        form={custForm}
        description="ex: myEmail@exmaple.ca"
      />
      <FormInputField labelName="Company Name" formVar="companyName" form={custForm} />

      {formUsage !== 'newInvoice' && (
        <>
          <TextInput
            mt="md"
            label="Unit Number"
            key={custForm.key('unitNo')}
            {...custForm.getInputProps('unitNo')}
          />
          <FormInputField
            labelName="Street Name"
            formVar="streetName"
            formatFunc={formatCapitalizeString}
            form={custForm}
          />
          <FormInputField
            labelName="City"
            formVar="city"
            formatFunc={formatCapitalizeString}
            form={custForm}
          />
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
            label="Province"
            withAsterisk
            placeholder="Select province"
            data={provincesAndTerritories}
            {...custForm.getInputProps('state')}
            withScrollArea={false}
            styles={{ dropdown: { maxHeight: 150, overflowY: 'auto' } }}
            mt="md"
            searchable
            // allowDeselect
            // clearable
          />
          {/* <FormInputField
            labelName="Notes"
            formVar="notes"
            formatFunc={formatCapitalizeString}
            form={custForm}
            requiredProp={false}
          /> */}
          <TextInput
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
          <div style={{ fontSize: '12px', color: '#6B7280', marginTop: '4px' }}>
            {charCount}/1000
          </div>
        </>
      )}
    </>
  );
}
