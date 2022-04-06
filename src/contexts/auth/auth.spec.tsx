import { renderHook, act } from "@testing-library/react-hooks";
import fetchMock from "jest-fetch-mock";
import { mocked } from "jest-mock";
import { startAsync } from "expo-auth-session";

import { AuthProvider, useAuth } from ".";
import { User } from "../../interfaces/User";

jest.mock("expo-auth-session");

fetchMock.enableMocks();

describe("Auth hook", () => {
  it("should sign in with google existing account", async () => {
    const googleMocked = mocked(startAsync);
    googleMocked.mockResolvedValueOnce({
      type: "success",
      params: { access_token: "access_token" },
    } as any);

    fetchMock.mockResponseOnce(
      JSON.stringify({
        id: "id",
        email: "john@doe.com",
        given_name: "John Doe",
        picture: "picture.url.com",
      })
    );

    const { result } = renderHook(useAuth, {
      wrapper: AuthProvider,
    });

    await act(async () => result.current.signInWithGoogle());

    expect(result.current.user).toMatchObject<User>({
      id: "id",
      email: "john@doe.com",
      name: "John Doe",
      photo: "picture.url.com",
    });
  });

  it("should not sign in with google if canceled", async () => {
    const googleMocked = mocked(startAsync);
    googleMocked.mockResolvedValueOnce({ type: "cancel" } as any);

    const { result, waitForValueToChange } = renderHook(useAuth, {
      wrapper: AuthProvider,
    });

    await waitForValueToChange(() => result.current.loading);

    try {
      await result.current.signInWithGoogle();
    } catch (error) {
      expect(error.message).toEqual("Error: Failed to sign in with google");
    }
  });
});
