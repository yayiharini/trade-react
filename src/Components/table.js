import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';



export default function BasicTable(props) {
  
  
  let propsRecords = Array.from(props.records.values());
 
  return (
    <TableContainer component={Paper} style={{ maxHeight: 400 ,maxWidth:800 }}>
      <Table stickyHeader aria-label="sticky table" sx={{ minWidth: 550 }} >
        <TableHead style={{backgroundColor:'#EBECF0'}}>
          <TableRow>
            <TableCell>Location</TableCell>
            <TableCell align="right">PLU</TableCell>
            <TableCell align="right">LiterAsessment</TableCell>
            <TableCell align="right">Date</TableCell>
            <TableCell align="right">Permittee</TableCell>
            <TableCell align="right">Itemcount</TableCell>
          </TableRow>
        </TableHead>
        
        <TableBody>
         
          {
          propsRecords.map((item,index) => {
              return (
                <TableRow hover key={item.recid}>
                  <TableCell align="right" key={1}>{item.location}</TableCell>
                  <TableCell align="right" key={2}>{item.plu}</TableCell>
                  <TableCell align="right" key={3}>{item.LitterAssessment}</TableCell>
                  <TableCell align="right" key={4}>{item.date}</TableCell>
                  <TableCell align="right" key={5}>{item.permittee}</TableCell>
                  <TableCell align="right" key={6}>{item.itemcount}</TableCell>
          
                </TableRow>
              )
            
          })}

        </TableBody>
      </Table>

    </TableContainer>
    
 );
}
