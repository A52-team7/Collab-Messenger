import { Avatar, Tag, TagLabel } from "@chakra-ui/react";
import { useState, useEffect } from 'react';
import { getUserByHandle } from "../../services/users.service";
import { Author } from "../OneMessage/OneMessage";
import RemoveUser from "../RemoveUser/RemoveUser";
import { deleteMemberFromChannel } from "../../services/channels.service";

interface UserTagProps {
    handle: string;
    channelId:string
}

const UserTag = ({ handle, channelId }: UserTagProps) => {

    const [userInfo, setUserInfo] = useState<Author>();
    const [displayName, setDisplayName] = useState('');

    useEffect(() => {
        getUserByHandle(handle)
        .then(result => {
            setUserInfo(result.val());
            setDisplayName(result.val().firstName + ' ' + result.val().lastName);
        })
        .catch(e =>console.error(e));
    }, [handle]);

    const onDelete = () => {
        deleteMemberFromChannel(channelId, handle);
    }

    const RemoveUserProps = {
        name:displayName,
        onDelete: onDelete,
    };

    return(
        <>
        {userInfo && (
            <Tag size='lg' colorScheme='red' borderRadius='full'>
                <Avatar
                    size='xs'
                    name={displayName}
                    ml={-1}
                    mr={2}
                />
                <TagLabel>{displayName}</TagLabel>
                <RemoveUser {...RemoveUserProps}/>
            </Tag>
        )}
        </>
    )
}

export default UserTag;