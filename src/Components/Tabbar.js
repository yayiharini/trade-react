import * as React from "react";
import PropTypes from "prop-types";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import BasicTable from "./table";
import { Grid } from "@mui/material";
import TmsPieChart from "./TmsCharts/TmsPieChart";
import TmsBarChart from "./TmsCharts/TmsBarChart";
import TmsLineChart from "./TmsCharts/TmsLineChart";
import TmsLitterIndexChart from "./TmsCharts/TmsLitterIndexChart";

function TabPanel(props) {
  const { records, children, value, index, ...other } = props;
  
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `tab-${index}`,
    "aria-controls": `tabpanel-${index}`,
  };
}

function hasRequestData(props) {
  return (
    props.requestData && props.requestData.frdate && props.requestData.tdate
  );
}

export default function Tabbar(props) {
  let [value, setValue] = React.useState(0);

  const { records, pieChartData, lineChartData, requestData } = props;
  
  console.log("records in tab bar",records);
  console.log("request data",requestData);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Grid container spacing={2} columns={16}>
      <Grid item>
        <Box sx={{ width: "100%" }}>
          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <Tabs
              value={value}
              onChange={handleChange}
              aria-label="tabbar"
            >
              <Tab label="Table" {...a11yProps(0)} />
              <Tab label="Litter Index" {...a11yProps(1)} />
              <Tab label="Pie Chart" {...a11yProps(2)} />
              <Tab label="Bar Chart" {...a11yProps(3)} />
              <Tab label="Line Chart" {...a11yProps(4)} />
            </Tabs>
          </Box>
          <TabPanel value={value} index={0}>
            <BasicTable records={records} />
          </TabPanel>
          <TabPanel value={value} index={1}>
            {hasRequestData(props) ? (
              <TmsLitterIndexChart requestData={{ ...props.requestData }} />
            ) : (
              <Typography>No chart Data !!!</Typography>
            )}
          </TabPanel>
          <TabPanel value={value} index={2}>
            {hasRequestData(props) ? (
              <TmsPieChart requestData={{ ...props.requestData }} />
            ) : (
              <Typography>No chart Data !!!</Typography>
            )}
          </TabPanel>
          <TabPanel value={value} index={3}>
            {hasRequestData(props) ? (
              <TmsBarChart requestData={{ ...props.requestData }} />
            ) : (
              <Typography>No chart Data !!!</Typography>
            )}
          </TabPanel>
          <TabPanel value={value} index={4}>
            {hasRequestData(props) ? (
              <TmsLineChart
                lineChartData={{ ...(lineChartData["lineChartData"] ?? {}) }}
                requestData={{ ...props.requestData }}
              />
            ) : (
              <Typography>No chart Data !!!</Typography>
            )}
          </TabPanel>
        </Box>
      </Grid>
      
    </Grid>
  );
}
