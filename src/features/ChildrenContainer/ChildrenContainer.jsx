import Box from '@mui/material/Box';

import { useSelector } from "react-redux";

import Instance from '../Instance/Instance';

import styles from './ChildrenContainer.module.css';


const ChildrenContainer = ({ id, addStyles }) => {

    const nodes = useSelector((state) => state.tree.nodes);

    const children = Object.values(nodes).filter((item) => item.parentId === id);

    if (children.length > 0) {
        return (
            <Box className={`${styles['children-container']}`} sx={addStyles}>
                {children.map((child) => (
                    <Instance data={child} key={child.id} addStyles={{ marginBottom: '10px' }} small={true} />
                ))}
            </Box>
        );
    }
    else {
        return null;
    }
}

export default ChildrenContainer;
