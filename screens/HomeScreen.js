import React from 'react';
import { StyleSheet, Text, View, AsyncStorage } from 'react-native';
import MapView, { Marker } from "react-native-maps";
import Modal from "react-native-modal"

import EventSource from 'react-native-event-source';
import Dialog, { DialogContent } from 'react-native-popup-dialog';

import { Button } from 'native-base';
import PostLocation from '../app/components/FetchLocation'



export default class loc extends React.Component {
 
    constructor(props){
        super(props);
        this.state = {
            latitude: 30.10,
            longitude: 31.0,
            error: null,
            dataz: "",
            popup: false,
            k: 1


        };
        

        
        // this.state.token = this._retrieveData()        
        //this.getUserLocation = this.getUserLocation.bind(this);
    }
    _togglePopup = () => this.setState({ popup: !this.state.popup });
  async componentDidMount() {
    let token = await AsyncStorage.getItem("token");
    console.log(token);
    this.eventSource = new EventSource("http://192.168.1.11:8080/notification", {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: "Bearer " + token
      }
    });
    this.eventSource.addEventListener("message", data => {
      console.log(data.type); // message
      console.log(data.data);
      this.setState({
        dataz: data.data
      });

      if (this.state.k === 1) {
        this._togglePopup();
        this.setState({ k: 2 });
      }
    });
  }

  async accept() {
    let token = await AsyncStorage.getItem("token");
    fetch("http://192.168.1.11:8080/acceptSeekerRequest", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: "Bearer " + token
      }
    })
      .then(response => response.text())
      .then(responseJson => {
        // console.log("**************", response)
        console.log(responseJson)
        if (responseJson[0] === 'U')
          this.alert("SORRY", responseJson)
        else
          this.alert("ACCEPTED", responseJson)
        
      })
      .catch(error => {
        console.error(error);
      });
  }

  async saveLoc() {
    let token = await AsyncStorage.getItem("token");
    fetch("http://192.168.1.11:8080/saveProviderLoc", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: "Bearer " + token
      },
      body: JSON.stringify({
        lat: this.state.latitude,
        lon: this.state.longitude
      })
    }).catch(error => {
        console.error(error);
      });
  }

  alert(title, message) {
     Alert.alert(
        title,
        message,
        [
          {
            text: "OK",
            onPress: () => console.log("OK Pressed"),
            style: "cancel"
          }
        ],
        { cancelable: false }
      );
  }

  stopUpdates() {
  this.eventSource.close();
}

     

    static navigationOptions ={
        header:null
         // title: 'Registration Screen',
      };
   
  
   render() {
    console.log(this.state.popup);
    const {navigate} = this.props.navigation;
    if(this.state.popup === false) {
     return (
       <View style={styles.container}>

       <MapView
              style={styles.map}
              region={{
                latitude: this.state.latitude,
                longitude: this.state.longitude,
                latitudeDelta: 0.015,
                longitudeDelta: 0.0121,
              }}>
              <Marker coordinate={this.state} />
              <Marker coordinate={this.provs} pinColor='#417df4'/>
              {/* <Button onPress={ this.saveLoc.bind(this) } title = "Save" /> */}
        </MapView>
        <PostLocation saveLoc={this.saveLoc.bind(this)} />
        
        
          {/* <Button full success style={styles.button} onPress={this._toggleModal} ><Text style={{color:'#ffffff'}}>REQUEST</Text></Button> */}
       </View>

     );}else {
      Alert.alert(
        "Alert Title",
        "My Alert Msg",
        [
          {
            text: "Ask me later",
            onPress: () => console.log("Ask me later pressed")
          },
          {
            text: "Cancel",
            onPress: () => console.log("Cancel Pressed"),
            style: "cancel"
          },
          { text: "OK", onPress: () => this.accept() }
        ],
        { cancelable: false }
      );
     
  }
  return (
    <View style={styles.container}>

    <MapView
           style={styles.map}
           region={{
             latitude: this.state.latitude,
             longitude: this.state.longitude,
             latitudeDelta: 0.015,
             longitudeDelta: 0.0121,
           }}>
           <Marker coordinate={this.state} />
           <Marker coordinate={this.provs} pinColor='#417df4'/>
           <Button onPress={ this.saveLoc.bind(this) } title = "Save" />
     </MapView>
     <PostLocation saveLoc={this.saveLoc.bind(this)} />
     
     
       {/* <Button full success style={styles.button} onPress={this._toggleModal} ><Text style={{color:'#ffffff'}}>REQUEST</Text></Button> */}
    </View>

  )
}
}

 const styles = StyleSheet.create({
   container: {
     flex: 1,
     backgroundColor: '#ffffff',
     //backgroundGradient: 'vertical',
     paddingLeft:60,
     paddingRight:60,
     alignItems: 'center',
     justifyContent: 'center',
   },
   map: {
    ...StyleSheet.absoluteFillObject,
    height: 630,
  },
  text:{
    top: "30%",
    fontWeight: "bold",
    color: "#ffffff"
  },

  button:{
    alignSelf: 'stretch',
    alignItems: 'center',
    padding: 10,
    paddingBottom: 10,
    //backgroundColor: '#1990e5',
    marginTop: 30,
    top: "95%",
    //left: 148.53
  },
  btntext:{
      alignItems: 'center',
      fontSize: 17,
      justifyContent: 'center',
      left: 148.53,
      backgroundColor: '#ffffff',
      //colo

  },
  button4: {
    position: "absolute",
    height: 43,
    top: "58.98%",
    left: 148.53
  }
});
