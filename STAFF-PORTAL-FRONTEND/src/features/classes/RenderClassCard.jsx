import { FiCalendar, FiUsers } from "react-icons/fi";
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import { useNavigate } from "react-router-dom";

const RenderClassCard = ({
  classItem,
  type,
  setEditingClass,
  setActiveForm,
  setMyClass,
  FormType,
  onDelete_class
}) => {
  const navigate = useNavigate();

  const handleEdit = () => {
    setEditingClass(classItem);
    setActiveForm(FormType.EDIT_CLASS);
  };

  const handleDelete = () => {
    onDelete_class(classItem.userclassesId);
  };

  const handleUploadStudents = () => {
    setActiveForm(FormType.UPLOAD_STUDENTS);
    setMyClass(classItem);
  };

  const renderActionButtons = () => (
    <div className="flex items-center space-x-2">
      <Button onClick={handleEdit} className="bg-blue-500">Edit</Button>
      <Button onClick={handleDelete} className="bg-black">Delete</Button>
      <Button onClick={handleUploadStudents} className="bg-blue-500">Upload Students</Button>
    </div>
  );
     const scheduleParts = classItem.schedule.split("#");
  return (
    <Card key={classItem.id} className="p-6 hover:shadow-lg transition-shadow">
      <div className="space-y-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-xl font-semibold text-[var(--color-text-primary)]">
              {classItem.subject}
            </h3>
            <p className="text-[var(--color-text-secondary)]">
              {classItem.code} • {classItem.semester} {classItem.branch}
            </p>
          </div>
          <div className="flex items-center space-x-2 text-[var(--color-text-secondary)]">
            <FiUsers className="w-4 h-4" />
            <span>{classItem.students} students</span>
          </div>
        </div>

        {type === "current" ? (
          <div className="space-y-2">
            <div className="flex items-center space-x-2 text-[var(--color-text-secondary)]">
              <FiCalendar className="w-4 h-4" />

              <span>{classItem.schedule}</span>
            </div>
            {renderActionButtons()}
            <div className="grid grid-cols-2 gap-4">
              <Button
                variant="secondary"
                className="w-full"
                onClick={() =>
                  window.open(
                    "https://drive.google.com/drive/folders/1_iyHqZk4MUDLTec5reneK9Az_JmU-MUl?usp=drive_link",
                    "_blank"
                  )
                }
              >
                Course Files
              </Button>
              <Button
                variant="secondary"
                className="w-full"
                onClick={() =>
                  navigate(`/attendance/${classItem.userclassesId}`)
                }
              >
                Attendance
              </Button>
              <Button
                variant="secondary"
                className="w-full"
                onClick={() =>
                  navigate(`/internalmarks/${classItem.userclassesId}`)
                }
              >
                Internal Marks
              </Button>
              <Button
                variant="secondary"
                className="w-full"
                onClick={() =>
                  navigate(`/seriesmarks/${classItem.userclassesId}`)
                }
              >
                Series Marks
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex justify-between text-[var(--color-text-secondary)]">
              <span>Year: {classItem.year}</span>
              <span>Result: {classItem.result}</span>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Button variant="secondary" className="w-full">
                View Report
              </Button>
              <Button variant="secondary" className="w-full">
                Course Files
              </Button>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};

export default RenderClassCard;
