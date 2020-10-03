import React from "react";
import { makeStyles } from "@material-ui/core/styles";

import { Row, Col } from "react-bootstrap";
import clsx from "clsx";
import CardElement from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardMedia from "@material-ui/core/CardMedia";
import CardContent from "@material-ui/core/CardContent";
import CardActions from "@material-ui/core/CardActions";
import Collapse from "@material-ui/core/Collapse";
import Avatar from "@material-ui/core/Avatar";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import { red } from "@material-ui/core/colors";
import StarBorderIcon from "@material-ui/icons/StarBorder";
import StarIcon from "@material-ui/icons/Star";
import ShareIcon from "@material-ui/icons/Share";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import PictureAsPdfIcon from "@material-ui/icons/PictureAsPdf";
import Tooltip from "@material-ui/core/Tooltip";
import axios from "axios";
import { saveAs } from "file-saver";
import FileSaver from "file-saver";
import { Document, Page } from "react-pdf";

const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: 345,
    fontWeight: "bold",
  },
  media: {
    height: 0,
    paddingTop: "56.25%", // 16:9
  },
  expand: {
    transform: "rotate(0deg)",
    marginLeft: "auto",
    transition: theme.transitions.create("transform", {
      duration: theme.transitions.duration.shortest,
    }),
  },
  expandOpen: {
    transform: "rotate(180deg)",
  },
  avatar: {
    backgroundColor: "#14387D",
    width: "80px",
    borderRadius: "6%",
  },
}));

