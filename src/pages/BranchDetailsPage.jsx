import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, Legend, BarChart, Bar } from "recharts";
import * as XLSX from "xlsx";

const BranchDetailsPage = () => {
    const { branchName } = useParams();
    const [branchData, setBranchData] = useState([]);
    const [ctcHistogramData, setCtcHistogramData] = useState([]);
    const [avgCtc, setAvgCtc] = useState(0);
    const [medianCtc, setMedianCtc] = useState(0);
    const [scatterData, setScatterData] = useState([]);

    useEffect(() => {
        fetchExcelData();
    }, []);

    const fetchExcelData = async () => {
        try {
            // Fetching the Excel file from the assets folder
            const response = await fetch("/src/assets/data.xlsx");
            const blob = await response.arrayBuffer();
            const workbook = XLSX.read(blob, { type: "array" });
            const sheetName = workbook.SheetNames[0];
            const sheet = workbook.Sheets[sheetName];
            const data = XLSX.utils.sheet_to_json(sheet);

            setBranchDataByName(data);

        } catch (error) {
            console.error("Error fetching and parsing Excel file:", error);
        }
    };

    const setBranchDataByName = (data) => {
        // Filter data by the selected branch
        const branchData = data.filter((item) => item["Program and Branch"] === branchName);
        console.log(branchData);

        processCTCHistogram(branchData);
        calculateAvgAndMedianCTC(branchData);
        setBranchData(branchData);
        const cleanScatterData = branchData
            .map((item) => ({
                CGPA: parseFloat(item["CGPA"]),
                CTC: parseFloat(item["CTC Offered (LPA)"]),
            }))
            .filter((item) => !isNaN(item.CGPA) && !isNaN(item.CTC));
        setScatterData(cleanScatterData);
    };

    const calculateAvgAndMedianCTC = (data) => {
        const ctcs = data.map((item) => parseFloat(item["CTC Offered (LPA)"])).filter(Boolean);
        const avg = ctcs.reduce((acc, ctc) => acc + ctc, 0) / ctcs.length;

        const sortedCTC = ctcs.sort((a, b) => a - b);
        const median =
            sortedCTC.length % 2 === 0
                ? (sortedCTC[sortedCTC.length / 2 - 1] + sortedCTC[sortedCTC.length / 2]) / 2
                : sortedCTC[Math.floor(sortedCTC.length / 2)];

        setAvgCtc(avg);
        setMedianCtc(median);
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

    return (
        <div>
            <h1 className="flex justify-center text-4xl">Branch Details: {branchName}</h1>
            <br />
            <div className=" m-auto ">
                <p className="flex justify-center">Average CTC: {avgCtc}</p>
                <p className="flex justify-center">Median CTC: {medianCtc}</p>
                <br />
            </div>
            <div className="flex justify-center">
                <div>
                    <h2 className="flex justify-center text-xl">CTC Range Histogram</h2>
                    <BarChart width={800} height={400} data={ctcHistogramData}>
                        <XAxis dataKey="range" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="count" fill="#82ca9d" />
                    </BarChart>
                </div>
            </div>
        <br />
            <div className="flex justify-center">
                <div>
                    <h2>CGPA vs CTC (Scatter Plot)</h2>
                    <ScatterChart width={800} height={400}>
                        <CartesianGrid />
                        <XAxis type="number" dataKey="CGPA" name="CGPA" unit="" />
                        <YAxis type="number" dataKey="CTC" name="CTC (LPA)" unit="LPA" />
                        <Tooltip cursor={{ strokeDasharray: "3 3" }} />
                        <Legend />
                        <Scatter name="CGPA vs CTC" data={scatterData} fill="#8884d8" />
                    </ScatterChart>
                </div>
            </div>
        </div>
    );
};

export default BranchDetailsPage;
