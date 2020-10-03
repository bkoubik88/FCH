import React from "react";
import PropTypes from "prop-types";
import clsx from "clsx";
import { lighten, makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TablePagination from "@material-ui/core/TablePagination";
import TableRow from "@material-ui/core/TableRow";
import TableSortLabel from "@material-ui/core/TableSortLabel";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";
import Checkbox from "@material-ui/core/Checkbox";
import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Switch from "@material-ui/core/Switch";
import DeleteIcon from "@material-ui/icons/Delete";
import FilterListIcon from "@material-ui/icons/FilterList";
import axios from "axios";
import EditIcon from "@material-ui/icons/Edit";
import Fiter from "./Filter";
import ToggleButton from "./ToggleButton";
import Badge from "@material-ui/core/Badge";
import PersonIcon from "@material-ui/icons/Person";
import { Container, Row, Col } from "react-bootstrap";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import ListItemText from "@material-ui/core/ListItemText";
import Avatar from "@material-ui/core/Avatar";
import FormGroup from "@material-ui/core/FormGroup";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import DialogContent from "@material-ui/core/DialogContent";
import Dialog from "@material-ui/core/Dialog";
import MuiDialogTitle from "@material-ui/core/DialogTitle";
import MuiDialogContent from "@material-ui/core/DialogContent";
import MuiDialogActions from "@material-ui/core/DialogActions";
import DialogTitle from "@material-ui/core/DialogTitle";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import InputLabel from "@material-ui/core/InputLabel";
import moment from "moment";
import { withStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import CloseIcon from "@material-ui/icons/Close";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { useTheme } from "@material-ui/core/styles";
import Accordion from "@material-ui/core/Accordion";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import DialogContentText from "@material-ui/core/DialogContentText";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";

import "moment/locale/de";
moment.locale("de");

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

const headCells = [
  {
    id: "firma",
    numeric: false,
    disablePadding: true,
    label: "Firmenname",
  },
  { id: "firmen_id", numeric: true, disablePadding: false, label: "Firmen ID" },
  {
    id: "anlageDatum",
    numeric: true,
    disablePadding: false,
    label: "Anlagedatum",
  },
  {
    id: "Mitglieder",
    numeric: true,
    disablePadding: false,
    label: "Mitglieder",
  },
];

function EnhancedTableHead(props) {
  const {
    classes,
    onSelectAllClick,
    order,
    orderBy,
    numSelected,
    rowCount,
    onRequestSort,
  } = props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead TableSortLabel="sortieren">
      <TableRow>
        <TableCell padding="checkbox">
          <Checkbox
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
            inputProps={{ "aria-label": "Alle auswählen" }}
          />
        </TableCell>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? "right" : "left"}
            padding={headCell.disablePadding ? "none" : "default"}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : "asc"}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <span className={classes.visuallyHidden}>
                  {order === "desc" ? "sorted descending" : "sorted ascending"}
                </span>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

EnhancedTableHead.propTypes = {
  classes: PropTypes.object.isRequired,
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.oneOf(["asc", "desc"]).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
};
const useToolbarStyles = makeStyles((theme) => ({
  root: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(1),
  },
  highlight:
    theme.palette.type === "light"
      ? {
          color: theme.palette.secondary.main,
          backgroundColor: lighten(theme.palette.secondary.light, 0.85),
        }
      : {
          color: theme.palette.text.primary,
          backgroundColor: theme.palette.secondary.dark,
        },
  title: {
    flex: "1 1 100%",
  },
}));

