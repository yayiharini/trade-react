import { Line } from "react-chartjs-2";
import { lineChartConfig } from "./TmsChartsConfig";
import {
  Typography,
  RadioGroup,
  FormControl,
  FormControlLabel,
  Radio,
} from "@mui/material";
import * as Constants from "../../Constants";
import {
  getDistinctMaterialGroupsList,
  populateMissingMaterialGroupAvgCount,
  createLineChartData,
} from "../../Helpers/ChartHelpers";
import React, { useState } from "react";
import axios from "axios";
import TmsSubLineChart from "./TmsSubLineChart";
import { TRADE_ENDPOINT } from "../../Constants";

export default function TmsLineChart(props) {
  const [lineChartFor, showLineChartFor] = React.useState(
    Constants.QUARTERLY_CATEGORY
  );

  if (!props || !props.requestData) {
    return <Typography>No chart data !!</Typography>;
  }

  const renderLineChart = () => {
    switch (lineChartFor) {
      case Constants.MONTHLY_CATEGORY:
        return (
          <>
            <TmsMonthlyLineChart requestData={{ ...props.requestData }} />
          </>
        );
      case Constants.QUARTERLY_CATEGORY:
        return (
          <>
            <TmsQuarterlyLineChart requestData={{ ...props.requestData }} />
          </>
        );

      case Constants.SEMI_ANNUALLY_CATEGORY:
          return (
            <>
              <TmsSemiAnuallyLineChart requestData={{ ...props.requestData }} />
            </>
          );
      default:
        return <TmsYearlyLineChart requestData={{ ...props.requestData }} />;
    }
  };

  return (
    <>
      <div style={{ display: "flex", flex: 1, width: "100%" }} className="pl-4">
        <br />
        <FormControl>
          <RadioGroup
            value={lineChartFor}
            onChange={(event) => showLineChartFor(event.target.value)}
            row
          >
            <FormControlLabel
              value={Constants.MONTHLY_CATEGORY}
              control={<Radio />}
              label="Monthly"
            />
            <FormControlLabel
              value={Constants.QUARTERLY_CATEGORY}
              control={<Radio />}
              label="Quarterly"
            />
            <FormControlLabel
             value={Constants.SEMI_ANNUALLY_CATEGORY}
             control={<Radio />}
             label="Semi Anually"
            />
            <FormControlLabel
              value={Constants.YEARLY_CATEGORY}
              control={<Radio />}
              label="Yearly"
            />
          </RadioGroup>
        </FormControl>
        <br />
        <br />
        <br />
      </div>
      {renderLineChart()}
    </>
  );
}

