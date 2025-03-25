'use client';

import { Dispatch, forwardRef, SetStateAction, useImperativeHandle, useState } from 'react';
import { Select, TextInput } from '@mantine/core';
import { hasLength, isEmail, isNotEmpty, matches, useForm, UseFormReturnType } from '@mantine/form';
import { ValidationError } from '@/app/CustomErrors/CustomErrorrs';
import { CustomerFormValues } from '@/app/types/customerTypes';
import {
  formatCapitalizeString,
  validateAndFormatPhone,
  validateAndFormatZip,
} from '@/app/utility/formatValues';
import FormInputField from './FormInputField';
import Notes from './Notes';
import styles from './CustomerForm.module.css';

export type CustomerFormHandle = {
  validateAndGetValues: () => Promise<any>;
  reset: () => void;
};

type CustomerFormProps = {
  formUsage?: string;
  customerInitialValues: CustomerFormValues;
};

const CustomerForm = forwardRef<CustomerFormHandle, CustomerFormProps>(
  ({ customerInitialValues, formUsage }, ref) => {
    const [custNoteCount, setcustNoteCount] = useState(0);

    const baseValidation = {
      firstName: isNotEmpty('First name is required'),
      lastName: isNotEmpty('Last name is required'),
      phoneNo: isNotEmpty('Phone number is required'),
      email: isEmail('Invalid email'),
      companyName: hasLength({ min: 2 }, 'Company name must be at least 2 characters long'),
    };

    const formFieldValidation = {
      ...baseValidation,
      ...(formUsage !== 'newInvoice' && {
        street: isNotEmpty('Street name required'),
        city: isNotEmpty('City required'),
        postalCode: matches(/^[A-Za-z]\d[A-Za-z] \d[A-Za-z]\d$/, 'Enter valid zip/postal code'),
        country: isNotEmpty('Country is required'),
        state: isNotEmpty('Select a state/province'),
        notes: hasLength({ max: 50 }, 'Cannot exceed 50 characters'),
      }),
    };

    const customerForm = useForm<CustomerFormValues>({
      mode: 'uncontrolled',
      initialValues: customerInitialValues,
      validate: formFieldValidation,
    });

    useImperativeHandle(ref, () => ({
      validateAndGetValues: async () => {
        const validation = customerForm.validate();
        if (validation.hasErrors) {
          return null;
        }
        return customerForm.getValues();
      },
      reset: () => {
        customerForm.reset();
        setcustNoteCount(0);
      },
    }));

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
        <div className={styles.formRow}>
          <FormInputField
            labelName="First Name"
            placeHolder="John"
            formVar="firstName"
            formatFunc={formatCapitalizeString}
            form={customerForm}
          />
          <FormInputField
            labelName="Last Name"
            placeHolder="Doe"
            formVar="lastName"
            formatFunc={formatCapitalizeString}
            form={customerForm}
          />
        </div>
        <div className={styles.formRow}>
          <FormInputField
            labelName="Phone Number"
            placeHolder="4162223333"
            formVar="phoneNo"
            form={customerForm}
            formatFunc={validateAndFormatPhone}
            description="ex: 4162223333 (do not include spaces)"
          />
          <FormInputField
            labelName="Email"
            placeHolder="email@example.ca"
            formVar="email"
            form={customerForm}
            description="ex: myEmail@exmaple.ca"
          />
        </div>

        <FormInputField labelName="Company Name" formVar="companyName" form={customerForm} />

        {formUsage !== 'newInvoice' && (
          <>
            <div className={styles.formRow}>
              <TextInput
                radius="50px"
                width="50px"
                className={styles.unitNo}
                w="21px"
                mt="md"
                label="Unit Number"
                key={customerForm.key('unitNo')}
                {...customerForm.getInputProps('unitNo')}
              />
              <FormInputField
                labelName="Street Name"
                formVar="street"
                formatFunc={formatCapitalizeString}
                form={customerForm}
              />
              <FormInputField
                labelName="City"
                formVar="city"
                formatFunc={formatCapitalizeString}
                form={customerForm}
              />
            </div>
            <div className={styles.formRow}>
              <FormInputField
                labelName="Zip/Postal Code"
                placeHolder="A1A 2B2"
                formVar="postalCode"
                formatFunc={validateAndFormatZip}
                form={customerForm}
                description="ex: A1A 2B2"
              />
              <FormInputField
                labelName="Country"
                formVar="country"
                formatFunc={formatCapitalizeString}
                form={customerForm}
              />
              <Select
                radius="50px"
                label="Province"
                withAsterisk
                placeholder="Select province"
                data={provincesAndTerritories}
                {...customerForm.getInputProps('state')}
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
              form={customerForm}
              counter={custNoteCount}
              setFn={setcustNoteCount}
              maxCharLimit={50}
            />
          </>
        )}
      </>
    );
  }
);

// Labelling makes it easier to identify the form during debugging when using React DevTools
CustomerForm.displayName = 'CustomerForm';

export default CustomerForm;
