import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { withStyles } from "@material-ui/core/styles";
import BottomNavigation from "@material-ui/core/BottomNavigation";
import BottomNavigationAction from "@material-ui/core/BottomNavigationAction";
import HomeIcon from "@material-ui/icons/Home";
import Badge from "@material-ui/core/Badge";
import InsertDriveFileIcon from "@material-ui/icons/InsertDriveFile";
import Dialog from "@material-ui/core/Dialog";
import MuiDialogTitle from "@material-ui/core/DialogTitle";
import MuiDialogContent from "@material-ui/core/DialogContent";
import MuiDialogActions from "@material-ui/core/DialogActions";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import PDFListe from "./PdfList";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { useTheme } from "@material-ui/core/styles";
import SettingsIcon from "@material-ui/icons/Settings";
import StarIcon from "@material-ui/icons/Star";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import AdminDialog from "./Dialog";
import axios from "axios";
import { Switch, Route, Redirect } from "react-router-dom";

const useStyles = makeStyles({
  root: {
    width: "100%",
    position: "fixed",
    bottom: 0,
    background: "black",
    color: "white",
  },
});

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

export default function SimpleBottomNavigation({
  pdfs,
  url,
  gemerkt,
  user,
  update,
  verlauf,
}) {
  const classes = useStyles();
  const [value, setValue] = React.useState();
  const [open, setOpen] = React.useState(false);
  const [OpenPdf, setOpenPdf] = React.useState(false);

  const [adminDialogOeffnen, setAdminDialogOeffnen] = React.useState(false);

  const theme = useTheme();
  const [fullWidth, setFullWidth] = React.useState(true);
  const [maxWidth, setMaxWidth] = React.useState("sm");

  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const defaultProps = {
    color: "secondary",
    children: <InsertDriveFileIcon />,
  };

  const handleClickOpen = () => {
    if (Object.keys(pdfs).length > 0) {
      const data1 = new FormData();
      data1.append("kundeId", user._id);
      data1.append("firmenId", user.firmen_id);
      data1.append("vorname", user.vorname);
      data1.append("nachname", user.nachname);
      data1.append("suchteNach", "");
      data1.append("tatWas", "Hat auf bereits abgefragte PDF geklickt");

      axios.post(url + "/CPep_Spring/Verlauf", data1);

      setOpen(true);
      setOpenPdf(false);
    }
  };

  const handleClickOpenGemerkt = () => {
    if (Object.keys(gemerkt).length > 0) {
      const data1 = new FormData();
      data1.append("kundeId", user._id);
      data1.append("firmenId", user.firmen_id);
      data1.append("vorname", user.vorname);
      data1.append("nachname", user.nachname);
      data1.append("suchteNach", "");
      data1.append("tatWas", "Hat auf gemerkte PDF geklickt");

      axios.post(url + "/CPep_Spring/Verlauf", data1);

      setOpenPdf(true);
      setOpen(false);
    }
  };

  const abmelden = () => {
    localStorage.clear("token");
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleClosePdf = () => {
    setOpenPdf(false);
  };

  const Admin = () => {
    const data1 = new FormData();
    data1.append("kundeId", user._id);
    data1.append("firmenId", user.firmen_id);
    data1.append("vorname", user.vorname);
    data1.append("nachname", user.nachname);
    data1.append("suchteNach", "");
    data1.append("tatWas", "Hat auf Admin geklickt");

    axios.post(url + "/CPep_Spring/Verlauf", data1);

    setAdminDialogOeffnen(!adminDialogOeffnen);
  };

  const adminDialogSchließen = () => {
    setAdminDialogOeffnen(false);
  };

  const clearSession = () => {
    const data1 = new FormData();
    data1.append("kundeId", user._id);
    data1.append("firmenId", user.firmen_id);
    data1.append("vorname", user.vorname);
    data1.append("nachname", user.nachname);
    data1.append("suchteNach", "");
    data1.append("tatWas", "Hat sich abgemeldet");

    axios.post(url + "/CPep_Spring/Verlauf", data1);

    update();
  };

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

  return (
    <BottomNavigation
      value={value}
      onChange={(event, newValue) => {
        setValue(newValue);
      }}
      showLabels
      className={classes.root}
    >
      <BottomNavigationAction
        label="Gemerkt"
        onClick={handleClickOpenGemerkt}
        icon={
          <Badge
            badgeContent={gemerkt && Object.keys(gemerkt).length}
            {...defaultProps}
          />
        }
      />
      <BottomNavigationAction
        onClick={handleClickOpen}
        label="Pdf"
        icon={
          <Badge badgeContent={Object.keys(pdfs).length} {...defaultProps} />
        }
      />
      {user.rolle === "Admin" && (
        <BottomNavigationAction
          label="Admin"
          onClick={() => Admin()}
          icon={<SettingsIcon />}
        />
      )}

      <BottomNavigationAction
        label="Logout"
        onClick={() => clearSession()}
        icon={<ExitToAppIcon></ExitToAppIcon>}
      />

      <AdminDialog
        url={url}
        oeffnen={adminDialogOeffnen}
        adminDialogSchließen={adminDialogSchließen}
        verlauf={verlauf}
        user={user}
      ></AdminDialog>

      <Dialog
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={open}
        fullScreen={fullScreen}
      >
        <DialogTitle id="customized-dialog-title" onClose={handleClose}>
          Bisherige Abfragen
        </DialogTitle>
        <DialogContent dividers>
          <Typography gutterBottom>
            <PDFListe pdfs={pdfs} url={url} user={user}></PDFListe>
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={handleClose} color="primary">
            schließen
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        onClose={handleClosePdf}
        aria-labelledby="customized-dialog-title"
        open={OpenPdf}
        fullWidth={fullWidth}
        maxWidth={maxWidth}
      >
        <DialogTitle id="customized-dialog-title" onClose={handleClosePdf}>
          Gemerkte
        </DialogTitle>
        <DialogContent dividers>
          <Typography gutterBottom>
            <PDFListe pdfs={gemerkt} url={url} user={user}></PDFListe>
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClosePdf} color="primary">
            schließen
          </Button>
        </DialogActions>
      </Dialog>
    </BottomNavigation>
  );
}
