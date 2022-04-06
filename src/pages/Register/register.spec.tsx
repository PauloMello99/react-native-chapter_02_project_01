import React from "react";
import { render, fireEvent, act } from "@testing-library/react-native";
import { ThemeProvider } from "styled-components/native";

import theme from "../../global/styles/theme";

import Register from ".";

const Providers: React.FC = ({ children }) => (
  <ThemeProvider theme={theme}>{children}</ThemeProvider>
);

jest.mock("@react-navigation/native");

describe("Register page", () => {
  it("should open modal on category button click", () => {
    const { getByTestId } = render(<Register />, {
      wrapper: Providers,
    });
    const modal = getByTestId("category-modal");

    act(() => {
      fireEvent.press(getByTestId("category-button"));
    });

    expect(modal.props.visible).toBeTruthy();
  });
});
