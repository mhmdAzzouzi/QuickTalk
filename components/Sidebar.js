import { Avatar, IconButton, Button } from "@material-ui/core";
import styled from "styled-components";
import ChatIcon from "@material-ui/icons/Chat";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import SearchIcon from "@material-ui/icons/Search";
import * as EmailValidator from "email-validator";
import { useCollection } from "react-firebase-hooks/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../firebase";
import Chat from "./Chat";
function Sidebar() {
  const [user] = useAuthState(auth);
  const userChatRef = db
    .collection("chats")
    .where("users", "array-contains", user.email);

  const [chatSnapshot] = useCollection(userChatRef);

  const createChat = () => {
    const input = prompt("Please enter an email address");
    if (!input) return;

    if (
      EmailValidator.validate(input) &&
      !chatAlreadyExists(input) &&
      input !== user.email
    ) {
      //we need to add the chat into the db if it does not exist or already is valid
      db.collection("chats").add({
        users: [user.email, input],
      });
    }
  };

  const chatAlreadyExists = (recipientEmail) =>
    !!chatSnapshot?.docs.find((chat) =>
      chat.data().users.find((user) => user === recipientEmail?.length > 0)
    );
  return (
    <Container>
      <Header>
        <UserAvatar src={user.photoURL} onClick={() => auth.signOut()} />

        <IconsContainer>
          <IconButton style={{ color: "white" }}>
            <ChatIcon />
          </IconButton>

          <IconButton style={{ color: "white" }}>
            <MoreVertIcon />
          </IconButton>
        </IconsContainer>
      </Header>

      <Search>
        <SearchIcon />
        <SearchInput placeholder="Search for chats" />
      </Search>

      <SidebarButton onClick={createChat}>Start a new Chat</SidebarButton>

      {/* List of chats */}
      {chatSnapshot?.docs.map((chat) => (
        <Chat key={chat.id} id={chat.id} users={chat.data().users} />
      ))}
    </Container>
  );
}

export default Sidebar;

const Container = styled.div`
  flex: 0.45;
  border-right: 1px solid whitesmoke;
  height: 100vh;
  min-width: 300px;
  max-width: 350px;
  overflow: scroll;
  color: white;
  background-color: #141414;
`;

const SearchInput = styled.input`
  outline-width: 0;
  border: none;
  color: white;
  background-color: #141414;
  flex: 1;
`;
const SidebarButton = styled(Button)`
  width: 100%;

  &&& {
    background-color: #2f3f63;
    padding: 10px;
    color: white;
  }
  :hover {
    opacity: 0.4;
  }
`;
const Search = styled.div`
  display: flex;
  align-items: center;
  padding: 5px;
  border-radius: 2px;
`;

const Header = styled.div`
  display: flex;
  position: sticky;
  top: 0;
  background-color: #2f3f63;
  z-index: 1;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  height: 88px;
`;
const UserAvatar = styled(Avatar)`
  cursor: pointer;
  :hover {
    opacity: 0.8;
  }
`;
const IconsContainer = styled.div``;
