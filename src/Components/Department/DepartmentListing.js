import React, { useEffect, useState } from "react";
import axios from "axios";
import APIUrl from "./../../settings"; // Adjust the path as needed
import { useNavigate } from 'react-router-dom';

const DepartmentListing = () => {
    const [departments, setDepartments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [cmpId, setCmpId] = useState("");
    const [schId, setSchId] = useState("");
    const [companies, setCompanies] = useState([]);
    const [schools, setSchools] = useState([]);
    const [searchall, setSearchAll] = useState(false);

    const navigate = useNavigate(); // Using the navigate hook

    const fetchDepartments = async () => {
        setLoading(true); // Start loader
        try {
            const response = await axios.get(
                `${APIUrl}/DeptMaster/GetAllDepartments`
            );
            setDepartments(response.data);
        } catch (error) {
            console.error("Error fetching departments:", error);
            setError("Failed to load departments. Please try again.");
        } finally {
            setLoading(false); // Stop loader
        }
    };

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

    const fetchCompaniesAndSchools = async () => {
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

    const fetchAllDepartments = async () => {
        setLoading(true); // Start loader
        try {
            const companyResponse = await axios.get(
                "https://localhost:7268/api/DeptMaster/GetAllDepartments"
            );
            setDepartments(companyResponse.data);
        } catch (error) {
            setError("Failed to load company and school data. Please try again.");
        } finally {
            setLoading(false); // Stop loader
        }
    };

    const fetchDepartmentsByParams = async () => {
        if (!cmpId || !schId) {
            setError("Please select both a company and a school.");
            return;
        }

        setLoading(true); // Start loader
        try {
            const response = await axios.get(
                "https://localhost:7268/api/DeptMaster/GetAllDepartmentsBySchoolID",
                { params: { cmpId: cmpId, schId: schId } }
            );
            setSearchAll(true);
            setDepartments(response.data);
            setError(""); // Clear any previous errors
        } catch (err) {
            console.error("Error fetching departments:", err.response ? err.response.data : err.message);
            setError("Failed to fetch departments. Please check your input or try again later.");
        } finally {
            setLoading(false); // Stop loader
        }
    };

    useEffect(() => {
        fetchCompaniesAndSchools();
        if (!searchall)
        {
            fetchAllDepartments();            
        }
    }, []);

    const validateInput = () => {
        if (!cmpId || !schId) {
            setError("Both Company Code and School Code are required.");
            return false;
        }
        setError("");
        return true;
    };

    const handleSearch = () => {
        if (validateInput()) {
            fetchDepartmentsByParams();
        }
    };

    const handleAddNew = () => {
        navigate('/add-dept'); // Redirecting to the add-dept route
    };

    const handleEdit = (id) => {
        console.log(`Editing department with ID: ${id}`);
    };

    const handleView = (id) => {
        console.log(`Viewing department with ID: ${id}`);
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this department?")) {
            setLoading(true); // Start loader
            try {
                await axios.delete(
                    `http://localhost:7268/api/DeptMaster/Delete/${id}`
                );
                alert("Department deleted successfully.");
                fetchDepartments(); // Refresh the list
            } catch (error) {
                console.error("Error deleting department:", error);
                alert("Failed to delete department. Please try again.");
            } finally {
                setLoading(false); // Stop loader
            }
        }
    };

    const handleCompanyChange = (e) => {
        const selectedCompanyId = e.target.value;
        setCmpId(selectedCompanyId);
        if (selectedCompanyId) {
            fetchSchools(selectedCompanyId);
        } else {
            setSchools([]);
        }
    };

    return (
        <div className="container mt-5">
            <h1 className="text-center mb-4">Department Listing</h1>

            <div className="mb-3 row">
                <div className="col-md-4">
                    <select
                        className="form-control"
                        value={cmpId}
                        onChange={handleCompanyChange}
                    >
                        <option value="">Select Company</option>
                        {companies.map((company) => (
                            <option key={company.cmpId} value={company.cmpId}>
                                {company.cmpId} - {company.cmpDescription}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="col-md-4">
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
                <div className="col-md-2">
                    <button
                        className="btn btn-primary w-100"
                        onClick={handleSearch}
                    >
                        Search
                    </button>
                </div>
                <div className="col-md-2">
                    <button
                        className="btn btn-primary w-100"
                        onClick={handleAddNew}
                    >
                        Add New
                    </button>
                </div>
            </div>

            {error && <div className="alert alert-danger">{error}</div>}

            {loading ? (
                <div className="text-center">
                    <div className="spinner-border" role="status">
                        <span className="sr-only">Loading...</span>
                    </div>
                </div>
            ) : (
                <table className="table table-bordered table-hover">
                    <thead className="table-dark">
                        <tr>
                            <th>ID</th>
                            <th>Code</th>
                            <th>Name</th>
                            <th>Company Code</th>
                            <th>School Code</th>
                            <th>Is Active</th>
                            <th>Created Date</th>
                            <th>Modified Date</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {departments.map((dept) => (
                            <tr key={dept.deptId}>
                                <td>{dept.deptId}</td>
                                <td>{dept.deptCode}</td>
                                <td>{dept.deptName}</td>
                                <td>{dept.companyCode}</td>
                                <td>{dept.schoolCode}</td>
                                <td>{dept.deptIsActive ? "Yes" : "No"}</td>
                                <td>
                                    {new Date(dept.createdDate).toLocaleDateString()}
                                </td>
                                <td>
                                    {dept.modifiedDate
                                        ? new Date(dept.modifiedDate).toLocaleDateString()
                                        : "-"}
                                </td>
                                <td>
                                    <button
                                        className="btn btn-warning btn-sm mx-1"
                                        onClick={() => handleEdit(dept.deptId)}
                                    >
                                        Edit
                                    </button>
                                    <button
                                        className="btn btn-info btn-sm mx-1"
                                        onClick={() => handleView(dept.deptId)}
                                    >
                                        View
                                    </button>
                                    <button
                                        className="btn btn-danger btn-sm mx-1"
                                        onClick={() => handleDelete(dept.deptId)}
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default DepartmentListing;
