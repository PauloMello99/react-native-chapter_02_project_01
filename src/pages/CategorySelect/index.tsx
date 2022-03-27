import React from "react";
import { FlatList, ListRenderItem } from "react-native";
import { Button } from "../../components/Form";

import { Category } from "../../interfaces/Category";
import { categories } from "../../utils/categories";

import {
  Container,
  Header,
  Title,
  CategoryCard,
  Icon,
  CategoryName,
  Separator,
  Footer,
} from "./styles";

interface CategorySelectProps {
  selected?: Category;
  setCategory: (category: Category) => void;
  onClose: () => void;
}

function CategorySelect({
  selected,
  setCategory,
  onClose,
}: CategorySelectProps) {
  const renderItem: ListRenderItem<Category> = ({ item }) => {
    const handleSelectCategory = () => setCategory(item);
    return (
      <CategoryCard
        onPress={handleSelectCategory}
        selected={selected?.key === item.key}
      >
        <Icon name={item.icon} />
        <CategoryName>{item.name}</CategoryName>
      </CategoryCard>
    );
  };

  const keyExtractor = (item: Category) => item.key;

  return (
    <Container>
      <Header>
        <Title>Categoria</Title>
      </Header>

      <FlatList
        data={categories}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        ItemSeparatorComponent={Separator}
      />

      <Footer>
        <Button label="Selecionar" onPress={onClose} />
      </Footer>
    </Container>
  );
}

export default CategorySelect;
