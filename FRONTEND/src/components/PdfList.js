import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import Avatar from "@material-ui/core/Avatar";
import InsertDriveFileIcon from "@material-ui/icons/InsertDriveFile";
import moment from "moment";
import ShareIcon from "@material-ui/icons/Share";
import Tooltip from "@material-ui/core/Tooltip";
import Collapse from "@material-ui/core/Collapse";
import axios from "axios";
import TextField from "@material-ui/core/TextField";
import SendIcon from "@material-ui/icons/Send";
import Button from "@material-ui/core/Button";
import Checkbox from "@material-ui/core/Checkbox";
import Snackbar from "@material-ui/core/Snackbar";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import * as EmailValidator from "email-validator";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";

import "moment/locale/de"; // without this line it didn't work
moment.locale("de");
const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",

    backgroundColor: theme.palette.background.paper,
  },
  button: {
    margin: theme.spacing(1),
    float: "right",
  },
}));

export default function FolderList({ pdfs, url, user }) {
  const classes = useStyles();
  const [openEmail, setopenEmail] = React.useState(false);
  const [checked, setChecked] = React.useState(false);
  const [teilen, setTeilen] = React.useState([]);
  const [setzeEmail, setSetzeEmail] = React.useState("");
  const [openSnackbar, setOpenSnackbar] = React.useState(false);
  const [textSnackbar, setTextSnackbar] = React.useState("");
  const [aktuellerUser, setAktuellerUser] = React.useState(user);
  const [anEmail, setAnEmail] = React.useState("");

  const [state, setState] = React.useState({
    age: "",
    name: "hai",
  });
  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpenSnackbar(false);
  };

  const handleToggleVersenden = (value) => () => {
    const currentIndex = teilen.indexOf(value);
    const newChecked = [...teilen];

    if (currentIndex === -1) {
      newChecked.push(value);
      setTeilen(newChecked);
    } else {
      newChecked.splice(currentIndex, 1);
      setTeilen(newChecked);
    }

    console.log(teilen.indexOf(value) !== -1);
  };

  const handleToggle = (value) => () => {
    const currentIndex = teilen.indexOf(value);
    const newChecked = [...teilen];

    if (currentIndex === -1) {
      newChecked.push(value);
      setTeilen(newChecked);
    } else {
      newChecked.splice(currentIndex, 1);
      setTeilen(newChecked);
    }

    console.log(teilen);
  };

  React.useEffect(() => {
    if (teilen.length > 0) {
      setopenEmail(true);
    } else {
      setopenEmail(false);
    }
  }, [teilen]);

  const handleChangeEmail = (event) => {
    setAnEmail(event.target.value);
  };

  function handleChange(event) {
    setChecked(event.target.value);

    let boxes = teilen;
    boxes.forEach((box) => {
      if (box.value === event.target.value)
        box.isChecked = event.target.checked;
    });
    setTeilen({ boxes: boxes });
  }

  async function sendeEmail() {
    let ids_ = [];

    teilen.forEach((element) => {
      ids_.push(element.id_pdf);
    });

    const data1 = new FormData();
    data1.append("kundeId", aktuellerUser._id);
    data1.append("firmenId", aktuellerUser.firmen_id);
    data1.append("vorname", aktuellerUser.vorname);
    data1.append("nachname", aktuellerUser.nachname);
    data1.append("suchteNach", "");
    data1.append(
      "tatWas",
      "Hat eine Mail an " + anEmail + " versandt. IDs: " + ids_
    );

    axios.post(url + "/CPep_Spring/Verlauf", data1);

    const data = new FormData();
    data.append("kundeId", aktuellerUser._id);
    data.append("firmenId", aktuellerUser.firmen_id);
    data.append("pdfid_", ids_);
    data.append("anKundeEmail_", anEmail);
    data.append("vornameVon", aktuellerUser.vorname);
    data.append("nachnameVon", aktuellerUser.nachname);

    await axios
      .post(url + "/CPep_Spring/GemerkteNamenVersenden", data)

      .then(function (response) {
        if (response.data.length === 0) {
        } else {
          setTextSnackbar(response.data);
          setOpenSnackbar(true);
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  const getPdf = (p) => {
    const data1 = new FormData();
    data1.append("kundeId", user._id);
    data1.append("firmenId", user.firmen_id);
    data1.append("vorname", user.vorname);
    data1.append("nachname", user.nachname);
    data1.append("suchteNach", p.suchteNach);
    data1.append("tatWas", "Hat sich ein PDF anzeigen lassen");

    axios.post(url + "/CPep_Spring/Verlauf", data1);

    axios(
      url +
        "/CPep_Spring/getPdf?_id=" +
        p.pdfid +
        "&gesuchtNach=" +
        p.suchteNach +
        "&firmenId=" +
        p.firmen_id +
        "&kundenId=" +
        p._id +
        "&liste=" +
        p.liste,
      {
        method: "GET",
        responseType: "blob", //Force to receive data in a Blob Format
      }
    )
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
    <>
      <List className={classes.root}>
        {pdfs &&
          pdfs.map((p, index) => (
            <>
              <ListItem
                key={p._id}
                onClick={() => (p.suchteNach ? getPdf(p) : handleToggle(p))}
                style={{ cursor: "pointer" }}
              >
                {p.suchteNach && (
                  <ListItemAvatar>
                    <Avatar>
                      <InsertDriveFileIcon />
                    </Avatar>
                  </ListItemAvatar>
                )}
                {p.suchteNach && (
                  <ListItemText
                    primary={p.suchteNach}
                    secondary={moment(p.datum).format("L")}
                  />
                )}
                {p.id_pdf && (
                  <ListItem
                    key={p}
                    role={undefined}
                    dense
                    button
                    onClick={handleToggleVersenden(p)}
                  >
                    <ListItemIcon>
                      <Checkbox
                        color="primary"
                        disabled={true}
                        edge="start"
                        checked={teilen.indexOf(p) !== -1}
                        tabIndex={-1}
                      />
                    </ListItemIcon>

                    <ListItemText
                      primary={p.vorname + " - " + p.nachname}
                      secondary={moment(p.datum).format("LLL")}
                    />
                  </ListItem>
                )}
              </ListItem>

              <hr></hr>
            </>
          ))}
        <Collapse in={openEmail}>
          <FormControl
            variant="outlined"
            className={classes.formControl}
            style={{ width: "100%" }}
          >
            <InputLabel htmlFor="filled-age-native-simple">
              Empfänger
            </InputLabel>
            <Select
              labelId="demo-simple-select-outlined-label"
              value={anEmail}
              onChange={handleChangeEmail}
              label="Empfänger"
            >
              <MenuItem value="">
                <em>---</em>
              </MenuItem>

              <MenuItem value={"benjamin.koubik@gmx.de"}>
                benjamin.koubik@gmx.de
              </MenuItem>
              <MenuItem value={"guenter.koubik@auditweb.de"}>
                guenter.koubik@auditweb.de
              </MenuItem>
              <MenuItem value={"guenter.koubik@koubik-it.de"}>
                guenter.koubik@koubik-it.de
              </MenuItem>
              <MenuItem value={"guenter.koubik@t-online.de"}>
                guenter.koubik@t-online.de
              </MenuItem>
              <MenuItem value={"rolf.fleischer@koubik-it.de"}>
                rolf.fleischer@koubik-it.de
              </MenuItem>
              <MenuItem value={"sandra.leicht@fch-gruppe.de"}>
                sandra.leicht@fch-gruppe.de
              </MenuItem>
              <MenuItem value={"waldenbuch@aol.com"}>
                waldenbuch@aol.com
              </MenuItem>
              <MenuItem value={"lukas.nething@fch-gruppe.de"}>
                lukas.nething@fch-gruppe.de
              </MenuItem>
              <MenuItem value={"peter.keller@fch-gruppe.de"}>
                peter.keller@fch-gruppe.de
              </MenuItem>
            </Select>
          </FormControl>
          <hr></hr>

          <Button
            onClick={() => sendeEmail()}
            variant="contained"
            color="primary"
            className={classes.button}
            endIcon={<SendIcon />}
          >
            senden
          </Button>
        </Collapse>
      </List>
      <Snackbar
        anchorOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        message={textSnackbar}
        action={
          <React.Fragment>
            <Button
              color="secondary"
              size="small"
              onClick={handleCloseSnackbar}
            >
              schließen
            </Button>
            <IconButton
              size="small"
              aria-label="close"
              color="inherit"
              onClick={handleCloseSnackbar}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          </React.Fragment>
        }
      />
    </>
  );
}
