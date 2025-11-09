import { useState, useEffect, CSSProperties } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Slider from '@mui/material/Slider';

import { dtFormatter } from "../../utils/timeUtils";
import { getResamplingTime } from '../../utils/resampling';
import { MIN_RESAMPLING_TIME, MAX_NUM_POINTS_ON_CHART } from '../../types';

type DtRangeProps = {
  commitedDtRange: number[],
  handleChangeCommitted: (x: number[]) => void,
  minTs: number,
  maxTs: number,
  addStyles?: CSSProperties
};

export default function DtRangeSlider({ commitedDtRange, handleChangeCommitted, minTs, maxTs, addStyles }: DtRangeProps) {
  const [step, setStep] = useState<number>(1000);
  const [dtRange, setDtRange] = useState([0, 0]);

  useEffect(() => {
    setDtRange(commitedDtRange);
  }, [commitedDtRange]);

  useEffect(() => {
    const newStep = getResamplingTime(dtRange[0], dtRange[1], MIN_RESAMPLING_TIME, MAX_NUM_POINTS_ON_CHART);
    setStep(newStep);
  }, [dtRange]);

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
        <Typography variant="h6">{`Quant time:${step / 1000}s`}</Typography>
        <Typography variant="h6">{dtFormatter.format(new Date(dtRange[1]))}</Typography>
      </Box>
    </Box>
  );
}