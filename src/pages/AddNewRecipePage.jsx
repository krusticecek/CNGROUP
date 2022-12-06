import {
  Box,
  Button, ButtonGroup,
  Flex,
  FormControl, FormErrorMessage,
  FormHelperText,
  FormLabel,
  Heading,
  Input, NumberDecrementStepper, NumberIncrementStepper, NumberInput, NumberInputField, NumberInputStepper,
  Spacer, Text, Textarea
} from "@chakra-ui/react";
import {useNavigate} from "react-router-dom";
import React, {useState, useEffect} from "react";
import axios from "axios";
// import {ReactSearchAutocomplete} from "react-search-autocomplete";
import ReactMarkdown from "react-markdown";

export const AddNewRecipePage = () => {
  const navigate = useNavigate()

  const [title, setTitle] = useState('')
  const [preparationTime, setPreparationTime] = useState(0)
  const [directions, setDirections] = useState('')
  const [sideDish, setSideDish] = useState('')
  const [amount, setAmount] = useState(0)
  // const [amountUnit, setAmountUnit] = useState('')
  // const [name, setName] = useState('')
  // const [ingredients,setIngredients] = useState([])

  const isError = title === ''

  // vytvorime data, ktere posleme do api
  const data = {
    "title": title,
    "preparationTime": preparationTime,
    "directions": directions,
    "sideDish": sideDish,
  }


  const handleSaveClicked = () => {
    axios.post("https://exercise.cngroup.dk/api/recipes", data)
      .then(() => {
        navigate("/")
      })
      .catch((err) => {
        console.log(err)
      })
  }

  useEffect(() => {
    axios.get('https://exercise.cngroup.dk/api/recipes/side-dishes')
      .then(response => setSideDish(response.data))
  }, []);

  // useEffect(() => {
  //   axios.get('https://exercise.cngroup.dk/api/recipes/ingredients')
  //     .then(response => setIngredients(response.data))
  // }, []);
  //

  return (
    <Box>
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
        <Input autoFocus type='text' onChange={x => setTitle(x.target.value)}/>
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
        <ReactMarkdown>{directions}</ReactMarkdown>
      </Box>

      <Box>
        <Heading display={"flex"} justifyContent={"center"} m={4} color={"teal"}>Přílohy</Heading>
        {/* pridani autocompletu zde*/}
        {/*<ReactSearchAutocomplete items={itms}/>*/}
        <Input type={"text"} onChange={x => setSideDish(x.target.value)}></Input>
      </Box>
      <Box>
        <FormLabel display={"flex"} justifyContent={"center"} m={4} color={"teal"}>Ingredience</FormLabel>
        <NumberInput
          value={amount > 100 ? 100 : amount && amount < 0 ? 0 : amount}
          clampValueOnBlur={false} max={100} min={0} onChange={x => setAmount(x)} mb={"15px"}>
          <NumberInputField/>
          <NumberInputStepper>
            <NumberIncrementStepper/>
            <NumberDecrementStepper/>
          </NumberInputStepper>
        </NumberInput>
        <Input placeholder={"Jednotka"} mb={"15px"} type={"text"} onChange={x => setAmountUnit(x.target.value)}></Input>
        <Input placeholder={"Název"} mb={"15px"} type={"text"} onChange={x => setName(x.target.value)}></Input>
        <Button>Přidat</Button>
      </Box>
    </Box>
  )
}


