import {Box, Heading, List, ListItem, Text} from "@chakra-ui/react";
import {useParams} from "react-router-dom";
import {api} from "../api";
import {useEffect, useState} from "react";
import {Loader} from "../components/Loader";

export function RecipeDetailPage() {
  const {slug} = useParams();

  const [detail, setDetail] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');


  useEffect(() => {
    function getRecipeDetail() {
      setIsLoading(true);
      api
        .get(`/recipes/${slug}`)
        .then(response => setDetail(response.data))
        .catch((error) => setError(error))
        .finally(() => setIsLoading(false));
    }

    getRecipeDetail();
  }, [slug]);

  if (isLoading) {
    return <Loader/>
  }

  if (error) {
    return <Text>{error}</Text>
  }

  const convertTime = () => {
    let hours = Math.floor(detail.preparationTime/60)
    let minutes = detail.preparationTime % 60

    if(hours < 10){
      hours = "0" + hours
    }
    if(minutes< 10){
      minutes = "0" + minutes
    }
    return(
      `${hours}h:${minutes}min`
    )
    // test gitu
  }

  return (
    <Box px={5}>
      {detail && (
        <>
          <Heading display="flex" justifyContent="center" color={"teal"}>{detail.title}</Heading>
          <Box display="flex" justifyContent="space-between" mt={10}>
            <Box>
              <Text mb={2}>⏲️️ {convertTime()}</Text>
              {detail.ingredients && (
                <List mb={2}>
                  {detail.ingredients.map((ingredient) => (
                    <ListItem
                      key={ingredient._id}
                    >{`${ingredient.amount} ${ingredient.amountUnit}   ${ingredient.name}`}</ListItem>
                  ))}
                </List>
              )}
              <Text>{detail.lastModifiedDate}</Text>
            </Box>
            {detail.directions && <Text ml={20}>{detail.directions}</Text>}
          </Box>
        </>
      )}
    </Box>
  )
}
