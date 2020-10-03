import React from "react";
import TextField from "@material-ui/core/TextField";
import { makeStyles } from "@material-ui/core/styles";
import { Row, Col } from "react-bootstrap";
import Button from "@material-ui/core/Button";
import Collapse from "@material-ui/core/Collapse";
import { Alert, AlertTitle } from "@material-ui/lab";
import axios from "axios";
import Link from "@material-ui/core/Link";
import PasswortDialog from "./PasswortDialog";
import LockOpenIcon from "@material-ui/icons/LockOpen";

const { useState, useRef, useEffect } = React;

const useStyles = makeStyles((theme) => ({
  root: {
    "& .MuiTextField-root": {
      margin: theme.spacing(1),
      width: "25ch",
    },
  },
}));

export default function Login({ url, userCheck }) {
  const classes = useStyles();
  const [email, setEmail] = React.useState("");
  const [passwort, setPasswort] = React.useState("");
  const [open, setOpen] = React.useState(false);
  const [error, setError] = React.useState("");

  const [show, setShow] = React.useState(false);

  const schließen = () => {
    setShow(false);
  };

  const passwortAnfordern = () => {
    setShow(true);
  };

  function check() {
    const data = new FormData();
    data.append("passwort", passwort);
    data.append("email", email);

    axios
      .post(url + "/CPep_Spring/logIn", data)
      .then(function (response) {
        if (response.data.length === 0) {
          setError("Falsche EMail/Passwort Kombination");
          setOpen(true);
        } else {
          userCheck(response.data);
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  const handleKeypress = (e) => {
    //it triggers by pressing the enter key
    if (e.keyCode === 13) {
      isNotEmpty();
    }
  };

  const isNotEmpty = () => {
    if (email !== "" && passwort !== "") {
      check();
    } else {
      setError("Bitte beide Felder füllen");
      setOpen(true);
    }
  };
  return (
    <>
      <PasswortDialog
        show={show}
        schließen={schließen}
        url={url}
      ></PasswortDialog>

      <Row className="justify-content-center">
        <form>
          <Col md={12}>
            <TextField
              autoFocus
              variant="outlined"
              id="email"
              required={true}
              label="Email"
              type="email"
              value={email}
              onKeyDown={(e) => handleKeypress(e)}
              autoComplete="current-password"
              onChange={(e) => setEmail(e.target.value)}
            />
          </Col>
          <Col md={12} style={{ marginTop: "20px" }}>
            <TextField
              variant="outlined"
              required={true}
              id="password"
              label="Password"
              type="password"
              autoComplete="current-password"
              value={passwort}
              onKeyDown={(e) => handleKeypress(e)}
              onChange={(e) => setPasswort(e.target.value)}
            />
          </Col>
          <Col md={12} style={{ marginTop: "20px" }}>
            <Link href="#" onClick={() => passwortAnfordern()}>
              Passwort vergessen ?
            </Link>
          </Col>

          <Collapse in={open} style={{ marginTop: "20px" }}>
            <Alert
              severity="error"
              onClose={() => {
                setOpen(false);
              }}
            >
              <AlertTitle>Fehler</AlertTitle> <strong>{error}</strong>
            </Alert>
          </Collapse>
          <Col md={12}>
            <Button
              size="large"
              variant="contained"
              color="primary"
              style={{ cursor: "pointer" }}
              onClick={() => isNotEmpty()}
              startIcon={<LockOpenIcon />}
            >
              Login
            </Button>
          </Col>
        </form>
      </Row>
    </>
  );
}
