import { useState, useEffect } from 'react';

export function usePreview() {
  const data = [
    {
      path: '/preview/button',
      name: 'Button',
    },
    {
      path: '/preview/dialog',
      name: 'Dialog',
    },
    {
      path: '/preview/card',
      name: 'Card',
    },
    {
      path: '/preview/bottom',
      name: 'Bottom Sheet',
    },
    {
      path: '/preview/checkbox',
      name: 'Checkbox',
    },
    {
      path: '/preview/avatar',
      name: 'Avatar',
    },
    {
      path: '/preview/select',
      name: 'Select',
    },
    {
      path: '/preview/calendar',
      name: 'Calendar',
    },
    {
      path: '/preview/date-picker',
      name: 'Date Picker',
    },
    {
      path: '/preview/date-range-picker',
      name: 'Date Range Picker',
    },
    {
      path: '/preview/tabs',
      name: 'Tabs',
    },
  ]

  const sortedData = data.sort((a, b) => a.name.localeCompare(b.name));

  return {  sortedData };
}
