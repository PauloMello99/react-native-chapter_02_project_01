import React from "react";
import { Transaction } from "../../interfaces/Transaction";

import {
  Container,
  Title,
  Amount,
  Footer,
  Category,
  CategoryName,
  Date,
  Icon,
} from "./styles";

interface TransactionCardProps {
  data: Transaction;
}

function TransactionCard({ data }: TransactionCardProps) {
  const { title, amount, category, date, type } = data;

  return (
    <Container>
      <Title>{title}</Title>
      <Amount type={type}>
        {type === "outcome" && "- "}
        {amount}
      </Amount>
      <Footer>
        <Category>
          <Icon name={category.icon} />
          <CategoryName>{category.name}</CategoryName>
        </Category>
        <Date>{date}</Date>
      </Footer>
    </Container>
  );
}

export default TransactionCard;
