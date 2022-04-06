import React from "react";
import { render } from "@testing-library/react-native";

import { Profile } from ".";

describe("Profile Page", () => {
  it("should render user name related inputs ", () => {
    const { getByPlaceholderText } = render(<Profile />);
    expect(getByPlaceholderText("Nome")).toBeDefined();
    expect(getByPlaceholderText("Sobrenome")).toBeDefined();
  });

  it("should check if user data is loaded", () => {
    const { getByText } = render(<Profile />);
    expect(getByText("Perfil")).toBeDefined();
  });
});
