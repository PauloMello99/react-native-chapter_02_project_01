import { RFValue } from "react-native-responsive-fontsize";
import styled from "styled-components/native";
import { Feather } from "@expo/vector-icons";

export const Container = styled.View`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.background};
`;

export const Header = styled.View`
  background-color: ${({ theme }) => theme.colors.primary};
  width: 100%;
  height: ${RFValue(113)}px;
  justify-content: flex-end;
  align-items: center;
  padding-bottom: 16px;
`;

export const Title = styled.Text`
  font-family: ${({ theme }) => theme.fonts.regular};
  font-size: ${RFValue(18)}px;
  color: ${({ theme }) => theme.colors.shape};
`;

interface ContentProps {
  paddingBottom: number;
}

export const Content = styled.ScrollView.attrs<ContentProps>(
  ({ paddingBottom }) => ({
    showsVerticalScrollIndicator: false,
    contentContainerStyle: { padding: 24, paddingBottom },
  })
)<ContentProps>``;

export const Chart = styled.View`
  width: 100%;
  align-items: center;
`;

export const MonthSelect = styled.View`
  width: 100%;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 24px 16px 0;
`;

export const MonthSelectButton = styled.TouchableOpacity`
  padding: 8px 0;
`;

export const SelectIcon = styled(Feather).attrs({ size: 20 })``;

export const Month = styled.Text`
  font-family: ${({ theme }) => theme.fonts.regular};
  font-size: ${RFValue(16)}px;
`;

export const LoadContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
`;
