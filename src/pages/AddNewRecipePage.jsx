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
import React, {useState} from "react";
import axios from "axios";


export const AddNewRecipePage = () => {
  const navigate = useNavigate()

  const [title, setTitle] = useState('')
  const [preparationTime, setPreparationTime] = useState(0)
  const [directions, setDirections] = useState('')

  const isError = title === ''

  // vytvorime data, ktere posleme do api
  const data = {
    "title": title,
    "preparationTime": preparationTime,
    "directions": directions
  }

  const handleSaveClicked = () => {
    axios.post("https://exercise.cngroup.dk/api/recipes", data)
      .then((res) => {
        console.log(res.data)
        navigate("/")
      })
      .catch((err) => {
        console.log(err)
      })
  }

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
        <Heading display={"flex"} justifyContent={"center"} m={4}>Postup</Heading>
        <Textarea size={"lg"} rows={20} placeholder={"Zde napiš postup přípravy"} value={directions}
                  onChange={x => setDirections(x.target.value)}></Textarea>
      </Box>


    </Box>
  )
}
