import { lazy } from 'react';

// Lazy load the main component
const TaxManagementFeature = lazy(() => import('./TaxManagementFeature'));

export default TaxManagementFeature;
