import React from "react";

import Filter from "./Filter";
import Card from "./Card";
import axios from "axios";
import Progress from "./Progess";
import BottomNavi from "./BottomNavi";

import { Container } from "react-bootstrap";
import PictureAsPdfIcon from "@material-ui/icons/PictureAsPdf";
import Login from "./Login";
import Tooltip from "@material-ui/core/Tooltip";
import Badge from "@material-ui/core/Badge";
import MailIcon from "@material-ui/icons/Mail";
import { makeStyles } from "@material-ui/core/styles";
import DialogPDF from "./DialogPdf";
import CircularProgress from "@material-ui/core/CircularProgress";
import PasswoerAendernDialog from "./PasswortAendernDialog";
import InfoIcon from "@material-ui/icons/Info";
const useStyles = makeStyles({
  root: {
    minWidth: 275,
  },
  bullet: {
    display: "inline-block",
    margin: "0 18px",
    transform: "scale(0.9)",
  },
  title: {
    fontSize: 14,
  },
  pos: {
    marginBottom: 12,
  },
});

export default function View() {
  const classes = useStyles();

  const [initialPasswort, setInitialPasswort] = React.useState(false);

  const [value, setValue] = React.useState("");
  const [anzeigen, setAnzeige] = React.useState("");
  const [ergebnis, setErgebnis] = React.useState(null);
  const [unbekannt, setUnbekannt] = React.useState(null);
  const [suchbegriff, setSuchbegriff] = React.useState("");
  const [lädt, setLädt] = React.useState(false);
  const [userMoechtePdfEinsehen, setUserMoechtePdfEinsehen] = React.useState(
    false
  );
  const [pdfs, setPdfs] = React.useState([]);
  const [pdf, setPdf] = React.useState(null);
  const [url, setUrl] = React.useState("http://136.243.94.117:8081/");
  //const [url, setUrl] = React.useState("http://localhost:8080");
  const [keinTreffer, setkeinTreffer] = React.useState(false);

  const [gemerkt, setGemerkt] = React.useState(null);
  const [user, setUser] = React.useState(null);
  const [speicherPdf, setSpeicherPdf] = React.useState(false);

  const [exakteSuche, setExakteSuche] = React.useState(true);
  const [liste, setListe] = React.useState("beide");
  const [empfangenePdf, setEmpfangenePdf] = React.useState([]);
  const [lädtPdf, setLädtPdf] = React.useState(true);
  const [firma, setFirma] = React.useState(null);
  const bull = <span className={classes.bullet}>•</span>;

  const [invisible, setInvisible] = React.useState(false);

  const mailIconKlick = (bool) => {
    let w = "";

    if (bool === true) {
      w = "geöffnet";
    } else {
      w = "geschlossen";
    }
    const data1 = new FormData();
    data1.append("kundeId", user._id);
    data1.append("firmenId", user.firmen_id);
    data1.append("vorname", user.vorname);
    data1.append("nachname", user.nachname);
    data1.append("suchteNach", "");
    data1.append("tatWas", "Hat empfangene PDF " + w);

    axios.post(url + "/CPep_Spring/Verlauf", data1);

    setUserMoechtePdfEinsehen(bool);
  };

  const changeText = (e) => {
    setValue(e.target.value);
  };

  const clickBtn = () => {
    setAnzeige(value);
  };

  const enter = (e) => {
    setAnzeige(e.target.value);
  };

  const welcheL = (l) => {
    setListe(l);
  };

  const suche = (wert) => {
    setExakteSuche(!exakteSuche);
  };

  async function verschicktePdfEmpfangen(user) {
    setLädtPdf(true);
    const data = new FormData();
    data.append("email", user.email);
    await axios
      .post(url + "/CPep_Spring/verschicktePdfAbfragen", data)
      .then(function (resp) {
        setLädtPdf(false);
        setEmpfangenePdf(resp.data);
      });
  }

  React.useEffect(() => {
    ladeErgebnis();
  }, [liste, exakteSuche]);

  const startPaswortAendern = () => {
    anzahlAbfragen();
    gespeichert();

    if (user.passwortGeändert === "nein") {
      setInitialPasswort(true);
      setInvisible(false);
    } else {
      setInvisible(true);
    }
  };

  React.useEffect(() => {
    {
      user && startPaswortAendern();
    }
  }, [user]);

  const update = () => {
    setUser(null);
  };

  const passwortHinterherAendern = () => {
    setInitialPasswort(true);
    setInvisible(true);
  };

  const klick = (bool) => {
    setInitialPasswort(bool);
  };

  const userCheck = (user) => {
    if (user != null) {
      setUser(user[0]);

      const data1 = new FormData();
      data1.append("kundeId", user[0]._id);
      data1.append("firmenId", user[0].firmen_id);
      data1.append("vorname", user[0].vorname);
      data1.append("nachname", user[0].nachname);
      data1.append("suchteNach", "");
      data1.append("tatWas", "Hat sich angemeldet");

      axios.post(url + "/CPep_Spring/Verlauf", data1);

      const data = new FormData();
      data.append("firmenId", user[0].firmen_id);

      axios
        .post(url + "/CPep_Spring/eineFirma", data)

        .then((res) => {
          if (res.data.length > 0) {
            setFirma(res.data);
            verschicktePdfEmpfangen(user[0]);
          }
        });
    }
  };

  async function anzahlAbfragen() {
    await axios
      .get(url + "/CPep_Spring/getKundenAbfragen", {
        params: { kundenId: user._id },
      })
      .then(function (response) {
        if (response.data.length === 0) {
          console.log(response.data);
        } else {
          setPdfs(response.data);
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  const gespeichert = () => {
    axios
      .get(url + "/CPep_Spring/gemerkt", {
        params: { id_kunde: user._id },
      })
      .then(function (response) {
        if (response.data.length === 0) {
          setGemerkt(0);
        } else {
          setGemerkt(response.data);
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  const saveAbfrage = (gesucht) => {
    axios.get(
      url +
        "/CPep_Spring/saveAbfragen?gesuchtNach=" +
        gesucht +
        "&firmenId=" +
        user.firmen_id +
        "&kundenId=" +
        user._id +
        "&liste=" +
        liste
    );
  };

  const saveAbfrageFürGemerkte = (id, gesucht) => {
    axios.post(
      url +
        "/CPep_Spring/saveAbfragenFuerGemerkte?pdfId=" +
        id +
        "&gesuchtNach=" +
        gesucht +
        "&firmenId=" +
        user.firmen_id +
        "&kundenId=" +
        user._id
    );
  };

  const keinTrefferPDF = () => {
    axios(
      url +
        "/CPep_Spring/keinTreffer?gesuchtNach=" +
        anzeigen +
        "&firmenId=" +
        user.firmen_id +
        "&kundenId=" +
        user._id,
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

        gespeichert();
        anzahlAbfragen();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const getPdf = (id) => {
    axios(
      url +
        "/CPep_Spring/getPdf?_id=" +
        id +
        "&gesuchtNach=" +
        anzeigen +
        "&firmenId=" +
        user.firmen_id +
        "&kundenId=" +
        user._id +
        "&liste=" +
        liste,
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

        saveAbfrageFürGemerkte(id, anzeigen);
        anzahlAbfragen();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const ladeErgebnis = () => {
    if (anzeigen !== "") {
      if (anzeigen) setLädt(true);

      const daten = new FormData();

      const exakt = firma[0].exakteSuche === 1 ? "Ja" : "Nein";
      const list = firma[0].liste;

      daten.append("suche", anzeigen);
      daten.append("_exakteSuche", exakt);
      daten.append("liste", list);

      const fetchData = async () => {
        setkeinTreffer(false);
        await axios
          .post(url + "/CPep_Spring/searchPep", daten)
          .then(function (response) {
            if (response.data.length == 0) {
              setkeinTreffer(true);
              setLädt(false);
              gespeichert();
            } else {
              setErgebnis(response.data);
              saveAbfrage(anzeigen);
              setLädt(false);
              gespeichert();
            }

            setValue("");
          })
          .catch(function (error) {
            console.log(error);
          });
      };
      fetchData();
    }
  };

  React.useEffect(() => {
    ladeErgebnis();
  }, [anzeigen]);

  return (
    <div style={{ marginTop: "20px" }}>
      <span
        style={{
          fontFamily: "fantasy",
          fontSize: "1.5rem",
          letterSpacing: "1px",
        }}
      >
        <img
          alt="FCH"
          height="80"
          width="190"
          src={`${process.env.PUBLIC_URL}/fch_co_logo.png`}
        />
      </span>

      <Container style={{ marginTop: "2%", marginBottom: "5%" }}>
        {!user && <Login url={url} userCheck={userCheck}></Login>}

        {user && (
          <>
            <span style={{ fontSize: "0.9rem", marginBottom: "20px" }}>
              <span style={{ fontWeight: "bold" }}>Willkommen</span>{" "}
              {user.vorname} {user.nachname}
            </span>
            <hr className="gradient"></hr>

            <Tooltip title="Falls Ihnen jemand ein PDF geschickt hat, können Sie es hier einsehen">
              {lädtPdf ? (
                <CircularProgress></CircularProgress>
              ) : (
                <Badge
                  style={{ cursor: "pointer" }}
                  badgeContent={empfangenePdf.length}
                  max={5}
                  color="primary"
                  onClick={() => mailIconKlick(true)}
                >
                  <MailIcon />
                </Badge>
              )}
            </Tooltip>
            {bull}
            <Tooltip title="Aktuelle Informationen können Sie hier einsehen, falls vorhanden">
              {lädtPdf ? (
                <CircularProgress></CircularProgress>
              ) : (
                <Badge
                  invisible={invisible}
                  variant="dot"
                  style={{ cursor: "pointer" }}
                  color="secondary"
                  onClick={() => passwortHinterherAendern()}
                >
                  <InfoIcon />
                </Badge>
              )}
            </Tooltip>
            <hr className="gradient"></hr>
            <Filter
              changeText={changeText}
              wert={value}
              clickBtn={clickBtn}
              enter={enter}
              suche={suche}
              welcheL={welcheL}
              url={url}
              user={user}
            ></Filter>

            <hr></hr>

            {lädt ? (
              <Progress></Progress>
            ) : !keinTreffer ? (
              ergebnis && (
                <Card
                  user={user}
                  url={url}
                  wert={anzeigen}
                  ergebnis={ergebnis}
                  pdfs={pdfs}
                  getPdf={getPdf}
                  gemerkt={gemerkt}
                  ladeErgebnis={ladeErgebnis}
                  gespeichert={gespeichert}
                ></Card>
              )
            ) : (
              <>
                <Tooltip title="Ihr suche ergab kein Treffer">
                  <h1>Kein Treffer</h1>
                </Tooltip>
                <Tooltip title="PDF erstellen">
                  <PictureAsPdfIcon
                    fontSize="large"
                    style={{ cursor: "pointer" }}
                    onClick={() => keinTrefferPDF()}
                  ></PictureAsPdfIcon>
                </Tooltip>
              </>
            )}
          </>
        )}
      </Container>
      {user && (
        <BottomNavi
          pdfs={pdfs}
          url={url}
          gemerkt={gemerkt}
          user={user}
          update={update}
        ></BottomNavi>
      )}
      {empfangenePdf.length > 0 ? (
        <DialogPDF
          url={url}
          pdfs={empfangenePdf}
          userMoechtePdfEinsehen={userMoechtePdfEinsehen}
          mailIconKlick={mailIconKlick}
        ></DialogPDF>
      ) : (
        <></>
      )}
      {user && user.passwortGeändert === "nein" ? (
        <PasswoerAendernDialog
          user={user}
          url={url}
          oeffnen={initialPasswort}
          klick={klick}
        ></PasswoerAendernDialog>
      ) : (
        <></>
      )}
    </div>
  );
}
