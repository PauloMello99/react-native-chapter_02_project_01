import React, { useState } from "react";
import { ActivityIndicator, Alert, Platform } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import { useTheme } from "styled-components/native";

import AppleSvg from "../../assets/apple.svg";
import GoogleSvg from "../../assets/google.svg";
import LogoSvg from "../../assets/logo.svg";
import SignInSocialButton from "../../components/SignInSocialButton";
import { useAuth } from "../../contexts/auth";

import {
  Container,
  Header,
  TitleWrapper,
  Title,
  SignInTitle,
  Footer,
  SignInOptions,
} from "./styles";

export function SignIn() {
  const theme = useTheme();
  const { signInWithGoogle, signInWithApple } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleSignInWithGoogle = async () => {
    setLoading(true);
    try {
      await signInWithGoogle();
    } catch (error) {
      console.log(error);
      Alert.alert(
        "Autenticação",
        "Não foi possível realizar a autenticação com a conta Google"
      );

      setLoading(false);
    }
  };

  const handleSignInWithApple = async () => {
    setLoading(true);
    try {
      await signInWithApple();
    } catch (error) {
      console.log(error);
      Alert.alert(
        "Autenticação",
        "Não foi possível realizar a autenticação com a conta Apple"
      );

      setLoading(false);
    }
  };

  return (
    <Container>
      <Header>
        <TitleWrapper>
          <LogoSvg width={RFValue(120)} height={RFValue(70)} />
          <Title>
            Controle suas {"\n"} finanças de forma {"\n"} muito simples
          </Title>
        </TitleWrapper>
        <SignInTitle>Faça seu login</SignInTitle>
      </Header>
      <Footer>
        {!loading ? (
          <SignInOptions>
            <SignInSocialButton
              svg={GoogleSvg}
              title="Entrar com Google"
              onPress={handleSignInWithGoogle}
            />
            {Platform.OS === "ios" && (
              <SignInSocialButton
                svg={AppleSvg}
                title="Entrar com Apple"
                onPress={handleSignInWithApple}
              />
            )}
          </SignInOptions>
        ) : (
          <ActivityIndicator color={theme.colors.shape} size={RFValue(32)} />
        )}
      </Footer>
    </Container>
  );
}
