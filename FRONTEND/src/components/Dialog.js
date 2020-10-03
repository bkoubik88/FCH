import React from "react";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import ListItemText from "@material-ui/core/ListItemText";
import ListItem from "@material-ui/core/ListItem";
import List from "@material-ui/core/List";
import Divider from "@material-ui/core/Divider";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import CloseIcon from "@material-ui/icons/Close";
import Slide from "@material-ui/core/Slide";
import { Container, Row, Col } from "react-bootstrap";
import TextField from "@material-ui/core/TextField";
import SaveIcon from "@material-ui/icons/Save";
import Table from "./Table";
import axios from "axios";
import TransferListKunden from "./TransferListKunden";
import Alert from "@material-ui/lab/Alert";
import Collapse from "@material-ui/core/Collapse";
import Paper from "@material-ui/core/Paper";
import SwipeableViews from "react-swipeable-views";
import Tab from "@material-ui/core/Tab";
import Tabs from "@material-ui/core/Tabs";
import PropTypes from "prop-types";
import Box from "@material-ui/core/Box";
import Snackbar from "@material-ui/core/Snackbar";
import clsx from "clsx";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import InputLabel from "@material-ui/core/InputLabel";
import FormHelperText from "@material-ui/core/FormHelperText";
import Accordion from "@material-ui/core/Accordion";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import OutlinedInput from "@material-ui/core/OutlinedInput";
import InputAdornment from "@material-ui/core/InputAdornment";
import DateFnsUtils from "@date-io/date-fns";
import Verlauf from "./Verlauf";
import moment from "moment";

import {
  MuiPickersUtilsProvider,
  KeyboardTimePicker,
  KeyboardDatePicker,
} from "@material-ui/pickers";

