import { useEffect, useState, useMemo } from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { useSelector, useDispatch } from "react-redux";
import { createSelector } from '@reduxjs/toolkit';

import DfChartTab from './DfChartTab';

import InstancePropsPage from '../InstancePropsPage/InstancePropsPage';
import TabPanel from '../TabPanel/TabPanel';
import { a11yProps } from '../TabPanel/TabPanel';

import DatetimeRangeSlider from '../DateRangeSlider/DatetimeRangeSlider';
import { fetchNodeReadings } from "../NodeTree/treeSlice";
import { getMinMaxTsFromInfoBatch, getReadingsFromDtRange } from '../../utils/helpers';
import { getResamplingTime } from '../../utils/resampling';
import { MAX_NUM_POINTS_ON_CHART } from '../../types';


const getAllDfReadings = (id, dispatch) => {
  dispatch(fetchNodeReadings({
    items: [
      { id, readingType: 'dfReadings' },
    ]
  }));
}

const getMinMaxTs = createSelector(
  [(state) => state.tree.selNodeReadings],
  (readingInfos) => getMinMaxTsFromInfoBatch(readingInfos)
);

const getReadingsFromRange = createSelector(
  [(state) => state.tree.selNodeReadings, (state, dtRange) => dtRange],
  (readingInfos, dtRange) => getReadingsFromDtRange(readingInfos, dtRange)
);


const DatafeedArea = ({ id }) => {
  const [tabIdx, setTabIdx] = useState(0);
  const [committedDtRange, setCommittedDtRange] = useState([0, 0]);

  const nodeData = useSelector((state) => state.tree.nodes[id]);

  const commitedTimeResample = useMemo(() =>
    getResamplingTime(committedDtRange[0], committedDtRange[1], nodeData.timeResample, MAX_NUM_POINTS_ON_CHART),
    [committedDtRange]
  );

  const handleTabChange = (event, newTabIdx) => {
    setTabIdx(newTabIdx);
  };

  const dispatch = useDispatch();
  useEffect(() => getAllDfReadings(id, dispatch), []);
  const { minTs, maxTs } = useSelector(getMinMaxTs);

  useEffect(() => {
    setCommittedDtRange([minTs, maxTs]);
  }, [minTs, maxTs]);

  const readingInfos = useSelector((state) => getReadingsFromRange(state, committedDtRange));

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={tabIdx} onChange={handleTabChange} aria-label="basic tabs example">
          <Tab label="Properties" {...a11yProps(0)} />
          <Tab label="Graphs" {...a11yProps(1)} />
        </Tabs>
      </Box>
      <TabPanel value={tabIdx} index={0}>
        <InstancePropsPage id={id} />
      </TabPanel>
      <TabPanel value={tabIdx} index={1}>
        <DfChartTab
          id={id}
          timeResample={commitedTimeResample}
          readingInfo={readingInfos[0]} />
      </TabPanel>
      <Box sx={{ display: "flex", justifyContent: "space-evenly" }}>
        <DatetimeRangeSlider
          commitedDtRange={committedDtRange}
          handleChangeCommitted={setCommittedDtRange}
          minTs={minTs}
          maxTs={maxTs}
          step={nodeData.timeResample}
          addStyles={{ width: '70%', p: 1 }} />
        <Typography variant='h6'>{commitedTimeResample / 1000} s</Typography>
      </Box>
    </Box>
  );
}

export default DatafeedArea;