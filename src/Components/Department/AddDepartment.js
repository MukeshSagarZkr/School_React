import React, { useState, useEffect } from "react";
import axios from "axios";
import APIUrl from "./../../settings"; // Adjust the path as needed
import { useNavigate } from 'react-router-dom';

const AddDepartment = () => {
    const [departmentName, setDepartmentName] = useState("");
    const [departmentCode, setDepartmentCode] = useState("");
    const [isActive, setIsActive] = useState(false);
    const [cmpId, setCmpId] = useState("");
    const [schId, setSchId] = useState("");
    const [companies, setCompanies] = useState([]);
    const [schools, setSchools] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const navigate = useNavigate(); // Using the navigate hook

    useEffect(() => {
        fetchCompanies();        
    }, []);

    // Fetch companies on component mount
    const fetchCompanies = async () => {
        setLoading(true); // Start loader
        try {
            const companyResponse = await axios.get(
                `${APIUrl}/CompanyMaster/GetAll`
            );
            setCompanies(companyResponse.data);
        } catch (error) {
            setError("Failed to load company and school data. Please try again.");
        } finally {
            setLoading(false); // Stop loader
        }
    };


    const handleCompanyChange = (e) => {
        debugger

        const selectedCompanyId = e.target.value;
        setCmpId(selectedCompanyId);
        debugger
        if (selectedCompanyId) {
            fetchSchools(selectedCompanyId);
        } else {
            setSchools([]);
        }
    };

    // Fetch schools when a company is selected
    

    const fetchSchools = async (companyId) => {
        setLoading(true); // Start loader
        try {
            const response = await axios.get(
                `${APIUrl}/SchoolMaster/GetSchoolByCompany`,
                { params: { cmpId: companyId } }
            );
            setSchools(response.data);
        } catch (error) {
            console.error("Error fetching schools:", error.response ? error.response.data : error.message);
        } finally {
            setLoading(false); // Stop loader
        }
    };
    const handleSubmit = async (e) => {
        debugger;
        e.preventDefault();
        setLoading(true);
        setError("");

        const payload = {
            DeptName: departmentName,
            DeptCmpId: cmpId,
            DeptSchId: schId,
            IsActive: isActive
        };

        try {
            await axios.post("http://localhost:7268/api/DeptMaster/AddDepartment", payload);
            alert("Record added successfully!");
            navigate("/departments"); // Redirect to the departments listing page
        } catch (err) {
            console.error("Error adding record:", err);
            setError("Failed to add record. Please try again later.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container">
            <h2 className="text-center mt-4">Add New Record</h2>

            <form onSubmit={handleSubmit}>
            <div className="mb-3">
                    <label htmlFor="company" className="form-label">
                        Company
                    </label>
                    <select
                        id="company"
                        className="form-control"
                        value={cmpId}
                        onChange={handleCompanyChange}
                        required
                    >
                        <option value="">Select Company</option>
                        {companies.map((company) => (
                            <option key={company.cmpId} value={company.cmpId}>
                                {company.cmpDescription}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="mb-3">
                    <label htmlFor="company" className="form-label">
                        School
                    </label>
                    <select
                        className="form-control"
                        value={schId}
                        onChange={(e) => setSchId(e.target.value)}
                    >
                        <option value="">Select School</option>
                        {schools.map((school) => (
                            <option key={school.schId} value={school.schId}>
                                {school.schId} - {school.schName}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="mb-3">
                    <label htmlFor="departmentCode" className="form-label">
                        Department Code
                    </label>
                    <input
                        type="text"
                        id="departmentCode"
                        className="form-control"
                        value={departmentCode}
                        onChange={(e) => setDepartmentCode(e.target.value)}
                        required
                    />
                </div>

                <div className="mb-3">
                    <label htmlFor="departmentName" className="form-label">
                        Department Name
                    </label>
                    <input
                        type="text"
                        id="departmentName"
                        className="form-control"
                        value={departmentName}
                        onChange={(e) => setDepartmentName(e.target.value)}
                        required
                    />
                </div>
            
                <div className="mb-3">
                    <label htmlFor="IsActive" className="form-label">
                        Is Active
                    </label>
                    <input
                        type="checkbox"
                        id="IsActive"
                        className="form-check-input"
                        checked={isActive} // Bind to a boolean state
                        onChange={(e) => setIsActive(e.target.checked)} // Handle boolean value
                    />
                </div>
                

                

                {error && <p className="text-danger">{error}</p>}

                <button type="submit" className="btn btn-primary" disabled={loading}>
                    {loading ? "Adding..." : "Add Record"}
                </button>
            </form>
        </div>
    );
};

export default AddDepartment;
