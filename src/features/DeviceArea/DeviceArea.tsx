import * as React from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import InstancePropsPage from '../InstancePropsPage/InstancePropsPage';
import TabPanel from '../TabPanel/TabPanel';
import { a11yProps } from '../TabPanel/TabPanel';


export default function DeviceArea({ id }: { id: string }) {
  const [value, setValue] = React.useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
          <Tab label="Properties" {...a11yProps(0)} />
          <Tab label="Alarm Log" {...a11yProps(1)} />
        </Tabs>
      </Box>
      <TabPanel value={value} index={0}>
        <InstancePropsPage id={id} />
      </TabPanel>
      <TabPanel value={value} index={1}>
        <Typography variant='h3' sx={{ textAlign: "center" }}>Alarm log</Typography>
        <Container>Later</Container>
      </TabPanel>
    </Box>
  );
}