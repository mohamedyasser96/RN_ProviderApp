import React from 'react';
import {Button } from 'react-native'
const postLocation = props =>{
    return (
     <Button title="Save location" onPress={props.saveLoc} />

    );
};

export default postLocation;