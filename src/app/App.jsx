/**
 * Main Application Component
 * Initializes the React Router Provider.
 */

import React from 'react';
import { RouterProvider } from 'react-router-dom';
import { router } from './router.jsx';

export const App = () => {
  return <RouterProvider router={router} />;
};

export default App;
