import React from 'react';
import { Alert } from './Elements';

const ErrorItem = ({msg}) => (
  <div>{msg}</div>
);


export const FormErrors = ({
  message,
  data
  }) => (
  <Alert kind="danger">
    {message}
    {data.map((item, i) =>
      <ErrorItem key={i} msg={item.error}/>)}
  </Alert>
);
