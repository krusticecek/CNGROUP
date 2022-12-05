import {
  Box,
  Button,
  ButtonGroup,
  Flex,
  Heading,
  List,
  ListItem,
  Spacer,
  Text,
} from "@chakra-ui/react";
import {Link, useNavigate, useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import {Loader} from "../components/Loader";
import moment from "moment";
import axios from "axios";


export const RecipeDetailPage = () => {
  const {slug} = useParams();

  const [detail, setDetail] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const navigate = useNavigate();


  useEffect(() => {
      setIsLoading(true);
      axios
        .get(`https://exercise.cngroup.dk/api/recipes/${slug}`)
        .then(response => setDetail(response.data))
        .catch((error) => setError(error))
        .finally(() => setIsLoading(false));
    },[slug]);


  if (isLoading) {
    return <Loader/>
  }

  if (error) {
    return <Text>{error}</Text>
  }

  const convertTime = () => {
    let hours = Math.floor(detail.preparationTime / 60)
    let minutes = detail.preparationTime % 60
    hours = hours.toString()
    minutes = minutes.toString()

    if (hours === "0") {
      if (hours < 10) {
        hours = "0" + hours

      }
    }
    if (minutes < 10) {
      minutes = "0" + minutes
    }

    if (hours === "00") {
      return (`${minutes}min`)
    } else if (minutes === "00") {
      return (
        `${hours}h`
      )
    } else
      return `${hours}h:${minutes}min`
  }

  const handleClick = () => {
    axios.delete(`https://exercise.cngroup.dk/api/recipes/${detail._id}`).then(() => navigate("/"))
  }


  return (
    <Box px={5}>
      {detail && (
        <>
          <Box>
            <Flex minWidth='max-content' alignItems='center' gap='2'>
              <Box>
                <Heading display="flex" justifyContent="center" color={"teal"}>{detail.title}</Heading>
              </Box>
              <Spacer/>
              <ButtonGroup>
                <Link to={'/'}><Button display={"flex"} justifyContent={"flex-end"}>Zpět</Button></Link>
                <Link to={`/recept/${slug}/edit`}><Button display={"flex"} justifyContent={"flex-end"} colorScheme={"yellow"}>Edit</Button></Link>
                <Button type={"button"} display={"flex"} justifyContent={"flex-end"} colorScheme={"red"}
                        onClick={() => handleClick()}>Smazat</Button>
              </ButtonGroup>
            </Flex>
          </Box>
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
              <Text>{moment(`${detail.lastModifiedDate}`).format('llll')}</Text>
            </Box>
            {detail.directions && <Text ml={20}>{detail.directions}</Text>}
          </Box>
        </>
      )}
    </Box>
  )
}
