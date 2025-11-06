import { useState, useEffect, CSSProperties } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Slider from '@mui/material/Slider';

import { dtFormatter } from "../../utils/timeUtils";
import { getResamplingTime } from '../../utils/resampling';

type DtRangeProps = {
  dtRange: number[],
  handleChange: (x: number[]) => void,
  handleChangeCommitted: (x: number[]) => void,
  minTs: number,
  maxTs: number,
  quantTime: number,
  addStyles?: CSSProperties
};

export default function DtRangeSlider({ dtRange, handleChange, handleChangeCommitted, minTs, maxTs, quantTime, addStyles }: DtRangeProps) {
  const [step, setStep] = useState<number>(1000);
  useEffect(() => {
    const newStep = getResamplingTime(dtRange[0], dtRange[1], 1000, 100);
    setStep(newStep);
  }, [dtRange]);

  const onChange = (event: Event | any, newValue: number | number[]) => {
    if (Array.isArray(newValue)) {
      handleChange(newValue);
    }
    else {
      handleChange([newValue, newValue]);
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
        <Typography variant="h6">{`${step / 1000}s`}</Typography>
        <Typography variant="h6">{dtFormatter.format(new Date(dtRange[1]))}</Typography>
      </Box>
    </Box>
  );
}