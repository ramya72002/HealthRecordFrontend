import { Icon } from '@iconify/react';
import { uniqueId } from 'lodash';

export interface ChildItem {
  id?: number | string;
  name?: string;
  icon?: any;
  children?: ChildItem[];
  item?: any;
  url?: any;
  color?: string;
}

export interface MenuItem {
  heading?: string;
  name?: string;
  icon?: any;
  id?: number;
  to?: string;
  items?: MenuItem[];
  children?: ChildItem[];
  url?: any;
}

const SidebarContent: MenuItem[] = [
  {
    heading: "Dashboards",
    children: [
      {
        name: "Dashboard",
        icon: "solar:chart-line-duotone",  // More suitable for dashboard
        id: uniqueId(),
        url: "/dashboard",
      },
    ],
  },
  {
    heading: "Utilities",
    children: [
      {
        name: "Health Records",
        icon: "solar:heart-linear",  // Represents health records
        id: uniqueId(),
        children: [
          {
            name: "Upload Records",
            icon: "solar:cloud-upload-outline",  // Upload icon
            id: uniqueId(),
            url: "/ui/uploadehr",
          },
          {
            name: "View Records",
            icon: "solar:document-linear",  // Document icon for viewing
            id: uniqueId(),
            url: "/ui/getehr",
          },
          {
            name: "Send Records",
            icon: "solar:share-linear",//sendng icon
            id: uniqueId(),
            url: "/ui/sendehr",
          },
        ],
      },
      {
        name: "Medications",
        icon: "solar:pill-linear",  // Represents medications
        id: uniqueId(),
        children: [
          {
            name: "Add Medication",
            icon: "solar:document-linear",
            id: uniqueId(),
            url: "/ui/addmedications",
          },
          {
            name: "View Medication",
            icon: "solar:eye-linear",  // Eye icon for viewing
            id: uniqueId(),
            url: "/ui/viewmedications",
          },
          {
            name: "Calendar View",
            icon: "solar:calendar-linear",  // Calendar view icon
            id: uniqueId(),
            url: "/ui/calendarmedications",
          },
        ],
      },
    ],
  },
  {
    heading: "Auth",
    children: [
      {
        name: "Login",
        icon: "solar:login-2-linear",  // Login icon is already appropriate
        id: uniqueId(),
        url: "/auth/login",
      },
      {
        name: "Register",
        icon: "solar:user-plus-outline",  // Better icon for registration
        id: uniqueId(),
        url: "/auth/register",
      },
    ],
  },
];

export default SidebarContent;
