import React from "react";
import Button from '@mui/material/Button';
import { Link } from "react-router-dom";
import Grid from "@mui/material/Grid";
import axios from "axios";
import * as XLSX from "xlsx";
import Container from '@mui/material/Container';
import "../App.css";
import { Paper } from "@mui/material";
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import { AUTHENTICATION_ENDPOINT } from "../Constants";



const Upload =()=>{
   const [file,setFile]=React.useState();
   const [name,setName]=React.useState('');
   const onFileChange=  (event) =>{
     
    const fileReader = new FileReader();
    fileReader.readAsBinaryString(event.target.files[0]);
    var data='test';
    fileReader.onload = event => {
      const bstr = event.target.result;
      const wb = XLSX.read(bstr, { type: "binary" });
      const wsname = wb.SheetNames[0];
      const ws = wb.Sheets[wsname];
      console.log('before append',data);
      data = XLSX.utils.sheet_to_csv(ws, { header: 1 });
      console.log('afterappend',data);  
      setFile(data);
    };
       //readTextFile()
   };
   console.log("file",file);

//get username 
React.useEffect(()=> {
  (
      async() =>{
          const response= await fetch(AUTHENTICATION_ENDPOINT +'/api/user',{
                headers: {'Content-Type': 'application/json'},
                credentials:'include',
          });

          const content=await response.json();
          setName(content.Name);
      }
  )();


});

//submit file for parsing
 const submitFile= () =>{
    const data = {
       file:file,
      };
      console.log('data',data);
      axios.post(AUTHENTICATION_ENDPOINT + '/api/upload',  data ).then((res) => {
        console.log("------------- get record -------------------");
        console.log({ data });
        console.log(res.data);
      });
 };

  const onFileUpload=() =>{
      
      submitFile();
  }

  //logout
  const logout = async() =>{
      const response= await fetch(AUTHENTICATION_ENDPOINT + '/api/logout',{
            method:'POST',
            headers: {'Content-Type': 'application/json'},
            credentials:'include',
      });

      const content=await response.json();
      setName('');
  }

    return(
     <Container maxWidth="sm" >
      <Paper elevation={2}>
      <Grid container  spacing={3}  >
          <Grid item xs={7}>
          <AccountBoxIcon></AccountBoxIcon> 
          </Grid>
          <Grid item xs={5}>
          <Button variant="contained" style={{ backgroundColor: "#008080" }} >
          <Link to='/upload' underline='none' style={{ color: "white", textDecoration: 'none' }} onClick={logout} >Logout</Link>
          </Button>
          
          </Grid>
          <Grid item md={12}> 
          <label style={{ color: "#008080",fontWeight: 'bold',fontStyle:'italic'}}>You can  now upload an excel file, This is the 
          <Button><a href={'https://drive.google.com/uc?export=download&id=1uUK2i8ymLJo-iiae-tlYDGZqEIKv7cHf'} download="template.xlsx">Template</a></Button>
           file for reference</label>
          </Grid>
          <Grid item md={12}>

           </Grid>
          <Grid item md={12}>

          </Grid>
          <Grid item md={7}>
            
           <input required type="file" onChange={onFileChange} style={{ color:'#008080',fontWeight: 'bold'}} />
               
          </Grid>

          <Grid item md={5}>
           <Button variant="contained"  onClick={onFileUpload} style={{
                backgroundColor: "#008080",
              }}><span></span>Upload</Button>
      
          </Grid>
          <Grid item md={12}>
          </Grid>
      </Grid>
      </Paper>
    </Container>
    )
}
export default Upload