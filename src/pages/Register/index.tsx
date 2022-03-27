import React, { useState } from "react";
import { Alert, Keyboard, Modal, TouchableWithoutFeedback } from "react-native";
import { SubmitHandler, useForm } from "react-hook-form";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import AsyncStorage from "@react-native-async-storage/async-storage";
import uuid from "react-native-uuid";
import { NavigationProp, useNavigation } from "@react-navigation/native";

import CategorySelect from "../CategorySelect";
import {
  Button,
  TransactionTypeButton,
  CategorySelectButton,
  ControlledInput,
} from "../../components/Form";

import { useAuth } from "../../contexts/auth";
import { Category } from "../../interfaces/Category";
import { Transaction } from "../../interfaces/Transaction";
import { TRANSACTIONS } from "../../utils/storage";

import {
  Container,
  Form,
  Header,
  Title,
  Fields,
  TransactionTypes,
} from "./styles";

interface FormData {
  name: string;
  amount: number;
}

const schema: Yup.SchemaOf<FormData> = Yup.object().shape({
  name: Yup.string().required("Nome é obrigatório"),
  amount: Yup.number()
    .typeError("Informe um valor válido")
    .positive("O valor não pode ser negativo")
    .required("Valor é obrigatório"),
});

const resolver = yupResolver(schema);

function Register() {
  const { user } = useAuth();
  const navigation = useNavigation<NavigationProp<{ Listagem: undefined }>>();

  const [transactionType, setTransactionType] = useState<Transaction["type"]>();
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [category, setCategory] = useState<Category>();

  const { control, handleSubmit, formState, reset } = useForm<FormData>({
    resolver,
  });
  const { errors } = formState;

  const handleOpenCategoryModal = () => setShowCategoryModal(true);

  const handleCloseCategoryModal = () => setShowCategoryModal(false);

  const handleRegister: SubmitHandler<FormData> = async ({ name, amount }) => {
    if (!transactionType) return Alert.alert("Selecione o tipo de transação");
    if (!category?.key) return Alert.alert("Selecione a categoria");

    const TRANSACTIONS_KEY = TRANSACTIONS + user.id;

    try {
      const transaction: Transaction = {
        id: String(uuid.v4()),
        title: name,
        amount: amount.toString(),
        type: transactionType,
        category: category,
        date: new Date().toISOString(),
      };

      const data = await AsyncStorage.getItem(TRANSACTIONS_KEY);
      const currentData: Transaction[] = data ? JSON.parse(data) : [];
      currentData.push(transaction);
      await AsyncStorage.setItem(TRANSACTIONS_KEY, JSON.stringify(currentData));

      setTransactionType("income");
      setCategory(undefined);
      reset();

      navigation.navigate("Listagem");
    } catch (error) {
      console.log(error);
      Alert.alert("Não foi possível salvar a transação");
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <Container>
        <Header>
          <Title>Cadastro</Title>
        </Header>

        <Form>
          <Fields>
            <ControlledInput
              name="name"
              control={control}
              error={errors.name}
              placeholder="Nome"
              autoCapitalize="sentences"
              autoCorrect={false}
            />
            <ControlledInput
              name="amount"
              control={control}
              error={errors.amount}
              placeholder="Preço"
              keyboardType="numeric"
            />
            <TransactionTypes>
              <TransactionTypeButton
                label="Entrada"
                type="income"
                selected={transactionType === "income"}
                onPress={() => setTransactionType("income")}
              />
              <TransactionTypeButton
                label="Saída"
                type="outcome"
                selected={transactionType === "outcome"}
                onPress={() => setTransactionType("outcome")}
              />
            </TransactionTypes>
            <CategorySelectButton
              label={category?.name || "Selecione a categoria"}
              onPress={handleOpenCategoryModal}
            />
          </Fields>

          <Button label="Enviar" onPress={handleSubmit(handleRegister)} />
        </Form>

        <Modal visible={showCategoryModal} onDismiss={handleCloseCategoryModal}>
          <CategorySelect
            onClose={handleCloseCategoryModal}
            setCategory={setCategory}
            selected={category}
          />
        </Modal>
      </Container>
    </TouchableWithoutFeedback>
  );
}

export default Register;
