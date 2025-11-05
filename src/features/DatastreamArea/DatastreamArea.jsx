import { useEffect, useState } from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import { useSelector, useDispatch } from "react-redux";
import { createSelector } from '@reduxjs/toolkit';

import DsChartTab from './DsChartTab';
import InstancePropsPage from '../InstancePropsPage/InstancePropsPage';
import TabPanel from '../TabPanel/TabPanel';
import DatetimeRangeSlider from '../DateRangeSlider/DatetimeRangeSlider';
import { a11yProps } from '../TabPanel/TabPanel';
import { fetchNodeReadings } from "../NodeTree/treeSlice";
import { findMinMaxTsAmongManyReadingInfos } from '../../utils/helpers';
import { getResamplingTime } from '../../utils/resampling';

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

const getMinMaxTs = createSelector(
  [(state) => state.tree.selNodeReadings],
  (readingInfos) => findMinMaxTsAmongManyReadingInfos(readingInfos)
);

const getReadingsFromRange = createSelector(
  [(state) => state.tree.selNodeReadings, (state, range) => range],
  (readingInfos, range) => {
    const [startTs, endTs] = range;
    const newInfos = [];
    for (const info of readingInfos) {
      const newInfo = { ...info };
      newInfo.readings = {};
      for (const [tsStr, reading] of Object.entries(info.readings)) {
        if (reading.t >= startTs && reading.t <= endTs) {
          newInfo.readings[tsStr] = reading;
        }
      }
      newInfos.push(newInfo);
    }
    return newInfos;
  }
);

export default function DatastreamArea({ id }) {
  const [tabIdx, setTabIdx] = useState(0);
  const [quantTime, setQuantTime] = useState(0);
  const [dtRange, setDtRange] = useState([0, 0]);

  const handleChange = (event, newTabIdx) => {
    setTabIdx(newTabIdx);
  };

  const dispatch = useDispatch();
  useEffect(() => getAllDsReadings(id, dispatch), []);
  const { minTs, maxTs } = useSelector(getMinMaxTs);
  useEffect(() => setDtRange([minTs, maxTs]), [minTs, maxTs]);
  useEffect(() => setQuantTime(getResamplingTime(dtRange[0], dtRange[1], 1000, 100)), [dtRange]);
  const readingInfos = useSelector((state) => getReadingsFromRange(state, dtRange));

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={tabIdx} onChange={handleChange} aria-label="basic tabs example">
          <Tab label="Properties" {...a11yProps(0)} />
          <Tab label="Graphs" {...a11yProps(1)} />
          <Tab label="Alarm log" {...a11yProps(2)} />
        </Tabs>
      </Box>
      <TabPanel value={tabIdx} index={0}>
        <InstancePropsPage id={id} />
      </TabPanel>
      <TabPanel value={tabIdx} index={1}>
        <DsChartTab id={id} quantTime={quantTime} readingInfos={readingInfos} />
      </TabPanel>
      <TabPanel value={tabIdx} index={2}>
        <Typography variant='h3' sx={{ textAlign: "center" }}>Alarm log</Typography>
        <Container>Later</Container>
      </TabPanel>
      <Box sx={{ display: "flex", justifyContent: "space-evenly" }}>
        <DatetimeRangeSlider dtRange={dtRange} handleChange={setDtRange} minTs={minTs} maxTs={maxTs} quantTime={quantTime} addStyles={{ display: "flex", justifyContent: "center", minWidth: 200, width: '70%' }} />
        <Typography variant="h6" sx={{ display: "flex", justifyContent: "center" }}>Quant time, s: {quantTime / 1000}</Typography>
      </Box>

    </Box>
  );
}
