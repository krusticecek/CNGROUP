import {useNavigate, useParams} from "react-router-dom";
import {
  Box,
  Button,
  ButtonGroup,
  Flex,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  Grid,
  GridItem,
  Heading,
  Input,
  List,
  ListItem,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Spacer,
  Text,
  Textarea
} from "@chakra-ui/react";
import React, {useEffect, useState} from "react";
import ReactMarkdown from "react-markdown";
import {api} from "../api";
import ChakraUIRenderer from "chakra-ui-markdown-renderer";
import {ReactSearchAutocomplete} from "react-search-autocomplete";

export const EditDetailRecipePage = () => {

  const {slug} = useParams();
  const navigate = useNavigate();
  const [detail, setDetail] = useState('');
  const [preparationTime, setPreparationTime] = useState(0);
  const [title, setTitle] = useState('');
  const [directions, setDirections] = useState('');
  const [sideDish, setSideDish] = useState('');
  const [servingCount, setServingCount] = useState(0)
  const [ingredients, setIngredients] = useState([]);
  const [amount, setAmount] = useState(0);
  const [amountUnit, setAmountUnit] = useState('');
  const [name, setName] = useState('');
  const [apiSideDishes, setApiSideDishes] = useState([])
  const [apiIngredients, setApiIngredients] = useState([])


  const isError = title === ''

  useEffect(() => {
    api.get(`/recipes/${slug}`)
      .then(res => {
        setDetail(res.data);
        setTitle(res.data.title);
        setDirections(res.data.directions);
        setPreparationTime(res.data.preparationTime);
        setSideDish(res.data.sideDish);
        setIngredients(res.data.ingredients);
        setServingCount(res.data.servingCount);
      });
  }, [slug]);


  // vytvorime data, ktere posleme do api
  const data = {
    "title": title,
    "preparationTime": preparationTime,
    "directions": directions,
    "sideDish": sideDish,
    "servingCount": servingCount,
    "ingredients": ingredients

  }

  let titlenondiacritic =
    title
      ?.normalize("NFKD")
      .replace(/\p{Diacritic}/gu, "")
      .trimEnd()
      .replace(/\s+/g, '-')
      .toLowerCase()
  const handleSaveClicked = () => {
    api.post(`/recipes/${detail["_id"]}`, data)
      .then(() => {
        navigate(`/recept/${titlenondiacritic}`)
        // navigate(`/`)
      })
      .catch((err) => {
        console.log(err)
      })
  }

  useEffect(() => {
    api
      .get("/recipes/ingredients")
      .then(res => {
        setApiIngredients(res.data)
      })
  }, [])

  const IngredientsList = []
  apiIngredients.map((name, id) =>
    IngredientsList.push({id, name})
  )


  useEffect(() => {
    api
      .get("/recipes/side-dishes")
      .then(res => {
        setApiSideDishes(res.data)
      })
  }, [])

  const SideDishesList = []
  apiSideDishes.map((name, id) =>
    SideDishesList.push({id, name})
  )
  const handleSaveIngredients = () => {
    if (name !== "") {
      setIngredients(ingredient => [...ingredient, {"name": name, "amount": amount, "amountUnit": amountUnit}])
    } else {
      console.log("Musí obsahovat název")
    }
  }

  const handleSideDelete = () => {
    setSideDish('')
  }

  const hide = () => {
    return sideDish === '' || sideDish === undefined;
  }
  return (
    <Box m={"5px"}>
      <Flex minWidth='max-content' alignItems='center' gap='2'>
        <Box p='2'>
          <Heading my={4} size='xl' color={"teal"}>{title || ''}</Heading>
        </Box>
        <Spacer/>
        <ButtonGroup>
          <Button display={"flex"} justifyContent={"flex-end"} onClick={() => navigate(`/recept/${slug}`)}>
            Zrušit
          </Button>
          <Button colorScheme={"whatsapp"} disabled={isError} onClick={() => handleSaveClicked()}>Uložit</Button>
        </ButtonGroup>
      </Flex>


      <Grid templateColumns='repeat(3, 1fr)' gap={6} mb={"5px"}>
        <GridItem w='100%' h='10'>
          <FormControl isInvalid={isError}>
            <FormLabel>Název receptu</FormLabel>
            <Input type='text' onChange={x => setTitle(x.target.value.trimStart())} value={title || ''} autoFocus/>
            {!isError ? (
              <FormHelperText>
                Recept bude uložen s názvem <Text as={"b"}>{title}</Text>
              </FormHelperText>
            ) : (
              <FormErrorMessage m={"5px"}>Chybí název receptu!</FormErrorMessage>
            )}
          </FormControl>
        </GridItem>
        <GridItem w='100%' h='10'>
          <FormControl mb={"5px"}>
            <FormLabel>Doba přípravy v minutách</FormLabel>
            <NumberInput
              value={preparationTime > 1200 ? 1200 : preparationTime && preparationTime < 0 ? 0 : preparationTime || 0}
              clampValueOnBlur={false} max={1200} min={0} onChange={x => setPreparationTime(parseInt(x))}>
              <NumberInputField/>
              <NumberInputStepper>
                <NumberIncrementStepper/>
                <NumberDecrementStepper/>
              </NumberInputStepper>
            </NumberInput>
          </FormControl>
        </GridItem>

        <GridItem w='100%' h='10'>
          <FormControl mb={"5px"}>
            <FormLabel>Počet porcí</FormLabel>
            <NumberInput
              value={servingCount > 50 ? 50 : servingCount && servingCount < 0 ? 0 : servingCount || 0}
              clampValueOnBlur={false} max={50} min={0} onChange={x => setServingCount(parseInt(x))}>
              <NumberInputField/>
              <NumberInputStepper>
                <NumberIncrementStepper/>
                <NumberDecrementStepper/>
              </NumberInputStepper>
            </NumberInput>
          </FormControl>
        </GridItem>
      </Grid>

      <Box>
        <Heading display={"flex"} justifyContent={"center"} mt={"60px"} mb={"20px"} color={"teal"}>Postup</Heading>
        <Textarea mb={"20px"} size={"xs"} rows={20} placeholder={"Zde napiš postup přípravy"} value={directions || ''}
                  onChange={x => setDirections(x.target.value)}></Textarea>
        <ReactMarkdown components={ChakraUIRenderer()} children={directions}></ReactMarkdown>
      </Box>

      <Box>
        <Heading display={"flex"} justifyContent={"center"} m={4} color={"teal"}>Přílohy</Heading>
        <ReactSearchAutocomplete items={SideDishesList} onSelect={(e) => setSideDish(e.name)}
                                 onSearch={(e) => setSideDish(e)}/>
        <Text m={"5px"} display={"flex"} justifyContent={"center"}>
          {`${sideDish !== undefined ? `${sideDish}` : `Recept nemá přílohu`}`}
          <Button size={"xs"} disabled={sideDish === ''} hidden={hide()} onClick={() => handleSideDelete()}
                  background={"red"}>Smazat</Button></Text>
      </Box>


      <Heading display={"flex"} justifyContent={"center"} m={4} color={"teal"}>Ingredience</Heading>

      <Grid templateColumns='repeat(3, 1fr)' gap={6}>
        <GridItem w='100%' h='10'>
          <NumberInput
            value={amount > 100 ? 100 : amount && amount < 0 ? 0 : amount || 0}
            clampValueOnBlur={false} max={100} min={0} onChange={x => setAmount(parseInt(x))} mb={"15px"}>
            <NumberInputField/>
            <NumberInputStepper>
              <NumberIncrementStepper/>
              <NumberDecrementStepper/>
            </NumberInputStepper>
          </NumberInput>
        </GridItem>
        <GridItem w='100%' h='10'>
          <Input placeholder={"Jednotka"} mb={"15px"} type={"text"}
                 onChange={x => setAmountUnit(x.target.value.trimStart())} value={amountUnit || ''}></Input>
        </GridItem>
        <GridItem w='100%' h='10'>
          <ReactSearchAutocomplete items={IngredientsList} onSelect={(e) => setName(e.name)}
                                   onSearch={(e) => setName(e)}/>
        </GridItem>
      </Grid>
      <Box display={"flex"} justifyContent={"center"} m={"15px"}>
        <Button disabled={name === ''} onClick={() => handleSaveIngredients()}>Uložit</Button>
      </Box>
      <Box>
        <>
          {ingredients.map((ingredient, index) => (
            <List display={"flex"} justifyContent={"center"} key={index}>
              <ListItem>
                {ingredient.amount === 0 || ingredient.amount === null || ingredient.amountUnit === undefined? '' : ingredient.amount} {ingredient.amountUnit} {ingredient.name}
                <Button type={"button"}
                        onClick={() => {
                          setIngredients(ingredients.filter((item, idx) => idx !== index))
                        }} background={"red"} m={"5px"}>Smazat</Button>
              </ListItem>
            </List>
          ))}
        </>
      </Box>
    </Box>
  )
}
