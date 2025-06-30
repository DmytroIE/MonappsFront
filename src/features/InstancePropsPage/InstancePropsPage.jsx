import Typography from '@mui/material/Typography';
import { useSelector } from "react-redux";

import Instance from '../Instance/Instance';
import ChildrenContainer from '../ChildrenContainer/ChildrenContainer';


const InstancePropsPage = ({ id }) => {

    const data = useSelector((state) => state.tree.nodes[id]);

    return (
        <>
            {(data !== undefined) ?
                (<>
                    <Instance data={data} addStyles={{ marginBottom: '15px' }} />
                    <ChildrenContainer id={id} />
                </>)
                : (<Typography variant='h3' sx={{ textAlign: "center" }}>No data or data is corrupted</Typography>)}
        </>
    );
}

export default InstancePropsPage;
