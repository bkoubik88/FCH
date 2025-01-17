import React from "react";
import Button from "@material-ui/core/Button";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";
import { makeStyles } from "@material-ui/core/styles";

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    "& > * + *": {
      marginTop: theme.spacing(2),
    },
  },
}));

export default function CustomizedSnackbars({
  erfolg,
  erfolgText,
  snackBarClose,
}) {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    snackBarClose(false);
  };

  return (
    <div className={classes.root}>
      <Snackbar open={erfolg} autoHideDuration={4000} onClose={handleClose}>
        <Alert severity="success">{erfolgText}</Alert>
      </Snackbar>
    </div>
  );
}
