import React from 'react';
import Calendar from './Calendar';
import { render, cleanup, screen, act, fireEvent } from '@testing-library/react';
import renderer from 'react-test-renderer';
import { DateTime } from 'luxon';
import axiosMock from 'axios';

jest.mock('axios');

const mockResponse = [
  {
    date: DateTime.local().toFormat('dd/MM/yyyy'),
    availableSlots: [
      { startTime: '09:00', endTime: '10:00' },
      { startTime: '10:00', endTime: '11:00' },
    ],
  },
  {
    date: DateTime.local().plus({ days: 1 }).toFormat('dd/MM/yyyy'),
    availableSlots: [
      { startTime: '13:00', endTime: '14:00' },
      { startTime: '15:00', endTime: '16:00' },
      { startTime: '16:00', endTime: '17:00' },
    ],
  },
];

beforeEach(() => {
  axiosMock.get.mockResolvedValueOnce({
    data: mockResponse,
  });
});

afterEach(cleanup);

describe('Calendar', () => {
  it('renders without crashing', async () => {
    await act(async () => render(<Calendar />));
  });

  it('matches snapshot', async () => {
    const tree = await renderer.act(async () => await renderer.create(<Calendar />).toJSON());
    await expect(tree).toMatchSnapshot();
  });

  it('renders full week', async () => {
    await act(async () => render(<Calendar />));
    const calendarWrapper = screen.getByTestId('calendar-wrapper');
    expect(calendarWrapper.children.length).toBe(7);
  });

  it('renders available dates', async () => {
    await act(async () => render(<Calendar />));
    const availableDates = screen
      .getAllByTestId('calendar-item')
      .filter((item) => item.classList.contains('Calendar__item--available'));

    expect(availableDates.length).toBe(2);
  });

  it('handles date clicks', async () => {
    await act(async () => render(<Calendar />));
    const availableDates = screen
      .getAllByTestId('calendar-item')
      .filter((item) => item.classList.contains('Calendar__item--available'));

    const checkActiveHours = () => {
      const calendarHours = screen.getAllByTestId('calendar-hour');
      const activeHours = calendarHours.filter((hour) => hour.classList.contains('Calendar__hour--active'));
      return activeHours.length;
    };

    expect(checkActiveHours()).toBe(0);

    fireEvent.click(availableDates[0]);

    const activeDate = screen
      .getAllByTestId('calendar-item')
      .filter((item) => item.classList.contains('Calendar__item--active'));

    expect(activeDate.length).toBe(1);
    expect(checkActiveHours()).toBe(2);

    fireEvent.click(availableDates[1]);

    expect(activeDate.length).toBe(1);
    expect(checkActiveHours()).toBe(3);
  });
});
