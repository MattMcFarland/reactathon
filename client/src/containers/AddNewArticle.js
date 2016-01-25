import React from 'react';
import { AddNewArticleForm } from '../components';
export const AddNewArticle = () => (
  <section>
    <div
      style={{
        maxWidth: '788px',
        padding: '8px',
        background: 'white',
        margin: '1em auto 2em auto',
        borderRadius: '2px',
        boxShadow: '0 3px 10px rgba(0, 0, 0, 0.16), ' +
         '0 3px 10px rgba(0, 0, 0, 0.23)'
        }}>
      <AddNewArticleForm />
    </div>
  </section>
);

