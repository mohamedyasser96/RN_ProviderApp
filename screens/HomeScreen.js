import React from 'react';
import { StyleSheet, Text, View, AsyncStorage, Alert, TextInput, ScrollView } from 'react-native';
import MapView, { Marker } from "react-native-maps";
import Modal from "react-native-modal"

import EventSource from 'react-native-event-source';
import Dialog, { DialogContent } from 'react-native-popup-dialog';

import { Button } from 'native-base';
import PostLocation from '../app/components/FetchLocation'

import SockJS from 'sockjs-client';
import Stomp from "stompjs";

var stompClient = null;
var img = null;
var sesid = null;
var items = [];
var topic = null;

export default class loc extends React.Component {
 
    constructor(props){
        super(props);
        this.state = {
            latitude: 0,
            longitude: 0,
            error: null,
            dataz: "",
            popup: false,
            k: 1,
            itemcolor: 'blue',
            email: '',
            screenFlag: false, 
            item : [],
            mess: '', 
            OnReuqest: false,
            requestID: '',
            base64Image: '',



        };
        

        this.change = this.change.bind(this);
        this.on_connect = this.on_connect.bind(this);

        setInterval(() => (
          this.setState({item:items})), 1000);
        // this.state.token = this._retrieveData()        
        //this.getUserLocation = this.getUserLocation.bind(this);
    }


    async on_connect(emails){

      var socket = new SockJS('http://cocoabeans.herokuapp.com/chat');
      stompClient = Stomp.over(socket);  

      let email =  await AsyncStorage.getItem('email');
      topic = emails + "_" + email;
        
      stompClient.connect({}, function(frame) {
      
        var urlarray = socket._transport.url.split('/');
        var index = urlarray.length - 2;
  
        sesid = urlarray[index];
        
        stompClient.subscribe('/user/topic/messages', function(messageOutput) {
          console.log('Message Received')
  
          var obj = JSON.parse(messageOutput.body)
          var dict = {"from": obj.from, "imageFlag": false, "message":obj.message}
          items.splice(0, 0, obj.from +": "+obj.message);
        });
  
        stompClient.subscribe('/user/topic/images', function(messageOutput) {
          console.log('Image Received:');

          var obj = JSON.parse(messageOutput.body)

          var dict = {"from": obj.from, "imageFlag": true, "message":obj.message}
  
          items.splice(0,0,dict);

        });

        stompClient.subscribe('/user/topic/location', function(messageOutput) {
          console.log('Location Received:');
        });

  
        var Obj = { "topic": topic ,"id": sesid};
        var jsonObj = JSON.stringify(Obj);
        stompClient.send("/app/register", {}, jsonObj);
  
      });
  
      }
  

    sendMessage = () =>{
      var from = this.state.email
      var text = this.state.mess
  
      stompClient.send("/app/chat/text/"+topic, {}, JSON.stringify({'from':from, 'text':text}));
    }

    on_disconnect = () => {
    
      var Obj = { "topic": topic,"id": sesid};
      var jsonObj = JSON.stringify(Obj);
      stompClient.send("/app/disconnect", {}, jsonObj);
  
      if(stompClient != null) {
        stompClient.disconnect();
      }
  
    }


    change = () => 
        this.setState({ screenFlag: !this.state.screenFlag})


    toggleRequestPage = () => 
        this.setState({ OnReuqest: !this.state.OnReuqest})


    _togglePopup = () => this.setState({ popup: !this.state.popup });
    
  async componentDidMount() {
    // if(this.state.latitude != 0){
      this.interval = setInterval(() => this.saveLoc(), 10000);
    //}
      let token = await AsyncStorage.getItem("token");
    console.log(token);
    this.eventSource = new EventSource("http://cocoabeans.herokuapp.com/notification", {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: "Bearer " + token
      }
    });
    
    

