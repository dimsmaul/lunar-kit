import React from 'react';
import './global.css';
import { StatusBar } from 'expo-status-bar';
import Navigation from './Navigation';

export default function Main() {
  return (
    <>
      <Navigation />
      <StatusBar style="auto" />
    </>
  );
}
