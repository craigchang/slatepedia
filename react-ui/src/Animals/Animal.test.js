import React from 'react';
import ReactDOM from 'react-dom';
import Animal from './Animal';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<Animal />, div);
});
