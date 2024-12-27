import { Tab } from "@headlessui/react";
import { useNavigation } from "../../../../contexts/NavigationContext";
import Card from "../../../../components/ui/Card";
import PageContainer from "../../../../components/layout/PageContainer";
import TabButton from "../../../../components/ui/TabButton";
import AppointmentOrder from "./AppointmentOrder";
import PSCAdviceMemo from "./PSCAdviceMemo";
import TransferOrders from "./TransferOrders";
import SalarySlips from "./SalarySlips";

const tabs = [
  { name: "Appointment Order", component: AppointmentOrder },
  { name: "PSC Advice Memo", component: PSCAdviceMemo },
  { name: "Transfer Orders", component: TransferOrders },
  { name: "Salary Slips", component: SalarySlips },
];

export default function ServiceInfo() {
  return (
    <PageContainer>
      <div className="w-full">
        <Card className="bg-[var(--color-bg-primary)] shadow-lg p-8 rounded-xl w-full border border-[var(--color-border-primary)]">
          <h2 className="text-3xl font-bold text-[var(--color-primary-500)] mb-6">
            Service Details
          </h2>

          <Tab.Group>
            <Tab.List className="flex space-x-2 border-b-2 border-[var(--color-border-primary)]">
              {tabs.map((tab, index) => (
                <TabButton key={tab.name} index={index} name={tab.name} />
              ))}
            </Tab.List>
            <Tab.Panels className="mt-8">
              {tabs.map((tab) => (
                <Tab.Panel
                  key={tab.name}
                  className="animate-fadeIn bg-[var(--color-bg-secondary)] p-6 rounded-lg"
                >
                  <tab.component />
                </Tab.Panel>
              ))}
            </Tab.Panels>
          </Tab.Group>
        </Card>
      </div>
    </PageContainer>
  );
}
