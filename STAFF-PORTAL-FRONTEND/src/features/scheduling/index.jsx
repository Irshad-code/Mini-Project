import { lazy } from 'react';

// Lazy load the main component
const SchedulingFeature = lazy(() => import('./SchedulingFeature'));

export default SchedulingFeature;
