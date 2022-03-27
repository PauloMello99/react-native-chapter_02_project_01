import styled, { css } from "styled-components/native";
import { Feather } from "@expo/vector-icons";
import { RFValue } from "react-native-responsive-fontsize";
import { TransactionTypeButtonProps } from ".";

interface ContainerProps {
  active: boolean;
  type: TransactionTypeButtonProps["type"];
}

export const Container = styled.TouchableOpacity<ContainerProps>`
  flex: 0.48;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  padding: 16px;

  border: ${({ active }) => (active ? "0" : "1.5px")} solid
    ${({ theme }) => theme.colors.text};
  border-radius: 8px;
  margin-bottom: 8px;

  ${({ active, type, theme }) =>
    type === "income" &&
    active &&
    css`
      background-color: ${theme.colors.success_light};
    `}

  ${({ active, type, theme }) =>
    type === "outcome" &&
    active &&
    css`
      background-color: ${theme.colors.attention_light};
    `}
`;

interface IconProps {
  type: TransactionTypeButtonProps["type"];
}

export const Icon = styled(Feather)<IconProps>`
  font-size: ${RFValue(24)}px;
  margin-right: 12px;
  color: ${({ theme, type }) =>
    type === "income" ? theme.colors.success : theme.colors.attention};
`;

export const Title = styled.Text`
  font-size: ${RFValue(14)}px;
  font-family: ${({ theme }) => theme.fonts.regular};
`;
