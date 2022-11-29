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

export const AddNewRecipePage = () => {
  const navigate = useNavigate()

  const [input, setInput] = useState('')

  const handleInputChange = (e) => setInput(e.target.value)

  const isError = input === ''


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
          <Button colorScheme={"whatsapp"} disabled={isError}>Uložit</Button>
        </ButtonGroup>
      </Flex>

      <FormControl isInvalid={isError}>
        <FormLabel>Název receptu</FormLabel>
        <Input type='name' value={input} onChange={handleInputChange}/>
        {!isError ? (
          <FormHelperText>
            Recept bude uložen s názvem <Text as={"b"}>{input}</Text>
          </FormHelperText>
        ) : (
          <FormErrorMessage m={"5px"}>Chybí název receptu!</FormErrorMessage>
        )}
      </FormControl>

      <FormControl mb={"5px"}>
        <FormLabel>Doba přípravy</FormLabel>
        <NumberInput  clampValueOnBlur={false} max={9999} min={0}>
          <NumberInputField/>
          <NumberInputStepper>
            <NumberIncrementStepper/>
            <NumberDecrementStepper/>
          </NumberInputStepper>
        </NumberInput>
      </FormControl>

      <FormControl>
        <FormLabel>Počet porcí</FormLabel>
        <NumberInput  clampValueOnBlur={false} max={20} min={0}>
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
