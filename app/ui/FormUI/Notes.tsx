'use client';

import { Dispatch, SetStateAction } from 'react';
import { useDebouncedCallback } from 'use-debounce';
import { Textarea } from '@mantine/core';
import { UseFormReturnType } from '@mantine/form';
import { PathValue } from '@mantine/form/lib/types';

type InputProps<T> = {
  formVar: keyof T;
  form: UseFormReturnType<T>; // Using generic type <T> gives us flexibilty to pass any shape of useForm (making this compnent general purpose)
  counter: number;
  setFn: Dispatch<SetStateAction<number>>;
  maxCharLimit: number;
};

export default function Notes<T>({ formVar, form, counter, setFn, maxCharLimit }: InputProps<T>) {
  // Using debounce callback to set the notes field in the customerForm object
  const changeNotesField = useDebouncedCallback((formVar: keyof T, value: string) => {
    form.setFieldValue(formVar, value as PathValue<T, keyof T>);
  }, 50);

  return (
    <>
      <Textarea
        autosize
        minRows={2} // Adjusts minimum height
        maxRows={6} // Prevents excessive growth
        mt="md"
        label="Notes"
        key={form.key(formVar)}
        {...form.getInputProps(formVar)}
        onChange={(e) => {
          const newValue = e.target.value;
          setFn(newValue.length);
        }}
        onBlur={(e) => {
          const newValue = e.target.value;
          changeNotesField(formVar, newValue); // Call the debounced function when user leaves the input
        }}
      />
      <div style={{ fontSize: '12px', color: '#6B7280', marginTop: '4px' }}>
        {counter}/{maxCharLimit}
      </div>
    </>
  );
}
