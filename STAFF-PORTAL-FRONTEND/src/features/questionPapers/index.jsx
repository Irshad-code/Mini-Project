import { lazy } from 'react';

// Lazy load the main component
const QuestionPapersFeature = lazy(() => import('./QuestionPapersFeature'));

export default QuestionPapersFeature;
