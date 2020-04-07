import React from 'react';
import Calendar from './Calendar';
import { render, cleanup } from '@testing-library/react';
import renderer from 'react-test-renderer';

afterEach(cleanup);

describe('Calendar', () => {
  it('renders without crashing', () => {
    render(<Calendar />);
  });

  it('matches snapshot', () => {
    const tree = renderer.create(<Calendar />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
