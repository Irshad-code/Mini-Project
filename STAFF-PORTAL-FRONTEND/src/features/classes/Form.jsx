import React from 'react'
import Button from "../../components/ui/Button";

export const Form = (
    {   setIsModelOpen,

        isModelUpdateOpen,
        setIsModelUpdateOpen,

        onAdd_class,
        onUpdate_class,

        handleChange,
        newClassData
    }) => {
  return (
    <div 
    className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
    onClick={() => {setIsModelOpen(false); setIsModelUpdateOpen(false)}} // Close when clicking outside
  >
    {/* Prevent click inside from closing modal */}
    <div 
      className="bg-white p-6 rounded-lg shadow-lg w-96 max-w-full"
      onClick={(e) => e.stopPropagation()} // prevent the closing of form when clicked inside it
    >
      <h2 className="text-xl font-semibold mb-4">Add New Class</h2>
      <form onSubmit={onAdd_class} className="space-y-4">
        <input type="text" name="subject" placeholder="Subject" value={newClassData.subject} onChange={handleChange} className="w-full border p-2 rounded"/>
        <input type="text" name="code" placeholder="Code" value={newClassData.code} onChange={handleChange} className="w-full border p-2 rounded"/>
        <input type="text" name="semester" placeholder="Semester" value={newClassData.semester} onChange={handleChange} className="w-full border p-2 rounded"/>
        <input type="text" name="branch" placeholder="Branch" value={newClassData.branch} onChange={handleChange} className="w-full border p-2 rounded"/>
        <input type="number" name="students" placeholder="No. of Students" value={newClassData.students} onChange={handleChange} className="w-full border p-2 rounded"/>
        <input type="text" name="schedule" placeholder="Schedule" value={newClassData.schedule} onChange={handleChange} className="w-full border p-2 rounded"/>
        <input type="text" name="syllabus" placeholder="Syllabus Link" value={newClassData.syllabus} onChange={handleChange} className="w-full border p-2 rounded"/>
        <input type="text" name="courseOutcome" placeholder="Course Outcome Link" value={newClassData.courseOutcome} onChange={handleChange} className="w-full border p-2 rounded"/>
        
        {/* Button Actions */}
        <div className="flex justify-end space-x-2">

          <Button type="button"  onClick={() => {
            //setIsModelOpen(false);
            setIsModelUpdateOpen(false);
          }
            } className="bg-gray-500">
              Cancel
              </Button>

          <Button type="button"  onClick={()=>{
            console.log("ismodelupdate on form is= ",isModelUpdateOpen)
            isModelUpdateOpen ? ()=>{
              onUpdate_class();
              console.log("Update Class",isModelUpdateOpen)
            }:onAdd_class();
            }} className="bg-blue-500">
               {isModelUpdateOpen ? "Update Class" : "Add Class"} 
                </Button>
        </div>
      </form>
    </div>
  </div>
  )
}
