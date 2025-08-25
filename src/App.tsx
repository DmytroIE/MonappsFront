import { useEffect, useState } from 'react';

import Box from '@mui/material/Box';
import ContentArea from './features/ContentArea/ContentArea';
import Navbar from './features/Navbar/Navbar';
import SideBar from './features/SideBar/SideBar';

import "./style.css"

function App() {
  const [nav, setNav] = useState(false);

  useEffect(() => {
    console.log(' v navnavnavnav==>', nav)
  }, [nav])

  return (
    <div className="App">
      <Navbar addStyles={{ flexGrow: 0 }} data={{ setNav }} />
      <Box component="div" className='body-section' sx={{ display: 'flex', flexGrow: 1, overflow: 'hidden' }}>
        <div
          className={`side-bar ${nav ? '' : "width-100"}`}
        >
          <SideBar addStyles={{ width: "100%", padding: 1 }} />
        </div>
        <Box component="main" sx={{ flex: '1', overflowX: 'auto' }}>
          <ContentArea />
        </Box>
      </Box>

    </div>
  );
}

export default App;
