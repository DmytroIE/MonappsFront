import * as React from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import { useDispatch } from "react-redux";

import DfChartTab from './DfChartTab';

import InstancePropsPage from '../InstancePropsPage/InstancePropsPage';
import TabPanel from '../TabPanel/TabPanel';
import { a11yProps } from '../TabPanel/TabPanel';
import { fetchNodeReadings } from "../NodeTree/treeSlice";


export default function DatafeedArea({ id }) {
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const dispatch = useDispatch();

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
          <Tab label="Properties" {...a11yProps(0)} />
          <Tab label="Graphs" {...a11yProps(1)} onClick={() => {dispatch(fetchNodeReadings({ items: [{id, readingType: 'dfReadings'}] }));}}/>
        </Tabs>
      </Box>
      <TabPanel value={value} index={0}>
        <InstancePropsPage id={id}/>
      </TabPanel>
      <TabPanel value={value} index={1}>
        <DfChartTab id={id} />
      </TabPanel>
    </Box>
  );
}
