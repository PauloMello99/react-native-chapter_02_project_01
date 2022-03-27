import React from "react";
import { TouchableOpacityProps } from "react-native";

import { Container, Title } from "./styles";

interface ButtonProps extends TouchableOpacityProps {
  label: string;
}

function Button({ label, ...rest }: ButtonProps) {
  return (
    <Container {...rest}>
      <Title>{label}</Title>
    </Container>
  );
}

export default Button;
