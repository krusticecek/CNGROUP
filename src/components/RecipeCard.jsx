import {Card, CardBody, Image, Stack, Heading, Text, Divider, CardFooter} from "@chakra-ui/react";
import PlaceHolderImage from "../images/food-placeholder.png";
import {Link} from "react-router-dom";


export function RecipeCard({slug, title, preparationTime, sideDish}) {
  const convertTime = () => {
    let hours = Math.floor(preparationTime / 60)
    let minutes = preparationTime % 60

    if (hours === 0) {
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

  return (
    <Link to={`/recept/${slug}`}>
      <Card maxW='sm'>
        <CardBody>
          <Image
            src={PlaceHolderImage}
            alt='Images of meals'
            borderRadius='lg'
          />
          <Stack mt='6' spacing='3'>
            <Heading size='md'>{title}</Heading>
          </Stack>
        </CardBody>
        <Divider/>
        <CardFooter>
          <Text color='blue.600' fontSize={"xl"}>
            ⏲️ {convertTime()}
          </Text>
          <Text fontSize={"xl"} ml={"10px"}> {sideDish}</Text>
        </CardFooter>
      </Card>
    </Link>
  )
}
