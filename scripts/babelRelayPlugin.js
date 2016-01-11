import getBabelRelayPlugin from "babel-relay-plugin";

import schema from "../data/schema.json";

export default getBabelRelayPlugin(schema.data);
