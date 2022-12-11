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
import {useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";
import ReactMarkdown from "react-markdown";
import {api} from "../api";
import ChakraUIRenderer from "chakra-ui-markdown-renderer";
import {ReactSearchAutocomplete} from 'react-search-autocomplete'


export const AddNewRecipePage = () => {
  const navigate = useNavigate()

  const [title, setTitle] = useState('')
  const [preparationTime, setPreparationTime] = useState(0)
  const [directions, setDirections] = useState('')
  const [sideDish, setSideDish] = useState('')
  const [servingCount, setServingCount] = useState(0)

  const [amount, setAmount] = useState(0)
  const [amountUnit, setAmountUnit] = useState('')
  const [name, setName] = useState('')

  const [ingredients, setIngredients] = useState([])
  const [apiSideDishes, setApiSideDishes] = useState([])
  const [apiIngredients, setApiIngredients] = useState([])
  const isError = title === ''

  // vytvorime data, ktere posleme do api
  const data = {
    "title": title,
    "preparationTime": preparationTime,
    "directions": directions,
    "sideDish": sideDish,
    "servingCount": servingCount,
    "ingredients": ingredients
  }

  const titlenondiacritic =
    title
      .normalize("NFKD")
      .replace(/\p{Diacritic}/gu, "")
      .trimEnd()
      .replace(/\s+/g, '-')
      .toLowerCase()
  const handleSaveClicked = () => {
    api.post("/recipes", data)
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


  return (<Box>
    <Flex minWidth='max-content' alignItems='center' gap='2'>
      <Box p='2'>
        <Heading my={4} size='xl' color={"teal"}>Nový recept</Heading>
      </Box>
      <Spacer/>
      <ButtonGroup>
        <Button display={"flex"} justifyContent={"flex-end"} onClick={() => navigate('/')}>
          Zpět
        </Button>
        <Button colorScheme={"whatsapp"} disabled={isError} onClick={() => handleSaveClicked()}>Uložit</Button>
      </ButtonGroup>
    </Flex>

    <FormControl isInvalid={isError}>
      <FormLabel>Název receptu</FormLabel>
      <Input autoFocus type='text' onChange={x => setTitle(x.target.value.trimStart())}/>
      {!isError ? (<FormHelperText>
        Recept bude uložen pod názvem <Text as={"b"}>{title}</Text>
      </FormHelperText>) : (<FormErrorMessage m={"5px"}>Chybí název receptu!</FormErrorMessage>)}
    </FormControl>

    <FormControl mb={"5px"}>
      <FormLabel>Doba přípravy v minutách</FormLabel>
      <NumberInput
        value={preparationTime > 1200 ? 1200 : preparationTime && preparationTime < 0 ? 0 : preparationTime}
        clampValueOnBlur={false} max={1200} min={0} onChange={x => setPreparationTime(parseInt(x))}>
        <NumberInputField/>
        <NumberInputStepper>
          <NumberIncrementStepper/>
          <NumberDecrementStepper/>
        </NumberInputStepper>
      </NumberInput>
    </FormControl>

    <FormControl mb={"5px"}>
      <FormLabel>Počet porcí</FormLabel>
      <NumberInput
        value={servingCount > 50 ? 50 : servingCount && servingCount < 0 ? 0 : servingCount}
        clampValueOnBlur={false} max={50} min={0} onChange={x => setServingCount(parseInt(x))}>
        <NumberInputField/>
        <NumberInputStepper>
          <NumberIncrementStepper/>
          <NumberDecrementStepper/>
        </NumberInputStepper>
      </NumberInput>
    </FormControl>


    <Box>
      <Heading display={"flex"} justifyContent={"center"} m={4} color={"teal"}>Postup</Heading>
      <Box>
        <Textarea size={"xs"} rows={10} placeholder={"Zde napiš postup přípravy"} value={directions}
                  onChange={x => setDirections(x.target.value)}></Textarea>
      </Box>
      <Box>
        <Heading as='h2' size='xl' color={"teal"}>Náhled
        </Heading>
        <ReactMarkdown components={ChakraUIRenderer()}>{directions}</ReactMarkdown>
      </Box>
    </Box>

    <Box>
      <Heading display={"flex"} justifyContent={"center"} m={4} color={"teal"}>Přílohy</Heading>
      <ReactSearchAutocomplete items={SideDishesList} onSelect={(e) => setSideDish(e.name)}
                               onSearch={(e) => setSideDish(e)}/>
    </Box>

    <FormLabel display={"flex"} justifyContent={"center"} m={4} color={"teal"}>Ingredience</FormLabel>
    <Grid templateColumns='repeat(3, 1fr)' gap={6}>
      <GridItem w='100%' h='10'>
        <NumberInput
          value={amount > 100 ? 100 : amount && amount < 0 ? 0 : amount}
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
               onChange={x => setAmountUnit(x.target.value.trimStart())}></Input>
      </GridItem>
      <GridItem w='100%' h='10'>
        <ReactSearchAutocomplete items={IngredientsList} onSelect={(e) => setName(e.name)} onSearch={(e) => setName(e)}
                                 placeholder={"Název"}/>
      </GridItem>
    </Grid>
    <Box display={"flex"} justifyContent={"center"} m={"15px"}>
      <Button onClick={() => handleSaveIngredients()}>Uložit</Button>
    </Box>

    <Box>
      <>
        {ingredients.map((ingredient, index) => (<List display={"flex"} justifyContent={"center"} key={index}>
          <ListItem>
            {ingredient.amount} {ingredient.amountUnit} {ingredient.name}
            <Button type={"button"}
                    onClick={() => {
                      setIngredients(ingredients.filter((item, idx) => idx !== index))
                    }} background={"red"} m={"5px"}>Smazat</Button>
          </ListItem>
        </List>))}
      </>
    </Box>
  </Box>)
}
