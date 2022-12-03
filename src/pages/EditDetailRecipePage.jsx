import {useNavigate, useParams} from "react-router-dom";
import axios from "axios";
import {
  Box,
  Button,
  ButtonGroup, Flex,
  FormControl, FormErrorMessage,
  FormHelperText,
  FormLabel,
  Heading,
  Input,
  Spacer, Text
} from "@chakra-ui/react";
import React, {useEffect, useState} from "react";

export const EditDetailRecipePage = () => {

  const {slug} = useParams();
  const navigate = useNavigate();
  const [detail, setDetail] = useState('')
  const [preparationTime, setPreparationTime] = useState(0)
  const [title, setTitle] = useState('')
  const [directions, setDirections] = useState('')
  const isError = title === ''

  useEffect(() => {
    axios.get(`https://exercise.cngroup.dk/api/recipes/${slug}`).then(res => {
      setDetail(res.data);
      setTitle(res.data.title);
      setDirections(res.data.directions)
      setPreparationTime(res.data.preparationTime)
    });
  }, []);


  // vytvorime data, ktere posleme do api
  const data = {
    "title": title,
    "preparationTime": preparationTime,
    "directions": directions
  }

  const handleSaveClicked = () => {
    axios.post(`https://exercise.cngroup.dk/api/recipes/${detail._id}`, data)
      .then(() => {
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
          <Heading my={4} size='xl' color={"teal"}>{title}</Heading>
        </Box>
        <Spacer/>
        <ButtonGroup>
          <Button display={"flex"} justifyContent={"flex-end"} onClick={() => navigate(`/recept/${slug}`)}>
            Zpět
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

    </Box>
  )
}
