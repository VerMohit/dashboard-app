'use client';

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
}: {
  custForm: UseFormReturnType<CustomerFormValues>;
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
        placeholder="Pick province"
        data={provincesAndTerritories}
        {...custForm.getInputProps('state')}
        withScrollArea={false}
        styles={{ dropdown: { maxHeight: 150, overflowY: 'auto' } }}
        mt="md"
        searchable
        allowDeselect
        clearable
      />
      <FormInputField
        labelName="Notes"
        formVar="notes"
        formatFunc={formatCapitalizeString}
        form={custForm}
      />
    </>
  );
}
