import { Avatar, Tag, TagCloseButton, TagLabel } from "@chakra-ui/react";
import { useState, useEffect } from 'react';
import { getUserByHandle } from "../../services/users.service";
import { Author } from "../OneMessage/OneMessage";
import RemoveUser from "../RemoveUser/RemoveUser";
import { deleteMemberFromChannel } from "../../services/channels.service";

interface UserTagProps {
    handle: string;
    id?:string,
    removeChannelMembers?: (value: string) => void;
}

const UserTag = ({ handle, id, removeChannelMembers }: UserTagProps) => {

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
        deleteMemberFromChannel(id, handle);
    }

    return(
        <>
        {userInfo && (
            <Tag size='lg' w={'fit-content'} colorScheme='red' borderRadius='full'>
                <Avatar
                    size='xs'
                    name={displayName}
                    ml={-1}
                    mr={2}
                />
                <TagLabel>{displayName}</TagLabel>
                {!removeChannelMembers ? (
                    <RemoveUser name={displayName} onDelete={onDelete} selfRemove={false}/>
                ) : (
                    <TagCloseButton onClick={() => removeChannelMembers(handle)} />
                )}
            </Tag>
        )}
        </>
    )
}

export default UserTag;