import { Avatar, Tag, TagCloseButton, TagLabel } from "@chakra-ui/react";
import { useState, useEffect, useContext } from 'react';
import { getUserByHandle } from "../../services/users.service";
import { Author } from "../OneMessage/OneMessage";
import RemoveUser from "../RemoveUser/RemoveUser";
import { deleteMemberFromChannel } from "../../services/channels.service";
import { deleteMemberFromTeam } from "../../services/teams.service";
import AppContext from "../../context/AppContext";

interface UserTagProps {
    handle: string;
    channelId?:string,
    teamId?: string,
    removeChannelMembers?: (value: string) => void;
}

const UserTag = ({ handle, channelId, teamId, removeChannelMembers }: UserTagProps) => {

    const [userInfo, setUserInfo] = useState<Author>();
    const [displayName, setDisplayName] = useState('');

    const {userData} = useContext(AppContext);

    useEffect(() => {
        getUserByHandle(handle)
        .then(result => {
            setUserInfo(result.val());
            setDisplayName(result.val().firstName + ' ' + result.val().lastName);
        })
        .catch(e =>console.error(e));
    }, [handle]);

    const onDelete = () => {
        if(channelId){
            deleteMemberFromChannel(channelId, handle);
        }else if(teamId){
            deleteMemberFromTeam(teamId, handle);
        }
    }

    return(
        <>
        {userInfo && (
            <Tag size='lg' w={'205px'} h={'45px'} colorScheme='red' borderRadius='full'>
                <Avatar
                    size='xs'
                    name={displayName}
                    ml={-1}
                    mr={2}
                />
                <TagLabel>{displayName}</TagLabel>
                {handle !== userData?.handle && (
                    <>
                        {!removeChannelMembers ? (
                            <RemoveUser name={displayName} onDelete={onDelete} selfRemove={false}/>
                        ) : (
                            <TagCloseButton onClick={() => removeChannelMembers(handle)} />
                        )}
                    </>
                )}
            </Tag>
        )}
        </>
    )
}

export default UserTag;