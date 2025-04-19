
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";

const AddClassCard = ({
  newClasses,
  updateNewClass,
  onAdd_classes,
  setActiveForm,
  FormType,
}) => {
  const toggleScheduleEditor = (index) => {
    updateNewClass(index, "showScheduleEditor", !newClasses[index].showScheduleEditor);
  };

  return (
    <Card className="p-6">
      <form onSubmit={onAdd_classes} className="space-y-4">
        {/* Desktop table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-4 py-2">Subject Code</th>
                <th className="px-4 py-2">Subject Name</th>
                <th className="px-4 py-2">Semester</th>
                <th className="px-4 py-2">Schedule</th>
                <th className="px-4 py-2">Class Type</th>
                <th className="px-4 py-2">Branch</th>
                <th className="px-4 py-2">Course Files Link</th>
              </tr>
            </thead>
            <tbody>
              {newClasses.map((classData, index) => (
                <tr key={index}>
                  {["code", "subject", "semester"].map((field) => (
                    <td key={field} className="px-2 py-1">
                      <input
                        type="text"
                        value={classData[field]}
                        onChange={(e) => updateNewClass(index, field, e.target.value)}
                        className="w-full p-1 border rounded"
                        required
                      />
                    </td>
                  ))}
                  <td className="px-2 py-1">
                    <div className="space-y-1">
                      <Button
                        type="button"
                        variant="outline"
                        className="w-full text-xs"
                        onClick={() => toggleScheduleEditor(index)}
                      >
                        {classData.fromTime && classData.toTime
                          ? `${classData.fromTime} - ${classData.toTime}`
                          : "Set Schedule"}
                      </Button>
                      {classData.showScheduleEditor && (
                        <div className="space-y-1">
                          <input
                            type="time"
                            value={classData.fromTime}
                            onChange={(e) =>
                              updateNewClass(index, "fromTime", e.target.value)
                            }
                            className="w-full p-1 border rounded"
                            required
                          />
                          <input
                            type="time"
                            value={classData.toTime}
                            onChange={(e) =>
                              updateNewClass(index, "toTime", e.target.value)
                            }
                            className="w-full p-1 border rounded"
                            required
                          />
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-2 py-1">
                    <select
                      value={classData.type || "ordinary"}
                      onChange={(e) => updateNewClass(index, "type", e.target.value)}
                      className="w-full p-1 border rounded"
                      required
                    >
                      <option value="ordinary">Ordinary</option>
                      <option value="honour">Honour</option>
                      <option value="minor">Minor</option>
                    </select>
                  </td>
                  <td className="px-2 py-1">
                    <input
                      type="text"
                      value={classData.branch}
                      onChange={(e) => updateNewClass(index, "branch", e.target.value)}
                      className="w-full p-1 border rounded"
                      required={classData.type === "ordinary"}
                      disabled={classData.type !== "ordinary"}
                      placeholder={classData.type === "ordinary" ? "Enter branch" : "N/A"}
                    />
                  </td>
                    <td key={"courseFilesLink"} className="px-2 py-1">
                      <input
                        type="text"
                        placeholder="paste Gdrive link here"
                        value={classData["courseFilesLink"]}
                        onChange={(e) => updateNewClass(index, "courseFilesLink", e.target.value)}
                        className="w-full p-1 border rounded"
                        required
                      />
                    </td>                  
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile view (cards) */}
        <div className="md:hidden space-y-10">
          {newClasses.map((classData, index) => (
            <div
              key={index}
              className="p-4 border rounded space-y-3 bg-gray-300 shadow-sm"
            >
              {["code", "subject", "semester"].map((field) => (
                <div key={field}>
                  <label className="block text-sm font-medium text-gray-700 capitalize">
                    {field}
                  </label>
                  <input
                    type="text"
                    value={classData[field]}
                    onChange={(e) => updateNewClass(index, field, e.target.value)}
                    className="w-full p-2 border rounded"
                    required
                  />
                </div>
              ))}

              <div>
                <label className="block text-sm font-medium text-gray-700">Schedule</label>
                <Button
                  type="button"
                  variant="outline"
                  className="w-full text-xs mb-1"
                  onClick={() => toggleScheduleEditor(index)}
                >
                  {classData.fromTime && classData.toTime
                    ? `${classData.fromTime} - ${classData.toTime}`
                    : "Set Schedule"}
                </Button>
                {classData.showScheduleEditor && (
                  <div className="space-y-1">
                    <input
                      type="time"
                      value={classData.fromTime}
                      onChange={(e) =>
                        updateNewClass(index, "fromTime", e.target.value)
                      }
                      className="w-full p-2 border rounded"
                      required
                    />
                    <input
                      type="time"
                      value={classData.toTime}
                      onChange={(e) =>
                        updateNewClass(index, "toTime", e.target.value)
                      }
                      className="w-full p-2 border rounded"
                      required
                    />
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Class Type
                </label>
                <select
                  value={classData.type || "ordinary"}
                  onChange={(e) => updateNewClass(index, "type", e.target.value)}
                  className="w-full p-2 border rounded"
                  required
                >
                  <option value="ordinary">Ordinary</option>
                  <option value="honour">Honour</option>
                  <option value="minor">Minor</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Branch</label>
                <input
                  type="text"
                  value={classData.branch}
                  onChange={(e) =>
                    updateNewClass(index, "branch", e.target.value)
                  }
                  className="w-full p-2 border rounded"
                  required={classData.type === "ordinary"}
                  disabled={classData.type !== "ordinary"}
                  placeholder={classData.type === "ordinary" ? "Enter branch" : "N/A"}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Course Files Link</label>
                      <input
                        type="text"
                        placeholder="paste Gdrive link here"
                        value={classData["courseFilesLink"]}
                        onChange={(e) => updateNewClass(index, "courseFilesLink", e.target.value)}
                        className="w-full p-1 border rounded"
                        required
                      />
                    </div>
            </div>
          ))}
        </div>

        <div className="flex justify-end space-x-2">
          <Button
            type="button"
            variant="secondary"
            onClick={() => setActiveForm(FormType.NONE)}
          >
            Cancel
          </Button>
          <Button type="submit" variant="primary">
            Add Classes
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default AddClassCard;