import MomentUtils from "@date-io/moment";
import "moment/locale/de";

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 210,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },

  appBar: {
    position: "relative",
  },
  title: {
    marginLeft: theme.spacing(2),
    flex: 1,
  },
  button: {
    margin: theme.spacing(1),
  },
  root: {
    width: "100%",
    "& > * + *": {
      marginTop: theme.spacing(2),
    },
  },
}));

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function FullScreenDialog({
  oeffnen,
  adminDialogSchließen,
  url,
  user,
  verlaufCheck,
}) {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const [snackBarOpen, setSnackBarOpen] = React.useState(false);
  const [firma, setFirma] = React.useState("");
  const [firmen, setFirmen] = React.useState([]);
  const [idFirma, setIdFirma] = React.useState("");
  const [reihenfolge_, setReihenfolge_] = React.useState("Firma ASC");

  const [firmaZumBearbeiten, setFirmaZumBearbeiten] = React.useState("");
  const [userEinerFirma, setUserEinerFirma] = React.useState([]);

  const [vornameUser, setVornameUser] = React.useState("");
  const [nachnameUser, setNachnameUser] = React.useState("");
  const [emailUser, setEmailUser] = React.useState("");
  const [passwortUser, setPasswortUser] = React.useState("");
  const [aktuelleFirma, setAktuelleFirma] = React.useState("");
  const [openAlert, setOpenAlert] = React.useState(false);
  const [betrag, setBetrag] = React.useState(0.96);
  const [rolle, setRolle] = React.useState({
    rolleAnwender: "",
  });

  const [stateRechnung, setStateRechnung] = React.useState("");
  const [state, setState] = React.useState("");

  const [anredeUser, setAnredeUser] = React.useState({
    anrede: "",
  });

  React.useEffect(() => {
    setOpen(oeffnen);
  }, [oeffnen]);

  React.useEffect(() => {
    alleFirmenMitKunden();

    ladeUser();
  }, []);

  const ladeUser = () => {
    axios
      .get(url + "/CPep_Spring/kundenEinerFima", {
        params: {
          firmenId: firma,
        },
      })
      .then(function (response) {
        if (response.data.length > 0) {
          setUserEinerFirma(response.data);
        }
      });
  };

  React.useEffect(() => {
    alleFirmenMitKunden();
  }, [reihenfolge_]);

  React.useEffect(() => {
    firmenAuflistung();
  }, []);

  const firmenAuflistung = () => {};

  const neueReihenfolge = (folge) => {
    setReihenfolge_(folge);
  };

  const handleChangeFirmenRechnung = (event) => {
    setStateRechnung(event.target.value);
  };

  const handleChangeAnrede = (event) => {
    const anrede = event.target.name;
    setAnredeUser({
      ...state,
      [anrede]: event.target.value,
    });
  };

  const handleChangeRolle = (event) => {
    setRolle(event.target.value);
  };

  const handleChange = (event) => {
    setState(event.target.value);
  };

  const handleChangeTab = (event, newValue) => {
    setValue(newValue);
    let worauf = "";

    if (newValue === 0) {
      worauf = "Neue Firma";
    } else if (newValue === 1) {
      worauf = "Übersicht";
    } else if (newValue === 2) {
      worauf = "Neuer User";
    } else if (newValue === 3) {
      worauf = "Rechnungen";
    } else if (newValue === 4) {
      worauf = "Verlauf";
    }
    const data1 = new FormData();
    data1.append("kundeId", user._id);
    data1.append("firmenId", user.firmen_id);
    data1.append("vorname", user.vorname);
    data1.append("nachname", user.nachname);
    data1.append("suchteNach", "");
    data1.append("tatWas", "Hat auf " + worauf + " geklickt");

    axios.post(url + "/CPep_Spring/Verlauf", data1);
  };

  function SimpleSnackbar() {
    const classes = useStyles();

    return (
      <div className={classes.root}>
        <Collapse in={snackBarOpen}>
          <Alert
            action={
              <IconButton
                aria-label="close"
                color="inherit"
                size="small"
                onClick={() => {
                  setSnackBarOpen(false);
                }}
              >
                <CloseIcon fontSize="inherit" />
              </IconButton>
            }
          >
            {firma} - {idFirma} erfolgreich angelegt
          </Alert>
        </Collapse>
      </div>
    );
  }

  function a11yProps(index) {
    return {
      id: `full-width-tab-${index}`,
      "aria-controls": `full-width-tabpanel-${index}`,
    };
  }

  async function alleFirmenMitKunden() {
    await axios
      .get(url + "/CPep_Spring/customers", {
        params: { reihenfolge: reihenfolge_ },
      })

      .then((res) => {
        if (res.data.length > 0) {
          setFirmen(res.data);
        }
      });
  }

  const neuAnlageUser = () => {
    const data = new FormData();
    data.append("Anrede", anredeUser.anrede);
    data.append("Vorname", vornameUser);
    data.append("Nachname", nachnameUser);
    data.append("Email", emailUser);
    data.append("FirmenID", state);
    data.append("Rolle", rolle);

    axios
      .post(url + "/CPep_Spring/userNeuanlage", data)
      .then(function (response) {
        const data1 = new FormData();
        data1.append("kundeId", user._id);
        data1.append("firmenId", user.firmen_id);
        data1.append("vorname", user.vorname);
        data1.append("nachname", user.nachname);
        data1.append("suchteNach", "");
        data1.append(
          "tatWas",
          "Hat einen neuen Kunden angelegt (" +
            anredeUser.anrede +
            "/" +
            vornameUser +
            "/" +
            nachnameUser +
            "/" +
            emailUser +
            "/" +
            passwortUser +
            "/" +
            state +
            "/" +
            rolle
        );

        axios.post(url + "/CPep_Spring/Verlauf", data1);

        ladeUser();
        alleFirmenMitKunden();

        setRolle("");
        setState("");
        setAnredeUser("");
        setVornameUser("");
        setNachnameUser("");
        setEmailUser("");
        setPasswortUser("");
      });
  };

  const neuAnlageFirma = () => {
    if (firma.length !== 0 && idFirma.length !== 0) {
      axios
        .get(url + "/CPep_Spring/neueFirma", {
          params: { firmenName: firma, firmenId: idFirma },
        })

        .then((res) => {
          const data1 = new FormData();
          data1.append("kundeId", user._id);
          data1.append("firmenId", user.firmen_id);
          data1.append("vorname", user.vorname);
          data1.append("nachname", user.nachname);
          data1.append("suchteNach", "");
          data1.append(
            "tatWas",
            "Hat eine neue Firma angelegt (" + firma + "/" + idFirma
          );

          axios.post(url + "/CPep_Spring/Verlauf", data1);

          if (res.data.length > 0) {
            alleFirmenMitKunden();
            setOpenAlert(true);

            setFirma("");
            setIdFirma("");
          }
        });
    } else {
      alert("Bitte Firmenname und FirmenID befüllen!");
    }
  };

  const [expanded, setExpanded] = React.useState(false);
  const [expandedFirma, setExpandedFirma] = React.useState(false);

  const handleChangePanel = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  const handleChangePanelFirma = (panel) => (event, isExpanded) => {
    setExpandedFirma(isExpanded ? panel : false);
  };
  const handleChangeIndex = (index) => {
    setValue(index);
  };
  const firmenName = (e) => {
    setFirma(e.target.value);
  };
  const informiereDialog = (wert) => {
    setFirmaZumBearbeiten(wert);
  };

  const firmenId = (e) => {
    setIdFirma(e.target.value);
  };

  function firmaAusgewählt(firma) {
    setFirmaZumBearbeiten(firma);
  }
  const [value, setValue] = React.useState(0);
  var date = new Date();
  const [selectedDateVon, setSelectedDateVon] = React.useState(
    new Date(date.getFullYear(), date.getMonth(), 1)
  );
  const [selectedDateBis, setSelectedDateBis] = React.useState(new Date());

  const handleDateChangeVon = (date) => {
    setSelectedDateVon(date);
  };
  const handleDateChangeBis = (date) => {
    setSelectedDateBis(date);
  };

  const handleCloseAlert = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpenAlert(false);
  };

  const rechnungErstellen = () => {
    axios(
      url +
        "/CPep_Spring/PDF_Rechnung?firmen_id=" +
        stateRechnung +
        "&berechnungsschluessel=" +
        betrag +
        "&von=" +
        moment(selectedDateVon).format("L") +
        "&bis=" +
        moment(selectedDateBis).format("L"),

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

        const data1 = new FormData();
        data1.append("kundeId", user._id);
        data1.append("firmenId", user.firmen_id);
        data1.append("vorname", user.vorname);
        data1.append("nachname", user.nachname);
        data1.append("suchteNach", "");
        data1.append(
          "tatWas",
          "Hat eine Rechung erstellt (" +
            betrag +
            "/" +
            moment(selectedDateVon).format("L") +
            "/" +
            moment(selectedDateBis).format("L") +
            "/" +
            stateRechnung
        );

        axios.post(url + "/CPep_Spring/Verlauf", data1);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const theme = useTheme();
  return (
    <div>
      <Dialog
        fullScreen
        open={open}
        onClose={adminDialogSchließen}
        TransitionComponent={Transition}
      >
        <AppBar className={classes.appBar}>
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              onClick={adminDialogSchließen}
              aria-label="close"
            >
              <CloseIcon />
            </IconButton>
            <Typography variant="h6" className={classes.title}>
              Admin Bereich
            </Typography>
            <Button autoFocus color="inherit" onClick={adminDialogSchließen}>
              schließen
            </Button>
          </Toolbar>
        </AppBar>
        <Container style={{ marginTop: "35px", marginBottom: "60px" }} fluid>
          <AppBar position="static" color="default">
            <Tabs
              variant="scrollable"
              scrollButtons="on"
              centered
              value={value}
              onChange={handleChangeTab}
              indicatorColor="primary"
              textColor="primary"
            >
              <Tab label="Neue Firma" {...a11yProps(0)} />
              <Tab label="Übersicht" {...a11yProps(1)} />
              <Tab label="Neuer User" {...a11yProps(2)} />
              <Tab label="Rechnungen" {...a11yProps(3)} />
              <Tab label="Verlauf" {...a11yProps(4)} />
            </Tabs>
          </AppBar>
          <SwipeableViews
            axis={theme.direction === "rtl" ? "x-reverse" : "x"}
            index={value}
            onChangeIndex={handleChangeIndex}
          >
            <TabPanel value={value} index={0} dir={theme.direction}>
              <Col md={12} style={{ textAlign: "center" }}>
                <h2>Neue Firma anlegen</h2>
                <hr></hr>
              </Col>
              <Col md={12} style={{ textAlign: "center" }}>
                <TextField
                  autoFocus
                  variant="outlined"
                  label="Firmenname"
                  value={firma}
                  onChange={(e) => firmenName(e)}
                  helperText="Legen Sie eine neue Firma an"
                />
              </Col>
              <Col md={12} style={{ textAlign: "center" }}>
                <TextField
                  variant="outlined"
                  label="FirmenID"
                  value={idFirma}
                  onChange={(e) => firmenId(e)}
                  helperText="Vergeben Sie eine eindeutige ID"
                />
              </Col>
              <Col
                md={12}
                style={{ textAlign: "center", marginBottom: "21px" }}
              >
                <Button
                  size="large"
                  variant="contained"
                  color="primary"
                  onClick={() => neuAnlageFirma()}
                  className={classes.button}
                  startIcon={<SaveIcon />}
                >
                  Firma anlegen
                </Button>

                <Snackbar
                  open={openAlert}
                  autoHideDuration={6000}
                  onClose={handleCloseAlert}
                >
                  <Alert onClose={handleCloseAlert} severity="success">
                    Firma Erfolgreich angelegt
                  </Alert>
                </Snackbar>
              </Col>
            </TabPanel>
            <TabPanel value={value} index={1} dir={theme.direction}>
              <Col md={12} style={{ textAlign: "center" }}>
                <h2>Übersicht</h2>
                <hr></hr>
              </Col>
              <Col md={12}>
                <Table
                  firmen={firmen}
                  neueReihenfolge={neueReihenfolge}
                  url={url}
                  neuRendern={alleFirmenMitKunden}
                  firmaAusgewählt={firmaAusgewählt}
                  informiereDialog={informiereDialog}
                  user={user}
                ></Table>
              </Col>
            </TabPanel>
            <TabPanel value={value} index={2} dir={theme.direction}>
              <Col md={12} style={{ textAlign: "center" }}>
                <h2>Neuen User anlegen</h2>
                <hr></hr>
              </Col>
              <Col md={12} style={{ textAlign: "center" }}>
                <FormControl variant="outlined" className={classes.formControl}>
                  <InputLabel htmlFor="outlined-age-native-simple">
                    Firma
                  </InputLabel>
                  <Select
                    native
                    value={state}
                    onChange={handleChange}
                    label="Firma"
                  >
                    <option aria-label="None" value="" />
                    {firmen.map((elem, index) => (
                      <option value={elem.firmen_id}>{elem.firma}</option>
                    ))}
                  </Select>
                  <FormHelperText>
                    Wählen Sie die zu bearbeitende Firma aus
                  </FormHelperText>
                </FormControl>
              </Col>

              {state !== "" ? (
                <>
                  <Row>
                    <Col md={12} style={{ textAlign: "center" }}>
                      <FormControl
                        variant="outlined"
                        className={classes.formControl}
                      >
                        <InputLabel htmlFor="outlined-age-native-simple">
                          Anrede
                        </InputLabel>
                        <Select
                          native
                          value={anredeUser.anrede}
                          onChange={handleChangeAnrede}
                          label="Anrede"
                          inputProps={{
                            name: "anrede",
                          }}
                        >
                          <option aria-label="None" value="" />
                          <option value="Herr">Herr</option>
                          <option value="Frau">Frau</option>
                        </Select>
                      </FormControl>
                    </Col>
                    <Col md={12} style={{ textAlign: "center" }}>
                      <FormControl
                        variant="outlined"
                        className={classes.formControl}
                      >
                        <InputLabel htmlFor="outlined-age-native-simple">
                          Rolle
                        </InputLabel>
                        <Select
                          native
                          value={rolle}
                          onChange={handleChangeRolle}
                          label="Rolle"
                          inputProps={{
                            rolle: "",
                          }}
                        >
                          <option aria-label="None" value="" />
                          <option value="User">User</option>
                          <option value="Admin">Admin</option>
                        </Select>
                      </FormControl>
                    </Col>
                  </Row>
                  <Row className="justify-content-center">
                    <Col
                      md={12}
                      style={{ textAlign: "center", marginTop: "10px" }}
                    >
                      <TextField
                        value={vornameUser}
                        label="Vorname"
                        variant="outlined"
                        onChange={(e) => setVornameUser(e.target.value)}
                      ></TextField>
                    </Col>
                    <Col
                      md={12}
                      style={{ textAlign: "center", marginTop: "10px" }}
                    >
                      <TextField
                        value={nachnameUser}
                        label="Nachname"
                        variant="outlined"
                        onChange={(e) => setNachnameUser(e.target.value)}
                      ></TextField>
                    </Col>
                    <Col
                      md={12}
                      style={{ textAlign: "center", marginTop: "10px" }}
                    >
                      <TextField
                        value={emailUser}
                        label="Email"
                        variant="outlined"
                        onChange={(e) => setEmailUser(e.target.value)}
                      ></TextField>
                    </Col>

                    <Col md={12} style={{ textAlign: "center" }}>
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => neuAnlageUser()}
                        className={classes.button}
                        startIcon={<SaveIcon />}
                      >
                        speichern
                      </Button>
                    </Col>
                  </Row>
                </>
              ) : (
                <></>
              )}
            </TabPanel>
            <TabPanel value={value} index={3} dir={theme.direction}>
              <Row className="justify-content-center">
                <Col md={12} style={{ textAlign: "center" }}>
                  <h4>
                    Erstellen Sie eine Kostenaufstellung für eine bestimmte
                    Firma
                  </h4>
                </Col>
                <Col md={12} style={{ textAlign: "center" }}>
                  <FormControl
                    variant="outlined"
                    className={classes.formControl}
                  >
                    <InputLabel htmlFor="outlined-age-native-simple">
                      Firma
                    </InputLabel>
                    <Select
                      native
                      value={stateRechnung}
                      onChange={handleChangeFirmenRechnung}
                      label="Firma"
                    >
                      <option aria-label="None" value="" />
                      {firmen.map((elem, index) => (
                        <option value={elem.firmen_id}>{elem.firma}</option>
                      ))}
                    </Select>
                    <FormHelperText>
                      Firma, für die Sie eine Rechnung erstellen, möchten
                      auswählen
                    </FormHelperText>
                  </FormControl>
                </Col>
                <Col md={12} style={{ textAlign: "center", marginTop: "20px" }}>
                  {stateRechnung !== "" && (
                    <TextField
                      id="outlined-number"
                      label="Betrag pro Abfrage (Default: 0,96 Euro)"
                      type="number"
                      InputLabelProps={{
                        shrink: true,
                      }}
                      variant="outlined"
                      onChange={(e) => setBetrag(e.target.value)}
                    />
                  )}
                </Col>
                <Col md={12} style={{ textAlign: "center", marginTop: "20px" }}>
                  {stateRechnung !== "" && (
                    <MuiPickersUtilsProvider utils={MomentUtils} locale="de">
                      <KeyboardDatePicker
                        margin="normal"
                        id="date-picker-dialog"
                        label="Von"
                        format="DD.MM.YYYY"
                        value={selectedDateVon}
                        cancelLabel="Abbrechen"
                        todayLabel="aktuelles Datum"
                        onChange={handleDateChangeVon}
                        maxDate={new Date()}
                        showTodayButton={true}
                        KeyboardButtonProps={{
                          "aria-label": "von",
                        }}
                      />
                    </MuiPickersUtilsProvider>
                  )}
                </Col>
                <Col md={12} style={{ textAlign: "center", marginTop: "20px" }}>
                  {stateRechnung !== "" && (
                    <MuiPickersUtilsProvider utils={MomentUtils} locale="de">
                      <KeyboardDatePicker
                        margin="normal"
                        id="date-picker-dialog"
                        label="Bis"
                        format="DD.MM.YYYY"
                        value={selectedDateBis}
                        onChange={handleDateChangeBis}
                        maxDate={new Date()}
                        showTodayButton={true}
                        cancelLabel="Abbrechen"
                        todayLabel="aktuelles Datum"
                        KeyboardButtonProps={{
                          "aria-label": "bis",
                        }}
                      />
                    </MuiPickersUtilsProvider>
                  )}
                </Col>

                <Col md={12} style={{ textAlign: "center", marginTop: "20px" }}>
                  {stateRechnung !== "" && (
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => rechnungErstellen()}
                    >
                      Rechnung erstellen
                    </Button>
                  )}
                </Col>
              </Row>
            </TabPanel>
            <TabPanel value={value} index={4} dir={theme.direction}>
              <Container>
                <Row className="justify-content-center">
                  <Col md={12} style={{ textAlign: "center" }}>
                    <Verlauf url={url} user={user}></Verlauf>
                  </Col>
                </Row>
              </Container>
            </TabPanel>
          </SwipeableViews>
        </Container>
      </Dialog>
    </div>
  );
}
