import { useState, useEffect } from 'react';

export function usePreview() {

  const [search, setSearch] = useState('');

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
      path: '/preview/accordion',
      name: 'Accordion',
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
    {
      path: '/preview/form',
      name: 'Form',
    },
  ]

  const sortedData = data.sort((a, b) => a.name.localeCompare(b.name));

  const filteredData = sortedData.filter(item => 
    item.name.toLowerCase().includes(search.toLowerCase())
  );

  return { filteredData, search, setSearch };
}
