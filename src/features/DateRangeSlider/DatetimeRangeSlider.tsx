import { useState, useEffect, CSSProperties } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Slider from '@mui/material/Slider';

import { dtFormatter } from "../../utils/timeUtils";

type DtRangeProps = {
  commitedDtRange: number[],
  handleChangeCommitted: (x: number[]) => void,
  minTs: number,
  maxTs: number,
  step: number
  addStyles?: CSSProperties
};

const DtRangeSlider = (
  { commitedDtRange,
    handleChangeCommitted,
    minTs,
    maxTs,
    step,
    addStyles }: DtRangeProps) => {
  const [dtRange, setDtRange] = useState([0, 0]);

  useEffect(() => {
    setDtRange(commitedDtRange);
  }, [commitedDtRange]);

  const onChange = (event: Event | any, newValue: number | number[]) => {
    if (Array.isArray(newValue)) {
      setDtRange(newValue);
    }
    else {
      setDtRange([newValue, newValue]);
    }
  };

  const onChangeCommitted = (event: Event | any, newValue: number | number[]) => {
    if (Array.isArray(newValue)) {
      handleChangeCommitted(newValue);
    }
    else {
      handleChangeCommitted([newValue, newValue]);
    }
  };

  if (minTs === maxTs && minTs === 0) {
    return (
      <Box sx={{ ...addStyles }}>
        <Typography variant="h6" sx={{ textAlign: "center" }}>No data</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ ...addStyles }}>
      <Slider
        getAriaLabel={() => 'Datetime range'}
        value={dtRange}
        min={minTs}
        max={maxTs}
        onChange={onChange}
        onChangeCommitted={onChangeCommitted}
        step={step}
      />
      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Typography variant="h6">{dtFormatter.format(new Date(dtRange[0]))}</Typography>
        <Typography variant="h6">{dtFormatter.format(new Date(dtRange[1]))}</Typography>
      </Box>
    </Box>
  );
}

export default DtRangeSlider;