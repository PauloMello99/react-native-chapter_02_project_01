import React from "react";
import { render } from "@testing-library/react-native";
import { ThemeProvider } from "styled-components/native";

import Input from ".";

import theme from "../../../global/styles/theme";

const Providers: React.FC = ({ children }) => (
  <ThemeProvider theme={theme}>{children}</ThemeProvider>
);

describe("Form Input component", () => {
  it("should render properly", () => {
    const placeholder = "My Input";
    const { getByPlaceholderText } = render(
      <Input placeholder={placeholder} />,
      { wrapper: Providers }
    );
    expect(getByPlaceholderText(placeholder)).toBeDefined();
  });

  it("should have correct background color", () => {
    const placeholder = "My Input";
    const { getByPlaceholderText } = render(
      <Input placeholder={placeholder} />,
      { wrapper: Providers }
    );

    const input = getByPlaceholderText(placeholder);
    const style = input.props.style[0];

    expect(style.backgroundColor).toEqual(theme.colors.shape);
    expect(style.color).toEqual(theme.colors.text_dark);
    expect(style.fontFamily).toEqual(theme.fonts.regular);
  });
});
