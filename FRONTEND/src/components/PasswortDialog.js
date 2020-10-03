import React from "react";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import axios from "axios";
import { makeStyles } from "@material-ui/core/styles";
import Alert from "@material-ui/lab/Alert";
import IconButton from "@material-ui/core/IconButton";
import Collapse from "@material-ui/core/Collapse";
import CloseIcon from "@material-ui/icons/Close";

export default function FormDialog({ show, schließen, url }) {
  const [open, setOpen] = React.useState(false);
  const [email, setEmail] = React.useState("");
  const [zeigeAlert, setZeigeAlert] = React.useState(false);
  const [message, setMessage] = React.useState("");
  const setzeEMail = (e) => {
    setEmail(e.target.value);
  };

  function sendeEMail() {
    axios
      .get(url + "/CPep_Spring/PasswortAnfordern", {
        params: { email: email },
      })
      .then(function (response) {
        if (response.data.length > 0) {
          setMessage("EMail wurde versandt!");
          setZeigeAlert(true);
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  return (
    <div>
      <Dialog
        open={show}
        onClose={schließen}
        aria-labelledby="form-dialog-title"
      >
        <Collapse in={zeigeAlert}>
          <Alert
            action={
              <IconButton
                aria-label="close"
                color="inherit"
                size="small"
                onClick={() => {
                  setZeigeAlert(false);
                }}
              >
                <CloseIcon fontSize="inherit" />
              </IconButton>
            }
          >
            {message}
          </Alert>
        </Collapse>
        <DialogTitle id="form-dialog-title">Passwort anfordern</DialogTitle>
        <DialogContent>
          <DialogContentText>Geben Sie Ihre EMail Adresse an</DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Email Addresse"
            type="email"
            fullWidth
            onChange={(e) => setzeEMail(e)}
            value={email}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={schließen} color="primary">
            schließen
          </Button>
          <Button onClick={() => sendeEMail()} color="primary">
            senden
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
