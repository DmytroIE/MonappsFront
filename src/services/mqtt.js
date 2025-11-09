import mqtt from 'mqtt';
import { updateNode } from "../features/NodeTree/treeSlice";

const URL = 'ws://127.0.0.1:8084/mqtt';

let client = null;

const createMqttClient = (dispatch) => {

    if (client instanceof mqtt.MqttClient) {
        return client;
    }
    client = mqtt.connect(URL, {
        protocolVersion: 5,
        clean: true,
        properties: {
            sessionExpiryInterval: 300 // 300 seconds
        }
    })

    // First 2 seconds the client reads but doesn't push data further to the store
    // It's needed for retain "state MQTT" messages
    // published by the backend app
    // These messages may contain obsolete data that may replace
    // the freshest data already brought by the initial HTTP
    // request. That's why we supress propagating for 2 seconds
    client.notAllowedToPushData = true;
    setTimeout(() => {
        client.notAllowedToPushData = false;
        console.log("allowed to push data");
    }, 2000);

    client.on('connect', () => {
        console.log('Connected to MQTT broker');
        client.subscribe("procdata/#", { qos: 0 }, (error, granted) => {
            if (error) {
                console.log(error);
            } else {
                if (Array.isArray(granted) && granted.length > 0) {
                    console.log(`${granted[0].topic} was subscribed`);
                }
            }
        })
    })

    client.on('close', () => {
        console.log('Connection closed');
    })

    client.on('message', (topic, message, packet) => {
        if (client.notAllowedToPushData) {
            return;
        }
        try {
            const msg_obj = JSON.parse(message.toString());
            console.log('A message received from MQTT');
            console.log(msg_obj);
            dispatch(updateNode(msg_obj));
        } catch (error) {
            console.log(error);
        }

        message.toString()
    })

    return client;
}

export { createMqttClient };
