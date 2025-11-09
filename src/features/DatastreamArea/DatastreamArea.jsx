import { useEffect, useState, useMemo } from 'react';
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
import { MIN_RESAMPLING_TIME, MAX_NUM_POINTS_ON_CHART } from '../../types';

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

// -----------------------------------------------------------------------
// hide state

export default function DatastreamArea({ id }) {

  const [tabIdx, setTabIdx] = useState(0);
  const [committedDtRange, setCommittedDtRange] = useState([0, 0]);

  const commitedQuantTime = useMemo(() =>
    getResamplingTime(committedDtRange[0], committedDtRange[1], MIN_RESAMPLING_TIME, MAX_NUM_POINTS_ON_CHART),
    [committedDtRange]
  );

  const handleChange = (event, newTabIdx) => {
    setTabIdx(newTabIdx);
  };

  const dispatch = useDispatch();
  useEffect(() => getAllDsReadings(id, dispatch), []);
  const { minTs, maxTs } = useSelector(getMinMaxTs);

  useEffect(() => {
    setCommittedDtRange([minTs, maxTs]);
  }, [minTs, maxTs]);

  const readingInfos = useSelector((state) => getReadingsFromRange(state, committedDtRange));

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
        <DsChartTab id={id} quantTime={commitedQuantTime} readingInfos={readingInfos} setDtRange={(dtRange) => { setCommittedDtRange(dtRange); }} />
      </TabPanel>
      <TabPanel value={tabIdx} index={2}>
        <Typography variant='h3' sx={{ textAlign: "center" }}>Alarm log</Typography>
        <Container>Later</Container>
      </TabPanel>
      <Box sx={{ display: "flex", justifyContent: "space-evenly" }}>
        <DatetimeRangeSlider commitedDtRange={committedDtRange} handleChangeCommitted={setCommittedDtRange} minTs={minTs} maxTs={maxTs} addStyles={{ width: '70%', p: 1 }} />
      </Box>
    </Box>
  );
}
