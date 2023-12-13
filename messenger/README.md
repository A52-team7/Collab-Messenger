<img src="https://webassets.telerikacademy.com/images/default-source/logos/telerik-academy.svg" alt="logo" width="300px" style="margin-top: 20px;"/>

# Chat'n Blab
Chat'n Blab is a modern solution for people and teams in need of a real-time solution for communication and collaboration. It allows users to share information, link resources and potentially discuss ideas over voice and video.

### 1. Project information

     - Library: React
     - Language: TypeScript
     - UI library: Chakra UI
     - Platform and version: Node 14.0+

### 2. Local Setup and Run

To get the project up and running, follow these steps:

1. Download the app from gitHub: https://github.com/A52-team7/Collab-Messenger
2. Go inside the `messenger` folder.
3. Run `npm install` to restore all dependencies.
4. After that, run script to start app `npm run dev`

### 3. Functionalities

Authentication: User authentication is handled by Firebase Realtime Database.

### 4. Public part
- The public part is accessible for without authentication. 
- Anonymous users can register and login.

### 5. Private part

- Accessible only if the user is authenticated.
- Registered users have a private area accessible after successful login, where they can see all the chats and teams they have been added to.

#### Individual user requirements:
Users can see and edit their personal information – name, avatar picture, etc.
- Users can search for other users by their name, team(s) they belong to, and/or email.
- Users have a status (online/offline/busy/away).

#### Team requirements:
- A team can be created by a user and that user must be the team’s owner.
- One user can be added to multiple teams.
- Only the team’s owner can add to or remove other users from the team.
- A team have its own page/view where information about the team could be visible, and all team’s channels are displayed together.
- Users can organize team meetings with a starting date and hour and a specified duration.

#### Chat requirements:
- A single user can create a chat (with unrelated users) or a channel (with their own team).
- Users can leave any chat and channel they have been added to. Upon leaving they should stop receiving new messages from that chat/channel.
- Every chat/channel contain all the messages sent in it and display the messages in chronological order.
- Users can react to individual messages.
- Users can edit their sent message. 
- Messages contain media such as static pictures and youtube link


## Authors and acknowledgment
[Desislava Petrova] (https://github.com/desi-petrova)
[Hristina Georgieva] (https://github.com/hristina-georgieva)
[Mihail Uymaz] (https://github.com/m-uymaz)