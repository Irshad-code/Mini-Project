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

const dashboardItems = [
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

const staffInfoItems = [
  {
    name: "Personal Information",
    icon: FiUser,
    section: "personal",
  },
  {
    name: "Academic Details",
    icon: FiBook,
    section: "academic",
  },
  {
    name: "Research Activities",
    icon: FiFileText,
    section: "research",
  },
  {
    name: "Employer Details",
    icon: FiGrid,
    section: "employer",
  },
  {
    name: "Service Details",
    icon: FiClock,
    section: "service",
  },
  {
    name: "Biodata",
    icon: FiFileText,
    section: "biodata",
  },
];

const myClassesItems = [
  {
    name: "Current Classes",
    icon: FiBook,
    section: "current-classes",
  },
  {
    name: "Archived Classes",
    icon: FiFileText,
    section: "archived-classes",
  },
];

const taxItems = [
  {
    name: "Calculator",
    icon: FiPieChart,
    section: "tax-calculator",
  },
  {
    name: "Tax Declarations",
    icon: FiFileText,
    section: "tax-declarations",
  },
  {
    name: "Tax Documents",
    icon: FiClipboard,
    section: "tax-documents",
  },
  {
    name: "History",
    icon: FiCalendar,
    section: "tax-history",
  },
];

export function getNavigationItems(feature) {
  switch (feature) {
    case "dashboard":
      return dashboardItems;
    case "staff-info":
      return staffInfoItems;
    case "my-classes":
      return myClassesItems;
    case "tax":
      return taxItems;
    default:
      return dashboardItems;
  }
}

export function getFeatureTitle(feature) {
  switch (feature) {
    case "dashboard":
      return "Dashboard";
    case "staff-info":
      return "Staff Information";
    case "my-classes":
      return "My Classes";
    case "tax":
      return "Tax Management";
    default:
      return "Dashboard";
  }
}
