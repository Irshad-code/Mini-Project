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
  FiArchive,
  FiBookmark,
  FiPieChart,
} from "react-icons/fi";

export const dashboardFeatures = [
  {
    id: "staff-info",
    title: "Staff Information",
    description: "Manage your personal and professional details",
    icon: FiUser,
    sections: [
      "personal",
      "academic",
      "research",
      "employer",
      "service",
      "biodata",
    ],
  },
  {
    id: "my-classes",
    title: "My Classes",
    description: "View and manage your current and archived classes",
    icon: FiBookOpen,
    sections: ["current", "archived"],
  },
  {
    id: "tax",
    title: "Tax Management",
    description: "Handle your tax calculations, declarations and documents",
    icon: FiDollarSign,
    sections: ["calculator", "declarations", "documents", "history"],
  },
  {
    id: "leave",
    title: "Leave Management",
    description: "Apply and track your leave requests",
    icon: FiCalendar,
    sections: ["apply", "history"],
  },
  {
    id: "payroll",
    title: "Payroll",
    description: "Access your salary statements and payroll details",
    icon: FiDollarSign,
    sections: ["statements", "details"],
  },
];

export const navigationItems = {
  "staff-info": [
    { name: "Personal Information", icon: FiUser, section: "personal" },
    { name: "Academic Details", icon: FiBook, section: "academic" },
    { name: "Research Activities", icon: FiFileText, section: "research" },
    { name: "Employer Details", icon: FiGrid, section: "employer" },
    { name: "Service Details", icon: FiClock, section: "service" },
    { name: "Biodata", icon: FiFileText, section: "biodata" },
  ],
  "my-classes": [
    { name: "Current Classes", icon: FiBookOpen, section: "current" },
    { name: "Archived Classes", icon: FiArchive, section: "archived" },
  ],
  tax: [
    { name: "Tax Calculator", icon: FiPieChart, section: "calculator" },
    { name: "Tax Declarations", icon: FiFileText, section: "declarations" },
    { name: "Tax Documents", icon: FiClipboard, section: "documents" },
    { name: "History", icon: FiClock, section: "history" },
  ],
  leave: [
    { name: "Apply Leave", icon: FiCalendar, section: "apply" },
    { name: "Leave History", icon: FiClock, section: "history" },
  ],
  payroll: [
    { name: "Salary Statements", icon: FiDollarSign, section: "statements" },
    { name: "Payroll Details", icon: FiGrid, section: "details" },
  ],
};
