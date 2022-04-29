import * as Constants from "../Constants";
import { generateSectorColors } from "./ChartHelpers";

const colorsArray = generateSectorColors();

//line chart generation for litter index

export function createYearlyDataSet(litterIndexYearlyData, distinctPlus) {
  let datasets = [];
  distinctPlus.forEach((plu, index) => {
    let litterAssessmentForEachPlu = [];
    litterIndexYearlyData.forEach((yearData) => {
      const dataForCurrentYearList = yearData[Constants.DATA_FOR_YEAR];
      if (!plu) {
        litterAssessmentForEachPlu.push(
          dataForCurrentYearList[0][Constants.LITTERASSESSMENT]
        );
      } else {
        const matchedPlu = dataForCurrentYearList.filter(
          (eachPluDataForEachYear) =>
            eachPluDataForEachYear[Constants.PLU] === plu
        );
        if (!matchedPlu || matchedPlu.length <= 0) {
          litterAssessmentForEachPlu.push(null);
        } else {
          litterAssessmentForEachPlu.push(
            matchedPlu[0][Constants.LITTERASSESSMENT]
          );
        }
      }
    });
    datasets.push({
      label: (+plu) ? "plu - " + plu : plu,
      data: litterAssessmentForEachPlu,
      borderWidth: 1,
      backgroundColor: colorsArray[index],
      borderColor: colorsArray[index],
      tension: 0,
      borderWidth: 2,
    });
  });

  return datasets;
}

// linechart for litterindexmonthly,quarterly,yearly
export function createYearPartDataSet(
  litterIndexYearPartData,
  distinctPlus,
  forQuarter,
  semiAnnually
) {
  let partYearKey = "monthly_data";
  let dataForKey = "data_for_month";

  console.log("Disinct plus");
  console.log(distinctPlus);

  console.log("litterIndexYearPartData");
  console.log(litterIndexYearPartData);

  const datasets = [];

  if (forQuarter) {
    partYearKey = "quarterly_data";
    dataForKey = "data_for_quarter";
  } else if (semiAnnually) {
    partYearKey = "semi_annually_data";
    dataForKey = "data_for_semi_annually";
  } else {
    partYearKey = "monthly_data";
    dataForKey = "data_for_month";
  }

  distinctPlus.forEach((plu, index) => {
    let litterAssessmentForEachPlu = [];
    litterIndexYearPartData.forEach((yearAndPartyYearDataForEachYear) => {
      const partYearDataForCurrentYear =
        yearAndPartyYearDataForEachYear[partYearKey];
      console.log(
        "-------------- creating line chart data for litter index part year -------"
      );
      console.log(partYearDataForCurrentYear);
      partYearDataForCurrentYear.forEach((eachPartYearDataList) => {
        const partYearDataList = eachPartYearDataList[dataForKey];
        if (!plu) {
          litterAssessmentForEachPlu.push(
            partYearDataList[0][Constants.LITTERASSESSMENT]
          );
        } else {
          const matchedPlu = partYearDataList.filter(
            (eachPartYearDataPoint) =>
              eachPartYearDataPoint[Constants.PLU] == plu
          );
          litterAssessmentForEachPlu.push(
            matchedPlu[0][Constants.LITTERASSESSMENT]
          );
        }
      });
    });

    datasets.push({
      label: (+plu) ? "plu - " + plu : plu,
      data: litterAssessmentForEachPlu,
      borderWidth: 1,
      backgroundColor: colorsArray[index],
      borderColor: colorsArray[index],
      tension: 0,
      borderWidth: 2,
    });
  });
  return datasets;
}
