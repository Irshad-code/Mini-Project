import { Tab } from '@headlessui/react';
import { useNavigation } from '../../../../contexts/NavigationContext';
import Card from '../../../../components/ui/Card';
import PageContainer from '../../../../components/layout/PageContainer';
import TabButton from '../../../../components/ui/TabButton';
import { useResearch } from '../../hooks/useResearch';
import BasicResearchInfo from './BasicResearchInfo';
import PublicationList from './PublicationList';
import PublicationForm from './PublicationForm';
import FDPList from './FDPList';
import FDPForm from './FDPForm';
import VisitingProgramList from './VisitingProgramList';
import VisitingProgramForm from './VisitingProgramForm';
import ProjectList from './ProjectList';
import ProjectForm from './ProjectForm';

const tabs = [
  { name: 'Basic Info', key: 'basic' },
  { name: 'Journal Papers', key: 'journal' },
  { name: 'Conference Papers', key: 'conference' },
  { name: "FDP's", key: 'fdp' },
  { name: 'Visiting Programs', key: 'visiting' },
  { name: 'Projects', key: 'project' },
];

export default function ResearchInfo() {
  const {
    state,
    updateBasicInfo,
    addPublication,
    addFDP,
    addVisitingProgram,
    addProject,
    updateItem,
    removeItem,
    selectItem,
    cancelEdit,
  } = useResearch();

  const renderContent = (key) => {
    if (state.isEditing) {
      switch (state.selectedItem.type) {
        case 'journal':
        case 'conference':
          return (
            <PublicationForm
              type={state.selectedItem.type}
              publication={state.selectedItem.item}
              onSubmit={(data) =>
                state.selectedItem.item
                  ? updateItem(state.selectedItem.type, data)
                  : addPublication(state.selectedItem.type, data)
              }
              onCancel={cancelEdit}
            />
          );
        case 'fdp':
          return (
            <FDPForm
              fdp={state.selectedItem.item}
              onSubmit={(data) =>
                state.selectedItem.item ? updateItem('fdp', data) : addFDP(data)
              }
              onCancel={cancelEdit}
            />
          );
        case 'visiting':
          return (
            <VisitingProgramForm
              program={state.selectedItem.item}
              onSubmit={(data) =>
                state.selectedItem.item
                  ? updateItem('visiting', data)
                  : addVisitingProgram(data)
              }
              onCancel={cancelEdit}
            />
          );
        case 'project':
          return (
            <ProjectForm
              project={state.selectedItem.item}
              onSubmit={(data) =>
                state.selectedItem.item
                  ? updateItem('project', data)
                  : addProject(data)
              }
              onCancel={cancelEdit}
            />
          );
      }
    }

    switch (key) {
      case 'basic':
        return (
          <BasicResearchInfo
            info={state.basicInfo}
            onUpdate={updateBasicInfo}
          />
        );
      case 'journal':
        return (
          <PublicationList
            type="journal"
            publications={state.journals}
            onAdd={() => selectItem('journal', null)}
            onEdit={(pub) => selectItem('journal', pub)}
            onDelete={(id) => removeItem('journal', id)}
          />
        );
      case 'conference':
        return (
          <PublicationList
            type="conference"
            publications={state.conferences}
            onAdd={() => selectItem('conference', null)}
            onEdit={(pub) => selectItem('conference', pub)}
            onDelete={(id) => removeItem('conference', id)}
          />
        );
      case 'fdp':
        return (
          <FDPList
            fdps={state.fdps}
            onAdd={() => selectItem('fdp', null)}
            onEdit={(fdp) => selectItem('fdp', fdp)}
            onDelete={(id) => removeItem('fdp', id)}
          />
        );
      case 'visiting':
        return (
          <VisitingProgramList
            programs={state.visitingPrograms}
            onAdd={() => selectItem('visiting', null)}
            onEdit={(program) => selectItem('visiting', program)}
            onDelete={(id) => removeItem('visiting', id)}
          />
        );
      case 'project':
        return (
          <ProjectList
            projects={state.projects}
            onAdd={() => selectItem('project', null)}
            onEdit={(project) => selectItem('project', project)}
            onDelete={(id) => removeItem('project', id)}
          />
        );
    }
  };

  return (
    <PageContainer>
      <Card>
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-[var(--color-text-highlight)]">
            Research Information
          </h2>

          <Tab.Group>
            <Tab.List className="flex space-x-2 overflow-x-auto pb-2 border-b border-[var(--color-border-primary)]">
              {tabs.map((tab, index) => (
                <TabButton
                  key={tab.key}
                  index={index}
                  name={tab.name}
                  disabled={state.isEditing}
                />
              ))}
            </Tab.List>
            <Tab.Panels className="mt-6">
              {tabs.map((tab) => (
                <Tab.Panel key={tab.key} className="animate-fadeIn">
                  {renderContent(tab.key)}
                </Tab.Panel>
              ))}
            </Tab.Panels>
          </Tab.Group>
        </div>
      </Card>
    </PageContainer>
  );
}
