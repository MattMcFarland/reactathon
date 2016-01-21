import React from 'react';
import { ResetRequestForm } from '../components';
export const ResetRequest = () => (
  <section>
    <div
      style={{
        maxWidth: '440px',
        padding: '8px',
        background: 'white',
        margin: '1em auto 2em auto',
        borderRadius: '2px',
        boxShadow: '0 3px 10px rgba(0, 0, 0, 0.16), ' +
         '0 3px 10px rgba(0, 0, 0, 0.23)'
        }}>
      <ResetRequestForm />
    </div>
  </section>
);