export default function Card({
  url,
  wert,
  ergebnis,
  pdfs,
  getPdf,
  user,
  gemerkt,
  ladeErgebnis,
  gespeichert,
}) {
  const classes = useStyles();
  const [expanded, setExpanded] = React.useState(false);
  const [suche, setSuche] = React.useState(false);
  const [file, setFile] = React.useState(null);
  const newArray = [];
  const [star, setStar] = React.useState(false);
  const [whats, setWhats] = React.useState(star);
  const [nurErgebnisIds, setNurErgebnisIds] = React.useState([]);

  const handleExpandClick = (index) => {
    setExpanded({
      ...expanded,
      [index]: !expanded[index],
    });
  };

  const toggleStart = (index, pdfId, vorname, nachname) => {
    updateMerken(pdfId, index, vorname, nachname);
  };

  React.useEffect(() => {
    const newArray = [];

    gemerkt &&
      gemerkt.map((e) => {
        newArray.push(e.id_pdf);
      });

    setNurErgebnisIds(newArray);
  }, [wert, gemerkt]);

  function updateMerken(pdfId, star, vorname, nachname) {
    axios.get(url + "/CPep_Spring/merken", {
      params: {
        id_kunde: user._id,
        id_pdf: pdfId,
        key: star,
        vorname: vorname,
        nachname: nachname,
      },
    });

    const data1 = new FormData();
    data1.append("kundeId", user._id);
    data1.append("firmenId", user.firmen_id);
    data1.append("vorname", user.vorname);
    data1.append("nachname", user.nachname);
    data1.append("suchteNach", "");
    if (star === "wahr") {
      data1.append(
        "tatWas",
        "Hat ein gemerktes Pdf deselektiert (" + pdfId + ")"
      );
    } else {
      data1.append("tatWas", "Hat sich ein Pdf gemerkt (" + pdfId + ")");
    }

    axios.post(url + "/CPep_Spring/Verlauf", data1);

    ladeErgebnis();
  }

  const Capitalize = (last, first) => {
    return first.slice(0, 1) + " " + last.slice(0, 1);
  };

  return (
    <>
      <Row className="justify-content-center">
        <Col md={12} sm="auto" xs="auto">
          <span style={{ fontSize: "1rem" }}>
            Gesucht nach:{" "}
            <span style={{ color: "red", fontWeight: "bold" }}>{wert}</span>
            <p></p>
            <span>
              <p>Anzahl: {ergebnis.length}</p>{" "}
              {ergebnis.length > 0 && (
                <p>(Es werden maximal 50 Ergebnisse angezeigt)</p>
              )}
            </span>
          </span>
        </Col>
      </Row>
      <Row className="justify-content-center" style={{ marginBottom: "20%" }}>
        {ergebnis.map((e, index) => (
          <Col
            md="auto"
            sm="auto"
            xs="auto"
            style={{ marginTop: "25px" }}
            key={index}
          >
            <CardElement className={classes.root}>
              {e.Unbekannt === "Nein" && (
                <CardHeader
                  style={{ fontWeight: "bold" }}
                  avatar={
                    <Avatar aria-label="recipe" className={classes.avatar}>
                      {e.dob}
                    </Avatar>
                  }
                  title={e.last_Name}
                  subheader={e.first_Name}
                />
              )}
              <CardContent>
                {e.Unbekannt === "Ja" ? (
                  <Tooltip
                    title={
                      "Überprüfen Sie mithilfe der angegebene ID ob die Daten richtig vorhanden bzw. geladen worden sind"
                    }
                  >
                    <div>
                      <h2 style={{ color: "red" }}>Achtung!</h2>
                      <h4> Kein Vor- und Nachname</h4>
                      <h6>
                        ID: <span style={{ color: "red" }}>{e._id_fk}</span>
                      </h6>
                    </div>
                  </Tooltip>
                ) : (
                  <Tooltip title={e.category}>
                    <Typography
                      variant="body2"
                      color="textSecondary"
                      component="p"
                    >
                      {e.category}
                    </Typography>
                  </Tooltip>
                )}
              </CardContent>
              {e.Unbekannt === "Nein" && (
                <CardActions disableSpacing>
                  <IconButton aria-label="add to favorites">
                    {nurErgebnisIds.includes(e._id_fk) ? (
                      <StarIcon
                        onClick={() =>
                          toggleStart(
                            "wahr",
                            e._id_fk,
                            e.first_Name,
                            e.last_Name
                          )
                        }
                        style={{ color: "#E69123", cursor: "pointer" }}
                      ></StarIcon>
                    ) : (
                      <StarBorderIcon
                        onClick={() =>
                          toggleStart(
                            "falsch",
                            e._id_fk,
                            e.first_Name,
                            e.last_Name
                          )
                        }
                        style={{ cursor: "pointer" }}
                      ></StarBorderIcon>
                    )}
                  </IconButton>
                  <IconButton aria-label="pdf">
                    <PictureAsPdfIcon onClick={() => getPdf(e._id_fk)} />
                  </IconButton>

                  <IconButton
                    className={clsx(classes.expand, {
                      [classes.expandOpen]: expanded[index],
                    })}
                    onClick={() => handleExpandClick(index)}
                    aria-expanded={expanded[index]}
                    aria-label="show more"
                  >
                    <ExpandMoreIcon />
                  </IconButton>
                </CardActions>
              )}

              <Collapse in={expanded[index]} timeout="auto" unmountOnExit>
                <CardContent>
                  <Typography className="headerDetail">POB:</Typography>
                  <Tooltip title={e.pob}>
                    <Typography paragraph className="details">
                      {e.pob}
                    </Typography>
                  </Tooltip>
                  <Typography className="headerDetail">Function</Typography>
                  <Tooltip title={e.function}>
                    <Typography paragraph className="details">
                      {e.function}
                    </Typography>
                  </Tooltip>
                  <Typography className="headerDetail">
                    Additional Information
                  </Typography>
                  <Tooltip title={e.additional_Information}>
                    <Typography paragraph className="details">
                      {e.additional_Information}
                    </Typography>
                  </Tooltip>
                </CardContent>
              </Collapse>
            </CardElement>
          </Col>
        ))}
      </Row>
    </>
  );
}
