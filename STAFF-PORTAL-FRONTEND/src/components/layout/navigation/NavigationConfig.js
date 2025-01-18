import {
  FiUser,
  FiDollarSign,
  FiCalendar,
  FiBook,
  FiFileText,
  FiClock,
  FiGrid,
  FiBookOpen,
  FiCheckSquare,
  FiClipboard,
  FiPieChart,
} from "react-icons/fi";

const dashboardFeatures = [
  {
    name: "Staff Information",
    icon: FiUser,
    section: "staff-info",
  },
  {
    name: "My Classes",
    icon: FiBookOpen,
    section: "my-classes",
  },
  {
    name: "Tax Management",
    icon: FiDollarSign,
    section: "tax",
  },
  {
    name: "Leave Management",
    icon: FiCalendar,
    section: "leave",
  },
  {
    name: "Payroll",
    icon: FiDollarSign,
    section: "payroll",
  },
];

export const getNavigationItems = (feature, userRole = 'REGULAR_USER') => {
  if (feature === 'dashboard') {
    // Filter dashboard items based on user role
    if (userRole === 'REGULAR_USER') {
      return dashboardFeatures.filter(item => 
        ['staff-info', 'my-classes'].includes(item.section)
      );
    }
    return dashboardFeatures; // SUPER_USER gets all features
  }

  const featureItems = {
    'staff-info': [
      { name: "Personal Information", icon: FiUser, section: "personal" },
      { name: "Academic Details", icon: FiBook, section: "academic" },
      { name: "Research Activities", icon: FiFileText, section: "research" },
      { name: "Employer Details", icon: FiGrid, section: "employer" },
      { name: "Service Details", icon: FiClock, section: "service" },
      { name: "Biodata", icon: FiFileText, section: "biodata" },
    ],
    'my-classes': [
      { name: "Current Classes", icon: FiBook, section: "current-classes" },
      { name: "Archived Classes", icon: FiFileText, section: "archived-classes" },
    ],
    'tax': [
      { name: "Calculator", icon: FiPieChart, section: "tax-calculator" },
      { name: "Tax Declarations", icon: FiFileText, section: "tax-declarations" },
      { name: "Tax Documents", icon: FiClipboard, section: "tax-documents" },
      { name: "History", icon: FiClock, section: "tax-history" },
    ],
  };

  return featureItems[feature] || [];
};

export const getFeatureTitle = (feature) => {
  switch (feature) {
    case 'dashboard':
      return 'Dashboard';
    case 'staff-info':
      return 'Staff Information';
    case 'my-classes':
      return 'My Classes';
    case 'tax':
      return 'Tax Management';
    case 'leave':
      return 'Leave Management';
    case 'payroll':
      return 'Payroll';
    default:
      return '';
  }
};
