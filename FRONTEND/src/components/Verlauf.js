import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import Avatar from "@material-ui/core/Avatar";
import ImageIcon from "@material-ui/icons/Image";
import WorkIcon from "@material-ui/icons/Work";
import BeachAccessIcon from "@material-ui/icons/BeachAccess";
import { Container, Row, Col } from "react-bootstrap";
import PersonIcon from "@material-ui/icons/Person";
import EditIcon from "@material-ui/icons/Edit";
import SearchIcon from "@material-ui/icons/Search";
import VpnKeyIcon from "@material-ui/icons/VpnKey";
import SupervisorAccountIcon from "@material-ui/icons/SupervisorAccount";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import InputAdornment from "@material-ui/core/InputAdornment";
import FormControl from "@material-ui/core/FormControl";
import clsx from "clsx";
import OutlinedInput from "@material-ui/core/OutlinedInput";
import InputLabel from "@material-ui/core/InputLabel";
import moment from "moment";
import "moment/locale/de";
import TextField from "@material-ui/core/TextField";
import axios from "axios";
import Tooltip from "@material-ui/core/Tooltip";
import Progress from "./Progess";
import ExportVerlauf from "./FilterExportVerlauf";
import LinearProgress from "./LinaerProgress";
moment.locale("de");

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    maxHeight: 700,
    backgroundColor: theme.palette.background.paper,
  },
}));

export default function FolderList({ user, url }) {
  var date = new Date();

  const classes = useStyles();
  const [filter, setFilter] = React.useState([]);
  const [suche, setSuche] = React.useState("");
  const [lädt, setLädt] = React.useState(false);
  const [verlauf, setVerlauf] = React.useState([]);

  const [von, setVon] = React.useState(
    new Date(date.getFullYear(), date.getMonth(), 1)
  );
  const [bis, setBis] = React.useState(new Date());

  const handleChange = (event) => {
    setSuche(event.target.value);
  };

  const vonBis = (von, bis) => {
    setLädt(true);
    const data = new FormData();
    data.append("von", moment(von).format("L"));
    data.append("bis", moment(bis).format("L"));

    axios
      .post(url + "/CPep_Spring/VerlaufAbfragen", data)

      .then((res) => {
        if (res.data.length > 0) {
          setVerlauf(res.data);
          setFilter(res.data);
          setLädt(false);
        }
      });
  };

  React.useEffect(() => {
    if (suche === "") {
      vonBis(von, bis);
    }
    if (suche.length >= 3) {
      const timeout = setTimeout(() => {
        setLädt(true);
        const results = verlauf.filter((person) => {
          const query = suche.toLowerCase();

          return (
            person.nachname.toLowerCase().indexOf(query) >= 0 ||
            person.vorname.toLowerCase().indexOf(query) >= 0 ||
            person.status.toLowerCase().indexOf(query) >= 0
          );
        });
        setFilter(results);

        setLädt(false);

        return () => {
          clearTimeout(timeout); // this guarantees to run right before the next effect
        };
      }, 500);
    }
  }, [suche]);

  return (
    <>
      <Tooltip title="Der Verlauf zeigt immer nur den Zeitraum vom aktuellen Monat an">
        <FormControl
          className={clsx(classes.margin, classes.textField)}
          variant="outlined"
        >
          <InputLabel htmlFor="outlined-adornment-password">Suche</InputLabel>
          <OutlinedInput
            id="outlined-adornment-password"
            value={suche}
            onChange={(e) => setSuche(e.target.value)}
            endAdornment={
              <InputAdornment position="end">
                <SearchIcon
                  aria-label="toggle password visibility"
                  edge="end"
                ></SearchIcon>
              </InputAdornment>
            }
            labelWidth={70}
          />
        </FormControl>
      </Tooltip>
      {/*<ExportVerlauf vonBis={vonBis}></ExportVerlauf>*/}

      <hr></hr>
      {lädt ? <LinearProgress /> : <h5>Anzahl: {filter.length}</h5>}

      <List className={classes.root}>
        {filter.map((verl) => {
          return (
            <>
              <ListItem style={{ background: "#dbe6ea" }}>
                <ListItemAvatar>
                  <Avatar>
                    {verl.status === "Hat eine Suche vorgenommen" ? (
                      <SearchIcon style={{ color: "#00f3ff" }}></SearchIcon>
                    ) : verl.status === "Hat sich angemeldet" ? (
                      <VpnKeyIcon style={{ color: "green" }}></VpnKeyIcon>
                    ) : verl.status === "Hat auf Admin geklickt" ? (
                      <SupervisorAccountIcon
                        style={{ color: "red" }}
                      ></SupervisorAccountIcon>
                    ) : verl.status === "Hat sich abgemeldet" ? (
                      <ExitToAppIcon style={{ color: "gray" }}></ExitToAppIcon>
                    ) : (
                      <EditIcon style={{ color: "yellow" }}></EditIcon>
                    )}
                  </Avatar>
                </ListItemAvatar>
                <Tooltip
                  title={` ${verl.status} - ${moment(verl.datum).format(
                    "LLLL"
                  )}`}
                >
                  <ListItemText
                    style={{ width: "100%" }}
                    primary={`${verl.vorname}  ${verl.nachname}`}
                    secondary={`${verl.status} - ${moment(verl.datum).format(
                      "LLLL"
                    )}  ${
                      verl.status === "Hat eine Suche vorgenommen"
                        ? "- " + verl.suchteNach
                        : ""
                    }`}
                  />
                </Tooltip>
              </ListItem>

              <hr></hr>
            </>
          );
        })}
      </List>
    </>
  );
}
