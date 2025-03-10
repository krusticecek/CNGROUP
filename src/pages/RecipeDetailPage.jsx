import {
  Box,
  Button,
  ButtonGroup,
  Flex, Heading,
  List,
  ListItem,
  Spacer,
  Text
} from "@chakra-ui/react";
import {Link, useNavigate, useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import {Loader} from "../components/Loader";
import moment from "moment";
// import ReactMarkdown from "react-markdown";
// import ChakraUIRenderer from 'chakra-ui-markdown-renderer';
import {api} from "../api";


export const RecipeDetailPage = () => {
  const {slug} = useParams();

  const [detail, setDetail] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const navigate = useNavigate();


  useEffect(() => {
    const getDetail = () => {

      setIsLoading(true);
      api
        .get(`/recipes/${slug}`)
        .then(response => setDetail(response.data))
        .catch((error) => setError(error))
        .finally(() => setIsLoading(false));
    }
    getDetail()
  }, [slug]);


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
      if (hours < "10") {
        hours = "0" + hours

      }
    }
    if (minutes < "10") {
      minutes = "0" + minutes
    }
    if (hours === "00") {
      return (`${minutes}min`)
    } else if (minutes === "00") {
      return (
        `${hours}h`
      )
    } else
      return `${hours}h ${minutes}min`
  }

  const handleClick = () => {
    api.delete(`/recipes/${detail["_id"]}`).then(() => navigate("/"))
  }

  const direction = detail.directions?.split("\n")

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
                <Link to={'/'}>
                  <Button display={"flex"} justifyContent={"flex-end"}>Zpět</Button>
                </Link>
                <Link to={`/recept/${slug}/edit`}>
                  <Button display={"flex"} justifyContent={"flex-end"}
                          colorScheme={"yellow"}>Edit</Button>
                </Link>
                <Button type={"button"} display={"flex"} justifyContent={"flex-end"} colorScheme={"red"}
                        onClick={() => handleClick()}>Smazat</Button>
              </ButtonGroup>
            </Flex>
          </Box>
          <Box display="flex" justifyContent={"space-between"} mt={10}>
            <Box m={"5px"}>
              <Text mb={2}>⏲️️ {convertTime()} {`${detail.sideDish === undefined ? '' : `🍴${detail.sideDish}`}`}</Text>
              <Text>{`${detail.servingCount === 0 ? 'Není určen počet porcí' : `Počet porcí ${detail.servingCount}`}`}</Text>
              {detail.ingredients && (
                <List mb={2}>
                  {detail.ingredients.map((ingredient, index) => (
                    <ListItem
                      key={index}
                    >{`${ingredient.amount === 0 || ingredient.amount === null || ingredient.amount === undefined ? '' : ingredient.amount} ${ingredient.amountUnit !== undefined ? ingredient.amountUnit : ''} ${ingredient.name}`}</ListItem>
                  ))}
                </List>
              )}
              <Text>{moment(`${detail.lastModifiedDate}`).format('llll')}</Text>
            </Box>
            {/*<Box>*/}
            {/*  <ReactMarkdown children={detail.directions} components={ChakraUIRenderer()}/>*/}
            {/*</Box>*/}
            <Box m={"5px"}>
              {detail.directions && (
                <List>
                  {direction.map((dir, index) => (
                    <ListItem key={index}>
                      {dir}
                    </ListItem>
                  ))}
                </List>
              )}
            </Box>
          </Box>
        </>
      )}
    </Box>
  )
}
