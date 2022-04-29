import React from "react";
import { Box, IconButton, Modal, Typography } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
  borderRadius: "2rem",
};

export default function TmsSubChartModal(props) {
  const { modalState, handleClose, children, title } = props;

  //console.clear();
  console.log("------------ Chart modal --------------");
  console.log(props);

  return (
    <div>
      <Modal
        open={modalState}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={modalStyle}>
          <div style={{ display: "flex", flexDirection: "row" }}>
            <Typography
              variant="h6"
              component="h2"
              style={{ display: "flex", flex: 1 }}
            >
              {title}
            </Typography>
            <Typography
              variant="h6"
              component="div"
              style={{ display: "flex", flex: 1, justifyContent: "flex-end" }}
              textAlign={"right"}
            >
              <IconButton aria-label="delete" onClick={handleClose}>
                <CloseIcon />
              </IconButton>
            </Typography>
          </div>
          <br />
          {children}
        </Box>
      </Modal>
    </div>
  );
}
