import styles from "./modal.module.css";

const Modal = ({
  title,
  onClose,
  showModal,
  setShowModal,
  onDeleteHandler,
  onDeleteAllHandler,
}) => {
  return (
    <div className={`${styles.modal} ${showModal ? "" : styles["d-none"]} `}>
      <div className={styles["modal-content"]}>
        <h5>{title}</h5>
        <div className="d-flex-row justify-content-between">
          <button
            onClick={() => {
              if (title === "Are you sure you want to delete?") {
                onDeleteHandler();
              } else {
                onDeleteAllHandler();
              }
              setShowModal(false);
            }}
            className="btn danger"
          >
            Yes
          </button>
          <button
            onClick={() => {
              setShowModal(false);
            }}
            className="btn"
          >
            No
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
