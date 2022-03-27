import React from "react";
import { TouchableOpacityProps } from "react-native";

import { Container, Category, Icon } from "./styles";

interface CategorySelectButtonProps
  extends Omit<TouchableOpacityProps, "activeOpacity"> {
  label: string;
}

function CategorySelectButton({ label, ...rest }: CategorySelectButtonProps) {
  return (
    <Container {...rest}>
      <Category>{label}</Category>
      <Icon name="chevron-down" />
    </Container>
  );
}

export default CategorySelectButton;
