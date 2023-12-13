import { Avatar, Box, Flex, Tag, TagCloseButton, TagLabel } from "@chakra-ui/react";
import { useState, useEffect, useContext } from 'react';
import { getUserByHandle } from "../../services/users.service";
import { Author } from "../OneMessage/OneMessage";
import RemoveUser from "../RemoveUser/RemoveUser";
import { channelMessage, deleteMemberFromChannel, getChannelById } from "../../services/channels.service";
import { deleteMemberFromTeam } from "../../services/teams.service";
import AppContext from "../../context/AppContext";
import { addMessage } from "../../services/messages";
import { ADMIN, FROM, REMOVED, REMOVE_PERSON } from "../../common/constants";
import { useNavigate } from 'react-router-dom';

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
    const [imageSrc, setImageSrc] = useState('');

    const navigate = useNavigate();

    useEffect(() => {
        getUserByHandle(handle)
        .then(result => {
            setUserInfo(result.val());
            setDisplayName(result.val().firstName + ' ' + result.val().lastName);
            if(result.val().profilePhoto){
                setImageSrc(result.val().profilePhoto);
            }
        })
        .catch(e =>console.error(e));
    }, [handle]);

    const onDelete = () => {
        if(channelId){
            deleteMemberFromChannel(channelId, handle);
            getChannelById(channelId)
            .then(channel => {
                addMessage(userData?.firstName + ' ' + userData?.lastName + ' ' + REMOVED + displayName + FROM + channel.title, ADMIN, channelId, true, REMOVE_PERSON)
                .then(message => {
                channelMessage(channelId, message.id);
                })
                .catch(error => console.error(error.message));
            })
            .catch(error => console.error(error.message));
        }
    }

    const onDeleteTeamMember = () =>{
        if(teamId !== undefined && userData?.firstName !== undefined){
        deleteMemberFromTeam(teamId, handle, userData.firstName, userData?.lastName, displayName)
        navigate(-1)
    }
    }

    return(
        <>
        {userInfo && (
            <Tag size='lg' w={'300px'} h={'45px'} bg={'rgb(193,137,219)'} borderRadius='full'>
                <Flex w={'full'} alignItems={'center'}>
                <Avatar
                    size='xs'
                    name={displayName}
                    src={imageSrc}
                    ml={-1}
                    mr={2}
                />
                <TagLabel>{displayName}</TagLabel>
                </Flex>
                {handle !== userData?.handle && (
                    <>
                        {(teamId && channelId == undefined) ? (<RemoveUser name={displayName} onDelete={onDeleteTeamMember} selfRemove={false}/>)
                          : !removeChannelMembers  ? (
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