import React, { useCallback, useState } from "react";
import { ActivityIndicator } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { VictoryPie } from "victory-native";
import { RFValue } from "react-native-responsive-fontsize";
import { useTheme } from "styled-components/native";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { addMonths, subMonths, format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useFocusEffect } from "@react-navigation/native";

import HistoryCard from "../../components/HistoryCard";

import { categories } from "../../utils/categories";
import { TRANSACTIONS } from "../../utils/storage";
import { Transaction } from "../../interfaces/Transaction";
import { useAuth } from "../../contexts/auth";

import {
  Container,
  Content,
  Header,
  Title,
  Chart,
  MonthSelect,
  MonthSelectButton,
  SelectIcon,
  Month,
  LoadContainer,
} from "./styles";

interface CategoryData {
  key: string;
  name: string;
  total: number;
  formattedTotal: string;
  color: string;
  percentage: string;
}

function Resume() {
  const theme = useTheme();
  const { user } = useAuth();

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<CategoryData[]>([]);
  const [selectedDate, setSelectedDate] = useState(new Date());

  const handleChangeDate = (action: "next" | "previous") => {
    if (action === "next") {
      setSelectedDate((date) => addMonths(date, 1));
    } else {
      setSelectedDate((date) => subMonths(date, 1));
    }
  };

  const loadData = async () => {
    const TRANSACTIONS_KEY = TRANSACTIONS + user.id;

    setLoading(true);
    try {
      const data = await AsyncStorage.getItem(TRANSACTIONS_KEY);
      const response: Transaction[] = data ? JSON.parse(data) : [];

      const expenses = response.filter(
        (transaction) =>
          transaction.type === "outcome" &&
          new Date(transaction.date).getMonth() === selectedDate.getMonth() &&
          new Date(transaction.date).getFullYear() ===
            selectedDate.getFullYear()
      );

      const expensesTotal = expenses.reduce(
        (acc, transaction) => acc + Number(transaction.amount),
        0
      );

      const totalByCategory: CategoryData[] = [];

      categories.forEach((category) => {
        let sum = 0;

        expenses.forEach((transaction) => {
          if (transaction.category.key === category.key) {
            sum += Number(transaction.amount);
          }
        });

        if (sum > 0) {
          const percentage = ((sum / expensesTotal) * 100).toFixed(0) + "%";

          totalByCategory.push({
            name: category.name,
            key: category.key,
            color: category.color,
            total: sum,
            formattedTotal: sum.toLocaleString("pt-BR", {
              currency: "BRL",
              style: "currency",
            }),
            percentage,
          });
        }
      });

      setData(totalByCategory);
    } catch (error) {
      console.log(error);
    }

    setLoading(false);
  };

  const loadTransactions = useCallback(() => {
    loadData();
  }, [selectedDate]);

  useFocusEffect(loadTransactions);

  return (
    <Container>
      <Header>
        <Title>Resumo</Title>
      </Header>
      <MonthSelect>
        <MonthSelectButton onPress={() => handleChangeDate("previous")}>
          <SelectIcon name="chevron-left" />
        </MonthSelectButton>
        <Month>{format(selectedDate, "MMMM, yyyy", { locale: ptBR })}</Month>
        <MonthSelectButton onPress={() => handleChangeDate("next")}>
          <SelectIcon name="chevron-right" />
        </MonthSelectButton>
      </MonthSelect>
      {loading ? (
        <LoadContainer>
          <ActivityIndicator color={theme.colors.primary} size={24} />
        </LoadContainer>
      ) : (
        <>
          <Content paddingBottom={useBottomTabBarHeight()}>
            <Chart>
              <VictoryPie
                data={data}
                x="percentage"
                y="total"
                colorScale={data.map((category) => category.color)}
                labelRadius={50}
                style={{
                  labels: {
                    fontSize: RFValue(16),
                    fontWeight: "bold",
                    fill: theme.colors.shape,
                  },
                }}
              />
            </Chart>
            {data.map((category) => (
              <HistoryCard
                key={category.key}
                title={category.name}
                amount={category.formattedTotal}
                color={category.color}
              />
            ))}
          </Content>
        </>
      )}
    </Container>
  );
}

export default Resume;
