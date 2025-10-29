import * as React from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import { useDispatch, useSelector } from "react-redux";
import { createSelector } from '@reduxjs/toolkit';

import AppChartTab from './AppChartTab';
import InstancePropsPage from '../InstancePropsPage/InstancePropsPage';
import TabPanel from '../TabPanel/TabPanel';
import { a11yProps } from '../TabPanel/TabPanel';
import { fetchNodeReadings } from "../NodeTree/treeSlice";


const getDatafeedIds= createSelector(
  [(state) => state.tree.nodes, (state, itemId) => itemId],
  (nodes, id) => Object.values(nodes).filter((item) => item.parentId === id).map((item) => item.id)
);

export default function ApplicationArea({ id }) {
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const dispatch = useDispatch();

  const datafeedIds = useSelector((state) => getDatafeedIds(state, id));
  const dfItems = datafeedIds.map(id => ({id, readingType: 'dfReadings'}));

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
          <Tab label="Properties" {...a11yProps(0)} />
          <Tab label="Graphs" {...a11yProps(1)} onClick={() => { dispatch(fetchNodeReadings({ items: dfItems })); }} />
          <Tab label="Alarm log" {...a11yProps(2)} />
        </Tabs>
      </Box>
      <TabPanel value={value} index={0}>
        <InstancePropsPage id={id} />
      </TabPanel>
      <TabPanel value={value} index={1}>
        {/* <Typography variant='h3' sx={{ textAlign: "center" }}>Graphs</Typography> */}
        <AppChartTab id={id} />
      </TabPanel>
      <TabPanel value={value} index={2}>
        {/* <Typography variant='h3' sx={{ textAlign: "center" }}>Alarm log</Typography> */}
        <Container>Later</Container>
      </TabPanel>
    </Box>
  );
}