import React from 'react';
import CalendarItem from './CalendarItem';
import { render, cleanup, fireEvent } from '@testing-library/react';
import { DateTime } from 'luxon';
import renderer from 'react-test-renderer';

afterEach(cleanup);

const props = {
  dayObject: DateTime.local(),
  isAvailable: false,
  onClick: jest.fn(),
  isActive: false,
};

describe('CalendarItem', () => {
  it('renders without crashing', () => {
    render(<CalendarItem {...props} />);
  });

  it('matches snapshot', () => {
    const tree = renderer.create(<CalendarItem {...props} />).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('was clicked', (done) => {
    props.onClick = done;
    const { getByTestId } = render(<CalendarItem {...props} />);
    const calendarItem = getByTestId('calendar-item');
    fireEvent.click(calendarItem);
  });

  it('has available class', () => {
    props.isAvailable = true;
    const { getByTestId } = render(<CalendarItem {...props} />);
    const calendarItem = getByTestId('calendar-item');
    expect(calendarItem).toHaveClass('Calendar__item--available');
  });

  it('has active class', () => {
    props.isActive = true;
    const { getByTestId } = render(<CalendarItem {...props} />);
    const calendarItem = getByTestId('calendar-item');
    expect(calendarItem).toHaveClass('Calendar__item--active');
  });

  it('shows correct day', () => {
    const { getByTestId } = render(<CalendarItem {...props} />);
    const calendarDay = getByTestId('calendar-day');
    expect(calendarDay).toHaveTextContent(props.dayObject.weekdayShort);
  });

  it('shows correct date sufix', () => {
    const { day } = props.dayObject;
    const dayLength = day.toString().length;
    const lastDayChar = day.toString()[dayLength - 1];

    let dateSufix;

    switch (lastDayChar) {
      case '1':
        dateSufix = 'st';
        break;
      case '2':
        dateSufix = 'nd';
        break;
      case '3':
        dateSufix = 'rd';
        break;
      default:
        dateSufix = 'th';
        break;
    }

    const { getByTestId } = render(<CalendarItem {...props} />);
    const dateSufixNode = getByTestId('date-sufix');
    expect(dateSufixNode).toHaveTextContent(dateSufix);
  });
});
