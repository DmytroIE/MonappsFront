import { NodeRendererProps } from "react-arborist";
import Box from '@mui/material/Box';

import styles from './Node.module.css'

import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';

import InstanceStateContainer from '../InstanceStateContainer/InstanceStateContainer';
import InstanceIcon from '../InstanceIcon/InstanceIcon';


const Node = ({ node, style, dragHandle, tree }: NodeRendererProps<any>) => {
    const type = node.data.id.split(' ')[0];
    return (

        <div style={style}
            ref={dragHandle}
            className={`${styles['node-container']} ${node.isSelected ? styles['node-selected'] : ''}`}
            onKeyDown={(e) => {
                if (e.key === "Enter") node.select();
            }}
        >
            <span className={`${styles['node-arrow']}`} onClick={() => node.isInternal && node.toggle()} >
                {!node.isLeaf ? (node.isOpen ? <ArrowDropDownIcon /> : <ArrowRightIcon />
                ) : (<Box sx={{ width: '24px', height: '24px' }} />)}
            </span>
            <div className={`${styles['node-content']} ${node.data.isEnabled === false ? styles['node-disabled'] : ''} ${styles[`node-content-${type}`]}`}>
                <InstanceIcon type={type} addStyles={{ marginRight: '5px', width: '25px', height: '25px' }} />
                <span className={`${styles['node-text']}`}>
                    {node.data.name}
                </span>
                <InstanceStateContainer {...node.data} addStyles={{ paddingRight: '5px', height: '16px' }} />
            </div>
        </div>
    );
};

export default Node;
