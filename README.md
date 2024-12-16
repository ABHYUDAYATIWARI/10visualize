# Excel Data Visualization

This project visualizes data from an Excel sheet using **React** and **Recharts**. The application includes:
- A bar chart to display the histogram of CTC ranges.
- A pie chart to display the number of students placed in each B.Tech branch.

It is styled using **Tailwind CSS** to ensure a responsive and visually appealing design.

---

## Features

1. **CTC Range Histogram:**
   - Visualizes the count of CTC offers falling within specific ranges (e.g., 0-5 LPA, 5-10 LPA).
   - Interactive bar chart created using `BarChart` from Recharts.

2. **Pie Chart for Branch Placement:**
   - Displays the number of students placed in each B.Tech branch.
   - Clickable segments for interactivity.

3. **Responsive Design:**
   - Layout is fully responsive using Tailwind CSS.
   - Charts are centered and adapt to various screen sizes.

4. **Excel Data Parsing:**
   - Parses Excel files using the `xlsx` library.
   - Filters data dynamically based on branch selection.

---