import { useState, useEffect, useMemo } from "react";
import Plot from "react-plotly.js";
import Papa from "papaparse";
import axios from "axios";
import { API_URL } from '../config/constants'

// ✅ LOCAL JSON
import resultsData from "../config/preposcovid_result.json";

/* ------------------- API helpers ------------------- */
const fetchShapiroWilk = async (grades) => {
    try {
        const { data } = await axios.post(`${API_URL}/preposcovid/shapiro-wilk`, {
            numbers: grades
        });
        return data;
    } catch (error) {
        console.error("Error fetching Shapiro-Wilk:", error);
        return null;
    }
};

const fetchMannWhitney = async (group1, group2) => {
    try {
        const { data } = await axios.post(`${API_URL}/preposcovid/mannwhitney`, {
            group1,
            group2
        });
        return data;
    } catch (error) {
        console.error("Error fetching Mann-Whitney:", error);
        return null;
    }
};

const fetchTStudent = async (group1, group2) => {
    try {
        const { data } = await axios.post(`${API_URL}/preposcovid/stuents_t`, {
            group1,
            group2
        });
        return data;
    } catch (error) {
        console.error("Error fetching T-test:", error);
        return null;
    }
};

const compareYears = async (year1, year2, shapiro1, shapiro2, data1, data2) => {
    if (!shapiro1 || !shapiro2) return null;

    const isNormal1 = shapiro1.result === "Likely Normal";
    const isNormal2 = shapiro2.result === "Likely Normal";

    const group1 = data1.map(item => item.grade);
    const group2 = data2.map(item => item.grade);

    return isNormal1 && isNormal2
        ? await fetchTStudent(group1, group2)
        : await fetchMannWhitney(group1, group2);
};

/* ------------------- Component ------------------- */

