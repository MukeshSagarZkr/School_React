import React from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AddDepartment from "./Components/Department/AddDepartment";
import ListDepartments from "./Components/Department/DepartmentListing"; // Assuming you have a departments listing component

const App = () => {
  return (
    <Router>
      <div className="container">
        <h1 className="text-center my-4">Company and Department Management</h1>
        <Routes>
          <Route path="/add-dept" element={<AddDepartment />} />
          <Route path="/list-dept" element={<ListDepartments />} />
          <Route path="/" element={<ListDepartments />} /> 
        </Routes>
      </div>
    </Router>
  );
};

export default App;
