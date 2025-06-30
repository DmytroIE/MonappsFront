import { useSelector } from 'react-redux';
import AssetArea from '../AssetArea/AssetArea';
import ApplicationArea from '../ApplicationArea/ApplicationArea';
import DeviceArea from '../DeviceArea/DeviceArea';
import DatafeedArea from '../DatafeedArea/DatafeedArea';
import DatastreamArea from '../DatastreamArea/DatastreamArea';


const NodeObjectTypes = {
    APP: 'application',
    ASSET: 'asset',
    DF: 'datafeed',
    DS: 'datastream',
    DEV: 'device'
};

const ContentArea = () => {
    const selNodeId = useSelector((state) => state.tree.selNodeId)

    if (selNodeId === null) {
        return (<p>Initial</p>);
    }
    else {
        const type = selNodeId.split(' ')[0];
        switch (type) {
            case (NodeObjectTypes.APP):
                return <ApplicationArea id={selNodeId} key={selNodeId} />
            case (NodeObjectTypes.ASSET):
                return <AssetArea id={selNodeId} key={selNodeId} />
            case (NodeObjectTypes.DEV):
                return <DeviceArea id={selNodeId} key={selNodeId} />
            case (NodeObjectTypes.DF):
                return <DatafeedArea id={selNodeId} key={selNodeId} />
            case (NodeObjectTypes.DS):
                return <DatastreamArea id={selNodeId} key={selNodeId} />
            default:
                return <p>Unknown type :(</p>
        }
    }
}

export default ContentArea;
