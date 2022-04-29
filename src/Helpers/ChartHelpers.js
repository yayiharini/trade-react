import randomColor from "randomcolor";

import * as Constants from "../Constants";

export const extractSectorData = (labelsArray, chartDataSet) => {
  let itemKey = "";
  let itemCountKey = "";
  if (chartDataSet && chartDataSet.length > 0) {
    itemKey = chartDataSet[0]["material_group"]
      ? "material_group"
      : "material_category";
    itemCountKey = chartDataSet[0]["material_group"]
      ? "material_group_count"
      : "itemcount";
  } else {
    return [];
  }
  return chartDataSet
    .filter((eachData, index) => {
      return eachData[itemKey] === labelsArray[index].split("[")[0].trim();
    })
    .map((filteredData) => filteredData[itemCountKey]);
};

export const extractLabels = (chartDataSet) => {
  let itemKey = "";
  let itemCountKey = "";
  if (chartDataSet && chartDataSet.length > 0) {
    itemKey = chartDataSet[0]["material_group"]
      ? "material_group"
      : "material_category";
    itemCountKey = chartDataSet[0]["material_group"]
      ? "material_group_count"
      : "itemcount";
  } else {
    return [];
  }
  // Medical [2]
  return chartDataSet.map(
    (eachData) => `${eachData[itemKey]} [${eachData[itemCountKey]}]`
  );
};

export const generateSectorColors = (numberOfColors = 100, alpha = 1.5) => {
  let colorsArray = [];
  for (let i = 0; i < numberOfColors; i++) {
    colorsArray.push(
      randomColor({
        format: "rgba",
        alpha: alpha,
      })
    );
  }
  return colorsArray;
};

/*
 * Helpers for Line chart generation
 */

export function getDistinctMaterialGroupsList(materialGroupYearlyList) {
  return materialGroupYearlyList.map((currentMaterialGroup) => ({
    [Constants.MATERIAL_GROUP]: currentMaterialGroup,
  }));
}

function hasMaterialGroupLike(refrenceMaterialGroup, eachYearMatGrpDataList) {
  for (let index = 0; index < eachYearMatGrpDataList.length; index++) {
    if (
      eachYearMatGrpDataList[index][Constants.MATERIAL_GROUP] ===
      refrenceMaterialGroup
    )
      return true;
  }
  return false;
}

export function populateMissingMaterialGroupAvgCount(
  materialGroupYearlyList,
  referenceList
) {
  referenceList.forEach((referenceObject, index) => {
    const refrenceMaterialGroup = referenceObject[Constants.MATERIAL_GROUP];
    materialGroupYearlyList.forEach((eachYearData, index) => {
      const eachYearsMatGrpDataList = eachYearData[Constants.MAT_GRP_DATA];
      if (
        !hasMaterialGroupLike(refrenceMaterialGroup, eachYearsMatGrpDataList)
      ) {
        eachYearsMatGrpDataList.push({
          [Constants.MATERIAL_GROUP]: refrenceMaterialGroup,
          [Constants.MATERIAL_GROUP_AVG_COUNT]: 0,
        });
      }
    });
  });
}

function getMaterialGroupAvgValueCount(matGrpData, currentMaterialGroup) {
  return matGrpData.filter(
    (eachMapGrpData) =>
      eachMapGrpData[Constants.MATERIAL_GROUP] ===
      currentMaterialGroup[Constants.MATERIAL_GROUP]
  )[0][Constants.MATERIAL_GROUP_AVG_COUNT];
}

export function collectMaterialGroupAvgCount(
  materialGroupMonthlyList,
  distinctMaterialGroupList
) {
  const pointColors = generateSectorColors(distinctMaterialGroupList.length, 1);
  let collectedDataset = [];
  //materialGroupMonthlyList -> material_group_monthly_list
  distinctMaterialGroupList.forEach((eachDistinctMaterialGroup, index) => {
    let avgCountAccumulator = [];
    materialGroupMonthlyList.forEach((eachYearData) => {
      //material_group_monthly_list.mat_grp_monthly_data
      const monthlyOrQuarterlyData = eachYearData[
        Constants.MAT_GRP_MONTHLY_DATA
      ]
        ? eachYearData[Constants.MAT_GRP_MONTHLY_DATA]
        : eachYearData[Constants.MAT_GRP_QUARTERLY_DATA];

      monthlyOrQuarterlyData.forEach((eachMonthData) => {
        avgCountAccumulator.push(
          getMaterialGroupAvgValueCount(
            eachMonthData[Constants.MAT_GRP_DATA],
            eachDistinctMaterialGroup
          )
        );
      });
    });
    collectedDataset.push({
      label: eachDistinctMaterialGroup[Constants.MATERIAL_GROUP],
      data: [...avgCountAccumulator],
      backgroundColor: pointColors[index],
      borderColor: pointColors[index],
      tension: 0,
      borderWidth: 2,
    });
  });

  return collectedDataset;
}

