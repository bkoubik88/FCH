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
import PictureAsPdfIcon from "@material-ui/icons/PictureAsPdf";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import Avatar from "@material-ui/core/Avatar";
import { makeStyles } from "@material-ui/core/styles";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import axios from "axios";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { useTheme } from "@material-ui/core/styles";

import moment from "moment";
import "moment/locale/de";

const useStyles = makeStyles((theme) => ({
  pdfs: {
    width: "100%",

    height: 500,
    backgroundColor: theme.palette.background.paper,
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

export default function CustomizedDialogs({
  userMoechtePdfEinsehen,
  mailIconKlick,
  pdfs,
  url,
}) {
  const classes = useStyles();
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const handleClose = () => {
    mailIconKlick(false);
  };

  const getPdf = (id) => {
    axios(url + "/CPep_Spring/getPdf?_id=" + id + "&liste=beide", {
      method: "GET",
      responseType: "blob", //Force to receive data in a Blob Format
    })
      .then((response) => {
        //Create a Blob from the PDF Stream
        const file = new Blob([response.data], { type: "application/pdf" });
        //Build a URL from the file
        const fileURL = URL.createObjectURL(file);
        //Open the URL on new Window
        window.open(fileURL);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div>
      <Dialog
        fullScreen={fullScreen}
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={userMoechtePdfEinsehen}
      >
        <DialogTitle id="customized-dialog-title" onClose={handleClose}>
          Empfangene Dokumente
        </DialogTitle>
        <DialogContent dividers>
          <Typography gutterBottom>
            <List className={classes.pdfs}>
              {pdfs.map((pdf) => {
                return (
                  <>
                    <ListItem>
                      <ListItemAvatar>
                        <Avatar>
                          <PictureAsPdfIcon />
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={`Von: ${pdf.vornameVon} ${pdf.nachnameVon} - ${pdf.vonFirmenId}`}
                        secondary={moment(pdf.datum).format("LLL")}
                      />

                      <ListItemSecondaryAction>
                        <IconButton edge="end" aria-label="delete">
                          <PictureAsPdfIcon onClick={() => getPdf(pdf.pdfId)} />
                        </IconButton>
                      </ListItemSecondaryAction>
                    </ListItem>
                  </>
                );
              })}
            </List>
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            schließen
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
