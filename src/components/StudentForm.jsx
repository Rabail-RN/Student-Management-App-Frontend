import React from "react";
import { useState,useEffect } from "react";
import api from "../../utils/axios";
import "../styles/StudentForm.css"

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
            const res = await api.get("/students");
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

                // Updating the students list
                setStudents(
                    students.map((std) => (std.id === id ? res.data : std))
                );

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
        setIsEditing(true);
        setId(student.id);
        setName(student.name);
        setEmail(student.email);
        setRegNo(student.regNo);
        setCourse(student.course);
    }

    const handleDelete = async (studentId) => {

        try {
            await api.delete(`/students/${studentId}`);
            setStudents(students.filter((std) => std.id !== studentId));
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
            const res = await api.get(`/students/${id}`);
            setSelectedStudent(res.data);
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
                    <b>{std.name}</b> {std.email} {std.regNo} {std.course}
                    </span>
                    <div style={{ display: "flex", gap: "5px" }}>
                        <button onClick={() => handleView(std.id)}>View</button>
                        <button onClick={() => handleEdit(std)}>Edit</button>
                        <button onClick={() => handleDelete(std.id)}>Delete</button>
                    </div>
                </li>
                ))}
            </ul>

            {/* Student Details */}
            {showDetails && selectedStudent && <DetailsPage std={selectedStudent} />}

        </div>
    )
}

export default StudentForm;