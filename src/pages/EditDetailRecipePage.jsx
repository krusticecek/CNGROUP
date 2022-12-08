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

export const EditDetailRecipePage = () => {

  const {slug} = useParams();
  const navigate = useNavigate();
  const [detail, setDetail] = useState('')
  const [preparationTime, setPreparationTime] = useState(0)
  const [title, setTitle] = useState('')
  const [directions, setDirections] = useState('')
  const [sideDish,setSideDish] = useState('')
  const [ingredients,setIngredients] = useState([])
  const [amount,setAmount] = useState(0)
  const [amountUnit,setAmountUnit]= useState('')
  const [name, setName] = useState('');


  const isError = title === ''

  useEffect(() => {
      api.get(`/recipes/${slug}`).then(res => {
        setDetail(res.data);
        setTitle(res.data.title);
        setDirections(res.data.directions)
        setPreparationTime(res.data.preparationTime)
        setSideDish(res.data.sideDish)
        setIngredients(res.data.ingredients)
      });
  }, [slug]);



  // vytvorime data, ktere posleme do api
  const data = {
    "title": title,
    "preparationTime": preparationTime,
    "directions": directions,
    "sideDish": sideDish,
    "ingredients": ingredients
  }

  const titlenondiacritic = title.normalize("NFKD").replace(/\p{Diacritic}/gu, "")

  const handleSaveClicked = () => {
    api.post(`/recipes/${detail._id}`, data)
      .then(() => {
        navigate(`/recept/${titlenondiacritic}`)
        // navigate(`/`)
      })
      .catch((err) => {
        console.log(err)
      })
  }

  const handleSaveIngredients = () => {
    if (name !== "") {
      setIngredients(ingredient => [...ingredient, {"name": name, "amount": amount, "amountUnit": amountUnit}])

    } else {
      console.log("Musíš obsahovat název")
    }
  }

  ingredients.forEach((o, i) => o.id = i + 1)

  return (
    <Box>
      <Flex minWidth='max-content' alignItems='center' gap='2'>
        <Box p='2'>
          <Heading my={4} size='xl' color={"teal"}>{title}</Heading>
        </Box>
        <Spacer/>
        <ButtonGroup>
          <Button display={"flex"} justifyContent={"flex-end"} onClick={() => navigate(`/recept/${slug}`)}>
            Zrušit
          </Button>
          <Button colorScheme={"whatsapp"} disabled={isError} onClick={() => handleSaveClicked()}>Uložit</Button>
        </ButtonGroup>
      </Flex>

      <FormControl isInvalid={isError}>
        <FormLabel>Název receptu</FormLabel>
        <Input type='text' onChange={x => setTitle(x.target.value)} defaultValue={`${title}`} autoFocus/>
        {!isError ? (
          <FormHelperText>
            Recept bude uložen s názvem <Text as={"b"}>{title}</Text>
          </FormHelperText>
        ) : (
          <FormErrorMessage m={"5px"}>Chybí název receptu!</FormErrorMessage>
        )}
      </FormControl>

      <FormControl mb={"5px"}>
        <FormLabel>Doba přípravy v minutách</FormLabel>
        <NumberInput
          value={preparationTime > 1200 ? 1200 : preparationTime && preparationTime < 0 ? 0 : preparationTime}
          clampValueOnBlur={false} max={1200} min={0} onChange={x => setPreparationTime(x)}>
          <NumberInputField/>
          <NumberInputStepper>
            <NumberIncrementStepper/>
            <NumberDecrementStepper/>
          </NumberInputStepper>
        </NumberInput>
      </FormControl>

      <Box>
        <Heading display={"flex"} justifyContent={"center"} m={4} color={"teal"}>Postup</Heading>
        {/* upraveni na markdown textarea*/}
        <Textarea size={"xs"} rows={20} placeholder={"Zde napiš postup přípravy"} value={directions}
                  onChange={x => setDirections(x.target.value)}></Textarea>
        <ReactMarkdown children={directions}></ReactMarkdown>
      </Box>

      <Box>
        <Heading display={"flex"} justifyContent={"center"} m={4} color={"teal"}>Přílohy</Heading>
        {/* pridani autocompletu zde*/}
        <Input type={"text"} onChange={x => setSideDish(x.target.value)} value={sideDish}></Input>
      </Box>

      <FormLabel display={"flex"} justifyContent={"center"} m={4} color={"teal"}>Ingredience</FormLabel>
      <Grid templateColumns='repeat(3, 1fr)' gap={6}>
        <GridItem w='100%' h='10'>
          <NumberInput
            value={amount > 100 ? 100 : amount && amount < 0 ? 0 : amount}
            clampValueOnBlur={false} max={100} min={0} onChange={x => setAmount(x)} mb={"15px"}>
            <NumberInputField/>
            <NumberInputStepper>
              <NumberIncrementStepper/>
              <NumberDecrementStepper/>
            </NumberInputStepper>
          </NumberInput>
        </GridItem>
        <GridItem w='100%' h='10'>
          <Input placeholder={"Jednotka"} mb={"15px"} type={"text"}
                 onChange={x => setAmountUnit(x.target.value)} value={amountUnit}></Input>
        </GridItem>
        <GridItem w='100%' h='10'>
          <Input placeholder={"Název"} mb={"15px"} type={"text"}
                 onChange={x => setName(x.target.value)} value={name}></Input>
        </GridItem>
      </Grid>
      <Box display={"flex"} justifyContent={"center"} m={"15px"}>
        <Button onClick={() => handleSaveIngredients()}>Uložit</Button>
      </Box>
      <Box>
        <>
          {ingredients.map((ingredient) => (
            <List display={"flex"} justifyContent={"center"} key={ingredient.id}>
              <ListItem>
                {ingredient.amount} {ingredient.amountUnit} {ingredient.name}
                <Button type={"button"}
                        onClick={() => {
                          setIngredients(ingredients.filter(current => current.id !== ingredient.id))
                        }} background={"red"} m={"5px"} size={"xs"}>X</Button>
              </ListItem>
            </List>
          ))}
        </>
      </Box>
    </Box>
  )
}