function TmsYearlyLineChart(props) {
  const [yearlyLineChartData, setYearlyLineChartData] = React.useState(null);
  const [showSubLineChart, setShowSubLineChart] = useState(false);
  const [selectedMaterialGroupLegend, setSelectedMaterialGroupLegend] =
    useState(null);

  React.useEffect(() => {
    async function fetchLineChartData() {
      try {
        const response = await axios.get(
          TRADE_ENDPOINT + `/getLineChartDataByYear`,
          {
            params: {
              ...props.requestData,
            },
          }
        );
        console.log(
          "------------Yearly line chart Chart data from server ---------------"
        );
        console.log(response);
        if (response && response.status === 200) {
          //setSubPieChartData({ ...response.data.subPieChartData });
          setYearlyLineChartData({
            ...response.data.material_group_yearly_data,
          });
        } else {
          console.log("Setting error else Sub Yearly line chart ");
          setYearlyLineChartData("ERROR");
        }
      } catch (e) {
        console.log(e);
        console.log("Setting error catch Yearly line chart ");
        setYearlyLineChartData("ERROR");
      }
    }
    fetchLineChartData();
  }, [props.requestData]);

  if (!yearlyLineChartData) {
    return <Typography>Loading ....</Typography>;
  } else if (yearlyLineChartData && yearlyLineChartData === "ERROR" || Object.keys(yearlyLineChartData[Constants.MATERIAL_GROUP_YEARLY_LIST]).length == 0) {
    return <Typography>No data appears for the selected date range and filter</Typography>;
  }

  console.log("-------- Yearly line chart data -------------");
  const distinctMaterialGroupsList = getDistinctMaterialGroupsList(
    yearlyLineChartData[Constants.DISTINCT_MATERIAl_GROUPS]
  );

  const copyOfyearlyLineChartData = JSON.parse(
    JSON.stringify({ ...yearlyLineChartData })
  );
  populateMissingMaterialGroupAvgCount(
    copyOfyearlyLineChartData[Constants.MATERIAL_GROUP_YEARLY_LIST],
    distinctMaterialGroupsList
  );

  console.log(
    "---------------- Created Line Yearly Chart Data ------------------"
  );
  const yearlyLineChartDataForRender = createLineChartData(
    copyOfyearlyLineChartData,
    distinctMaterialGroupsList
  );
  console.log(yearlyLineChartDataForRender);

  const data = yearlyLineChartDataForRender;

  const handleLegendClick = (e, legendItem, legend) => {
    if (legendItem.text) {
      setSelectedMaterialGroupLegend(legendItem.text);
      setShowSubLineChart(true);
    }
  };

  return (
    <>
      {selectedMaterialGroupLegend && (
        <TmsSubLineChart
          lineChartFor={Constants.YEARLY_CATEGORY}
          requestData={{ ...props.requestData }}
          showModal={showSubLineChart}
          handleModalClose={setShowSubLineChart}
          selectedMaterialGroup={selectedMaterialGroupLegend}
        />
      )}
      <div style={{ height: "45vh", width: "100%", display: "flex", flex: 1 }}>
        {data && (
          <Line
            options={{
              ...lineChartConfig,
              plugins: {
                legend: {
                  onClick: handleLegendClick,
                },
              },
            }}
            data={data}
          />
        )}
      </div>
    </>
  );
}

