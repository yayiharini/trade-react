import {Typography } from "@mui/material";
import React from "react";
import { Bar } from "react-chartjs-2";
import {
  extractLabels,
  extractSectorData,
  generateSectorColors,
} from "../../Helpers/ChartHelpers";
import TmsSubChartModal from "./TmsSubChartModal";
import { barChartConfig } from "./TmsChartsConfig";
import axios from "axios";
import * as Constants from "../../Constants";
import { TRADE_ENDPOINT } from "../../Constants";

const barColor = generateSectorColors();

function TmsSubBarChart(props) {
  const [subBarChartData, setSubBarChartData] = React.useState(null);
  React.useEffect(() => {
    async function fetchSubBarChartData() {
      try {
        const response = await axios.get(
          TRADE_ENDPOINT + `/getSubBarChartData`,
          {
            params: {
              ...props.requestData,
              [Constants.MATERIAL_GROUP]: props.title,
            },
          }
        );
        console.log(
          "------------Sub Bar Chart data from server ---------------"
        );
        console.log(response);
        if (response && response.status === 200) {
          setSubBarChartData({ ...response.data.subPieChartData });
        } else {
          console.log("Setting error else Sub Bar Chart");
          setSubBarChartData("ERROR");
        }
      } catch (e) {
        console.log(e);
        console.log("Setting error catch Sub Bar Chart");
        setSubBarChartData("ERROR");
      }
    }
    fetchSubBarChartData();
  }, [props.requestData]);

  if (!subBarChartData) {
    return <Typography>Loading ....</Typography>;
  } else if (subBarChartData && subBarChartData === "ERROR") {
    return <Typography>No chart data !!</Typography>;
  }

  const barChartData = subBarChartData;
  console.log("----------Sub bar chart data in sub Pie chart-------------");
  console.log(barChartData);

  const materialGroupLabels = extractLabels(
    barChartData.material_category_list
  );

  const barDataPoints = extractSectorData(
    materialGroupLabels,
    barChartData.material_category_list
  );

  const data = {
    labels: materialGroupLabels,
    datasets: [
      {
        label: "Material categories",
        data: barDataPoints,
        backgroundColor: barColor,
        borderColor: barColor,
        borderWidth: 1,
      },
    ],
  };
  return (
    <>
      <Bar
        options={{ ...barChartConfig, maintainAspectRatio: true }}
        data={data}
      />
    </>
  );
}

export default function TmsBarChart(props) {
  const [modalState, setOpenModal] = React.useState(false);
  const [barChartData, setBarChartData] = React.useState(null);
  const [matGrpForSubBarChart, setMatGrpForSubBarChart] = React.useState(null);

  React.useEffect(async () => {
    try {
      const response = await axios.get(
        TRADE_ENDPOINT + `/getBarChartData`,
        {
          params: props.requestData,
        }
      );
      console.log("------------ Bar chart data from server ---------------");
      console.log(response);
      if (response && response.status === 200) {
        setBarChartData([...response.data.pieChartData]);
      } else {
        console.log("Setting error else");
        setBarChartData("ERROR");
      }
    } catch (e) {
      console.log(e);
      console.log("Setting error catch");
      setBarChartData("ERROR");
    }
  }, [props.requestData]);

  const handleOpen = () => setOpenModal(true);
  const handleClose = () => setOpenModal(false);

  if (!barChartData) {
    return <Typography>Loading ....</Typography>;
  } else if (barChartData && barChartData === "ERROR" || Object.keys(barChartData).length == 0) {
    return <Typography>No data appears for the selected date range and filter</Typography>;
  }

  console.log("---------- Bar chart data -------------");
  console.log(barChartData);

  const materialGroupLabels = extractLabels(barChartData);
  console.log("labels", materialGroupLabels);
  const barDataPoints = extractSectorData(materialGroupLabels, barChartData);

  const handleBarClicked = (e, eventDataArray) => {
    console.clear();
    //console.log(e);
    console.log(eventDataArray[0].index);
    console.log(eventDataArray);

    const materialGroup =
      barChartData[eventDataArray[0].index]["material_group"];

    setMatGrpForSubBarChart(materialGroup);
    setOpenModal(true);
  };

  const data = {
    labels: materialGroupLabels,
    datasets: [
      {
        label: "Material groups",
        data: barDataPoints,
        backgroundColor: barColor,
      },
    ],
  };

  return (
    <>
      {barChartData && barChartData !== "ERROR" && (
        <TmsSubChartModal
          modalState={modalState}
          handleClose={handleClose}
          title={matGrpForSubBarChart}
        >
          <TmsSubBarChart
            requestData={props.requestData}
            title={matGrpForSubBarChart}
            matGrpForSubPieChart={matGrpForSubBarChart}
          />
        </TmsSubChartModal>
      )}

      <div style={{ height: "45vh", width: "100%", display: "flex", flex: 1 }}>
        <Bar
          options={{ ...barChartConfig, onClick: handleBarClicked }}
          data={data}
        />
      </div>
    </>
  );
}
