import React from "react";
import FormatAlignLeftIcon from "@material-ui/icons/FormatAlignLeft";
import FormatAlignCenterIcon from "@material-ui/icons/FormatAlignCenter";
import FormatAlignRightIcon from "@material-ui/icons/FormatAlignRight";
import FormatAlignJustifyIcon from "@material-ui/icons/FormatAlignJustify";
import ToggleButton from "@material-ui/lab/ToggleButton";
import ToggleButtonGroup from "@material-ui/lab/ToggleButtonGroup";
import Filter2Icon from "@material-ui/icons/Filter2";
import FilterIcon from "@material-ui/icons/Filter";
import Filter1Icon from "@material-ui/icons/Filter1";
import Tooltip from "@material-ui/core/Tooltip";
import axios from "axios";

export default function ToggleButtons({
  welcheListe,
  url,
  firmenId,
  suche_,
  wahl,
}) {
  const [alignment, setAlignment] = React.useState(welcheListe);

  const [aend, setaend] = React.useState(false);

  React.useEffect(() => {}, [alignment]);

  async function setDBexakteSuche(li) {
    const data = new FormData();
    data.append("liste", li);
    data.append("firmendId", firmenId);

    if (suche_ === true) {
      suche_ = 1;
    } else {
      suche_ = 0;
    }
    data.append("suche", suche_);

    await axios
      .post(url + "/CPep_Spring/changeListeAndSearch", data)
      .then(function () {
        wahl(alignment);
      });
  }

  const handleAlignment = (event, newAlignment) => {
    setAlignment(newAlignment);
    setDBexakteSuche(newAlignment);
  };

  return (
    <ToggleButtonGroup
      value={alignment}
      exclusive
      onChange={handleAlignment}
      aria-label="text alignment"
    >
      <ToggleButton value="nurPep" aria-label="left aligned">
        PEP
      </ToggleButton>

      <ToggleButton value="nurSanktion" aria-label="centered">
        SANKTIONEN
      </ToggleButton>

      <ToggleButton value="beide" aria-label="right aligned">
        BEIDE
      </ToggleButton>
    </ToggleButtonGroup>
  );
}