const Filter = () => {
    const [data, setData] = useState([]);

    const [genderFilter, setGenderFilter] = useState("");
    const [topicFilter, setTopicFilter] = useState("");
    const [frequencyFilter, setFrequencyFilter] = useState([0, 1]);
    const [openEndedFilter, setOpenEndedFilter] = useState(null);

    const [shapiro2019, setShapiro2019] = useState(null);
    const [shapiro2022, setShapiro2022] = useState(null);
    const [shapiro2023, setShapiro2023] = useState(null);

    const [test2019_2022, setTest2019_2022] = useState(null);
    const [test2019_2023, setTest2019_2023] = useState(null);
    const [test2022_2023, setTest2022_2023] = useState(null);

    /* ✅ LOAD LOCAL DATA */
    useEffect(() => {
        setData(resultsData);
    }, []);

    /* ------------------- Filtering ------------------- */

    const filteredData = useMemo(() => 
        data.filter(item => {
            const withinFrequency =
                item.frequency >= frequencyFilter[0] &&
                item.frequency <= frequencyFilter[1];

            const matchesGender = genderFilter ? item.gender === genderFilter : true;
            const matchesTopic = topicFilter ? item.topic === topicFilter : true;
            const matchesOpenEnded =
                openEndedFilter === null || item.open_ended === openEndedFilter;

            return withinFrequency && matchesGender && matchesTopic && matchesOpenEnded;
        }),
        [data, genderFilter, topicFilter, frequencyFilter, openEndedFilter]
    );

    /* ------------------- Split by year ------------------- */

    const data2019 = useMemo(
        () => filteredData.filter(item => item.semester?.startsWith("2019")),
        [filteredData]
    );

    const data2022 = useMemo(
        () => filteredData.filter(item => item.semester?.startsWith("2022")),
        [filteredData]
    );

    const data2023 = useMemo(
        () => filteredData.filter(item => item.semester?.startsWith("2023")),
        [filteredData]
    );

    /* ------------------- Statistical tests ------------------- */

    useEffect(() => {
        if (!filteredData.length) return;

        const runTests = async () => {
            const s2019 = await fetchShapiroWilk(data2019.map(i => i.grade));
            const s2022 = await fetchShapiroWilk(data2022.map(i => i.grade));
            const s2023 = await fetchShapiroWilk(data2023.map(i => i.grade));

            setShapiro2019(s2019);
            setShapiro2022(s2022);
            setShapiro2023(s2023);

            setTest2019_2022(await compareYears("2019", "2022", s2019, s2022, data2019, data2022));
            setTest2019_2023(await compareYears("2019", "2023", s2019, s2023, data2019, data2023));
            setTest2022_2023(await compareYears("2022", "2023", s2022, s2023, data2022, data2023));
        };

        runTests();
    }, [filteredData, data2019, data2022, data2023]);

    /* ------------------- Plot data ------------------- */

    const boxplot = (name, data) => ({
        type: "box",
        name,
        y: data.map(i => i.grade)
    });

    /* ------------------- CSV export ------------------- */

    const exportToCSV = () => {
        const csv = Papa.unparse(filteredData);
        const link = document.createElement("a");
        link.href = `data:text/csv;charset=utf-8,${encodeURIComponent(csv)}`;
        link.download = "filtered_data.csv";
        link.click();
    };


return (
  <div className="max-w-7xl mx-auto px-6">
    {/* ===================== FILTERS ===================== */}
    <div className="mt-8">
      <div className="bg-gray-50 border rounded-md px-4 py-3">
        <h3 className="text-sm font-semibold mb-3 text-gray-700">
          Filters
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-3 items-end">

          {/* Gender */}
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Gender
            </label>
            <select
              className="w-full border rounded px-2 py-1 text-sm"
              value={genderFilter}
              onChange={(e) => setGenderFilter(e.target.value)}
            >
              <option value="">All</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          </div>

          {/* Topic */}
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Topic
            </label>
            <select
              className="w-full border rounded px-2 py-1 text-sm"
              value={topicFilter}
              onChange={(e) => setTopicFilter(e.target.value)}
            >
              <option value="">All</option>
              <option value="SE Introduction">SE Introduction</option>
              <option value="Software Procesess and Agile Methods">
                Software Processes and Agile Methods
              </option>
              <option value="Software Requirements and Use Cases">
                Software Requirements and Use Cases
              </option>
              <option value="Design with UML">Design with UML</option>
              <option value="Implementation">Implementation</option>
              <option value="Software Testing and Software Quality">
                Software Testing and Software Quality
              </option>
              <option value="Software Architecture">
                Software Architecture
              </option>
            </select>
          </div>

          {/* Frequency */}
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Frequency
            </label>
            <div className="flex gap-2">
              <input
                type="number"
                min="0"
                max="1"
                step="0.01"
                className="w-full border rounded px-2 py-1 text-sm"
                value={frequencyFilter[0]}
                onChange={(e) =>
                  setFrequencyFilter([
                    parseFloat(e.target.value),
                    frequencyFilter[1]
                  ])
                }
              />
              <input
                type="number"
                min="0"
                max="1"
                step="0.01"
                className="w-full border rounded px-2 py-1 text-sm"
                value={frequencyFilter[1]}
                onChange={(e) =>
                  setFrequencyFilter([
                    frequencyFilter[0],
                    parseFloat(e.target.value)
                  ])
                }
              />
            </div>
          </div>

          {/* Question Type */}
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Question Type
            </label>
            <select
              className="w-full border rounded px-2 py-1 text-sm"
              value={openEndedFilter === null ? "" : openEndedFilter}
              onChange={(e) =>
                setOpenEndedFilter(
                  e.target.value === "" ? null : Number(e.target.value)
                )
              }
            >
              <option value="">All</option>
              <option value="0">Closed</option>
              <option value="1">Open-ended</option>
            </select>
          </div>

          {/* Export */}
          <div className="md:text-right">
            <button
              onClick={exportToCSV}
              className="bg-blue-600 text-white text-sm px-3 py-1.5 rounded hover:bg-blue-700"
            >
              Export
            </button>
          </div>
        </div>
      </div>
    </div>
    {/* ===================== PLOT ===================== */}
    <div className="mb-10 flex justify-center">
      <div className="w-full max-w-5xl">
        <Plot
          data={[
            boxplot("2019", data2019),
            boxplot("2022", data2022),
            boxplot("2023", data2023),
          ]}
          layout={{
            title: "Student Grades for 2019, 2022, and 2023",
            yaxis: { title: "Grades" },
            xaxis: { title: "Year", type: "category" },
            margin: { t: 50, l: 50, r: 30, b: 50 }
          }}
          useResizeHandler
          className="w-full"
        />
      </div>
    </div>

    {/* ===================== TABLES ===================== */}
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-10">

      {/* Year Stats */}
      <div>
        <h2 className="text-lg font-semibold mb-3">Year Statistics</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full border text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="border px-3 py-2">Year</th>
                <th className="border px-3 py-2">Mean</th>
                <th className="border px-3 py-2">Std Dev</th>
                <th className="border px-3 py-2">Shapiro (W)</th>
                <th className="border px-3 py-2">P-Value</th>
                <th className="border px-3 py-2">Normal?</th>
              </tr>
            </thead>
            <tbody>
              {shapiro2019 && (
                <tr>
                  <td className="border px-3 py-2">2019</td>
                  <td className="border px-3 py-2">{shapiro2019.mean?.toFixed(2)}</td>
                  <td className="border px-3 py-2">{shapiro2019.stddev?.toFixed(2)}</td>
                  <td className="border px-3 py-2">{shapiro2019.statistic?.toFixed(2)}</td>
                  <td className="border px-3 py-2">{Number(shapiro2019.p_value).toExponential(2)}</td>
                  <td className="border px-3 py-2">{shapiro2019.result}</td>
                </tr>
              )}
              {shapiro2022 && (
                <tr>
                  <td className="border px-3 py-2">2022</td>
                  <td className="border px-3 py-2">{shapiro2022.mean?.toFixed(2)}</td>
                  <td className="border px-3 py-2">{shapiro2022.stddev?.toFixed(2)}</td>
                  <td className="border px-3 py-2">{shapiro2022.statistic?.toFixed(2)}</td>
                  <td className="border px-3 py-2">{Number(shapiro2022.p_value).toExponential(2)}</td>
                  <td className="border px-3 py-2">{shapiro2022.result}</td>
                </tr>
              )}
              {shapiro2023 && (
                <tr>
                  <td className="border px-3 py-2">2023</td>
                  <td className="border px-3 py-2">{shapiro2023.mean?.toFixed(2)}</td>
                  <td className="border px-3 py-2">{shapiro2023.stddev?.toFixed(2)}</td>
                  <td className="border px-3 py-2">{shapiro2023.statistic?.toFixed(2)}</td>
                  <td className="border px-3 py-2">{Number(shapiro2023.p_value).toExponential(2)}</td>
                  <td className="border px-3 py-2">{shapiro2023.result}</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Test Results */}
      <div>
        <h2 className="text-lg font-semibold mb-3">Test Results</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full border text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="border px-3 py-2">Year Pair</th>
                <th className="border px-3 py-2">Test</th>
                <th className="border px-3 py-2">Significant</th>
              </tr>
            </thead>
            <tbody>
              {test2019_2022 && (
                <tr>
                  <td className="border px-3 py-2">2019 vs 2022</td>
                  <td className="border px-3 py-2">{test2019_2022.test_name}</td>
                  <td className="border px-3 py-2">{test2019_2022.significance}</td>
                </tr>
              )}
              {test2019_2023 && (
                <tr>
                  <td className="border px-3 py-2">2019 vs 2023</td>
                  <td className="border px-3 py-2">{test2019_2023.test_name}</td>
                  <td className="border px-3 py-2">{test2019_2023.significance}</td>
                </tr>
              )}
              {test2022_2023 && (
                <tr>
                  <td className="border px-3 py-2">2022 vs 2023</td>
                  <td className="border px-3 py-2">{test2022_2023.test_name}</td>
                  <td className="border px-3 py-2">{test2022_2023.significance}</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
);

  
};

export default Filter;