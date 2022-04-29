//import React from 'react';
import React, { useState, useRef } from "react";
import { Grid } from '@mui/material';
import Popover from '@mui/material/Popover';
import useSupercluster from 'use-supercluster';
import GoogleMapReact from "google-map-react";
import "../App.css";
import Box from "@mui/material/Box";


const Marker = ({ children }) => children;

export default function Mapcomp(props) {
    // setup map
   
    const mapRef = useRef();
    const {records,position}={...props};
    const [bounds, setBounds] = useState(null);
    const [zoom, setZoom] = useState(10);
    let [marker,setMarker]=useState(null);
    
    const [litter,setLitter]=useState(1);
   
    const [info,setInfo]=useState([]);
    const [popoverEnabled,setPopoverEnabled]=useState(false);
   
    var marker_id=null;
    console.log("record",records[0]);
     // load and prepare data
    const points = records.map(record => ({
        type: "Feature",
        properties: { cluster: false, ...record },
        geometry: {
          type: "Point",
          coordinates: [
            parseFloat(record.x),
            parseFloat(record.y)
          ]
        }
      }));
    
    // get clusters
    const { clusters, supercluster } = useSupercluster({
        points,
        bounds,
        zoom,
        options: { radius: 70, maxZoom: 25 }
      });

    console.log("records",records);
    console.log("points",points);
    console.log("clusters",clusters);

    
const handleClose = () => {
        setMarker(null);
        setPopoverEnabled(0);    
      };

     
    // return map
    return (
      
      <div style={{ height: "65vh", width: "100%" }} >
        <GoogleMapReact
          bootstrapURLKeys={{ key: "AIzaSyBwpdcqXensPDKcpxPdD3hIKU3NVq1b3DU" }}
          defaultCenter={position}
          defaultZoom={5}
          yesIWantToUseGoogleMapApiInternals
          onGoogleApiLoaded={({ map }) => {
            mapRef.current = map;
           
          }}
          center={position}
          onChange={({ zoom, bounds }) => {
            setZoom(zoom);
            setBounds([
              bounds.nw.lng,
              bounds.se.lat,
              bounds.se.lng,
              bounds.nw.lat
            ]);
            console.log("clusters",clusters);
            console.log("zoom",zoom);
            console.log("bounds",bounds);
          }}
          onClick={()=>setMarker(null)}
          
        >
         {clusters.map(cluster => {
          const [longitude, latitude] = cluster.geometry.coordinates;
          const {
            cluster: isCluster,
            point_count: pointCount
          } = cluster.properties;

          if (isCluster) {
            
            return (
              <Marker
                key={`cluster-${cluster.id}`}
                lat={latitude}
                lng={longitude}
              >
                <div
                  className="cluster-marker"
                  style={{
                    width: `${10 + (pointCount / points.length) * 20}px`,
                    height: `${10 + (pointCount / points.length) * 20}px`
                  }}
                  onClick={() => {
                    const expansionZoom = Math.min(
                      supercluster.getClusterExpansionZoom(cluster.id),
                      20
                    );
                    mapRef.current.setZoom(expansionZoom);
                    mapRef.current.panTo({ lat: latitude, lng: longitude });
                  }}
                >
                  {pointCount}
                </div>
              </Marker>
            );
          }

          return (
             
            <Marker
              key={`trash-${cluster.properties.recid}`}
              lat={latitude}
              lng={longitude}
              
            >
                <button id={cluster.properties.recid} onClick={(event) => {
                     setMarker(event.currentTarget);
                     marker = event.currentTarget;
                     marker_id = event.currentTarget.id;
                     setPopoverEnabled(true);
                     setInfo({...cluster.properties});
                     }} className="trash-marker">
                 <img  style={{height:50,width:60}} src ={`/${cluster.properties.LitterAssessment}.svg`} alt={`${cluster.properties.LitterAssessment}`} />

                </button>
                <Popover
                id={marker ? marker.id : undefined}
                open={marker != null && marker.id == cluster.properties.recid + ''}
                anchorEl={marker}
                onClose={handleClose}
                anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
                }}
                sx={{maxWidth:450,minWidth:300}}>
                    <Box sx={{ display: 'flex', justifyContent: 'center' ,borderRadius:16,m:1}}> 
                    
                    <Grid container style={{overflow: 'auto',width:400}} >
        
                      <Grid item md={2}>
                        <label style={{fontWeight:'bold',fontSize:15,color:"#008080",fontStyle:'italic'}}>Location:</label>
                      </Grid>
                      <Grid item md={10} style={{fontStyle:'italic',fontSize:15}}>
                       {cluster.properties.location}
                      </Grid>
                      
                      <Grid item md={3}>
                      <label style={{fontWeight:'bold',fontSize:15,color:"#008080",fontStyle:'italic'}}>Item Count:</label>
                      </Grid>       
                      <Grid item md={9} style={{fontStyle:'italic',fontSize:15}}>
                      {cluster.properties.itemcount}
                      </Grid>
                      <Grid item md={3}>
                      <label style={{fontWeight:'bold',fontSize:15,color:"#008080",fontStyle:'italic'}}>PLU:</label>
                      </Grid>
                      <Grid item md={9} style={{fontStyle:'italic',fontSize:15}}>
                      {cluster.properties.plu}
                      </Grid>
                      <Grid item md={3}>
                      <label style={{fontWeight:'bold',fontSize:15,color:"#008080",fontStyle:'italic'}}>permittee:</label>
                      </Grid>
                      <Grid item md={9} style={{fontStyle:'italic',fontSize:15}}>
                      {cluster.properties.permittee}
                      </Grid> 
                      <Grid item md={4}>
                      <label style={{fontWeight:'bold',fontSize:15,color:"#008080",fontStyle:'italic'}}>Litter Assessment:</label>
                      </Grid>
                      <Grid item md={8} style={{fontStyle:'italic',fontSize:15}}>
                      {cluster.properties.LitterAssessment}
                      </Grid>
                      <Grid item md={2}>
                      <label style={{fontWeight:'bold',fontSize:15,color:"#008080",fontStyle:'italic'}}>Date:</label>
                      </Grid>
                      <Grid item md={10} style={{fontStyle:'italic',fontSize:15}}>
                      {cluster.properties.date}
                      </Grid>
                  </Grid> 
                  </Box>        
                  </Popover>  
              
              
            </Marker>

          );
        })}
        </GoogleMapReact>
      </div>
    );
  }
  