#!/usr/bin/env babel-node --optional es7.asyncFunctions

import fs from 'fs';
import path from 'path';
import {graphql} from 'graphql';
import {introspectionQuery, printSchema} from 'graphql/utilities';

import Schema from '../server/src/schema';

(async () => {
	var result = await (graphql(Schema, introspectionQuery));
	if (result.errors) {
		console.error(
			'ERROR introspecting schema: ',
			JSON.stringify(result.errors, null, 2)
		);
	} else {
		fs.writeFileSync(
			path.join(__dirname, '../data/schema.json'),
			JSON.stringify(result, null, 2)
		);
	}
})();

fs.writeFileSync(
	path.join(__dirname, '../data/schema.graphql'),
	printSchema(Schema)
);
