const MessageCard = ({ message, setMessageId, setShowModal }) => {
  return (
    <div className="message-card">
      <div className="message-card-header mb--1 ">
        <h4>
          ~{message.source} - {new Date(message.timestamp).toLocaleDateString()}
        </h4>
        <button
          onClick={() => {
            setShowModal(true);
            setMessageId(message.id);
          }}
          className="delete btn"
        >
          Delete
        </button>
      </div>
      <p>{message.text}</p>
    </div>
  );
};

export default MessageCard;
