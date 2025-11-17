Submission for the take home assignment
``npm install``
``npm run dev``
Accessible via
``http://localhost:3000``
Each task consists of the following.

# Task 1
 ### AIO Table
**File: components/Table.tsx**<br/>
-All-in-one table, contains filtering and sorting. <br/>
-Pagination is a subcomponent<br/>
-Fully reusable<br/>

# Task 2
 ### Edge/Node Table, with Canvas
**File: components/ProcessFlowEditor.tsx**<br/>
-Node Table with (CRUD)<br/>
-Edge Table with (CRUD)<br/>
-Canvas visualization connecting nodes with arrows, updates every change reflected in Node and Edge table.

# Task 3
### Report Generator
** File: components/ReportGen.tsx<br/>**
API route: app/api/report/route.ts**<br/>
Loads dataset from mock_results.json<br/>

Summarizes:
-main_summary_text<br/>
-top_summary_text<br/>
-impact_summary_text<br/>
-sample KPI values<br/>
-“Generate AI Report” button sends a compacted dataset to an LLM<br/>
-Uses Groq LLM (llama-3.1-8b-instant)<br/>
-Allows pdf generation using jspdf<br/>

``Can register for a groqcloud account via https://console.groq.com/ for the input an API key for LLM demostration, it's free and has no limit.
.env file needs to be created with the following  GROQ_API_KEY="your-api-key""``

# Task 4
 ### Charts<br/>
**File: components/Charts.tsx**<br/>
Charts used<br/>
-Line Chart<br/>
-Scatter Plot<br/>
-Bar Chart<br/>

If there are any questions, feel free to reach out to me via the same email! 
