import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/react";
import { useNavigation } from "../../../../contexts/NavigationContext";
import Card from "../../../../components/ui/Card";
import PageContainer from "../../../../components/layout/PageContainer";
import TabButton from "../../../../components/ui/TabButton";
import BasicInfo from "./BasicInfo";
import ContactDetails from "./ContactDetails";

const tabs = [
  { name: "Basic Info", component: BasicInfo },
  { name: "Contact Details", component: ContactDetails },
];

export default function PersonalInfo() {
  return (
    <PageContainer>
      <div className="w-full">
        <Card className="bg-[var(--color-bg-primary)] shadow-lg p-8 rounded-xl w-full border border-[var(--color-border-primary)]  ">
          <h2 className="text-3xl font-bold text-[var(--color-primary-500)] mb-6">
            Personal Information
          </h2>

          <TabGroup>
            <TabList className="flex space-x-2 border-b-2 border-[var(--color-border-primary)]">
              {tabs.map((tab, index) => (
                <TabButton key={tab.name} index={index} name={tab.name} />
              ))}
            </TabList>
            <TabPanels className="mt-8">
              {tabs.map((tab) => (
                <TabPanel
                  key={tab.name}
                  className="animate-fadeIn bg-[var(--color-bg-secondary)] p-6 rounded-lg"
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
