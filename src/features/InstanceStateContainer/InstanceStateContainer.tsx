import styles from './InstanceStateContainer.module.css'


const statusColorClasses: any = {
    0: 'undefined',
    1: 'ok',
    2: 'warning',
    3: 'error'
}

const healthColorClasses: any = {
    0: 'health-undefined',
    1: 'health-ok',
    2: 'health-warning',
    3: 'health-error'
}


const StatusBox = (status: number, isStale?: boolean, addStyles?: React.CSSProperties) => {
    return (
        <div className={`${styles['status-box']} ${styles[statusColorClasses[status]]} ${isStale ? styles['stale'] : ''}`} style={addStyles}></div>)
}
const CurrStateBox = (currState: number, isStale?: boolean, addStyles?: React.CSSProperties) => {
    return (<div className={`${styles['curr-state-box']} ${styles[statusColorClasses[currState]]} ${isStale ? styles['stale'] : ''}`} style={addStyles}></div>)
}

const HealthBox = (health: number, isCatchingUp?: boolean, addStyles?: React.CSSProperties) => {
    return (<div className={`${styles['health-box']} ${styles[healthColorClasses[health]]} ${isCatchingUp ? styles['catching-up'] : ''}`} style={addStyles}></div>)
}

type StateContainerProps = {
    status?: number,
    isStatusStale?: boolean,
    currState?: number,
    isCurrStateStale?: boolean,
    health?: number,
    isCatchingUp?: boolean,
    addStyles?: React.CSSProperties
}


const InstanceStateContainer = (
    { status,
        isStatusStale,
        currState,
        isCurrStateStale,
        health,
        isCatchingUp,
        addStyles }: StateContainerProps) => {

    const indSizes = {
        status: { width: '16px', height: '16px' },
        currState: { width: '16px', height: '16px' },
        health: { borderTopWidth: '8px', borderLeftWidth: '16px', borderBottomWidth: '8px' }
    }

    const numOfElements = +(status != undefined) + +(currState != undefined) + +(health != undefined);
    let paddingRight = 0;
    if (addStyles?.paddingRight !== undefined) {
        paddingRight = parseInt(addStyles.paddingRight as string);
    }
    let overallWidth = numOfElements * 16 + paddingRight+ 'px';

    if (addStyles?.height !== undefined) {
        indSizes.status.height = addStyles.height as string;
        indSizes.currState.height = addStyles.height as string;
        indSizes.status.width = addStyles.height as string;
        indSizes.currState.width = addStyles.height as string;
        indSizes.health.borderLeftWidth = addStyles.height as string;
        const height = parseInt(addStyles.height as string);
        const healthHalfHeight = Math.round(height / 2) + 'px';
        indSizes.health.borderTopWidth = healthHalfHeight;
        indSizes.health.borderBottomWidth = healthHalfHeight;
        overallWidth = (Math.round(height * numOfElements * 1.1) + paddingRight) + 'px';
        addStyles = { ...addStyles, width: overallWidth };
    }

    return (<div className={`${styles['inst-state-container']}`} style={addStyles}>
        {status == null ? null : StatusBox(status, isStatusStale, indSizes.status)}
        {currState == null ? null : CurrStateBox(currState, isCurrStateStale, indSizes.currState)}
        {health == null ? null : HealthBox(health, isCatchingUp, indSizes.health)}
    </div>
    );
}

export default InstanceStateContainer;
