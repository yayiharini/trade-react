import React from "react";
import { Pie } from "react-chartjs-2";
import {
  extractSectorData,
  extractLabels,
  generateSectorColors,
} from "../../Helpers/ChartHelpers";
import { Typography } from "@mui/material";
import TmsSubChartModal from "./TmsSubChartModal";
import { pieChartConfig } from "./TmsChartsConfig";
import axios from "axios";
import * as Constants from "../../Constants";
import {TRADE_ENDPOINT} from "../../Constants";
const colorsArray = generateSectorColors();

function TmsSubPieChart(props) {
  const [subPieChartData, setSubPieChartData] = React.useState(null);
  React.useEffect(() => {
    async function fetchPieChartData() {
      try {
        const response = await axios.get(
          TRADE_ENDPOINT + `/getSubPieChartData`,
          {
            params: {
              ...props.requestData,
              [Constants.MATERIAL_GROUP]: props.title,
            },
          }
        );
        console.log(
          "------------Sub Pie Chart data from server ---------------"
        );
        console.log(response);
        if (response && response.status === 200) {
          setSubPieChartData({ ...response.data.subPieChartData });
        } else {
          console.log("Setting error else Sub Pie Chart");
          setSubPieChartData("ERROR");
        }
      } catch (e) {
        console.log(e);
        console.log("Setting error catch Sub Pie Chart");
        setSubPieChartData("ERROR");
      }
    }
    fetchPieChartData();
  }, [props.requestData]);

  if (!subPieChartData) {
    return <Typography>Loading ....</Typography>;
  } else if (subPieChartData && subPieChartData === "ERROR") {
    return <Typography>No chart data !!</Typography>;
  }

  const pieChartData = subPieChartData;
  console.log("----------Sub Pie chart data in sub Pie chart-------------");
  console.log(pieChartData);

  const materialGroupLabels = extractLabels(
    pieChartData.material_category_list
  );

  const sectorDataPoints = extractSectorData(
    materialGroupLabels,
    pieChartData.material_category_list
  );

  const data = {
    labels: materialGroupLabels,
    datasets: [
      {
        label: "",
        data: sectorDataPoints,
        backgroundColor: colorsArray,
        borderColor: colorsArray,
        borderWidth: 1,
      },
    ],
  };

  return (
    <>
      <Pie
        data={data}
        options={{ ...pieChartConfig, maintainAspectRatio: true }}
      />
    </>
  );
}

export default function TmsPieChart(props) {
  const [modalState, setOpenModal] = React.useState(false);
  const [pieChartData, setPieChartData] = React.useState(null);
  const [matGrpForSubPieChart, setMatGrpForSubPieChart] = React.useState(null);

  React.useEffect(async () => {
    try {
      const response = await axios.get(
        TRADE_ENDPOINT + `/getPieChartData`,
        {
          params: props.requestData,
        }
      );
      console.log("------------ Pie chart data from server ---------------");
      console.log(response);
      if (response && response.status === 200) {
        setPieChartData([...response.data.pieChartData]);
      } else {
        console.log("Setting error else");
        setPieChartData("ERROR");
      }
    } catch (e) {
      console.log(e);
      console.log("Setting error catch");
      setPieChartData("ERROR");
    }
  }, [props.requestData]);

  const handleOpen = () => setOpenModal(true);
  const handleClose = () => setOpenModal(false);

  if (!pieChartData) {
    return <Typography>Loading ....</Typography>;
  } else if (pieChartData && pieChartData === "ERROR" || Object.keys(pieChartData).length == 0) {
    return <Typography>No data appears for the selected date range and filter</Typography>;
  }

  console.log("---------- Pie chart data -------------");
  console.log(pieChartData);

  const materialGroupLabels = extractLabels(pieChartData);
  const sectorDataPoints = extractSectorData(materialGroupLabels, pieChartData);

  const handleSectorClicked = (e, eventDataArray) => {
    console.clear();
    //console.log(e);
    console.log(eventDataArray[0].index);
    console.log(eventDataArray);

    const materialGroup =
      pieChartData[eventDataArray[0].index]["material_group"];

    setMatGrpForSubPieChart(materialGroup);
    setOpenModal(true);
  };

  const data = {
    labels: materialGroupLabels,
    datasets: [
      {
        label: "Material categories",
        data: sectorDataPoints,
        backgroundColor: colorsArray,
        borderColor: colorsArray,
        borderWidth: 1,
      },
    ],
  };
  return (
    <>
      {pieChartData && pieChartData !== "ERROR" && (
        <TmsSubChartModal
          modalState={modalState}
          handleClose={handleClose}
          title={matGrpForSubPieChart}
        >
          <TmsSubPieChart
            requestData={props.requestData}
            title={matGrpForSubPieChart}
            matGrpForSubPieChart={matGrpForSubPieChart}
          />
        </TmsSubChartModal>
      )}

      <div style={{ height: "45vh", width: "100%", display: "flex", flex: 1 }}>
        <Pie
          data={data}
          options={{ ...pieChartConfig, onClick: handleSectorClicked }}
        />
      </div>
    </>
  );
}
