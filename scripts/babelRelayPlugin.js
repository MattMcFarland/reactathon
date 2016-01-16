import getBabelRelayPlugin from 'babel-relay-plugin';

import schema from '../data/schema.json';

var plugin = getBabelRelayPlugin(schema);

return babel.transform(source)


export default getBabelRelayPlugin(schema.data);
