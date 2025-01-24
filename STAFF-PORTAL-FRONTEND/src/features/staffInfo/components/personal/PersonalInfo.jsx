import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/react";
import { Menu } from "@headlessui/react";
import { FiChevronDown } from "react-icons/fi";
import Card from "../../../../components/ui/Card";
import PageContainer from "../../../../components/layout/PageContainer";
import TabButton from "../../../../components/ui/TabButton";
import BasicInfo from "./BasicInfo";
import ContactDetails from "./ContactDetails";
import OfficialIds from "./OfficialIds";
import Family from "./Family";
import ProfilePhoto from "./ProfilePhoto";
import Responsibilities from "./Responsibilities";
import { useState } from "react";

const tabs = [
  { name: "Basic Info", component: BasicInfo },
  { name: "Contact Details", component: ContactDetails },
  { name: "Official IDs", component: OfficialIds },
  { name: "Family Details", component: Family },
  { name: "Responsibilities", component: Responsibilities },
  { name: "Profile Photo", component: ProfilePhoto },
];

export default function PersonalInfo() {
  const [selectedTabIndex, setSelectedTabIndex] = useState(0);

  const MobileTabSelector = ({ selectedIndex, onChange }) => (
    <Menu as="div" className="relative w-full">
      <Menu.Button className="w-full flex items-center justify-between px-4 py-2 text-sm font-medium bg-[var(--color-bg-secondary)] border border-[var(--color-border-primary)] rounded-lg focus:outline-none">
        <span>{tabs[selectedIndex].name}</span>
        <FiChevronDown className="ml-2 h-4 w-4" />
      </Menu.Button>
      <Menu.Items className="absolute z-10 mt-1 w-full bg-[var(--color-bg-secondary)] border border-[var(--color-border-primary)] rounded-lg shadow-lg focus:outline-none">
        <div className="py-1">
          {tabs.map((tab, index) => (
            <Menu.Item key={tab.name}>
              {({ active }) => (
                <button
                  onClick={() => onChange(index)}
                  className={`${
                    active
                      ? "bg-[var(--color-bg-tertiary)]"
                      : ""
                  } ${
                    selectedIndex === index
                      ? "text-[var(--color-primary-500)]"
                      : "text-[var(--color-text-primary)]"
                  } group flex w-full items-center px-4 py-3 text-sm`}
                >
                  {tab.name}
                </button>
              )}
            </Menu.Item>
          ))}
        </div>
      </Menu.Items>
    </Menu>
  );

  return (
    <PageContainer>
      <div className="w-full">
        <Card className="bg-[var(--color-bg-primary)] shadow-lg p-4 sm:p-8 rounded-xl w-full border border-[var(--color-border-primary)]">
          <h2 className="text-2xl sm:text-3xl font-bold text-[var(--color-primary-500)] mb-6">
            Personal Information
          </h2>

          {/* Mobile Dropdown */}
          <div className="block sm:hidden mb-6">
            <MobileTabSelector
              selectedIndex={selectedTabIndex}
              onChange={setSelectedTabIndex}
            />
          </div>

          <TabGroup
            selectedIndex={selectedTabIndex}
            onChange={setSelectedTabIndex}
          >
            {/* Desktop Tabs */}
            <div className="hidden sm:block">
              <TabList className="flex space-x-2 border-b-2 border-[var(--color-border-primary)]">
                {tabs.map((tab, index) => (
                  <TabButton key={tab.name} index={index} name={tab.name} />
                ))}
              </TabList>
            </div>

            <TabPanels className="mt-6 sm:mt-8">
              {tabs.map((tab) => (
                <TabPanel
                  key={tab.name}
                  className="animate-fadeIn bg-[var(--color-bg-secondary)] p-4 sm:p-6 rounded-lg"
                >
                  <tab.component />
                </TabPanel>
              ))}
            </TabPanels>
          </TabGroup>
        </Card>
      </div>
    </PageContainer>
  );
}
