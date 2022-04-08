import React from "react";
import { TextInputProps } from "react-native";
import { Control, FieldError, useController } from "react-hook-form";

import Input from "../Input";

import { Container, Error } from "./styles";

interface ControlledInputProps extends TextInputProps {
  control: Control<any, any>;
  name: string;
  error?: FieldError;
}

function ControlledInput({
  control,
  name,
  error,
  ...rest
}: ControlledInputProps) {
  const { field } = useController({ control, name });
  const { onBlur, onChange, value } = field;

  return (
    <Container>
      <Input {...rest} onBlur={onBlur} onChangeText={onChange} value={value} />
      {!!error && <Error>{error.message}</Error>}
    </Container>
  );
}

export default ControlledInput;
