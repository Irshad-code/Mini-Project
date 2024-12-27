import {
  dashboardFeatures,
  navigationItems,
} from '../../dashboard/dashboardData';

export const getNavigationItems = (currentFeature) => {
  return navigationItems[currentFeature] || [];
};

export const getFeatureTitle = (featureId) => {
  const feature = dashboardFeatures.find((f) => f.id === featureId);
  return feature?.title || 'Dashboard';
};
