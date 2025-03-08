import { TextInput } from '@mantine/core';
import { UseFormReturnType } from '@mantine/form';

type InputProps<T> = {
  labelName: string;
  placeHolder: string;
  formVar: keyof T;
  customOnBlur?: ({ formVar, form }: { formVar: keyof T; form: UseFormReturnType<T> }) => void;
  form: UseFormReturnType<T>; // Enforces structure of passed in useForm structure, providing flexibility
};

export default function FormatedAmountInput<T>({
  labelName,
  placeHolder,
  formVar,
  customOnBlur,
  form,
}: InputProps<T>) {
  const inputProps = form.getInputProps(formVar);

  // Wrapping custom onBlur logic to match expected signature of onBlur event handler
  // because the custom methods have a different method signature from <FocusEvent<HTMLInputElement>
  const handleCustomBlur = (_event: React.FocusEvent<HTMLInputElement>) => {
    if (customOnBlur) {
      customOnBlur({ formVar, form });
    }
  };

  return (
    <TextInput
      label={labelName}
      placeholder={placeHolder}
      mt="md"
      withAsterisk
      defaultValue={form.getValues()[formVar] as string}
      key={form.key(formVar)}
      {...inputProps}
      onBlur={handleCustomBlur}
    />
  );
}
