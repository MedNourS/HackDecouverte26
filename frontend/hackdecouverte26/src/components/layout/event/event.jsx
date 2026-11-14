import InstanceEvent from "./instance-event";
import BlockEvent from "./block-event";

export default function Event({ startTime, endTime, ...props }) {
    return startTime == endTime
        ? <InstanceEvent time={startTime} {...props}></InstanceEvent>
        : <BlockEvent startTime={startTime} endTime={endTime} {...props}></BlockEvent>;
}