const EnhancedTableToolbar = (
  props,
  loeschen,
  firmaBearbeiten,
  url,
  neuRendern,
  firmaAusgewählt,
  setChildOptionBC
) => {
  const classes = useToolbarStyles();
  const { numSelected } = props;

  const deleteFirmen = () => {
    props.loeschen.forEach((element) => {
      axios
        .get(props.url + "/CPep_Spring/firmaUndKundenEntfernen", {
          params: {
            firmenID: element,
          },
        })
        .then(function (response) {
          props.neuRendern();
        });
    });
  };

  const editFirma = () => {
    const data = new FormData();
    data.append("firmen_id", props.firmaBearbeiten);

    axios
      .post(props.url + "/CPep_Spring/singleFirma", data)
      .then(function (response) {
        props.setEinzeleFirmaNachKlick(response.data);
        props.setChildOptionBC();
      });
  };

  return (
    <Toolbar
      className={clsx(classes.root, {
        [classes.highlight]: numSelected > 0,
      })}
    >
      {numSelected > 0 ? (
        <Typography
          className={classes.title}
          color="inherit"
          variant="subtitle1"
          component="div"
        >
          {numSelected} ausgewählt
        </Typography>
      ) : (
        <Typography
          className={classes.title}
          variant="h6"
          id="tableTitle"
          component="div"
        >
          Firmen
        </Typography>
      )}

      {numSelected > 1 ? (
        <>
          <Tooltip title="Löschen">
            <IconButton aria-label="delete" onClick={() => deleteFirmen()}>
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        </>
      ) : numSelected === 1 ? (
        <>
          <Tooltip title="ändern">
            <IconButton aria-label="beabbeiten" onClick={() => editFirma()}>
              <EditIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Löschen">
            <IconButton aria-label="delete" onClick={() => deleteFirmen()}>
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        </>
      ) : (
        <></>
      )}
    </Toolbar>
  );
};

EnhancedTableToolbar.propTypes = {
  numSelected: PropTypes.number.isRequired,
};

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
  },
  paper: {
    width: "100%",
    marginBottom: theme.spacing(2),
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    flexBasis: "33.33%",
    flexShrink: 0,
    fontWeight: "bold",
  },
  secondaryHeading: {
    fontSize: theme.typography.pxToRem(15),
    color: theme.palette.text.secondary,
  },
  table: {
    minWidth: 750,
  },
  visuallyHidden: {
    border: 0,
    clip: "rect(0 0 0 0)",
    height: 1,
    margin: -1,
    overflow: "hidden",
    padding: 0,
    position: "absolute",
    top: 20,
    width: 1,
  },
}));

