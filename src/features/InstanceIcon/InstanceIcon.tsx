import DataThresholdingOutlinedIcon from '@mui/icons-material/DataThresholdingOutlined'; // df
import DataExplorationOutlinedIcon from '@mui/icons-material/DataExplorationOutlined'; // ds
import CellTowerOutlinedIcon from '@mui/icons-material/CellTowerOutlined'; // dev
// import AreaChartOutlinedIcon from '@mui/icons-material/AreaChartOutlined'; // app - alternative
import TerminalOutlinedIcon from '@mui/icons-material/TerminalOutlined'; // app
import SettingsApplicationsOutlinedIcon from '@mui/icons-material/SettingsApplicationsOutlined'; // asset

import styles from './InstanceIcon.module.css'
import { ReactElement } from "react";

type AssetType = 'asset' | 'application' | 'device' | 'datastream' | 'datafeed';

const iconMap: any = {
    'asset': <SettingsApplicationsOutlinedIcon fontSize="small" />,
    'application': <TerminalOutlinedIcon fontSize="small" />,
    'device': <CellTowerOutlinedIcon fontSize="small" />,
    'datastream': <DataExplorationOutlinedIcon fontSize="small" />,
    'datafeed': <DataThresholdingOutlinedIcon fontSize="small" />
}

const giveIconByType = (type: any): ReactElement | undefined => {
    let icon;
    if (typeof type === 'string') {
        icon = iconMap[type];
    }
    return icon;
}

type InstanceIconProps = {
    type: AssetType,
    addStyles?: React.CSSProperties
}

const InstanceIcon = ({ type, addStyles }: InstanceIconProps) => {
    return (
        <div className={`${styles['icon-box']}`} style={addStyles}>
            {giveIconByType(type)}
        </div>
    )
}

export default InstanceIcon;