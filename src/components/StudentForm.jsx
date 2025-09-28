import React from "react";
import { useState,useEffect } from "react";
import api from "../../utils/axios";
import "../styles/studentForm.css"

const StudentForm = () => {

    const [id, setId] = useState(0);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [regNo, setRegNo] = useState("");
    const [course, setCourse] = useState("");
    const [students, setStudents] = useState([]);
    const [showDetails, setShowDetails] = useState(false);
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [isEditing, setIsEditing] = useState(false);

    // Fetching all the students
    useEffect(() => {
        const fetchData = async () => {
        try {

            // Sending the get request to fetch all students
            const res = await api.get("/students");

            // Setting the students state with the fetched data
            setStudents(res.data);
        } catch (error) {
            console.error(error);
        }
        };
        fetchData();
    }, []);

    // Adding a new student on button click
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {

            if (isEditing) {

                // Send a put request to update student in database
                const res = await api.put(`/students/${id}`, {name, email, regNo, course});

                // Updating the students list state
                setStudents(
                    students.map((std) => (std.id === id ? res.data : std))
                );

                // Setting the editing state to false after update is completed
                setIsEditing(false);
            }
            else {
                
                // Send a post request to add student in database
                const res = await api.post("/students", {id, name, email, regNo, course});

                // Updating the students list
                setStudents([...students, res.data]);
            }

            // Setting the states of variables to default
            setId(0);
            setName("");
            setEmail("");
            setRegNo("");
            setCourse("");

        } catch (error) {
            console.log(error);
        }
    }

    const handleEdit = (student) => {

        // Setting the editing state as true
        setIsEditing(true);

        // Setting the states with the details of student to be edited
        setId(student.id);
        setName(student.name);
        setEmail(student.email);
        setRegNo(student.regNo);
        setCourse(student.course);
    }

    const handleDelete = async (studentId) => {

        try {
            // Sending the delete request to delete the student from database
            await api.delete(`/students/${studentId}`);

            // Updating the students list state
            setStudents(students.filter((std) => std.id !== studentId));

            // If the deleted student is currently being viewed, then hiding the details and setting the selected state to null
            if (selectedStudent?.id === studentId) {
                setShowDetails(false);
                setSelectedStudent(null);
            }
        } catch (error) {
            console.error(error);
        }
    }

    const handleView = async (id) => {
        try {
            // Sending the get request to fetch the details of the selected student
            const res = await api.get(`/students/${id}`);

            // Updating the selected state with the fetched data
            setSelectedStudent(res.data);

            // Setting the show details state to true
            setShowDetails(true);
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <div className="main-container">
            <h1>Student Management App</h1>
            <div className="form-container">
                <form onSubmit={handleSubmit}>
                    <input type="number" value={id} onChange={(e) => setId(Number(e.target.value))} required disabled={isEditing} placeholder="ID"/><br />
                    <input type="text" value={name} onChange={(e) => setName(e.target.value)} required placeholder="Name"/><br />
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="Email"/><br />
                    <input type="text" value={regNo} onChange={(e) => setRegNo(e.target.value)} required placeholder="Reg No"/><br />
                    <input type="text" value={course} onChange={(e) => setCourse(e.target.value)} required placeholder="Course"/><br />
                    <button type="submit">{isEditing ? "Update Student" : "Add Student"}</button>
                </form>
            </div>

            <ul className="student-list">
                {students.map((std) => (
                <li key={std.id}>
                    <span>
                    <b>{std.name}</b> {std.regNo}
                    </span>
                    <div style={{ display: "flex", gap: "5px" }}>
                        <button onClick={() => handleView(std.id)}>View</button>
                        <button onClick={() => handleEdit(std)}>Edit</button>
                        <button onClick={() => handleDelete(std.id)}>Delete</button>
                    </div>
                </li>
                ))}
            </ul>

            {showDetails && selectedStudent && 
                <div className="details-container">
                    <h3>Student Details</h3>
                    <p><b>ID:</b> {selectedStudent.id}</p>
                    <p><b>Name:</b> {selectedStudent.name}</p>
                    <p><b>Email:</b> {selectedStudent.email}</p>
                    <p><b>Reg No:</b> {selectedStudent.regNo}</p>
                    <p><b>Course:</b> {selectedStudent.course}</p>

                </div>
            }

        </div>
    )
}

export default StudentForm;