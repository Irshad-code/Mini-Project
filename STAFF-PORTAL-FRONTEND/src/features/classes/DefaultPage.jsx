import { Tab } from "@headlessui/react";
import { FiPlus } from "react-icons/fi";
import Button from "../../components/ui/Button";
import TabButton from "../../components/ui/TabButton";
import { UploadManually } from "./UploadManually";

const DefaultPage = ({
  setActiveForm,
  FormType,
  fetchClasses,
  tabs,
  classes,
  renderClassCard,
  activeForm,
  myClass,
  setStudents,
  handleStudentExcelDataUpload,
}) => {

  function uploadExcelOrManually(classItem) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
        <div className="bg-white p-6 rounded-2xl shadow-lg w-96">
          <h1 className="text-xl font-bold mb-4 text-center">
            {`Upload Students For ${classItem.subject}`}
          </h1>
          <div className="flex flex-col gap-4">
            <button
              className="bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition"
              onClick={() => {
                setActiveForm(FormType.UPLOAD_STUDENTS_EXCEL);

                console.log("id= ", classItem.userclassesId);
              }}
            >
              Upload Excel
            </button>

            <button
              className="bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition"
              onClick={() => {
                setActiveForm(FormType.UPLOAD_STUDENTS_MANUALLY);
              }}
            >
              Upload Manually
            </button>

            <button
              className="bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition"
              onClick={() => {
                setActiveForm(FormType.NONE);
              }}
            >
              cancel
            </button>
          </div>
        </div>
      </div>
    );
  }

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
          {tabs.map((tab) => (
            <TabButton 
            key={tab.id} 
            noOfClasses={tab.name==="Current Classes"?classes.current.length:classes.archived.length} 
            name={tab.name} />
          ))}
        </Tab.List>

        <Tab.Panels className="mt-6">
          <Tab.Panel>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {classes.current.length?
              classes.current.map((classItem) =>
                renderClassCard(classItem, "current")
              ):<div className="text-center">No current classes</div>
              }
            </div>

            {activeForm === FormType.UPLOAD_STUDENTS &&
              uploadExcelOrManually(myClass)}

            {activeForm === FormType.UPLOAD_STUDENTS_MANUALLY && (
              <UploadManually
                myClass={myClass}
                columns={[
                  { label: "Roll No", key: "rollNumber", type: "text" },
                  { label: "Name", key: "name", type: "text" },
                  { label: "Phone Number", key: "phone", type: "tel" },
                  { label: "Semester", key: "semester", type: "text" },
                  { label: "Branch", key: "branch", type: "text" },
                  { label: "Email", key: "email", type: "email" },
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
                      handleStudentExcelDataUpload(
                        myClass.userclassesId,
                        e.target.files[0]
                      )
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
              {
              classes.archived.length?
              classes.archived.map((classItem) =>
                renderClassCard(classItem, "archived")
              ): <div className="text-center">No archived classes</div>
            }
            </div>
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>
    </>
  );
};

export default DefaultPage;
