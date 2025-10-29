import { useState, useEffect, CSSProperties } from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Slider from '@mui/material/Slider';


export default function DatetimeRangeSlider({ minTs, maxTs, addStyles }: { minTs: number, maxTs: number, addStyles?: CSSProperties }) {
  // Initialize with the incoming props, but keep in sync when they change
  const [value, setValue] = useState<number[]>([minTs, maxTs]);
  useEffect(() => {
    // When minTs/maxTs change after first render, update the slider state
    setValue([minTs, maxTs]);
  }, [minTs, maxTs]);
  console.log('datetime range slider');

  const handleChange = (event: Event | any, newValue: number | number[]) => {
    // Slider onChange can pass either a number or number[] depending on single/range slider
    if (Array.isArray(newValue)) {
      console.log(newValue);
      setValue(newValue);
    }
  };

  console.log(value);
  console.log(minTs, maxTs);

  return (
    <Box sx={{ ...addStyles }}>
      <Slider
        sx={{ minWidth: 200, width: '70%' }}
        getAriaLabel={() => 'Datetime range'}
        value={value}
        min={minTs}
        max={maxTs}
        onChange={handleChange}
        valueLabelDisplay="on"
        valueLabelFormat={(x: number) => { return (new Date(x)).toISOString(); }}

      />
    </Box>
  );
}