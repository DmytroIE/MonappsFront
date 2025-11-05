import { useState, useEffect, CSSProperties } from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Slider from '@mui/material/Slider';

type DtRangeProps = { 
  dtRange: number[], 
  handleChange: (x: number[]) => void, 
  minTs: number, 
  maxTs: number, 
  quantTime: number,
  addStyles?: CSSProperties };

export default function DtRangeSlider({ dtRange, handleChange, minTs, maxTs, quantTime, addStyles }: DtRangeProps) {

  const onChange = (event: Event | any, newValue: number | number[]) => {
    if (Array.isArray(newValue)) {
      handleChange(newValue);
    }
    else {
      handleChange([newValue, newValue]);
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
        valueLabelDisplay="on"
        valueLabelFormat={(x: number) => { return (new Date(x)).toISOString(); }}
        step={quantTime}
      />
    </Box>
  );
}