function createLineChartYearlyData(
  materialGroupLineChartYearlyData,
  distinctMaterialGroupList
) {
  const materialGroupLineChartYearlyList =
    materialGroupLineChartYearlyData[Constants.MATERIAL_GROUP_YEARLY_LIST];

  const labels = materialGroupLineChartYearlyData["distinct_years_list"];

  const lineChartDataSet = [];

  const pointColors = generateSectorColors(distinctMaterialGroupList.length, 1);

  distinctMaterialGroupList.forEach((distinctMaterialGroup, index) => {
    const dataPoints = [];
   
    materialGroupLineChartYearlyList.forEach((eachYearlyLineChartData) => {
      const eachMatGrpDataList =
        eachYearlyLineChartData[Constants.MAT_GRP_DATA];
      const matchingMaterialGroup = eachMatGrpDataList.filter(
        (eachMatGrp, index) =>
          eachMatGrp[Constants.MATERIAL_GROUP] ===
          distinctMaterialGroup[Constants.MATERIAL_GROUP]
      );
      if (matchingMaterialGroup && matchingMaterialGroup.length > 0) {
        dataPoints.push(
          matchingMaterialGroup[0][Constants.MATERIAL_GROUP_AVG_COUNT]
        );
      }
    });
    lineChartDataSet.push({
      label: distinctMaterialGroup[Constants.MATERIAL_GROUP],
      data: [...dataPoints],
      backgroundColor: pointColors[index],
      borderColor: pointColors[index],
      tension: 0,
      borderWidth: 2,
    });
  });

  return {
    labels,
    datasets: lineChartDataSet,
  };
}

function createLineChartMonthlyData(
  materialGroupLineChartMonthlyData,
  distinctMaterialGroupList
) {
  const materialGroupLineChartMonthlyList =
    materialGroupLineChartMonthlyData[Constants.MATERIAL_GROUP_MONTHLY_LIST] ??
    materialGroupLineChartMonthlyData[Constants.MATERIAL_GROUP_QUARTERLY_LIST];

  const labels = materialGroupLineChartMonthlyData[Constants.X_AXIS_LABELS];

  materialGroupLineChartMonthlyList.forEach((eachYearData) =>
    populateMissingMaterialGroupAvgCount(
      eachYearData[Constants.MAT_GRP_MONTHLY_DATA]
        ? eachYearData[Constants.MAT_GRP_MONTHLY_DATA]
        : eachYearData[Constants.MAT_GRP_QUARTERLY_DATA],
      distinctMaterialGroupList
    )
  );

  console.log(materialGroupLineChartMonthlyList);

  //console.log("--------------- Created montyhly  chart data ----------------");
  const monthlyChartDataset = {
    labels,
    datasets: collectMaterialGroupAvgCount(
      materialGroupLineChartMonthlyList,
      distinctMaterialGroupList
    ),
  };
  //console.log(monthlyChartDataset);
  return monthlyChartDataset;
}

export function createLineChartData(
  materialGroupLineChartData,
  distinctMaterialGroupList
) {
  let itemKey = "";
  if (materialGroupLineChartData[Constants.MATERIAL_GROUP_YEARLY_LIST]) {
    return createLineChartYearlyData(
      materialGroupLineChartData,
      distinctMaterialGroupList
    );
  } else if (
    materialGroupLineChartData[Constants.MATERIAL_GROUP_MONTHLY_LIST]
  ) {
    return createLineChartMonthlyData(
      materialGroupLineChartData,
      distinctMaterialGroupList
    );
  } else {
    return createLineChartMonthlyData(
      materialGroupLineChartData,
      distinctMaterialGroupList
    );
  }
}
