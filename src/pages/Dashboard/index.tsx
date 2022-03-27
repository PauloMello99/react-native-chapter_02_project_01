import React, { useCallback, useState } from "react";
import { ActivityIndicator, ListRenderItem } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import { useTheme } from "styled-components/native";

import HighlightCard from "../../components/HighlightCard";
import TransactionCard from "../../components/TransactionCard";

import { useAuth } from "../../contexts/auth";
import { Transaction } from "../../interfaces/Transaction";
import { TRANSACTIONS } from "../../utils/storage";

import {
  Container,
  Header,
  UserInfo,
  Photo,
  User,
  Greeting,
  UserName,
  UserWrapper,
  LogoutButton,
  Icon,
  HightlightCards,
  Transactions,
  Title,
  TransactionList,
  LoadContainer,
} from "./styles";

interface Highlight {
  amount: string;
  date: string;
}

interface HighlightData {
  income: Highlight;
  outcome: Highlight;
  total: Highlight;
}

function getLastTransactionDate(transactions: Transaction[]) {
  if (transactions.length === 0) return null;

  const entry = Math.max.apply(
    Math,
    transactions.map((transaction) => new Date(transaction.date).getTime())
  );

  return new Date(entry).toLocaleDateString();
}

function Dashboard() {
  const { signOut, user } = useAuth();
  const theme = useTheme();

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<Transaction[]>([]);
  const [highlightData, setHighlightData] = useState<HighlightData>(
    {} as HighlightData
  );

  const renderItem: ListRenderItem<Transaction> = ({ item }) => (
    <TransactionCard data={item} />
  );

  const keyExtractor = (item: Transaction) => String(item.id);

  const loadTransactions = async () => {
    const TRANSACTIONS_KEY = TRANSACTIONS + user.id;

    try {
      const data = await AsyncStorage.getItem(TRANSACTIONS_KEY);
      const response: Transaction[] = data ? JSON.parse(data) : [];

      let income = 0,
        outcome = 0,
        total = 0;

      const formattedTransactions = response.map(
        ({ date, amount, ...transaction }) => {
          if (transaction.type === "income") {
            income += Number(amount);
            total += Number(amount);
          } else {
            outcome += Number(amount);
            total -= Number(amount);
          }

          return {
            ...transaction,
            date: new Date(date).toLocaleDateString(),
            amount: Number(amount).toLocaleString("pt-BR", {
              currency: "BRL",
              style: "currency",
            }),
          };
        }
      );

      const lastIncomeDate = getLastTransactionDate(
        response.filter((transaction) => transaction.type === "income")
      );

      const lastOutcomeDate = getLastTransactionDate(
        response.filter((transaction) => transaction.type === "outcome")
      );

      const lastTransactionDate = getLastTransactionDate(response);

      setHighlightData({
        income: {
          amount: income.toLocaleString("pt-BR", {
            currency: "BRL",
            style: "currency",
          }),
          date: lastIncomeDate
            ? `Última entrada ${lastIncomeDate}`
            : "Não há transações",
        },
        outcome: {
          amount: outcome.toLocaleString("pt-BR", {
            currency: "BRL",
            style: "currency",
          }),
          date: lastOutcomeDate
            ? `Última saída ${lastOutcomeDate}`
            : "Não há transações",
        },
        total: {
          amount: total.toLocaleString("pt-BR", {
            currency: "BRL",
            style: "currency",
          }),
          date: lastTransactionDate ? lastTransactionDate : "Não há transações",
        },
      });
      setData(formattedTransactions);
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  };

  useFocusEffect(
    useCallback(() => {
      loadTransactions();
    }, [])
  );

  return (
    <Container>
      {loading ? (
        <LoadContainer>
          <ActivityIndicator color={theme.colors.primary} size={24} />
        </LoadContainer>
      ) : (
        <>
          <Header>
            <UserWrapper>
              <UserInfo>
                <Photo
                  source={{
                    uri: "https://avatars.githubusercontent.com/u/37298546?v=4",
                  }}
                />
                <User>
                  <Greeting>Olá, </Greeting>
                  <UserName>{user.name}</UserName>
                </User>
              </UserInfo>
              <LogoutButton onPress={signOut}>
                <Icon name="power" />
              </LogoutButton>
            </UserWrapper>
          </Header>

          <HightlightCards>
            <HighlightCard
              title="Entradas"
              amount={highlightData.income.amount}
              lastTransaction={highlightData.income.date}
              type="up"
            />
            <HighlightCard
              title="Saídas"
              amount={highlightData.outcome.amount}
              lastTransaction={highlightData.outcome.date}
              type="down"
            />
            <HighlightCard
              title="Total"
              amount={highlightData.total.amount}
              lastTransaction={highlightData.total.date}
              type="total"
            />
          </HightlightCards>

          <Transactions>
            <Title>Transações</Title>
            <TransactionList
              data={data}
              renderItem={renderItem}
              keyExtractor={keyExtractor}
            />
          </Transactions>
        </>
      )}
    </Container>
  );
}

export default Dashboard;
