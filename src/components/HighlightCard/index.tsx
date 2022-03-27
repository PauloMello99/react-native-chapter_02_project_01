import React from "react";

import {
  Container,
  Header,
  Title,
  Icon,
  Footer,
  Amount,
  LastTransaction,
} from "./styles";

export interface HighlightCardProps {
  title: string;
  type: "up" | "down" | "total";
  amount: string;
  lastTransaction: string;
}

const icon: Record<HighlightCardProps["type"], string> = {
  down: "arrow-down-circle",
  up: "arrow-up-circle",
  total: "dollar-sign",
};

function HighlightCard({
  title,
  type,
  amount,
  lastTransaction,
}: HighlightCardProps) {
  return (
    <Container type={type}>
      <Header>
        <Title type={type}>{title}</Title>
        <Icon name={icon[type]} type={type} />
      </Header>
      <Footer>
        <Amount type={type}>{amount}</Amount>
        <LastTransaction>{lastTransaction}</LastTransaction>
      </Footer>
    </Container>
  );
}

export default HighlightCard;
