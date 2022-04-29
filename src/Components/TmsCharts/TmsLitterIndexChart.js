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
import React from "react";
import axios from "axios";
import {
  createYearlyDataSet,
  createYearPartDataSet,
} from "../../Helpers/LitterIndexChartHelpers";
import { TRADE_ENDPOINT } from "../../Constants";

export default function TmsLitterIndexChart(props) {
  const [lineChartFor, showLineChartFor] = React.useState(
    Constants.MONTHLY_CATEGORY
  );

  if (!props || !props.requestData) {
    return <Typography>No chart data !!</Typography>;
  }

  const renderLineChart = () => {
    switch (lineChartFor) {
      case Constants.MONTHLY_CATEGORY:
        return (
          <>
            <TmsLitterIndexPartYearLineChart
              requestData={{ ...props.requestData }}
              chartFor={Constants.MONTHLY_CATEGORY}
            />
          </>
        );
      case Constants.QUARTERLY_CATEGORY:
        return (
          <>
            <TmsLitterIndexPartYearLineChart
              requestData={{ ...props.requestData }}
              chartFor={Constants.QUARTERLY_CATEGORY}
            />
          </>
        );
      case Constants.SEMI_ANNUALLY_CATEGORY:
        return (
          <>
            <TmsLitterIndexPartYearLineChart
              requestData={{ ...props.requestData }}
              chartFor={Constants.SEMI_ANNUALLY_CATEGORY}
            />
          </>
        );

      default:
        return (
          <>
            <TmsLitterIndexYearlyLineChart
              requestData={{ ...props.requestData }}
            />
          </>
        );
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
              label="Semi annually"
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

/*
 * Creates line chart for avg litter index by Year
 */
function TmsLitterIndexYearlyLineChart(props) {
  const [litterIndexYearlyLineChartData, setLitterIndexYearlyLineChartData] =
    React.useState(null);
  React.useEffect(() => {
    async function fetchLineChartData() {
      try {
        const response = await axios.get(
          TRADE_ENDPOINT + `/getLitterIndexDataByYear`,
          {
            params: {
              ...props.requestData,
            },
          }
        );
        console.log(
          "------------Litter index Yearly line chart Chart data from server ---------------"
        );
        console.log(response);
        if (response && response.status === 200) {
          //setSubPieChartData({ ...response.data.subPieChartData });
          setLitterIndexYearlyLineChartData({
            ...response.data,
          });
          console.log(response);
        } else {
          console.log("Setting error else Litter index  Yearly line chart ");
          setLitterIndexYearlyLineChartData("ERROR");
        }
      } catch (e) {
        console.log(e);
        console.log("Setting error catch Litter index  Yearly line chart ");
        setLitterIndexYearlyLineChartData("ERROR");
      }
    }
    fetchLineChartData();
  }, [props.requestData]);

  if (!litterIndexYearlyLineChartData) {
    return <Typography>Loading ....</Typography>;
  } else if (
    litterIndexYearlyLineChartData &&
    litterIndexYearlyLineChartData === "ERROR"
  ) {
    return <Typography>No chart data !!</Typography>;
  }

  const labels = litterIndexYearlyLineChartData[Constants.X_AXIS_LABELS];

  const data = {
    labels,
    datasets: createYearlyDataSet(
      litterIndexYearlyLineChartData["litter_index_yearly_data"],
      litterIndexYearlyLineChartData["distinct_plu"]
    ),
  };

  console.log(data);

  return (
    <>
      <div style={{ height: "45vh", width: "100%", display: "flex", flex: 1 }}>
        {data && (
          <Line
            options={{
              ...lineChartConfig,
              scales: {
                ...lineChartConfig.scales,
                y: {
                  beginAtZero:true,
                  title: {
                    display: true,
                    text: "# Avg of Litter assement",
                  },
                },
              },
            }}
            data={data}
          />
        )}
      </div>
    </>
  );

  return <h1>Yearly</h1>;
}

/*
 * Creates line chart for avg litter index by Either
 * Month or Quarter depending on thr chartFor (prop)
 */
function TmsLitterIndexPartYearLineChart(props) {
  const [
    litterIndexPartYearLineChartData,
    setLitterIndexPartYearLineChartData,
  ] = React.useState(null);

  console.log("Request Data")
  console.log(props.requestData)

  React.useEffect(() => setLitterIndexPartYearLineChartData(null), []);
  React.useEffect(() => {
    async function fetchLineChartData() {
      try {
        let lastSegmentForApi = "getLitterIndexDataByMonth";
        switch (props.chartFor) {
          case Constants.SEMI_ANNUALLY_CATEGORY:
            lastSegmentForApi = "getLitterIndexSemiAnnuallyData";
            break;
          case Constants.QUARTERLY_CATEGORY:
            lastSegmentForApi = "getLitterIndexDataByQuarter";
            break;
          default:
            lastSegmentForApi = "getLitterIndexDataByMonth";
            break;
        }
        const response = await axios.get(
          TRADE_ENDPOINT + `/${lastSegmentForApi}`,
          {
            params: {
              ...props.requestData,
            },
          }
        );
        console.log(
          "------------Litter index PartYear line chart Chart data from server ---------------"
        );
        console.log(response);
        if (response && response.status === 200) {
          console.log(response);
          setLitterIndexPartYearLineChartData({
            ...response.data,
          });
        } else {
          console.log("Setting error else Litter index  PartYear line chart ");
          setLitterIndexPartYearLineChartData("ERROR");
        }
      } catch (e) {
        console.log(e);
        console.log("Setting error catch Litter index  PartYear line chart ");
        setLitterIndexPartYearLineChartData("ERROR");
      }
    }
    fetchLineChartData();
  }, [props.requestData, props.chartFor]);

  const hasCategoryData = (litterIndexPartYearLineChartData, chartFor) => {
    if (chartFor === Constants.MONTHLY_CATEGORY) {
      return litterIndexPartYearLineChartData["litter_index_monthly_data"];
    } else if (chartFor === Constants.QUARTERLY_CATEGORY) {
      return litterIndexPartYearLineChartData["litter_index_quarterly_data"];
    }

    return litterIndexPartYearLineChartData["litter_index_semi_annually"];
  };

  if (
    !litterIndexPartYearLineChartData ||
    !hasCategoryData(litterIndexPartYearLineChartData, props.chartFor)
  ) {
    return <Typography>Loading ....</Typography>;
  } else if (
    litterIndexPartYearLineChartData &&
    litterIndexPartYearLineChartData === "ERROR"
  ) {
    return <Typography>No chart data !!</Typography>;
  }

  const labels = litterIndexPartYearLineChartData[Constants.X_AXIS_LABELS];
  console.log("Firts look at data")
  console.log(litterIndexPartYearLineChartData)

  let litterIndexPartYearLineChartDataKey = "litter_index_monthly_data";

  switch (props.chartFor) {
    case Constants.MONTHLY_CATEGORY:
      litterIndexPartYearLineChartDataKey = "litter_index_monthly_data";
      break;
    case Constants.SEMI_ANNUALLY_CATEGORY:
      litterIndexPartYearLineChartDataKey = "litter_index_semi_annually";
      break;
    case Constants.QUARTERLY_CATEGORY:
      litterIndexPartYearLineChartDataKey = "litter_index_quarterly_data";
      break;
    default:
      litterIndexPartYearLineChartDataKey = "litter_index_monthly_data";
      break;
  }

  // console.log("Final object to proccess part year data");
  // console.log(
  //   litterIndexPartYearLineChartData[litterIndexPartYearLineChartDataKey]
  // );
  // return <></>;
  const data = {
    labels,
    datasets: createYearPartDataSet(
      litterIndexPartYearLineChartData[litterIndexPartYearLineChartDataKey],
      litterIndexPartYearLineChartData["distinct_plu"],
      litterIndexPartYearLineChartData["for_quarter"],
      litterIndexPartYearLineChartData["semi_annually"]
    ),
  };

  console.log("data for chart")
  console.log(data);

  return (
    <>
      <div style={{ height: "45vh", width: "100%", display: "flex", flex: 1 }}>
        {data && (
          <Line
            options={{
              ...lineChartConfig,
              scales: {
                ...lineChartConfig.scales,
                y: {
                  beginAtZero:true,
                  title: {
                    display: true,
                    text: "# Avg of Litter assement",
                  },
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
