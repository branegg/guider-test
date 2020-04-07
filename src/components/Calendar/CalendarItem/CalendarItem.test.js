import React from 'react';
import CalendarItem from './CalendarItem';
import { render, cleanup } from '@testing-library/react';
import { DateTime } from 'luxon';
import renderer from 'react-test-renderer';

afterEach(cleanup);

const props = {
  dayObject: DateTime.local(),
  isAvailable: true,
  onClick: jest.fn(),
  isActive: true,
};

describe('CalendarItem', () => {
  it('renders without crashing', () => {
    render(<CalendarItem {...props} />);
  });

  it('matches snapshot', () => {
    const tree = renderer.create(<CalendarItem {...props} />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
