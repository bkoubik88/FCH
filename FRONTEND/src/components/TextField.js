import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import clsx from "clsx";
import FormControl from "@material-ui/core/FormControl";
import FilledInput from "@material-ui/core/FilledInput";
import OutlinedInput from "@material-ui/core/OutlinedInput";
import InputLabel from "@material-ui/core/InputLabel";
import InputAdornment from "@material-ui/core/InputAdornment";
import SearchIcon from "@material-ui/icons/Search";

const useStyles = makeStyles((theme) => ({
  root: {
    "& > *": {
      margin: theme.spacing(1),
      width: "25ch",
    },
  },
}));

export default function BasicTextFields({ changeText, enter, wert }) {
  const classes = useStyles();

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      enter(e);
    }
  };

  return (
    <form className={classes.root} noValidate autoComplete="off">
      <FormControl
        style={{ width: "50%" }}
        className={clsx(classes.margin, classes.textField)}
        variant="outlined"
      >
        <InputLabel htmlFor="outlined-adornment-password">
          Suche nach...
        </InputLabel>
        <OutlinedInput
          id="outlined-adornment-password"
          onKeyDown={handleKeyDown}
          id="outlined-basic"
          label="Suche nach..."
          value={wert}
          variant="outlined"
          onChange={(e) => changeText(e)}
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
    </form>
  );
}