    this.eventSource.addEventListener("message", data => {
      console.log(data.type); // message
      console.log(data.data);
      Alert.alert(
        "Alert Title",
        "My Alert Msg",
        [
          
          {
            text: "Cancel",
            onPress: () => console.log("Cancel Pressed"),
            style: "cancel"
          },
          { text: "OK", onPress: () => this.accept() }
        ],
        { cancelable: false }
      );
      this.setState({
        dataz: data.data
      });

      
    });
  }

  async componentWillUnmount() {
    clearInterval(this.interval);
  }

  async accept() {
    let token = await AsyncStorage.getItem("token");
    fetch("http://cocoabeans.herokuapp.com/acceptSeekerRequest", {
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
        else{
          this.alert("ACCEPTED", responseJson)
          //this.toggleRequestPage()
        }
        
      })
      .catch(error => {
        console.error(error);
      });

    this.eventSource = new EventSource("http://cocoabeans.herokuapp.com/notifyProvider", {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: "Bearer " + token
      }
    });
    
    

    this.eventSource.addEventListener("message", data => {
      console.log(data.type); // message
      console.log(data.data);
      this.toggleRequestPage()
      this.on_connect('am@email.com')
      this.setState({
        dataz: data.data
      });

      Alert.alert(
        "CONGRATS",
        "YOUR SERVICE HAS BEEN CHOSEN",
        [
          {
            text: "OK",
            onPress: () => console.log("OK Pressed"),
            style: "cancel"
          },
          { text: "CANCEL", onPress: () => this.cancelRequest() },
          { text: "END", onPress: () => this.endRequest() }
        ],
        { cancelable: false }
      );
    });
  }

  async cancelRequest() {
    let token = await AsyncStorage.getItem("token");
    fetch("http://cocoabeans.herokuapp.com/cancelRequest", {
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
        this.alert("SUCCESS", responseJson)
        
      })
      .catch(error => {
        console.error(error);
      });
  }

  async endRequest() {
    const x = {
      "fees" : "100"
    }
    let token = await AsyncStorage.getItem("token");
    fetch("http://cocoabeans.herokuapp.com/endRequest", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: "Bearer " + token
      },
      body : JSON.stringify(x),
    })
      .then(response => response.text())
      .then(responseJson => {
        // console.log("**************", response)
        console.log(responseJson)
        this.alert("SUCCESS", responseJson)
      })
      .catch(error => {
        console.error(error);
      });
  }

  async saveLoc() {
    navigator.geolocation.getCurrentPosition(position => {
        
        console.log(position["coords"]["latitude"]);
        console.log(position["coords"]["longitude"]);
        this.state.latitude = (position["coords"]["latitude"]);
        this.state.longitude = (position["coords"]["longitude"]);

        error: null

    }, error => console.log(error),
    { enableHighAccuracy: true, timeout: 20000, maximumAge: 2000}
    );
    let token = await AsyncStorage.getItem("token");
    fetch("http://cocoabeans.herokuapp.com/saveProviderLoc", {
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
    //console.log(this.state.popup);
    const {navigate} = this.props.navigation;
    if(!this.state.screenFlag && !this.state.OnReuqest)
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
        {/* <PostLocation saveLoc={this.saveLoc.bind(this)} /> */}
        
        
          {/* <Button full success style={styles.button} onPress={this._toggleModal} ><Text style={{color:'#ffffff'}}>REQUEST</Text></Button> */}
       </View>

     );
     else if(this.state.OnReuqest && !this.state.screenFlag)
     return(

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
            {/* <Text style={{fontSize: 20, color: 'black', top: '50%'}}>On Request</Text> */}
          <Button full success style={styles.button} onPress={() => {this.change()}} ><Text style={{color:'#ffffff'}}>CHAT</Text></Button>
          <Button full success style={styles.button} onPress={() => {this.cancelRequest()}} ><Text style={{color:'#ffffff'}}>CANCEL</Text></Button>
          <Button full success style={styles.button} onPress={() => {this.endRequest()}} ><Text style={{color:'#ffffff'}}>END</Text></Button>

      </View>

);
else{
    return (
      <View style={styles.container2}>

        <TextInput
          style={[styles.default, {height: Math.max(35, this.state.height)}]}
          placeholder="Message"
          value={this.state.mess}
          onChangeText={(text) => this.setState({mess:text})}
                />

        <ScrollView>
                  { 
                    this.state.item.map((item,key) =>
                    (
                        <View key = {key} style = {styles.item}>
                        { 
                            item.imageFlag ? (
                            <Image source={{ uri: `data:image/jpg;base64,${item.message}` }} style={{ width: 200, height: 200 }} />
                        ) : (
                            <Text style = {styles.text}> {item.message} </Text>
                            )}
                        </View>
                    ))
                  }
        </ScrollView>

        <Button full success style={styles.button2} onPress={() => {this.sendMessage()}} ><Text style={{color:'#ffffff'}}>Send Message</Text></Button>
        <Button full success style={styles.button2} onPress = {() => {this.change()}}><Text>Back </Text></Button>
        <Button
              onPress={this.sendImage}
              title="Send Image"
              style={styles.button2}
              accessibilityLabel="Learn more about this purple button"
              />

            <Button
              onPress={this.pickImage}
              title="Pick Image"
              style = {{marginTop:50}}
              color="blue"
              accessibilityLabel="Learn more about this purple button"
            />

        
      </View>
    );
   }

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
    top: "80%",
    //left: 148.53
  },
  button2:{
    alignSelf: 'stretch',
    alignItems: 'center',
    padding: 10,
    paddingBottom: 10,
    position: 'absolute', //Here is the trick
    bottom: 0,
    //backgroundColor: '#1990e5',
    //marginTop: 30,
    //top: "80%",
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

