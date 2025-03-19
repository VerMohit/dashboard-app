import { TextInput } from '@mantine/core';
import { UseFormReturnType } from '@mantine/form';
import { PathValue } from '@mantine/form/lib/types';

type InputProps<T> = {
  labelName: string;
  placeHolder?: string;
  formVar: keyof T;
  description?: string;
  formatFunc?: (value: string) =>
    | {
        formattedValue: string;
        err: null;
      }
    | {
        formattedValue: null;
        err: string;
      };
  form: UseFormReturnType<T>; // Using generic type <T> gives us flexibilty to pass any shape of useForm (making this compnent general purpose)
  requiredProp?: boolean;
};

export default function FormInputField<T>({
  labelName,
  placeHolder,
  formVar,
  description,
  formatFunc,
  form,
  requiredProp = true,
}: InputProps<T>) {
  const inputProps = form.getInputProps(formVar);

  // Custom onBlur handler to format amount when user is out of amount and amountPaid input fields
  const customOnBlur = () => {
    if (formatFunc) {
      const value = form.getValues()[formVar as keyof T] as string;
      const { formattedValue, err } = formatFunc(value);
      if (formattedValue !== null) {
        // as PathValue<T, keyof T> needed to ensure correct typing with setFieldValue
        form.setFieldValue(formVar, formattedValue as PathValue<T, keyof T>);
        form.clearFieldError(formVar);
      } else {
        form.setFieldError(formVar, err);
      }
    }
  };

  return (
    <div>
      <TextInput
        radius="50px"
        label={labelName}
        placeholder={placeHolder}
        mt="md"
        withAsterisk={requiredProp}
        defaultValue={form.getValues()[formVar as keyof T] as string}
        key={form.key(formVar)}
        {...inputProps}
        onBlur={customOnBlur}
      />
      <div style={{ fontSize: '12px', color: '#6B7280', marginTop: '4px' }}>{description}</div>
    </div>
  );
}
