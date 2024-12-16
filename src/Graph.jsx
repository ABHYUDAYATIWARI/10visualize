import React, { useEffect, useState } from "react";
import * as XLSX from "xlsx";
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Legend, PieChart, Pie, Cell } from "recharts";
import { useNavigate } from "react-router-dom";

const ExcelToGraphs = () => {
  const [excelData, setExcelData] = useState([]);
  const [ctcHistogramData, setCtcHistogramData] = useState([]);
  const [branchPieData, setBranchPieData] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchExcelData();
  }, []);

  const fetchExcelData = async () => {
    try {
      const response = await fetch("src/assets/data.xlsx");
      const blob = await response.arrayBuffer();
      const workbook = XLSX.read(blob, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const data = XLSX.utils.sheet_to_json(sheet);

      setExcelData(data);
      processCTCHistogram(data);
      processBranchPieChart(data);
    } catch (error) {
      console.error("Error fetching Excel file:", error);
    }
  };

  const processCTCHistogram = (data) => {
    const ctcRanges = {};
    for (let i = 0; i <= 50; i += 5) {
      ctcRanges[`${i}-${i + 5}`] = 0;
    }
    ctcRanges["50+"] = 0;

    data.forEach((item) => {
      const ctc = parseFloat(item["CTC Offered (LPA)"]);
      if (isNaN(ctc)) return;

      let found = false;
      for (let i = 0; i <= 50; i += 5) {
        if (ctc > i && ctc <= i + 5) {
          ctcRanges[`${i}-${i + 5}`]++;
          found = true;
          break;
        }
      }
      if (!found && ctc > 50) {
        ctcRanges["50+"]++;
      }
    });

    const histogramData = Object.keys(ctcRanges).map((range) => ({
      range,
      count: ctcRanges[range],
    }));

    setCtcHistogramData(histogramData);
  };

  const processBranchPieChart = (data) => {
    const branchCounts = {};

    data.forEach((item) => {
      const branch = item["Program and Branch"];
      if (branch && branch.startsWith("BTech")) {
        branchCounts[branch] = (branchCounts[branch] || 0) + 1;
      }
    });

    const pieChartData = Object.keys(branchCounts).map((branch) => ({
      name: branch,
      value: branchCounts[branch],
    }));

    setBranchPieData(pieChartData);
  };

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#A28AD5"];

  // Navigate to the branch details page on click
  const handleBranchClick = (branchName) => {
    navigate(`/branch/${branchName}`);
  };

  return (
    <div className="  flex justify-center flex-col">
      <h1 className="flex justify-center text-4xl">Excel Data Visualization</h1>
      <div className=" flex justify-center">
        {ctcHistogramData.length > 0 && (
          <div>
            <h2 className="flex justify-center text-xl">CTC Range Histogram</h2>
            <BarChart width={800} height={400} data={ctcHistogramData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="range" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" fill="#82ca9d" />
            </BarChart>
          </div>
        )}
      </div>
      <div className="flex justify-center">
        {branchPieData.length > 0 && (
          <div>
            <h2 className=" flex justify-center text-xl">Number of Students Placed in Each BTech Branch</h2>
            <PieChart width={500} height={500}>
              <Pie
                data={branchPieData}
                cx="50%"
                cy="50%"
                outerRadius={150}
                label
                dataKey="value"
                onClick={({ name }) => handleBranchClick(name)} // Handle click on Pie chart
              >
                {branchPieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExcelToGraphs;
