import * as React from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import { useDispatch } from "react-redux";

import DsChartTab from './DsChartTab';
import InstancePropsPage from '../InstancePropsPage/InstancePropsPage';
import TabPanel from '../TabPanel/TabPanel';
import { a11yProps } from '../TabPanel/TabPanel';
import { fetchNodeReadings } from "../NodeTree/treeSlice";

const getAllDsReadings = (id, dispatch) => {
  dispatch(fetchNodeReadings({ id, readingType: 'dsReadings' }));
  dispatch(fetchNodeReadings({ id, readingType: 'unusDsReadings' }));
  dispatch(fetchNodeReadings({ id, readingType: 'invDsReadings' }));
  dispatch(fetchNodeReadings({ id, readingType: 'norcDsReadings' }));
  dispatch(fetchNodeReadings({ id, readingType: 'ndMarkers' }));
  dispatch(fetchNodeReadings({ id, readingType: 'unusNdMarkers' }));
};

export default function DatastreamArea({ id }) {
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
          <Tab label="Graphs" {...a11yProps(1)} onClick={() => {getAllDsReadings(id, dispatch);}} />
          <Tab label="Alarm log" {...a11yProps(2)} />
        </Tabs>
      </Box>
      <TabPanel value={value} index={0}>
        <InstancePropsPage id={id} />
      </TabPanel>
      <TabPanel value={value} index={1}>
        <DsChartTab id={id} />
      </TabPanel>
      <TabPanel value={value} index={2}>
        <Typography variant='h3' sx={{ textAlign: "center" }}>Alarm log</Typography>
        <Container>Later</Container>
      </TabPanel>
    </Box>
  );
}
