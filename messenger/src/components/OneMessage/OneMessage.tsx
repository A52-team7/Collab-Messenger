import { Badge } from "@chakra-ui/react";

// interface Message {
//     id: string;
//     content: string;
//     author: string;
//     createdOn: Date;
// }

const OneMessage = (message: string) => {
return(
    <Badge colorScheme='green'>{message}</Badge>
)
}

export default OneMessage;