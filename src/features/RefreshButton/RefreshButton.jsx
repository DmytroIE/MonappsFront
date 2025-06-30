import RefreshIcon from '@mui/icons-material/Refresh';
import { IconButton } from '@mui/material';
import { useDispatch, useSelector, action } from "react-redux";



const RefreshButton = ({ action, size, addStyles }) => {

    const dispatch = useDispatch();

    return (
        <IconButton size={size} onClick={() => dispatch(action)} sx={addStyles}>
            <RefreshIcon />
        </IconButton>
    );
}


export default RefreshButton;