import React from "react";
import { TouchableOpacityProps } from "react-native";

import { Transaction } from "../../../interfaces/Transaction";

import { Container, Icon, Title } from "./styles";

export interface TransactionTypeButtonProps extends TouchableOpacityProps {
  label: string;
  type: Transaction["type"];
  selected: boolean;
}

const icon: Record<TransactionTypeButtonProps["type"], string> = {
  income: "arrow-up-circle",
  outcome: "arrow-down-circle",
};

function TransactionTypeButton({
  label,
  type,
  selected,
  ...rest
}: TransactionTypeButtonProps) {
  return (
    <Container {...rest} active={selected} type={type}>
      <Icon name={icon[type]} type={type} />
      <Title>{label}</Title>
    </Container>
  );
}

export default TransactionTypeButton;
