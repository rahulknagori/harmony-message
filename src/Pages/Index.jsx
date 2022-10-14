import { useEffect, useState } from "react";
import MessageCard from "../Components/MessageCard";
import { v4 as uuidv4 } from "uuid";
import Modal from "../Components/Modal";

let deleteRequestOptions = {
  method: "DELETE",
  headers: {
    "Content-Type": "application/json",
    Authorization: "_Reqqa1TnsbKSEJj",
  },
  redirect: "follow",
};

const Index = () => {
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState({
    id: uuidv4(),
    text: "",
    source: "rahul-dn",
    timestamp: new Date(),
  });
  const [messageId, setMessageId] = useState("");
  const [order, setOrder] = useState("asc");
  const [showModal, setShowModal] = useState(false);
  const [modalTitle, setModalTitle] = useState(
    "Are you sure you want to delete?"
  );
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch("https://mapi.harmoney.dev/api/v1/messages/", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "_Reqqa1TnsbKSEJj",
      },
    })
      .then((response) => response.json())
      .then((data) => setMessages(data));
  }, []);

  const onSubmitHandler = async () => {
    setLoading(true);
    try {
      let requestOptions = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "_Reqqa1TnsbKSEJj",
        },
        body: JSON.stringify(userInput),
        redirect: "follow",
      };

      await fetch("https://mapi.harmoney.dev/api/v1/messages/", requestOptions)
        .then((response) => {
          if (response.status === 201) {
            setLoading(false);
            setUserInput({ ...userInput, text: "" });
            return response.json();
          } else {
            setLoading(false);
            throw new Error("Something went wrong");
          }
        })
        .then((result) => setMessages([...messages, result]))
        .catch((error) => console.log("error", error));
    } catch (err) {
      console.log(err);
    }
  };

  const onDeleteHandler = async () => {
    setLoading(true);
    try {
      await fetch(
        `https://mapi.harmoney.dev/api/v1/messages/${messageId}`,
        deleteRequestOptions
      )
        .then((response) => {
          if (response.status === 204) {
            setLoading(false);
            return response;
          } else {
            throw new Error("Something went wrong");
          }
        })
        .then((_) => {
          setMessages(messages.filter((message) => message.id !== messageId));
        })
        .catch((error) => console.log("error", error));
    } catch (err) {
      console.log(err);
    }
  };

  const onDeleteAllHandler = async () => {
    setLoading(true);
    let ids = messages.map((item) => item.id);

    try {
      let requests = ids.map((id) =>
        fetch(
          `https://mapi.harmoney.dev/api/v1/messages/${id}`,
          deleteRequestOptions
        )
      );

      Promise.all(requests).then((responses) => {
        for (let response of responses) {
          if (response.status !== 204) {
            throw new Error("Something went wrong");
          }
        }
        setLoading(false);
        return setMessages([]);
      });
    } catch (err) {
      console.log(err);
    }
  };

  const onSortHandler = () => {
    let sortedMessages = messages.sort((a, b) => {
      return order === "asc"
        ? new Date(b.timestamp) - new Date(a.timestamp)
        : new Date(a.timestamp) - new Date(b.timestamp);
    });
    setOrder(order === "asc" ? "desc" : "asc");
    setMessages([...sortedMessages]);
  };

  return (
    <div className="container">
      <Modal
        onDeleteHandler={onDeleteHandler}
        onDeleteAllHandler={onDeleteAllHandler}
        showModal={showModal}
        setShowModal={setShowModal}
        title={modalTitle}
      />
      {loading && <h3 className="loader">Loading, Please Wait.....</h3>}
      <h1 className="mb--1 ">Chatter</h1>
      <p className="mb--1">Type something in the box below and hit "Post"</p>
      <div className="d-flex">
        <textarea
          className="mb--1"
          rows="10"
          onChange={(e) => setUserInput({ ...userInput, text: e.target.value })}
          value={userInput.text}
        ></textarea>
        <div className="mb--1">
          <button onClick={onSubmitHandler} className="btn">
            Post
          </button>
          <button
            className="ml--1 btn delete"
            onClick={() => {
              setModalTitle(
                "Are you sure you want to delete all the messages?"
              );
              setShowModal(true);
            }}
          >
            DELETE ALL
          </button>
        </div>
      </div>
      <div className="d-flex-row  justify-content-between">
        <h2>Messages</h2>
        <button onClick={onSortHandler} className="btn">
          Sort
        </button>
      </div>
      {messages.map((message) => (
        <MessageCard
          key={message.id}
          message={message}
          setShowModal={setShowModal}
          setMessageId={setMessageId}
        />
      ))}
    </div>
  );
};

export default Index;
