import React from "react";
import { withStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import MuiDialogTitle from "@material-ui/core/DialogTitle";
import MuiDialogContent from "@material-ui/core/DialogContent";
import MuiDialogActions from "@material-ui/core/DialogActions";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import { makeStyles } from "@material-ui/core/styles";
import axios from "axios";
import SnackBarErfolg from "./SnackbarPw";

const useStyles = makeStyles((theme) => ({
  form: {
    display: "flex",
    flexDirection: "column",
    margin: "auto",
    width: "fit-content",
  },
  formControl: {
    marginTop: theme.spacing(2),
    minWidth: 120,
  },
  formControlLabel: {
    marginTop: theme.spacing(1),
  },
}));

const styles = (theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(2),
  },
  closeButton: {
    position: "absolute",
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
});

const DialogTitle = withStyles(styles)((props) => {
  const { children, classes, onClose, ...other } = props;
  return (
    <MuiDialogTitle disableTypography className={classes.root} {...other}>
      <Typography variant="h6">{children}</Typography>
      {onClose ? (
        <IconButton
          aria-label="close"
          className={classes.closeButton}
          onClick={onClose}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </MuiDialogTitle>
  );
});

const DialogContent = withStyles((theme) => ({
  root: {
    padding: theme.spacing(2),
  },
}))(MuiDialogContent);

const DialogActions = withStyles((theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(1),
  },
}))(MuiDialogActions);

export default function CustomizedDialogs({ oeffnen, klick, user, url }) {
  const classes = useStyles();
  const handleClose = () => {
    klick(false);
  };
  const [erfolg, setErfolg] = React.useState(false);
  const [erfolgText, setErfolgText] = React.useState("");

  const [erstesPw, setErstesPw] = React.useState("");
  const [zweitesPw, setZweitesPw] = React.useState("");

  const [fullWidth, setFullWidth] = React.useState(true);
  const [maxWidth, setMaxWidth] = React.useState("sm");

  const snackBarClose = (bool) => {
    setErfolg(bool);
  };
  const erstesPwText = (e) => {
    setErstesPw(e.target.value);
  };

  const zweitesPwText = (e) => {
    setZweitesPw(e.target.value);
  };

  const uebernehmePW = () => {
    const data = new FormData();
    data.append("email", user.email);
    data.append("kundenId", user._id);

    if (erstesPw === zweitesPw) {
      data.append("passwort", erstesPw);
      axios
        .post(url + "/CPep_Spring/PasswortAendern", data)
        .then(function (resp) {
          setErfolgText(resp.data);
          setErfolg(true);
          setErstesPw("");
          setZweitesPw("");
        });
    } else {
      alert("Achtung: Passwörter stimmen nicht überein!");
    }
  };

  return (
    <div>
      <Dialog
        disableBackdropClick={true}
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={oeffnen}
        fullWidth={fullWidth}
        maxWidth={maxWidth}
      >
        <DialogTitle id="customized-dialog-title" onClose={handleClose}>
          Bitte ändern Sie ihr initial Passwort
        </DialogTitle>
        <DialogContent dividers>
          <Typography gutterBottom>
            <form className={classes.form} noValidate>
              <TextField
                onChange={(e) => erstesPwText(e)}
                value={erstesPw}
                id="pw1"
                label="Passwort"
                type="password"
                autoComplete="current-password"
                variant="outlined"
                helperText="Vergeben Sie ein individuelles Passwort"
              />
              <TextField
                onChange={(e) => zweitesPwText(e)}
                value={zweitesPw}
                id="pw2"
                label="Passwort Wiederholen"
                type="password"
                autoComplete="current-password"
                variant="outlined"
                helperText="Wiederholen"
              />
              <Button
                variant="contained"
                color="secondary"
                onClick={() => uebernehmePW()}
              >
                speichern
              </Button>
            </form>
          </Typography>
        </DialogContent>

        <SnackBarErfolg
          snackBarClose={snackBarClose}
          erfolg={erfolg}
          erfolgText={erfolgText}
        ></SnackBarErfolg>
      </Dialog>
    </div>
  );
}
