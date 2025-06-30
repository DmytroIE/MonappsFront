import Box from '@mui/material/Box';
import ContentArea from './features/ContentArea/ContentArea';
import Navbar from './features/Navbar/Navbar';
import SideBar from './features/SideBar/SideBar';


function App() {
  return (
    <div className="App" style={{ height: "100vh", display: "flex", flexDirection: "column" }}>
      <Navbar addStyles={{ flexGrow: 0 }}/>
      <Box component="div" sx={{ display: 'flex', flexGrow: 1 }}>
        <SideBar addStyles={{ width: 400, padding: 1, flex: 'none' }}/>
        <Box component="main" sx={{ flex: 'auto' }}>
          <ContentArea />
        </Box>
      </Box>

    </div>
  );
}

export default App;
