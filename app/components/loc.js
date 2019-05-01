import React from 'react';
import { StyleSheet, Text, View, AsyncStorage } from 'react-native';
import MapView, { Marker } from "react-native-maps";
import Modal from "react-native-modal"
//import Button4 from "../symbols/button4";

import {createStackNavigator, createAppContainer} from 'react-navigation';



import FetchLocation from "./FetchLocation"
import { Button } from 'native-base';



export default class loc extends React.Component {
  _retrieveData = async () => {
    try {
      const value = await AsyncStorage.getItem('token');
      if (value !== null) {
        // We have data!!
        console.log("okoko", value);
        return value
      }
    } catch (error) {
      // Error retrieving data
    }
  };
    constructor(props){
        super(props);
        this.state = {
            latitude: 0,
            longitude: 0,
            isModalVisible: false,
            error: null,
            // token: null,
            map:{
              lat: 0,
              lon: 0,
              numberofproviders: 1
            },
            providername: '',
            amount: '100 EGP'
        };
        

        
        // this.state.token = this._retrieveData()        
        //this.getUserLocation = this.getUserLocation.bind(this);
    }
    _toggleModal = () => 
        this.setState({ isModalVisible: !this.state.isModalVisible})
     componentDidMount() {
         navigator.geolocation.getCurrentPosition(position => {
             this.setState({
                 latitude: position.coords.latitude,
                 longitude: position.coords.longitude,
                 error: null
             }), console.log("Hey");
         }, error => this.setState({ error: error.message}),
         { enableHighAccuracy: true, timeout: 20000, maximumAge: 2000}
         );
     }

    static navigationOptions ={
        header:null
         // title: 'Registration Screen',
      };
   
  async postloc(){
        try { 
        // console.log('BHEGDIWDUIOHWOJWD', this._retrieveData()._55)
        let token = await AsyncStorage.getItem('token')
        let result = await fetch('http://172.20.10.9:8080/findProviders', {
         method: 'POST',
         withCredentials: true,
         headers: {
           Accept: 'application/json',
           'Content-Type': 'application/json',
           'Authorization': 'Bearer ' + token
          },
          body: JSON.stringify(this.state.map),
          
          
        });
        // console.log('HEADERS: ', headers)
       console.log('RESULTTTTTT', result);
       this.state.providername = result._bodyInit;
       var temp = result._bodyInit;
       var ind = temp.indexOf("=")
       var first_half = temp.slice(ind+1, ind + temp.length)
       console.log(first_half)
       var ind_equal = first_half.indexOf("=")
       var ind_fs = temp.indexOf("[")
       var ind_sc = temp.indexOf("@")
       var ProviderName = temp.slice(ind_fs+1, ind_sc)
       console.log(ProviderName)
       this.state.providername = "The Nearest Provider is : " + ProviderName
       var lati = first_half.slice(0, ind_equal)
       var longi = first_half.slice(ind_equal+1, first_half.length-1)
       console.log("JDSHDK", lati, longi)
  
       this.provs = {
         latitude: parseFloat(lati),
         longitude : parseFloat(longi)
       }
       console.log(this.provs)
       
       //this.checkStatus(result.status, result._bodyInit)
     } catch (error) {
         console.log(error);
         console.log('aywaaa')
       };
     }
   getUserLocation = () => {
     console.log('Pressed the button')
     navigator.geolocation.getCurrentPosition(position => {
       //this.state.latitude=position["coords"]["latitude"];
        console.log(position["coords"]["latitude"]);
        console.log(position["coords"]["longitude"]);
        this.state.map.lat = position["coords"]["latitude"];
        this.state.map.lon = position["coords"]["longitude"];
        this.postloc()
       //this.state.longitude = position["coords"]["longitude"];
     }, err => console.log(err));

   }
   render() {
    const {navigate} = this.props.navigation;
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
        </MapView>
        <Modal isVisible={this.state.isModalVisible}>
          <View style={{ flex: 1 }}>

            <Text style={styles.text}>{this.state.providername}</Text>
            <Text style={styles.text}>Price is : {this.state.amount}</Text>
            <Button full success style={styles.button} onPress={() => {this._toggleModal(), navigate('Pay')}} >
              <Text>PAY</Text>
            </Button>
            <Button full danger style={styles.button} onPress={() => {this._toggleModal()}} >
              <Text>Cancel </Text>
            </Button>
          </View>
        </Modal>
        <FetchLocation onGetLocation={this.getUserLocation} />
        
          <Button full success style={styles.button} onPress={this._toggleModal} ><Text style={{color:'#ffffff'}}>REQUEST</Text></Button>
       </View>
     );
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

