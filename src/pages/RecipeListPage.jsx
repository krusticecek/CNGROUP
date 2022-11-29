import {Box, Heading, Text, Input, Button, Flex, Spacer} from '@chakra-ui/react';
import {useEffect, useState} from 'react';
import {api} from "../api";
import {Loader} from "../components/Loader";
import {RecipeList} from "../components/RecipeList";
import {normalizeSync} from "normalize-diacritics";
import {Link} from "react-router-dom";

export const RecipeListPage = () => {
  const [recipes, setRecipes] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchValue, setSearchValue] = useState('');


  useEffect(() => {
    function getRecipes() {
      setIsLoading(true);
      api.get('/recipes')
        .then(response => setRecipes(response.data))
        .catch((error) => setError(error))
        .finally(() => setIsLoading(false));
    }

    getRecipes();
  }, []);

  function handleInputValueChange(event) {
    setSearchValue(event.currentTarget.value)
  }


  const filteredRecipes = recipes.filter((recipe) =>
    normalizeSync(recipe.title).toLowerCase().includes(normalizeSync(searchValue).toLowerCase()),
  );


  return (
    <Box px={5}>
      <Flex minWidth='max-content' alignItems='center' gap='2'>
        <Box p='2'>
          <Heading my={4} size='xl' color={"teal"}>Recepty</Heading>
        </Box>
        <Spacer/>
        <Link to={"/new-recipe"}><Button colorScheme='whatsapp'>Přidej recept</Button></Link>
      </Flex>
      <Input placeholder='Search' value={searchValue} onChange={handleInputValueChange} mb={"20px"}/>
      {isLoading && <Loader/>}
      {error && <Text>{error}</Text>}
      <RecipeList recipes={filteredRecipes}/>
    </Box>
  );
}