function TmsMonthlyLineChart(props) {
  //console.log("-------- Monthly line chart data -------------");

  const [monthlyLineChartData, setMonthlyLineChartData] = React.useState(null);
  const [showSubLineChart, setShowSubLineChart] = useState(false);
  const [selectedMaterialGroupLegend, setSelectedMaterialGroupLegend] =
    useState(null);

  React.useEffect(() => {
    async function fetchLineChartData() {
      try {
        const response = await axios.get(
          TRADE_ENDPOINT + `/getLineChartDataByMonth`,
          {
            params: {
              ...props.requestData,
            },
          }
        );
        console.log(
          "------------Monthly line chart Chart data from server ---------------"
        );
        console.log(response);
        if (response && response.status === 200) {
          //setSubPieChartData({ ...response.data.subPieChartData });
          setMonthlyLineChartData({
            ...response.data.material_group_monthly_data,
          });
        } else {
          console.log("Setting error else Monthly line chart ");
          setMonthlyLineChartData("ERROR");
        }
      } catch (e) {
        console.log(e);
        console.log("Setting error catch Monthly line chart ");
        setMonthlyLineChartData("ERROR");
      }
    }
    fetchLineChartData();
  }, [props.requestData]);

  if (!monthlyLineChartData) {
    return <Typography>Loading ....</Typography>;
  } else if (monthlyLineChartData && monthlyLineChartData === "ERROR" || Object.keys(monthlyLineChartData[Constants.MATERIAL_GROUP_MONTHLY_LIST]).length == 0) {
    return <Typography>No data appears for the selected date range and filter</Typography>;
  }

  const distinctMaterialGroupsList = getDistinctMaterialGroupsList(
    monthlyLineChartData[Constants.DISTINCT_MATERIAl_GROUPS]
  );
  console.log(monthlyLineChartData);

  const copyOfmonthlyLineChartData = JSON.parse(
    JSON.stringify({ ...monthlyLineChartData })
  );
  console.log(copyOfmonthlyLineChartData);
  console.log(distinctMaterialGroupsList);
  console.log("-------------- END Monthly line chart data -------------");

  const data = createLineChartData(
    copyOfmonthlyLineChartData,
    distinctMaterialGroupsList
  );

  console.log("------- Monthly FINAL DATA SET ------------");
  console.log(data);

  const handleLegendClick = (e, legendItem, legend) => {
    if (legendItem.text) {
      setSelectedMaterialGroupLegend(legendItem.text);
      setShowSubLineChart(true);
    }
  };

  return (
    <>
      {selectedMaterialGroupLegend && (
        <TmsSubLineChart
          lineChartFor={Constants.MONTHLY_CATEGORY}
          requestData={{ ...props.requestData }}
          showModal={showSubLineChart}
          handleModalClose={setShowSubLineChart}
          selectedMaterialGroup={selectedMaterialGroupLegend}
        />
      )}
      {
        <div
          style={{ height: "45vh", width: "100%", display: "flex", flex: 1 }}
        >
          {data && (
            <Line
              options={{
                ...lineChartConfig,
                plugins: {
                  legend: {
                    onClick: handleLegendClick,
                  },
                },
              }}
              data={data}
            />
          )}
        </div>
      }
    </>
  );
}
function TmsQuarterlyLineChart(props) {
  const [quarterlyLineChartData, setQuarterlyLineChartData] =
    React.useState(null);
  const [showSubLineChart, setShowSubLineChart] = useState(false);
  const [selectedMaterialGroupLegend, setSelectedMaterialGroupLegend] =
    useState(null);

  React.useEffect(() => {
    async function fetchLineChartData() {
      try {
        const response = await axios.get(
          TRADE_ENDPOINT + `/getLineChartDataByQuarter`,
          {
            params: {
              ...props.requestData,
            },
          }
        );
        console.log(
          "------------Quarterly line chart Chart data from server ---------------"
        );
        console.log(response);
        if (response && response.status === 200) {
          //setSubPieChartData({ ...response.data.subPieChartData });
          setQuarterlyLineChartData({
            ...response.data.material_group_quarterly_data,
          });
        } else {
          console.log("Setting error else Quarterly line chart ");
          setQuarterlyLineChartData("ERROR");
        }
      } catch (e) {
        console.log(e);
        console.log("Setting error catch Quarterly line chart ");
        setQuarterlyLineChartData("ERROR");
      }
    }
    fetchLineChartData();
  }, [props.requestData]);

  if (!quarterlyLineChartData) {
    return <Typography>Loading ....</Typography>;
  } else if (quarterlyLineChartData && quarterlyLineChartData === "ERROR" || Object.keys(quarterlyLineChartData[Constants.MATERIAL_GROUP_QUARTERLY_LIST]).length == 0) {
    return <Typography>No data appears for the selected date range and filter</Typography>;
  }

  console.log("-------- Quarterly line chart data -------------");
  const distinctMaterialGroupsList = getDistinctMaterialGroupsList(
    quarterlyLineChartData[Constants.DISTINCT_MATERIAl_GROUPS]
  );
  const copyOfquarterlyLineChartData = JSON.parse(
    JSON.stringify({ ...quarterlyLineChartData })
  );
  console.log(copyOfquarterlyLineChartData);
  console.log(distinctMaterialGroupsList);
  console.log("-------------- END Quarterly line chart data -------------");

  const data = createLineChartData(
    quarterlyLineChartData,
    distinctMaterialGroupsList
  );
  console.log("-------- Quarterly line chart data FINALLLLLLLL -------------");
  console.log(data);

  const handleLegendClick = (e, legendItem, legend) => {
    if (legendItem.text) {
      setSelectedMaterialGroupLegend(legendItem.text);
      setShowSubLineChart(true);
    }
  };

  return (
    <>
      {selectedMaterialGroupLegend && (
        <TmsSubLineChart
          lineChartFor={Constants.QUARTERLY_CATEGORY}
          requestData={{ ...props.requestData }}
          showModal={showSubLineChart}
          handleModalClose={setShowSubLineChart}
          selectedMaterialGroup={selectedMaterialGroupLegend}
        />
      )}
      {
        <div
          style={{ height: "45vh", width: "100%", display: "flex", flex: 1 }}
        >
          {data && (
            <Line
              options={{
                ...lineChartConfig,
                plugins: {
                  legend: {
                    onClick: handleLegendClick,
                  },
                },
              }}
              data={data}
            />
          )}
        </div>
      }
    </>
  );
}


