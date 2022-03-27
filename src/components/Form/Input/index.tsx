import React from "react";
import { TextInputProps } from "react-native";

import { Container } from "./styles";

function Input(props: TextInputProps) {
  return <Container {...props} />;
}

export default Input;
