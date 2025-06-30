import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import InstanceStateContainer from '../InstanceStateContainer/InstanceStateContainer';
import InstanceIcon from '../InstanceIcon/InstanceIcon';

import styles from './Instance.module.css';

type AppProps = {
    data: any | null | undefined,
    addStyles?: React.CSSProperties,
    small?: boolean
}

const Instance = ({ data, addStyles, small }: AppProps) => {

    let iconStyles = { marginRight: '5px', width: '25px', height: '25px' };
    let stateContStyles = { paddingRight: '5px', height: '20px' };
    let nameSize: 'h6' | 'body1' = 'h6'
    if (small) {
        iconStyles = { marginRight: '5px', width: '25px', height: '25px' };
        stateContStyles = { paddingRight: '5px', height: '16px' };
        nameSize = 'body1'
    }

    const type = data.id.split(' ')[0];
    return (
        <Box className={styles['inst-container']} sx={addStyles}>
            <Box className={styles['inst-header']}>
                <Box className={styles['inst-header-title']}>
                    <InstanceIcon type={type} addStyles={iconStyles}/>
                    <Typography variant={nameSize}>{data.name}</Typography>
                </Box>
                <InstanceStateContainer {...data} addStyles={stateContStyles}/>
            </Box>
            <Box className={styles['inst-content']}>
                <pre>
                    {JSON.stringify(data, null, 2)}
                </pre>
            </Box>
        </Box>
    );

}

export default Instance;
