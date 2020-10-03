import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "./TextField";
import Button from "@material-ui/core/Button";
import Switch from "@material-ui/core/Switch";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import { Row, Col } from "react-bootstrap";
import ToggleButton from "./ToggleButton";
import axios from "axios";
import SearchIcon from "@material-ui/icons/Search";

const useStyles = makeStyles((theme) => ({
  button: {
    margin: theme.spacing(1),
  },
}));

export default function Filter({
  changeText,
  wert,
  clickBtn,
  enter,
  suche,
  welcheL,
  url,
  user,
}) {
  const classes = useStyles();
  const [state, setState] = React.useState({
    checkedA: true,
  });

  const sucheGestartet = () => {
    const data2 = new FormData();

    user && data2.append("kundeId", user._id);
    data2.append("firmenId", user.firmen_id);
    data2.append("vorname", user.vorname);
    data2.append("nachname", user.nachname);
    data2.append("suchteNach", wert);
    data2.append("tatWas", "Hat eine Suche vorgenommen");

    axios.post(url + "/CPep_Spring/Verlauf", data2);

    clickBtn();
  };
  const handleChange = (event) => {
    setState({ ...state, [event.target.name]: event.target.checked });
    suche(state);
  };

  const welcheListe = (liste) => {
    welcheL(liste);
  };
  return (
    <>
      <Row className="justify-content-center" style={{ marginTop: "40px" }}>
        <Col md={12} style={{ marginTop: "20px", width: "100%" }}>
          <TextField
            changeText={changeText}
            wert={wert}
            enter={sucheGestartet}
          ></TextField>
        </Col>
        {/*
        <Col md={12}>
          <Button
            size="large"
            variant="contained"
            color="primary"
            onClick={sucheGestartet}
            style={{ cursor: "pointer" }}
            className={classes.button}
            startIcon={<SearchIcon />}
          >
            Suchen
          </Button>
        </Col>
        */}
      </Row>
    </>
  );
}
