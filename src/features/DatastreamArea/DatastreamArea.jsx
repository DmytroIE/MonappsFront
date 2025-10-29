import { useEffect, useState } from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import { useSelector, useDispatch } from "react-redux";

import DsChartTab from './DsChartTab';
import InstancePropsPage from '../InstancePropsPage/InstancePropsPage';
import TabPanel from '../TabPanel/TabPanel';
import DatetimeRangeSlider from '../DateRangeSlider/DatetimeRangeSlider';
import { a11yProps } from '../TabPanel/TabPanel';
import { fetchNodeReadings } from "../NodeTree/treeSlice";
import {findMinMaxTsAmongManyReadingInfos} from '../../utils/helpers';

const getAllDsReadings = (id, dispatch) => {
  dispatch(fetchNodeReadings({
    items: [
      { id, readingType: 'dsReadings' },
      { id, readingType: 'unusDsReadings' },
      { id, readingType: 'invDsReadings' },
      { id, readingType: 'norcDsReadings' },
      { id, readingType: 'ndMarkers' },
      { id, readingType: 'unusNdMarkers' }]
  }));
}

export default function DatastreamArea({ id }) {
  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  useEffect(() => {
    console.log('DatastreamArea', id);
  }, []);

  const dispatch = useDispatch();

  const readingInfos = useSelector((state) => state.tree.selNodeReadings);
  const { minTs, maxTs } = findMinMaxTsAmongManyReadingInfos(readingInfos);

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
          <Tab label="Properties" {...a11yProps(0)} />
          <Tab label="Graphs" {...a11yProps(1)} onClick={() => { getAllDsReadings(id, dispatch); }} />
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
      <DatetimeRangeSlider addStyles={{ display: "flex", justifyContent: "center" }} minTs={minTs} maxTs={maxTs}/>
    </Box>
  );
}
