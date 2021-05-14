import styled from "styled-components";
import { useState, useRef } from "react";
import { auth, db } from "../firebase";
import { useRouter } from "next/router";
import { useAuthState } from "react-firebase-hooks/auth";
import { Avatar, IconButton } from "@material-ui/core";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import AttachFileIcon from "@material-ui/icons/AttachFile";
import { useCollection } from "react-firebase-hooks/firestore";
import InsertEmoticonIcon from "@material-ui/icons/InsertEmoticon";
import Message from "./Message";
import firebase from "firebase";
import getRecipientEmail from "../utils/getRecipientEmail";
import TimeAgo from "timeago-react";

function ChatScreen({ chat, messages }) {
  const [user] = useAuthState(auth);
  const router = useRouter();
  const [input, setInput] = useState("");
  const [messagesSnapshot] = useCollection(
    db
      .collection("chats")
      .doc(router.query.id)
      .collection("messages")
      .orderBy("timestamp", "asc")
  );

  const endOfMessageRef = useRef(null);

  const [recipientSnapshot] = useCollection(
    db
      .collection("users")
      .where("email", "==", getRecipientEmail(chat.users, user))
  );

  const scrollToBottom = () => {
    endOfMessageRef.current.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  const showMessages = () => {
    if (messagesSnapshot) {
      return messagesSnapshot.docs.map((message) => (
        <Message
          key={message.id}
          user={message.data().user}
          message={{
            ...message.data(),
            timestamp: message.data().timestamp?.toDate().getTime(),
          }}
        />
      ));
    } else {
      return JSON.parse(messages).map((message) => (
        <Message key={message.id} user={message.user} message={message} />
      ));
    }
  };

  const sendMessage = (e) => {
    e.preventDefault();

    db.collection("users").doc(user.uid).set(
      {
        lastSeen: firebase.firestore.FieldValue.serverTimestamp(),
      },
      { merge: true }
    );
    if (trim(input)) {
      db.collection("chats").doc(router.query.id).collection("messages").add({
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        message: input,
        user: user.email,
        photoURL: user.photoURL,
      });
    }

    setInput("");
    scrollToBottom();
  };

  const recipient = recipientSnapshot?.docs?.[0]?.data();

  const recipientEmail = getRecipientEmail(chat.users, user);

  return (
    <Container>
      <Header>
        {recipient ? (
          <Avatar src={recipient?.photoURL} />
        ) : (
          <Avatar> {recipientEmail[0]}</Avatar>
        )}
        <HeaderInformation style={{ color: "white" }}>
          <h3>{recipientEmail}</h3>
          {recipientSnapshot ? (
            <p>
              {" "}
              last active:{" "}
              {recipient?.lastSeen?.toDate() ? (
                <TimeAgo datetime={recipient?.lastSeen?.toDate()} />
              ) : (
                "unvailabel"
              )}
            </p>
          ) : (
            <p>loading last active ... </p>
          )}
        </HeaderInformation>
        <HeaderIcons>
          <IconButton style={{ color: "white" }}>
            <AttachFileIcon />
          </IconButton>
          <IconButton style={{ color: "white" }}>
            <MoreVertIcon />
          </IconButton>
        </HeaderIcons>
      </Header>

      <MessagesContainer>
        {showMessages()}
        <EndOfMessage ref={endOfMessageRef} />
      </MessagesContainer>

      <InputContainer>
        <InsertEmoticonIcon style={{ color: "white" }} />
        <Input value={input} onChange={(e) => setInput(e.target.value)} />
        <button
          hidden
          disable={!input}
          type="submit"
          onClick={sendMessage}
        ></button>
      </InputContainer>
    </Container>
  );
}

export default ChatScreen;

const Container = styled.div``;
const Header = styled.div`
  position: sticky;
  background-color: #2f3f63;
  color: white;
  z-index: 100;
  top: 0;
  display: flex;
  padding: 11px;
  height: 88px;
  align-items: center;
`;
const HeaderInformation = styled.div`
  margin-left: 15px;
  flex: 1;

  > h3 {
    margin-bottom: 3px;
  }
  > p {
    font-size: 14px;
    color: gray;
  }
`;

const EndOfMessage = styled.div``;

const HeaderIcons = styled.div``;
const MessagesContainer = styled.div`
  padding: 30px;
  background-color: rgb(34, 38, 43);
  min-height: 90vh;
`;

const InputContainer = styled.form`
  display: flex;
  align-items: center;
  padding: 10px;
  bottom: 0;
  background-color: #2f3f63;
  z-index: 100;
  position: sticky;
`;

const Input = styled.input`
  flex: 1;
  outline: 0;
  border: none;
  border-radius: 10px;
  background-color: #a0b2d9;
  padding: 20px;
  margin-left: 15px;
  margin-right: 15px;
`;