function TmsSemiAnuallyLineChart(props){

  const [quarterlyLineChartData, setQuarterlyLineChartData] =
    React.useState(null);
  const [showSubLineChart, setShowSubLineChart] = useState(false);
  const [selectedMaterialGroupLegend, setSelectedMaterialGroupLegend] =
    useState(null);

  React.useEffect(() => {
    async function fetchLineChartData() {
      try {
        const response = await axios.get(
          TRADE_ENDPOINT + `/getLineChartDataSemiAnually`,
          {
            params: {
              ...props.requestData,
            },
          }
        );
        console.log(
          "------------Quarterly line chart Chart data from server ---------------"
        );
        console.log(response);
        if (response && response.status === 200) {
          //setSubPieChartData({ ...response.data.subPieChartData });
          setQuarterlyLineChartData({
            ...response.data.material_group_monthly_data,
          });
        } else {
          console.log("Setting error else Quarterly line chart ");
          setQuarterlyLineChartData("ERROR");
        }
      } catch (e) {
        console.log(e);
        console.log("Setting error catch Quarterly line chart ");
        setQuarterlyLineChartData("ERROR");
      }
    }
    fetchLineChartData();
  }, [props.requestData]);

  if (!quarterlyLineChartData) {
    return <Typography>Loading ....</Typography>;
  } else if (quarterlyLineChartData && quarterlyLineChartData === "ERROR" || Object.keys(quarterlyLineChartData[Constants.MATERIAL_GROUP_MONTHLY_LIST]).length == 0) {
    return <Typography>No data appears for the selected date range and filter</Typography>;
  }

  console.log("-------- Quarterly line chart data -------------");
  const distinctMaterialGroupsList = getDistinctMaterialGroupsList(
    quarterlyLineChartData[Constants.DISTINCT_MATERIAl_GROUPS]
  );
  const copyOfquarterlyLineChartData = JSON.parse(
    JSON.stringify({ ...quarterlyLineChartData })
  );
  console.log(copyOfquarterlyLineChartData);
  console.log(distinctMaterialGroupsList);
  console.log("-------------- END Quarterly line chart data -------------");

  const data = createLineChartData(
    quarterlyLineChartData,
    distinctMaterialGroupsList
  );
  console.log("-------- Quarterly line chart data FINALLLLLLLL -------------");
  console.log(data);

  const handleLegendClick = (e, legendItem, legend) => {
    if (legendItem.text) {
      setSelectedMaterialGroupLegend(legendItem.text);
      setShowSubLineChart(true);
    }
  };

  return (
    <>
      {selectedMaterialGroupLegend && (
        <TmsSubLineChart
          lineChartFor={Constants.SEMI_ANNUALLY_CATEGORY}
          requestData={{ ...props.requestData }}
          showModal={showSubLineChart}
          handleModalClose={setShowSubLineChart}
          selectedMaterialGroup={selectedMaterialGroupLegend}
        />
      )}
      {
        <div
          style={{ height: "45vh", width: "100%", display: "flex", flex: 1 }}
        >
          {data && (
            <Line
              options={{
                ...lineChartConfig,
                plugins: {
                  legend: {
                    onClick: handleLegendClick,
                  },
                },
              }}
              data={data}
            />
          )}
        </div>
      }
    </>
  );





}