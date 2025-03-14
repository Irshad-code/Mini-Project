import { Tab } from "@headlessui/react";
import { FiPlus } from "react-icons/fi";
import Button from "../../components/ui/Button";
import TabButton from "../../components/ui/TabButton";
import UploadManually from "./UploadManually";

const DefaultPage = ({
  setActiveForm,
  FormType,
  fetchClasses,
  tabs,
  classes,
  renderClassCard,
  activeForm,
  uploadExcelOrManually,
  myClass,
  setStudents,
  handleStudentExcelDataUpload
}) => {
  return (
    <>
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-[var(--color-text-primary)]">
            My Classes
          </h2>
          <p className="mt-2 text-[var(--color-text-secondary)]">
            Manage your current and archived classes
          </p>
        </div>
        <Button
          onClick={() => setActiveForm(FormType.NUM_CLASS_PROMPT)}
          variant="primary"
          icon={<FiPlus className="w-4 h-4" />}
        >
          Add New Classes
        </Button>
      </div>

      <Tab.Group onChange={() => fetchClasses()}>
        <Tab.List className="flex space-x-2 border-b border-[var(--color-border-primary)]">
          {tabs.map((tab, index) => (
            <TabButton key={tab.id} index={index} name={tab.name} />
          ))}
        </Tab.List>

        <Tab.Panels className="mt-6">
          <Tab.Panel>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {classes.current.map((classItem) =>
                renderClassCard(classItem, "current")
              )}
            </div>

            {activeForm === FormType.UPLOAD_STUDENTS && uploadExcelOrManually(myClass)}

            {activeForm === FormType.UPLOAD_STUDENTS_MANUALLY && (
              <UploadManually
                myClass={myClass}
                columns={[
                  { label: "ID", key: "id", type: "text" },
                  { label: "Name", key: "name", type: "text" },
                  { label: "Phone Number", key: "phone", type: "tel" },
                  { label: "Photo", key: "photo", type: "file" },
                  { label: "Address", key: "address", type: "textarea" }
                ]}
                setStudents={setStudents}
                setActiveForm={setActiveForm}
                FormType={FormType}
              />
            )}

            {activeForm === FormType.UPLOAD_STUDENTS_EXCEL && (
              <div className="fixed inset-0 flex items-center justify-center bg-black/30 backdrop-blur-md">
                <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                  <h3 className="text-lg font-semibold">Upload Excel File</h3>

                  <input
                    type="file"
                    accept=".xlsx, .xls"
                    onChange={(e) =>
                      handleStudentExcelDataUpload(myClass.userclassesId, e.target.files[0])
                    }
                    className="mt-3 border p-2 rounded w-full"
                  />

                  <div className="flex justify-end gap-48 mt-4">
                    <button
                      onClick={() => setActiveForm(FormType.UPLOAD_STUDENTS)}
                      className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                    >
                      Ok
                    </button>

                    <button
                      onClick={() => setActiveForm(FormType.UPLOAD_STUDENTS)}
                      className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}
          </Tab.Panel>
          <Tab.Panel>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {classes.archived.map((classItem) =>
                renderClassCard(classItem, "archived")
              )}
            </div>
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>
    </>
  );
};

export default DefaultPage;
