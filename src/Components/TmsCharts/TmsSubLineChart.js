import { Line } from "react-chartjs-2";
import { lineChartConfig } from "./TmsChartsConfig";
import {
  Typography,
  Modal,
  Box,
  IconButton,
} from "@mui/material";
import * as Constants from "../../Constants";
import {
  getDistinctMaterialGroupsList,
  populateMissingMaterialGroupAvgCount,
  createLineChartData,
} from "../../Helpers/ChartHelpers";
import React from "react";
import axios from "axios";
import CloseIcon from "@mui/icons-material/Close";
import { TRADE_ENDPOINT } from "../../Constants";

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
  borderRadius: "2rem",
};

export default function TmsSubLineChart({
  lineChartFor,
  showModal,
  selectedMaterialGroup,
  requestData,
  handleModalClose,
}) {
  if (!requestData) {
    return <Typography>No chart data !!</Typography>;
  }
  const modifiedRequestData = {
    ...requestData,
    [Constants.MATERIAL_GROUP]: selectedMaterialGroup,
  };

  return (
    <Modal open={showModal} onClose={() => handleModalClose(false)}>
      <Box sx={modalStyle}>
        <div style={{ display: "flex", flexDirection: "row" }}>
          <Typography
            variant="h6"
            component="h2"
            style={{ display: "flex", flex: 1 }}
          >
            {selectedMaterialGroup}
          </Typography>
          <Typography
            variant="h6"
            component="div"
            style={{ display: "flex", flex: 1, justifyContent: "flex-end" }}
            textAlign={"right"}
          >
            <IconButton
              aria-label="delete"
              onClick={() => handleModalClose(false)}
            >
              <CloseIcon />
            </IconButton>
          </Typography>
        </div>
        <br />
        <TmsSubLineChartManager
          requestData={{ ...modifiedRequestData }}
          lineChartFor={lineChartFor}
        />
      </Box>
    </Modal>
  );
}

function TmsSubLineChartManager(props) {
  if (!props || !props.requestData) {
    return <Typography>No chart data !!</Typography>;
  }
  const { lineChartFor } = props;
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
          return(
          <>
            <TmsSemiAnualLineChart requestData={{ ...props.requestData }} />
          </>);
      default:
        return <TmsYearlyLineChart requestData={{ ...props.requestData }} />;
    }
  };

  return <>{renderLineChart()}</>;
}

function TmsYearlyLineChart(props) {
  const [yearlyLineChartData, setYearlyLineChartData] = React.useState(null);
  React.useEffect(() => {
    async function fetchLineChartData() {
      try {
        const response = await axios.get(
          TRADE_ENDPOINT + `/getSubLineChartDataByYear`,
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
  } else if (yearlyLineChartData && yearlyLineChartData === "ERROR") {
    return <Typography>No chart data !!</Typography>;
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
    console.log("------------ Clicked legend ------------------");
    console.log(e);
    console.log(legendItem);
    console.log(legend);
  };

  return (
    <>
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
  React.useEffect(() => {
    async function fetchLineChartData() {
      try {
        const response = await axios.get(
          TRADE_ENDPOINT + `/getSubLineChartDataByMonth`,
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
          console.log("Debugging from here -----------------------")
          console.log(response)
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
  } else if (monthlyLineChartData && monthlyLineChartData === "ERROR") {
    return <Typography>No chart data !!</Typography>;
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

  return (
    <>
      {
        <div
          style={{ height: "45vh", width: "100%", display: "flex", flex: 1 }}
        >
          {data && <Line options={{ ...lineChartConfig }} data={data} />}
        </div>
      }
    </>
  );
}
function TmsQuarterlyLineChart(props) {
  const [quarterlyLineChartData, setQuarterlyLineChartData] =
    React.useState(null);
  React.useEffect(() => {
    async function fetchLineChartData() {
      try {
        const response = await axios.get(
          TRADE_ENDPOINT + `/getSubLineChartDataByQuarter`,
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
  } else if (quarterlyLineChartData && quarterlyLineChartData === "ERROR") {
    return <Typography>No chart data !!</Typography>;
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

  return (
    <>
      {
        <div
          style={{ height: "45vh", width: "100%", display: "flex", flex: 1 }}
        >
          {data && <Line options={{ ...lineChartConfig }} data={data} />}
        </div>
      }
    </>
  );
}


//semi anual

function TmsSemiAnualLineChart(props) {
  //console.log("-------- Monthly line chart data -------------");

  const [monthlyLineChartData, setMonthlyLineChartData] = React.useState(null);
  React.useEffect(() => {
    async function fetchLineChartData() {
      try {
        const response = await axios.get(
          TRADE_ENDPOINT + `/getSubLineChartDataSemiAnually`,
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
          console.log("Debugging from here -----------------------")
          console.log(response)
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
  } else if (monthlyLineChartData && monthlyLineChartData === "ERROR") {
    return <Typography>No chart data !!</Typography>;
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

  return (
    <>
      {
        <div
          style={{ height: "45vh", width: "100%", display: "flex", flex: 1 }}
        >
          {data && <Line options={{ ...lineChartConfig }} data={data} />}
        </div>
      }
    </>
  );
}
