import {
  Box,
  Button, ButtonGroup,
  Flex,
  FormControl, FormErrorMessage,
  FormHelperText,
  FormLabel,
  Heading,
  Input, NumberDecrementStepper, NumberIncrementStepper, NumberInput, NumberInputField, NumberInputStepper,
  Spacer, Text
} from "@chakra-ui/react";
import {useNavigate} from "react-router-dom";
import React, {useState} from "react";
import axios from "axios";


export const AddNewRecipePage = () => {
  const navigate = useNavigate()

  const [title, setTitle] = useState('')
  const [preparationTime,setPreparationTime] = useState(0)
  const [servings,setServings] = useState(0)

  const isError = title === ''

  // vytvorime data, ktere posleme do api
  const data = {
    "title": title,
    "preparationTime": preparationTime,
  }

  const handleSaveClicked = () =>
    axios.post("https://exercise.cngroup.dk/api/recipes",data)
    .then((res)=> {
      console.log(res.data)
    })
    .catch((err) => {
      console.log(err)
    })



  //console.log(`prepTime:${preparationTime}, title:${title}, servings: ${servings}`)



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
          <Button colorScheme={"whatsapp"} disabled={isError} onClick={handleSaveClicked}>Uložit</Button>
        </ButtonGroup>
      </Flex>

      <FormControl isInvalid={isError}>
        <FormLabel>Název receptu</FormLabel>
        <Input type='name' onChange={x => setTitle(x.target.value)}/>
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
        <NumberInput value={preparationTime > 1200 ? 1200 : preparationTime && preparationTime < 0 ? 0 : preparationTime} clampValueOnBlur={false} max={1200} min={0}  onChange={x => setPreparationTime(x)}>
          <NumberInputField/>
          <NumberInputStepper>
            <NumberIncrementStepper/>
            <NumberDecrementStepper/>
          </NumberInputStepper>
        </NumberInput>
      </FormControl>

      <FormControl>
        <FormLabel>Počet porcí</FormLabel>
        <NumberInput  value={servings > 20 ? 20 : servings && servings < 0 ? 0 : servings} clampValueOnBlur={false} max={20} min={0} onChange={x => setServings(x)}>
          <NumberInputField/>
          <NumberInputStepper>
            <NumberIncrementStepper/>
            <NumberDecrementStepper/>
          </NumberInputStepper>
        </NumberInput>
      </FormControl>

    </Box>
  )
}
