import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import * as AuthSession from "expo-auth-session";
import * as AppleAuthentication from "expo-apple-authentication";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { USER_DATA } from "../utils/storage";

interface User {
  id: string;
  name: string;
  email: string;
  photo?: string;
}

export interface AuthContextData {
  user: User;
  loading: boolean;
  signInWithGoogle(): Promise<void>;
  signInWithApple(): Promise<void>;
  signOut(): Promise<void>;
}

export const AuthContext = createContext({} as AuthContextData);

interface AuthProviderProps {
  children: ReactNode;
}

interface AuthorizationResponse {
  type: string;
  params: {
    access_token: string;
  };
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState({} as User);
  const [loading, setLoading] = useState(true);

  async function signInWithGoogle() {
    try {
      const { CLIENT_ID, REDIRECT_URI } = process.env;
      const RESPONSE_TYPE = "token";
      const SCOPE = encodeURI("profile email");
      const AUTH_URL = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}&scope=${SCOPE}`;

      const { type, params } = (await AuthSession.startAsync({
        authUrl: AUTH_URL,
      })) as AuthorizationResponse;

      if (type !== "success") {
        throw new Error("Failed to sign in with google");
      }

      const { access_token } = params;

      const response = await fetch(
        `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${access_token}`
      );
      const { id, email, given_name, picture } = await response.json();

      const userData = { id, email, name: given_name, photo: picture };

      setUser(userData);
      await AsyncStorage.setItem(USER_DATA, JSON.stringify(userData));
    } catch (error) {
      throw new Error(error);
    }
  }

  async function signInWithApple() {
    try {
      const credentials = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
      });

      if (!credentials) {
        throw new Error("Failed to sign in with apple");
      }

      const { user, email, fullName } = credentials;

      const userData = {
        id: String(user),
        email: email!,
        name: fullName!.givenName!,
        photo: `https>//ui-avatars.com/api/?name=${fullName!
          .givenName!}&length=1`,
      };

      setUser(userData);

      await AsyncStorage.setItem(USER_DATA, JSON.stringify(userData));
    } catch (error) {
      throw new Error(error);
    }
  }

  async function signOut() {
    setUser({} as User);
    await AsyncStorage.removeItem(USER_DATA);
  }

  useEffect(() => {
    async function loadUser() {
      const data = await AsyncStorage.getItem(USER_DATA);

      if (!data) {
        setLoading(false);
        return;
      }

      const userData = JSON.parse(data) as User;
      setUser(userData);

      setLoading(false);
    }

    loadUser();
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, loading, signInWithGoogle, signInWithApple, signOut }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
