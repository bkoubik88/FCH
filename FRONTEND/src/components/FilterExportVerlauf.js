import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import MomentUtils from "@date-io/moment";
import "moment/locale/de";
import Button from "@material-ui/core/Button";
import FilterListIcon from "@material-ui/icons/FilterList";
import axios from "axios";

import {
  MuiPickersUtilsProvider,
  KeyboardTimePicker,
  KeyboardDatePicker,
} from "@material-ui/pickers";

export default function FilterExportVerlauf({ vonBis }) {
  var date = new Date();

  const [selectedDateVon, setSelectedDateVon] = React.useState("");
  const [selectedDateBis, setSelectedDateBis] = React.useState("");

  const handleDateChangeVon = (date) => {
    setSelectedDateVon(date._d);
  };
  const handleDateChangeBis = (date) => {
    setSelectedDateBis(date._d);
  };

  const FilterVerlauf = () => {
    vonBis(selectedDateVon, selectedDateBis);
  };

  React.useEffect(() => {}, [selectedDateVon]);

  React.useEffect(() => {
    setSelectedDateVon(new Date(date.getFullYear(), date.getMonth(), 1));
    setSelectedDateBis(new Date());
  }, []);

  return (
    <>
      <Col md={12} style={{ textAlign: "center", marginTop: "20px" }}>
        <MuiPickersUtilsProvider utils={MomentUtils} locale="de">
          <KeyboardDatePicker
            margin="normal"
            id="date-picker-dialog"
            label="Von"
            format="DD.MM.YYYY"
            value={selectedDateVon}
            onChange={handleDateChangeVon}
            maxDate={new Date()}
            showTodayButton={true}
            cancelLabel="Abbrechen"
            todayLabel="aktuelles Datum"
            KeyboardButtonProps={{
              "aria-label": "bis",
            }}
          />
        </MuiPickersUtilsProvider>
      </Col>
      <Col md={12} style={{ textAlign: "center", marginTop: "20px" }}>
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
        <Col md={12} style={{ textAlign: "center", marginTop: "20px" }}>
          <Button
            onClick={() => FilterVerlauf()}
            variant="contained"
            color="secondary"
            startIcon={<FilterListIcon />}
          >
            Filtern
          </Button>
        </Col>
      </Col>
    </>
  );
}
