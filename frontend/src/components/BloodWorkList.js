
import { useEffect, useState } from "react";

import { Link } from "react-router-dom";

import {
    ListItem,
    ListItemText,
    Button,
  } from "@mui/material";

import { fetchBloodWorkMeasurements } from "../services/api";
const BloodWorkList = ({ userId }) => { 
    const [bloodWorkMeasurements, setBloodWorkMeasurements] = useState([]);

    useEffect(() => {
        fetchBloodWorkMeasurements(userId)
            .then(setBloodWorkMeasurements)
            .catch(console.error);
    }, [userId]);

    const bloodWorkDates = bloodWorkMeasurements.map((measurement) => measurement.dataAnalisi).filter((value, index, self) => self.indexOf(value) === index);


    return (
        <div>
            <h2>Lista delle misurazioni</h2>
            <ul>
                {bloodWorkDates.map((date) => (

                    <ListItem key={date} divider>
                        <ListItemText primary={date} />
                            <Button
                                component={Link}
                                to={`/user/${userId}/bloodwork/${date}`}
                                variant="contained"
                                color="primary"
                                size="small"
                            >
                                Visualizza
                            </Button>
                    </ListItem>
                ))}
            </ul>
        </div>
    );

};


/**
 *           <ListItem key={user._id} divider>
            <ListItemText primary={user.name + ' ' + user.surname } />
            <ListItemSecondaryAction>
              <Button
                component={Link}
                to={`/user/${user._id}/medications`}
                variant="contained"
                color="primary"
                size="small"
              >
                Visualizza Farmaci
              </Button>
            </ListItemSecondaryAction>
          </ListItem>
 */

export default BloodWorkList;