import React from "react";

import Grid from "@mui/material/Grid";
import BasicTable from "./table";

import Tabbar from "./Tabbar";

import Box from "@mui/material/Box";

import { Link } from "react-router-dom";
import axios from "axios";
import { Autocomplete, Container } from "@mui/material";
import { Paper, ListItemText, Checkbox } from "@mui/material";
import Typography from "@mui/material/Typography";
import Mapcomp from "./mapcluster";
import { TRADE_ENDPOINT } from "../Constants";


import {
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Stack,
  TextField,
  Button,
  TextareaAutosize,
} from "@mui/material";
export default function Trade() {
  const [age, setAge] = React.useState("");
  //const [pluname, setpluname] = React.useState("");
  const [pluname, setpluname] = React.useState([]);
  const [cityarray, setCityArray] = React.useState([]);
  const [city,setCity]=React.useState("ALL");
  const [citycounty, setcitycounty] = React.useState([]);
  //const [watershed,setwatershed]=React.useState([]);
  const [fromdate, setfromdate] = React.useState("2001-05-24");
  const [todate, settodate] = React.useState("2022-04-27");
  const [plu, setplu] = React.useState([]);
  const [isLoading, setisLoading] = React.useState(true);
  const [records, setRecords] = React.useState([]);
  const [pieChartData, setPieChartData] = React.useState({});
  const [lineChartData, setLineChartData] = React.useState({});
  const [click, setClick] = React.useState(false);
  const [text, setText] = React.useState("");
  const [permittee, setPermittee] = React.useState([]);
  const [permittenum, setPermitteenum] = React.useState("");
  const [disabled, setDisabled] = React.useState(true);
  const [permdisabled, setPermdisabled] = React.useState(false);
  const [citydisabled, setCitydisabled] = React.useState(false);
  const [auto, setAuto] = React.useState([]);
  const [county, setCounty] = React.useState("ALL");
  const [values, setValues] = React.useState([]);
  const [countyvalue,setCountyValues]=React.useState([]);
  const [shedvalue,setShedValues]=React.useState([]);
  const [boardvalue,setBoardValues]=React.useState([]);
  const [displaycity,setdisplaycity]=React.useState(true);
  const [displaypermittee,setdisplaypermittee]=React.useState(false);
  const [requestData, setRequestData] = React.useState({});
  const [position,setPosition]= React.useState({
    lat: 38.56572251, lng: -121.4246997
  });
  const [watershed,setWatershed]=React.useState([]);
  const [waterboard,setWaterboard]=React.useState([]);
  const [displaywatershed,setDisplayWatershed]=React.useState(false);
  const [displaywaterboard,setDisplayWaterboard]=React.useState(false);
  const [displaycounty, setDisplayCounty]=React.useState(false);
  const [shed,setWS]=React.useState();
  const [board,setBoard]=React.useState();
  const [countyarray,setCountyArray]=React.useState([]);
  const handlePermitteChange = (event) => {
    //alert(event.target.value);
    setPermitteenum(event.target.value);
    setDisabled(false);
    
    setCounty(null);
    setValues([]);
    setCountyValues([]);
    setShedValues([]);
    setBoardValues([]);
    const val = event.target.value;
    const data = {
      permitte: val,
    };
    //alert(JSON.stringify(data));

    if( val != "ALL")
    {
      setDisabled(false);
      //TRADE_ENDPOINT + `/getrecord`
    axios.post(TRADE_ENDPOINT + `/getplu`, { data }).then((res) => {
      console.log(res.data);
      setTimeout(function () {
        //alert('Hi')
      }, 1500);
      setplu([{ plu: "ALL" }, ...res.data]);
      setpluname(["ALL", ...res.data.map((eachPlu) => eachPlu.plu)]);
    });
  }
  else {
  setDisabled(true);
  setpluname([]);
  }
  };

  
  const handlefromDateChange = (event) => {
    setfromdate(event.target.value);
    //alert(event.target.value);
  };
  const handleToDateChange = (event) => {
    settodate(event.target.value);
    //alert(event.target.value);
  };

  const handlePluChange = (event) => {
    const {
      target: { value },
    } = event;
    console.clear();
    console.log("------------- plu changed ---------");
    console.log(value);
    console.log(value.includes("ALL"));
    console.log(value)

    if (typeof value === "object") {
      if (value.includes("ALL")) {
        console.log("Setting all plusssssssssssssssssssssss");
        setpluname([...plu.map((eachPlu) => eachPlu.plu)]);
        console.log(pluname);
        console.log("-----------------------------------");
        return;
      }
    }

    setpluname(
      // On autofill we get a stringified value.
      typeof value === "string" ? value.split(",") : value
    );
    //setpluname(event.target.value);

    //alert(event.target.value);
  };
  const handleAutoChange = (event) => {
    setCounty(auto[event.target.value]);
    //alert(auto[event.target.value]);
  };

  const setvalues = (data) => {
    setRecords(data); 
    console.log('data',data);
    
    setText(data);

    //settabledata(data);
  };
  const positiondata= (data) =>{
    let mapposition = {
      lat:data[0].y,
      lng:data[0].x
    }
    setPosition(mapposition);
  }
   
  const submitInputData = () => {
    const data = {
      //cityname: city,
      plname: pluname,
      frdate: fromdate,
      tdate: todate,
      permitten: permittenum,
      auto: county,
      shed:shed,
      board:board,
      countyname:county,
      cityname:city,
    };
    setRequestData({ ...data });
    axios.get(TRADE_ENDPOINT + `/getrecord`,{ 
      params:{
        ...data,
      },
    })
    .then((res) => {
      console.log("------------- get record -------------------");
      console.log({ data });
      console.log(res.data);
      console.log(res.data.tableData);
      setvalues(res.data.tableData);
      positiondata(res.data.tableData);
    });
 setPermdisabled(false);
    setCitydisabled(false);
  };
  const handleClick = (event) => {
    event.preventDefault();
    submitInputData();
  };
  console.log("records", records);
  console.log("position",position);
  const cities = [];
  const counties=[];

  React.useEffect(() => {
    fetch(TRADE_ENDPOINT + "/",{headers :{'Origin':'XXX'}})
      .then((res) => res.json())
      .then((data) => {
        setcitycounty([...data]);
        data.forEach(myFunction);
        function myFunction(item) {
          if (item.county != null && item.county != '' && !counties.includes(item.county)) {
            counties.push(item.county);
          }
          if(item.city != null){
             cities.push(item.city);
          }
          setCityArray(["ALL",...cities]);
          setCountyArray(["ALL",...counties]);
          setAuto(["ALL", ...county]);
          setValues("ALL");
          submitInputData();
        }
      })
      .then(setisLoading(false));
  }, []);
  console.log(citycounty);
  console.log("auto", auto);
  console.log("counties",countyarray);
  console.log("cities",cityarray);
  const watersheds=[];
  React.useEffect(() => {
    fetch(TRADE_ENDPOINT + "/getwatershed")
      .then((res) => res.json())
      .then((data) => {
        data.forEach(myFunction);
        // Watershed_Name
        function myFunction(item) {
          if (item.Watershed_Name != null) {
            
            
            watersheds.push(item.Watershed_Name);
          }
          setWatershed(["ALL", ...watersheds]);
          setAuto(["ALL", ...waterboards]);
        }
      })
      .then(setisLoading(false));
  }, []);

 

 console.log("watershed",watershed);
 const waterboards=[];
 React.useEffect(() => {
  fetch(TRADE_ENDPOINT + "/getwaterboard")
    .then((res) => res.json())
    .then((data) => {
      
      data.forEach(myFunction);
      // Watershed_Name
      function myFunction(item) {
        if (item.Waterboard_Name != null) {
          
          
          waterboards.push(item.Waterboard_Name);
        }
        setWaterboard(["ALL", ...waterboards]);
        setAuto(["ALL", ...waterboards]);
        
      }
    })
    .then(setisLoading(false));
}, []);

console.log("waterboard",waterboard);
  React.useEffect(() => {
    fetch(TRADE_ENDPOINT + "/permitte")
      .then((res) => res.json())
      .then((data) => {
        setPermittee([{"permittee": "ALL"},...data]);
        setPermitteenum("ALL");
      })
      .then(setisLoading(false));
  }, []);
  

  const objectArray = Object.entries(records);

  objectArray.forEach(([key, value]) => {
    console.log(key); // 'one'
    console.log(value); // 1
  });

  const [drop, setdrop] = React.useState('City');

  const handleChange = (event) => {
    setdrop(event.target.value);
    console.log("drop",event.target.value);
    const s="City";
    if(event.target.value===s){
       
        setdisplaycity(true);
        setdisplaypermittee(false);
        setDisplayWaterboard(false);
        setDisplayWatershed(false);
        setPermitteenum("");
        setpluname([]);
        setWS(null);
        setBoard(null);
        setCounty(null);
        setDisplayCounty(false);
    }
    else if(event.target.value=="Watershed"){
        
        setdisplaycity(false);
        setdisplaypermittee(false);
        setDisplayWaterboard(false);
        setDisplayWatershed(true);
        setDisplayCounty(false);
        setPermitteenum("");
        setpluname([]);
        setCounty(null);
        setBoard(null);
        setCity(null);
        

    }else if (event.target.value=="Waterboard"){
        
        setdisplaycity(false);
        setdisplaypermittee(false);
        setDisplayWaterboard(true);
        setDisplayWatershed(false);
        setDisplayCounty(false);
        setPermitteenum("");
        setpluname([]);
        setCounty(null);
        setWS(null);
        setCity(null);

    } 
    else if (event.target.value=="County"){
        
        setdisplaycity(false);
        setdisplaypermittee(false);
        setDisplayWaterboard(false);
        setDisplayWatershed(false);
        setDisplayCounty(true);
        setPermitteenum("");
        setpluname([]);
        setWS(null);
        setBoard(null);
        setCity(null);

    }  
    else  {
        setCity(null);
        setdisplaycity(false);
        setdisplaypermittee(true);
        setCounty(null);
        setWS(null);
        setBoard(null);
        setDisplayCounty(false);
        setDisplayWaterboard(false);
        setDisplayWatershed(false);
    }
  };
   
  console.log("display",displaypermittee);
  return (
    <Container maxWidth="xl">
      <Box >
        <Typography
          variant="h4"
          component="h4"
          fontSize={20}
          fontStyle={"bold"}
        >
          Trash Rapid Assessment Data Exchange
        </Typography>
      </Box>
      <br />
      <Paper elevation={3}>
        <Grid container spacing={2} justify="space-between" >
           
          <Grid item md={2} xs={12}>
          <FormControl fullWidth >
            <InputLabel id="filter">Filter by</InputLabel>
            <Select
                labelId="Filter by"
                id="Filter by"
                value={drop}
                label="Filter by"
                onChange={handleChange}
                sx={{ m:1}
            }
            >
            
            <MenuItem value={"City"}>City</MenuItem>
            <MenuItem value={"County"}>County</MenuItem>
            <MenuItem value={"Watershed"}>Watershed</MenuItem>
            <MenuItem value={"Waterboard"}>Waterboard</MenuItem>
            <MenuItem value={"Permittee"}>Permittee</MenuItem>
            
            </Select>
          </FormControl>
          </Grid>
          {displaycity && (<Grid item md={2} xs={12}>
            <FormControl>
              <Autocomplete
                id="city-auto"  
                options={cityarray}
                value={values}
                onChange={(event, value) => {
                  setCity(value);
                  setValues(value);
                  setCountyValues([]);
                  setShedValues([]);
                  setBoardValues([]);
                  setPermitteenum(null);
                  setpluname([]);
                  console.log("On Change county value");
                  console.log(value);
                }}
                
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="City"
                    variant="standard"
                    sx={{  minWidth: 230 }}
                  />
                )}
              />
            </FormControl>
          </Grid>)}
          {displaycounty && (<Grid item md={2} xs={12}>
            <FormControl>
              <Autocomplete
                id="county-auto"
                 
                options={countyarray}
                value={countyvalue}
                onChange={(event, value) => {
                  setCounty(value);
                  setCountyValues(value);
                  setValues([]);
                  setShedValues([]);
                  setBoardValues([]);
                  setPermitteenum(null);
                  setpluname([]);
                  console.log("On Change county value");
                  console.log(value);
                }}
                
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="County"
                    variant="standard"
                    sx={{  minWidth: 230 }}
                  />
                )}
              />
            </FormControl>
          </Grid>)}
          {displaywatershed && (<Grid item md={2} xs={12}>
            <FormControl>
              <Autocomplete
                id="watershed-auto"
                disabled={citydisabled}   
                options={watershed}
                value={shedvalue}
                onChange={(event, value) => {
                  setCountyValues([]);
                    setValues([]);
                    setBoardValues([]);
                  setPermitteenum(null);
                  setpluname([]);
                  setShedValues(value);
                  setWS(value);
                  
                }}
                
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="watershed"
                    variant="standard"
                    sx={{  minWidth: 230 }}
                  />
                )}
              />
            </FormControl>
          </Grid>)}
          {displaywaterboard && (<Grid item md={2} xs={12}>
            <FormControl>
              <Autocomplete
                id="waterboard-auto"
                   
                options={waterboard}
                value={boardvalue}
                onChange={(event, value) => {
                  setBoardValues(value);
                  setBoard(value);
                  setValues([]);
                  setShedValues([]);
                  setPermitteenum(null);
                  setpluname([]);
                  setCountyValues([]);
                }}
                
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Waterboard"
                    variant="standard"
                    sx={{  minWidth: 230 }}
                  />
                )}
              />
            </FormControl>
          </Grid>)}
          
          
           {displaypermittee && (<Grid item md={2} xs={12} >
            <FormControl
              fullWidth
              variant="standard"
              sx={{ m: 1, minWidth: 120 }}
              
            >
              <InputLabel id="permittee-label">Permittee</InputLabel>
              <Select
                labelId="permittee-label-id"
                id="permittee-id"
                value={permittenum}
                
                label="permitteenum"
                onChange={handlePermitteChange}
                
              >
                
                {permittee.map((item) => (
                  <MenuItem key={item.permittee} value={item.permittee}>
                    {item.permittee}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          )}
          <Grid item md={2} xs={12}>
            <Stack component="form" noValidate spacing={3}>
              <TextField
                id="date"
                label="From"
                type="date"
                value={fromdate}
                
                
                InputLabelProps={{
                  shrink: true,
                }}
                onChange={handlefromDateChange}
              />
            </Stack>
          </Grid>

          <Grid item md={2} xs={12}>
            <Stack
              component="form"
              noValidate
              spacing={2}
              onChange={handleToDateChange}
            >
              <TextField
                id="date"
                label="To"
                type="date"
                value={todate}
                
                
                InputLabelProps={{
                  shrink: true,
                }}
                onChange={handleToDateChange}
              />
            </Stack>
          </Grid>
          {displaypermittee && (<Grid item md={2} xs={12}>
            <FormControl
              fullWidth
              variant="standard"
              
            >
              <InputLabel id="plu-label">PLU</InputLabel>
              <Select
                labelId="plu-select-label"
                id="plu-select"
                multiple
                //input={<OutlinedInput label="Tag" />}
                value={pluname}
                disabled={disabled}
                label="pluname"
                renderValue={(selected) => selected.join(", ")}
                onChange={handlePluChange}
                
              >
                {plu.map((item) => (
                  <MenuItem key={item.plu} value={item.plu}>
                    <Checkbox checked={pluname.indexOf(item.plu) > -1} />
                    <ListItemText primary={item.plu} />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          )}
          <Grid item md={1} xs={12}>
            <Button
              variant="outlined"
              style={{
                backgroundColor: "#008080",
                minWidth: 150,
                textDecorationColor:"white"
              }}
              onClick={handleClick}
            >
              <Link
                to="/tab"
                underline="none"
                style={{ textDecoration: "none", color: "white" }}
                onClick={handleClick}
              >
                Search
              </Link>
            </Button>
          </Grid>
        </Grid>
      </Paper>
      <Grid>
        <br />
        <br />
      </Grid>
      <Grid container spacing={3}>
        <Grid item xs={12} md={7}>
          <Paper elevation={3}>
            <Tabbar
              records={records}
              pieChartData={pieChartData}
              lineChartData={{ ...lineChartData }}
              requestData={{ ...requestData }}
            />
          </Paper>
        </Grid>

        <Grid item xs={12} md={5}>
        <Mapcomp records={records} position={position} />
        </Grid>
      </Grid>
    </Container>
  );
}