export default function EnhancedTable({
  firmen,
  neueReihenfolge,
  url,
  neuRendern,
  firmaAusgewählt,
  informiereDialog,
  user,
}) {
  const [open, setOpen] = React.useState(false);
  const [openFirma, setOpenFirma] = React.useState(false);
  const [userBearbeitenDialog, setuserBearbeitenDialog] = React.useState(false);
  const [expanded, setExpanded] = React.useState(false);
  const classes = useStyles();
  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState("firma");
  const [selected, setSelected] = React.useState([]);
  const [fullWidth, setFullWidth] = React.useState(true);
  const [maxWidth, setMaxWidth] = React.useState("sm");
  const [listeGewaehlt, setlisteGewaehlt] = React.useState("");
  const [checked, setChecked] = React.useState([]);

  const [page, setPage] = React.useState(0);
  const [dense, setDense] = React.useState(false);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [rows, setRows] = React.useState(firmen);
  const [einzeleFirma, setEinzeleFirma] = React.useState(null);

  const [geaendert, setgeaendert] = React.useState(false);

  const [liste, setListe] = React.useState("beide");

  const [firmenUser, setfirmenUser] = React.useState([]);
  const [secondary, setSecondary] = React.useState(false);
  const [aktuellerUser, setaktuellerUser] = React.useState("");

  const [firmenName, setFirmenName] = React.useState("");
  const [firmenId, setFirmenId] = React.useState("");

  const [aendereAnrede, setaendereAnrede] = React.useState("");
  const [aendereVorname, setaendereVorname] = React.useState("");
  const [aendereNachname, setaendereNachname] = React.useState("");

  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const [openAlert, setOpenAlert] = React.useState(false);

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

  const setzeAenderung = (aenderung) => {
    setgeaendert(!aenderung);
  };

  const wahl = (w) => {
    neuRendern();
  };

  React.useEffect(() => {
    setRows(firmen);
  }, [firmen]);

  React.useEffect(() => {
    informiereDialog(listeGewaehlt);
  }, [listeGewaehlt]);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
    neueReihenfolge(orderBy + " " + order);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = rows.map((n) => n.firmen_id);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleCloseFirma = () => {
    setOpenFirma(false);
  };

  const firmaAenderungUebernehmen = () => {
    const data = new FormData();

    let fN = "";
    let fI = "";

    if (firmenName === "") {
      fN = einzeleFirma[0].firma;
    } else {
      fN = firmenName;
    }

    if (firmenId === "") {
      fI = einzeleFirma[0].firmen_id;
    } else {
      fI = firmenId;
    }

    data.append("firmenId", fI);
    data.append("firmenName_", fN);

    axios.post(url + "/CPep_Spring/updateFirma", data).then(function () {
      const data1 = new FormData();
      data1.append("kundeId", user._id);
      data1.append("firmenId", user.firmen_id);
      data1.append("vorname", user.vorname);
      data1.append("nachname", user.nachname);
      data1.append("suchteNach", "");
      data1.append("tatWas", "Hat eine Firma geändert (" + fI + ")");

      axios.post(url + "/CPep_Spring/Verlauf", data1);

      setOpenFirma(false);
      setOpenAlert(true);
      neuRendern();
      setFirmenId("");
      setFirmenName("");
    });
  };

  const userBearbeitenDialogClose = () => {
    setuserBearbeitenDialog(false);
  };

  const handleClick = (event, name) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }

    setSelected(newSelected);
  };

  const handleCloseAlert = () => {
    setOpenAlert(false);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
  }

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const getMitglieder = (firma) => {
    const data = new FormData();
    data.append("firmenId", firma);

    axios.post(url + "/CPep_Spring/firmenKunden", data).then(function (resp) {
      setfirmenUser(resp.data);
      setOpen(true);
    });
  };

  const userLoschen = (e, Userid, firmenId) => {
    e.preventDefault();
    const data = new FormData();
    data.append("userID", Userid);
    data.append("firmenID", firmenId);

    axios
      .post(url + "/CPep_Spring/loescheKundeFromFirma", data)
      .then(function (resp) {
        getMitglieder(firmenId);
        neuRendern();
      });
  };

  const firmaBearbeiten = (event, user) => {
    console.log(user);
  };

  const userBearbeitenSpeichern = (userB) => {
    const data = new FormData();
    data.append("userID", userB._id);
    data.append("firmenId", userB.firmen_id);
    data.append("anrede", aendereAnrede !== "" ? aendereAnrede : userB.anrede);
    data.append(
      "vorname",
      aendereVorname !== "" ? aendereVorname : userB.vorname
    );
    data.append(
      "nachname",
      aendereNachname !== "" ? aendereNachname : userB.nachname
    );
    data.append("email", aendereEmail !== "" ? aendereEmail : userB.email);

    axios
      .post(url + "/CPep_Spring/updateSingleUser", data)
      .then(function (resp) {
        const data1 = new FormData();
        data1.append("kundeId", user._id);
        data1.append("firmenId", user.firmen_id);
        data1.append("vorname", user.vorname);
        data1.append("nachname", user.nachname);
        data1.append("suchteNach", "");
        data1.append("tatWas", "Hat einen User geändert (" + userB._id + ")");

        axios.post(url + "/CPep_Spring/Verlauf", data1);

        getMitglieder(userB.firmen_id);
        neuRendern();
      });
  };

  const [aendereEmail, setaendereEmail] = React.useState("");
  const userBearbeiten = (userB) => {
    setaktuellerUser(userB);

    setuserBearbeitenDialog(true);
  };

  const changeVorname = (event) => {
    setaendereVorname(event.target.value);
  };

  const isSelected = (name) => selected.indexOf(name) !== -1;

  const isChecked = (name) => checked.indexOf(name) !== -1;

  const emptyRows =
    rowsPerPage - Math.min(rowsPerPage, rows.length - page * rowsPerPage);

  const welcheL = (l) => {
    setListe(l);
  };
  const welcheListe = (liste) => {
    welcheL(liste);
  };
  const handleChangePanel = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };
  async function handleChange(event, id, suche, liste) {
    const data = new FormData();
    data.append("liste", liste);
    data.append("firmendId", id);

    if (suche === 0) {
      suche = 1;
    } else {
      suche = 0;
    }
    data.append("suche", suche);

    await axios
      .post(url + "/CPep_Spring/changeListeAndSearch", data)
      .then(function () {
        wahl();
      });
  }

  const setChildOptionBC = () => {
    setOpenFirma(true);
  };

  const setEinzeleFirmaNachKlick = (firma) => {
    setEinzeleFirma(firma);
  };

  const aenderFirmenID = (e) => {
    setFirmenId(e.target.value);
  };

  const aenderFirmenName = (e) => {
    setFirmenName(e.target.value);
  };

  return (
    <div className={classes.root}>
      <Paper className={classes.paper}>
        <EnhancedTableToolbar
          numSelected={selected.length}
          loeschen={selected}
          firmaBearbeiten={selected}
          url={url}
          firmaAusgewählt={firmaAusgewählt}
          neuRendern={neuRendern}
          setChildOptionBC={setChildOptionBC}
          setEinzeleFirmaNachKlick={setEinzeleFirmaNachKlick}
        />
        <TableContainer>
          <Table
            className={classes.table}
            aria-labelledby="tableTitle"
            size={dense ? "small" : "medium"}
            aria-label="enhanced table"
          >
            <EnhancedTableHead
              classes={classes}
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={handleSelectAllClick}
              onRequestSort={handleRequestSort}
              rowCount={rows.length}
            />
            <TableBody>
              {stableSort(rows, getComparator(order, orderBy))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => {
                  const isItemSelected = isSelected(row.firmen_id);
                  const isItemChecked = isChecked(row.firmen_id);
                  const labelId = `enhanced-table-checkbox-${index}`;
                  const exakt = row.exakteSuche === 1 ? true : false;
                  const l = row.liste;
                  return (
                    <TableRow
                      hover
                      role="checkbox"
                      aria-checked={isItemSelected}
                      tabIndex={-1}
                      key={row._id}
                    >
                      <TableCell padding="checkbox">
                        <Checkbox
                          key={row.firma}
                          selected={isItemSelected}
                          onClick={(event) => handleClick(event, row.firmen_id)}
                          checked={isItemSelected}
                          inputProps={{ "aria-labelledby": labelId }}
                        />
                      </TableCell>
                      <TableCell
                        component="th"
                        id={labelId}
                        scope="row"
                        padding="none"
                      >
                        {row.firma}
                      </TableCell>
                      <TableCell align="right">{row.firmen_id}</TableCell>
                      <TableCell align="right">
                        {moment(row.anlageDatum).format("ll")}
                      </TableCell>
                      <TableCell align="right">
                        <Badge
                          badgeContent={row.Mitglieder}
                          color="primary"
                          style={{ cursor: "pointer" }}
                          onClick={() => getMitglieder(row.firmen_id)}
                        >
                          <PersonIcon />
                        </Badge>
                      </TableCell>
                      <TableCell align="right">
                        <ToggleButton
                          welcheListe={l}
                          url={url}
                          firmenId={row.firmen_id}
                          suche_={exakt}
                          wahl={wahl}
                        ></ToggleButton>
                      </TableCell>
                    </TableRow>
                  );
                })}
              {emptyRows > 0 && (
                <TableRow style={{ height: (dense ? 33 : 53) * emptyRows }}>
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          labelDisplayedRows={({ from, to, count }) =>
            `${from}-${to} von ${count} gesamt`
          }
          backIconButtonText="zurück"
          rowsPerPageOptions={[5, 10]}
          labelRowsPerPage="Firmen pro Seite"
          component="div"
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onChangePage={handleChangePage}
          onChangeRowsPerPage={handleChangeRowsPerPage}
        />
      </Paper>

      <Dialog
        open={openFirma}
        onClose={handleCloseFirma}
        aria-labelledby="simple-dialog-title"
      >
        <DialogTitle id="max-width-dialog-title">
          {einzeleFirma && <>Firma bearbeiten {einzeleFirma[0].firma}</>}
        </DialogTitle>

        <DialogContentText>
          {einzeleFirma && (
            <>
              <Col md={12} xs={12}>
                <p>
                  <h5>Firma:</h5> {einzeleFirma[0].firma}{" "}
                </p>
              </Col>
              <Col md={12} xs={12}>
                <p>
                  <h5>Firmen ID:</h5> {einzeleFirma[0].firmen_id}
                </p>
              </Col>
              <Col md={12} xs={12}>
                <p>
                  <h5>Angelegt am:</h5>
                  {moment(einzeleFirma[0].anlageDatum).format("LLL")}
                </p>
              </Col>
              <Col md={12} xs={12}>
                <p>
                  <h5>welche Liste:</h5> {einzeleFirma[0].liste}
                </p>
              </Col>
            </>
          )}
          <hr></hr>
        </DialogContentText>

        <Container>
          <Row className="justify-content-center">
            <Col md={12} style={{ marginTop: "20px" }}>
              <TextField
                style={{ width: "100%" }}
                id="FName"
                label="Firmen Name"
                type="text"
                variant="outlined"
                value={firmenName}
                onChange={(e) => setFirmenName(e.target.value)}
              />
            </Col>
          </Row>
        </Container>
        <DialogActions>
          <Button onClick={handleCloseFirma} color="primary">
            schließen
          </Button>
          <Button onClick={firmaAenderungUebernehmen} color="secondary">
            übernehmen
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        onClose={handleClose}
        aria-labelledby="simple-dialog-title"
        open={open}
      >
        <DialogTitle id="simple-dialog-title">User Bearbeiten</DialogTitle>

        {firmenUser.map((user) => (
          <Accordion
            expanded={expanded === user._id}
            onChange={handleChangePanel(user._id)}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1bh-content"
              id="panel1bh-header"
            >
              <Typography className={classes.heading}>
                {user.nachname}
              </Typography>
              <Typography className={classes.secondaryHeading}>
                {user.email}
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>
                <Row className="justify-content-center">
                  <Col md={12}>
                    <div style={{ textAlign: "center" }}>
                      <p>Anrede: {user.anrede}</p>
                      <p>Vorname: {user.vorname}</p>
                      <p>Nachname: {user.nachname}</p>
                      <p>EMail: {user.email}</p>
                    </div>
                  </Col>
                  <Col md={12} style={{ textAlign: "right" }}>
                    <DeleteIcon
                      style={{ cursor: "pointer" }}
                      onClick={(event) =>
                        userLoschen(event, user._id, user.firmen_id)
                      }
                    ></DeleteIcon>
                    <hr></hr>
                  </Col>
                  <h6 style={{ color: "red" }}>
                    Lassen Sie Felder leer, wenn Sie den aktuellen Wert
                    beibehalten möchten
                  </h6>
                  <Col md={12} style={{ marginTop: "15px" }}>
                    <FormControl
                      variant="outlined"
                      style={{ minWidth: "125px" }}
                    >
                      <InputLabel htmlFor="outlined-age-native-simple">
                        Anrede
                      </InputLabel>
                      <Select
                        id="Anrede"
                        native
                        value={aendereAnrede}
                        label="Anrede"
                        onChange={(e) => setaendereAnrede(e.target.value)}
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
                  <Col md={6} style={{ marginTop: "20px" }}>
                    <TextField
                      id="Vorname"
                      type="text"
                      variant="outlined"
                      label="Vorname"
                      value={aendereVorname}
                      onChange={(e) => setaendereVorname(e.target.value)}
                    />
                  </Col>
                  <Col md={6} style={{ marginTop: "20px" }}>
                    <TextField
                      id="Nachname"
                      type="text"
                      variant="outlined"
                      label="Nachname"
                      value={aendereNachname}
                      onChange={(e) => setaendereNachname(e.target.value)}
                    />
                  </Col>
                  <Col md={12} style={{ marginTop: "20px" }}>
                    <TextField
                      style={{ width: "100%" }}
                      id="email"
                      type="text"
                      variant="outlined"
                      label="eMail"
                      onChange={(e) => setaendereEmail(e.target.value)}
                      value={aendereEmail}
                    />
                  </Col>
                  <Col
                    md={12}
                    style={{ marginTop: "20px", textAlign: "right" }}
                  >
                    <Button
                      onClick={() => userBearbeitenSpeichern(user)}
                      variant="contained"
                      color="primary"
                    >
                      Speichern
                    </Button>
                  </Col>
                </Row>
              </Typography>
            </AccordionDetails>
          </Accordion>
        ))}
      </Dialog>
    </div>
  );
}
