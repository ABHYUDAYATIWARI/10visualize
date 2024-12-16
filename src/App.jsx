import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import ExcelToGraphs from "./Graph";
import BranchDetailsPage from "./pages/BranchDetailsPage"; // New page component

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<ExcelToGraphs />} />
        <Route path="/branch/:branchName" element={<BranchDetailsPage />} />
      </Routes>
    </Router>
  );
};

export default App;
