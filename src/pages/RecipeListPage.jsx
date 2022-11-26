import {Box, Heading, Text, Input} from '@chakra-ui/react';
import {useEffect, useState} from 'react';
import {api} from "../api";
import {Loader} from "../components/Loader";
import {RecipeList} from "../components/RecipeList";
import {normalizeSync} from "normalize-diacritics";

export function RecipeListPage() {
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
      <Heading my={4} color="dodgerblue">
        Recipes
      </Heading>
      <Input placeholder='Search' value={searchValue} onChange={handleInputValueChange}/>
      {isLoading && <Loader/>}
      {error && <Text>{error}</Text>}
      <RecipeList recipes={filteredRecipes}/>
    </Box>
  );
}
