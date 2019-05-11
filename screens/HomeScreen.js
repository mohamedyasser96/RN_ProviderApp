import React from 'react';
import { StyleSheet, Text, View, AsyncStorage, Alert, TextInput, ScrollView, Image, Dimensions } from 'react-native';
import MapView, { Marker } from "react-native-maps";
import Modal from "react-native-modal";
import {ImagePicker, Permissions} from 'expo';

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
var summary = {uname: '', mobileNum: '', rating: ''};
const screenWidth = Math.round(Dimensions.get('window').width);
const screenHeight = Math.round(Dimensions.get('window').height)

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
            topic: '',
            Severity: '1',
            seekerEmail: '',



        };
        

        this.change = this.change.bind(this);
        this.on_connect = this.on_connect.bind(this);

        setInterval(() => (
          this.setState({item:items})), 1000);
        // this.state.token = this._retrieveData()        
        //this.getUserLocation = this.getUserLocation.bind(this);
    }

    
    pickImage = async () => {
      const options = {
        base64:true,
        quality: 1.0,
        aspect: [4, 3]
      };

      let result = await ImagePicker.launchImageLibraryAsync(options);

      if(!result.cancelled)
        this.setState({base64Image: result.base64});
    }

    sendImage = () => {
      var from = this.state.email
      var text = this.state.base64
      var topic = this.state.topic

      stompClient.send("/app/chat/images/"+topic, {}, JSON.stringify({'from':from, 'text':text}));
    }

    async on_connect(emails){

      var socket = new SockJS('http://10.40.48.248:5000/chat');
      stompClient = Stomp.over(socket);  

      let email =  await AsyncStorage.getItem('email');
      this.state.email = email;
      topic = emails + "_" + email;
      this.state.topic = topic

      stompClient.connect({}, function(frame) {
      
        var urlarray = socket._transport.url.split('/');
        var index = urlarray.length - 2;
  
        sesid = urlarray[index];
        
        stompClient.subscribe('/user/topic/messages', function(messageOutput) {
          console.log('Message Received')
  
          var obj = JSON.parse(messageOutput.body)
          var dict = {"from": obj.from, "imageFlag": false, "message":obj.message}
          items.splice(0,0,dict);
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
      
    //}
      let token = await AsyncStorage.getItem("token");
    console.log(token);
    this.eventSource1 = await new EventSource("http://10.40.48.248:5000/notification", {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: "Bearer " + token
      }
    });
    
    

    await this.eventSource1.addEventListener("message", data => {
      //console.log(data.type); // message
      //console.log(data.data);
      let dt = data.data.slice(1);
      var obj = JSON.parse(dt)
      //AsyncStorage.setItem("request_id", req_id)
      console.log("HEYYYYY", obj)
      summary.uname = obj.username,
      summary.rating = obj.rating,
      summary.mobileNum = obj.mobileNum,
      this.state.seekerEmail = obj.seekerEmail,
      console.log("Hey 2", obj.requestID),
      this.state.requestID = obj.requestID
      Alert.alert(
        "Request Available",
        "Description: " + obj.description,
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

    // this.eventSource.removeAllListeners();
    this.eventSource1.close();
      
    });

    



    navigator.geolocation.getCurrentPosition(position => {
        
      // console.log(position["coords"]["latitude"]);
      // console.log(position["coords"]["longitude"]);
      this.state.latitude = (position["coords"]["latitude"]);
      this.state.longitude = (position["coords"]["longitude"]);

      error: null

    }, error => console.log(error),
    { enableHighAccuracy: true, timeout:10000, maximumAge: 2000}
    );

    this.interval = setInterval(() => this.saveLoc(), 8000);

  }

  async componentWillUnmount() {
    await this.eventSource1.removeAllListeners();
    await this.eventSource1.close()
    await this.eventSource2.removeAllListeners();
    await this.eventSource2.close();
    clearInterval(this.interval);
  }

  async accept() {
    let token = await AsyncStorage.getItem("token");
    //let reqID = await AsyncStorage.getItem("request_id")
    await fetch("http://10.40.48.248:5000/acceptSeekerRequest", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: "Bearer " + token
      },
      body: JSON.stringify({
        request_id : this.state.requestID,
        num_providers: 1,
      })
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

    this.eventSource2 = await new EventSource("http://10.40.48.248:5000/notifyProvider", {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: "Bearer " + token
      }
    });
    
    

    await this.eventSource2.addEventListener("message", data => {
      console.log(data.type); // message
      console.log(data.data);
      this.toggleRequestPage()
      this.on_connect(this.state.seekerEmail)
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
          }
          // { text: "CANCEL", onPress: () => this.cancelRequest() },
          // { text: "END", onPress: () => this.endRequest() }
        ],
        { cancelable: false }
      );
    // this.eventSource.removeAllListeners();
    this.eventSource2.close();
    });

  }

  async cancelRequest() {
    let token = await AsyncStorage.getItem("token");
    let reqID = await AsyncStorage.getItem("request_id")
    await fetch("http://10.40.48.248:5000/cancelRequest", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: "Bearer " + token
      },
      body: JSON.stringify({
        request_id : this.state.requestID,
      })
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

  startSev(){
    Alert.alert(
      ' Pick Severity',
       '',
       [
         {
           text: "Low",
           onPress: () => {this.state.Severity = '1', this.endRequest()},
           style: "cancel"
         },
         {
          text: "Medium",
          onPress: () => {this.state.Severity = '2', this.endRequest()},
          style: "cancel"
        },
        {
          text: "High",
          onPress: () => {this.state.Severity = '3', this.endRequest()},
          style: "cancel"
        }
       ],
       { cancelable: false }
     ); 
  }

  async endRequest() {
      
    const x = {
      "fees" : "100"
    }
    let token = await AsyncStorage.getItem("token");
    //let reqID = await AsyncStorage.getItem("request_id")
    await fetch("http://10.40.48.248:5000/endRequest", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: "Bearer " + token
      },
      body : JSON.stringify({
        fees : 100,
        request_id : this.state.requestID,
        trueSeverity: this.state.Severity,
      })
    })
      .then(response => response.text())
      .then(responseJson => {
        // console.log("**************", response)
        console.log(responseJson)
        //this.alert("SUCCESS", responseJson)
        Alert.alert(
          title,
          message,
          [
            {
              text: "OK",
              onPress: () => {this.toggleRequestPage()},
              style: "cancel"
            }
          ],
          { cancelable: false }
        );
      })
      .catch(error => {
        console.error(error);
      });
  }

  

  async saveLoc() {
    // navigator.geolocation.getCurrentPosition(position => {
        
    //     console.log(position["coords"]["latitude"]);
    //     console.log(position["coords"]["longitude"]);
    //     this.state.latitude = (position["coords"]["latitude"]);
    //     this.state.longitude = (position["coords"]["longitude"]);

    //     error: null

    // }, error => console.log(error),
    // { enableHighAccuracy: true, timeout: 20000, maximumAge: 2000}
    // );
    let token = await AsyncStorage.getItem("token");
    await fetch("http://10.40.48.248:5000/saveProviderLoc", {
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
              style={styles.map2}
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
                  style={styles.map2}
                  region={{
                    latitude: this.state.latitude,
                    longitude: this.state.longitude,
                    latitudeDelta: 0.015,
                    longitudeDelta: 0.0121,
                  }}>
                  <Marker coordinate={this.state} />
                  <Marker coordinate={this.provs} pinColor='#417df4'/>
            </MapView>
            <Text style={{fontSize: 15, color: 'black', top: '80%', fontWeight: 'bold'}}>{"Username: " + summary.uname}</Text>
            <Text style={{fontSize: 15, color: 'black', top: '83%', fontWeight: 'bold'}}>{"Rating: " + summary.rating + " Stars"}</Text>
            <Text style={{fontSize: 15, color: 'black', top: '85%', fontWeight: 'bold'}}>{"Mobile: " + summary.mobileNum}</Text>

            {/* <Text style={{fontSize: 20, color: 'black', top: '50%'}}>On Request</Text> */}
          {/* <Button full success style={styles.button} onPress={() => {this.change()}} ><Text style={{color:'#ffffff'}}>CHAT</Text></Button>
          <Button full success style={styles.button} onPress={() => {this.cancelRequest()}} ><Text style={{color:'#ffffff'}}>CANCEL</Text></Button>
          <Button full success style={styles.button} onPress={() => {this.startSev()}} ><Text style={{color:'#ffffff'}}>END</Text></Button> */}
          <View  style={{
                  flex: 1,
                  marginTop:screenHeight*0.1,
                  backgroundColor: 'transparent',
                  flexDirection: 'row',
                }} >
                        <Button rounded style={{
                            alignSelf: 'flex-end',
                            alignItems: 'center',
                            marginLeft:screenWidth*0.03,
                            backgroundColor: '#42b3f4'
                          }}
                          onPress={() => {this.change()}}
          
                          >
                      <Text>  Chat   </Text>
                    </Button>
          
                    <Button full rounded  style={{
                            alignSelf: 'flex-end',
                            alignItems: 'center',
                            marginLeft:screenWidth*0.03,
                            backgroundColor: '#2fa1e2'
                          }}
                          onPress={() => {this.cancelRequest()}}
                          >
                      <Text>   Cancel   </Text>
                    </Button>

                    <Button full rounded  style={{
                            alignSelf: 'flex-end',
                            alignItems: 'center',
                            marginLeft:screenWidth*0.03,
                            backgroundColor: '#258bc6'
                          }}
                          onPress={() => {this.startSev()}}
                          >
                      <Text>   End   </Text>
                    </Button>
            </View>
      </View>

);
else{
    return (
        <View>
          <ScrollView style={{position: 'absolute',
            top: 25,
            width: '100%',
            height: '70%',}}>
            { 
              this.state.item.map((item,key) =>
              (
                  <View key = {key} style = {styles.item}>
                  { 
                      item.imageFlag ? (
                       <Image source={{ uri: `data:image/jpg;base64,${item.message}` }} style={{ width: 200, height: 200 }} />
                  ) : (
                      <Text style = {styles.text}> {item.from + " : " + item.message} </Text>
                      )}
                  </View>
              ))
            }
          </ScrollView>
          <TextInput
                style={[styles.default, {marginTop:screenHeight*0.75 ,height: Math.max(35, this.state.height)}]}
                placeholder="Message"
                value={this.state.mess}
                onChangeText={(text) => this.setState({mess:text})}
                  />
  
          <View  style={{
                  flex: 1,
                  marginTop:screenHeight*0.1,
                  backgroundColor: 'transparent',
                  flexDirection: 'row',
                }} >
  
            <Button rounded style={{
                    alignSelf: 'flex-end',
                    alignItems: 'center',
                    marginLeft:screenWidth*0.08
                  }}
                  onPress={this.sendMessage}
  
                  >
              <Text>  Send Message   </Text>
            </Button>
  
            <Button full rounded success style={{
                    alignSelf: 'flex-end',
                    alignItems: 'center',
                    marginLeft:screenWidth*0.05
                  }}
                  onPress={this.sendImage}
                  >
              <Text>   Send Image   </Text>
            </Button>
  
            <Button full rounded danger style={{
                    alignSelf: 'flex-end',
                    alignItems: 'center',
                    marginLeft:screenWidth*0.05
                  }}
                  onPress={this.pickImage}
                  >
              <Text>   Attach   </Text>
            </Button>

            <Button full rounded danger style={{
                    alignSelf: 'flex-end',
                    alignItems: 'center',
                    //marginLeft:screenWidth*0.05
                  }}
                  onPress={() => {this.change()}}
                  >
              <Text>   `back`   </Text>
            </Button>
  
  
          </View>
        </View>
      );
   }

}
}


const styles = StyleSheet.create({
  item:{
   backgroundColor: 'white',
  },
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
 map2: {
   ...StyleSheet.absoluteFillObject,
   height: 550,
 },
 input: {
   //position: "absolute",
   top: "30%",
   borderBottomColor: 'black',
   borderBottomWidth: 1,
   alignSelf: 'stretch',
   justifyContent:'center',
   alignItems:'center',
   
   color: 'black'
 },
 text:{
   top: "30%",
   fontWeight: "bold",
   color: "black",
   fontSize: 14,
   paddingBottom: 5,
 },
 gridView: {
   marginTop: 20,
   flex: 1,
 },
 itemContainer: {
   justifyContent: 'flex-end',
   borderRadius: 30,
   padding: 10,
   height: 190,
 },
 itemName: {
   fontSize: 14,
   color: '#fff',
   fontWeight: '600',
 },
 itemCode: {
   fontWeight: '600',
   fontSize: 12,
   color: '#fff',
 },
 dd:{
   alignSelf: 'stretch',
   alignItems: 'center',
   padding: 10,
   paddingBottom: 10,
   //backgroundColor: '#1990e5',
   //marginTop: 30,
   top: "80%",
   //left: 148.53
 },
 button:{
   alignSelf: 'stretch',
   alignItems: 'center',
   padding: 10,
   paddingBottom: 5,
   backgroundColor: '#42b3f4',
   marginTop: 5,
   top: "98%",
   //left: 148.53
 },
 buttonC:{
   //alignSelf: 'stretch',
   alignItems: 'center',
   padding: 10,
   paddingBottom: 10,
   //backgroundColor: '#1990e5',
   marginTop: 5,
   //top: "90%",
   position: 'absolute', //Here is the trick
   bottom: 0,
   //left: 148.53
 },
 buttonD:{
   //alignSelf: 'stretch',
   alignItems: 'center',
   padding: 10,
   paddingBottom: 10,
   //backgroundColor: '#1990e5',
   marginTop: 5,
   top: "100%",
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
 },
 text2: {
   borderColor: 'black',
   borderWidth : 1,
   fontSize: 15,
   color: "black",
   padding :15
},
text3: {
 borderColor: 'black',
 borderWidth : 1,
 fontSize: 15,
 color: "white",
 padding :15
},
container2: {
 paddingTop : 20,
 //flex: 1,
},
container3: {
 flex: 1,
},
button2:{
 color : "blue",
 top: "25%"

},
bottom:{
 flex: 1,
 justifyContent: 'flex-end',
   //marginBottom: 36
 
}

});

 const styles2 = StyleSheet.create({
   container: {
     flex: 1,
     backgroundColor: '#ffffff',
     //backgroundGradient: 'vertical',
     paddingLeft:60,
     paddingRight:60,
     alignItems: 'center',
     justifyContent: 'center',
   },
   item: {
     backgroundColor: 'white'
   },
   map: {
    ...StyleSheet.absoluteFillObject,
    height: 630,
  },
  text:{
    top: "30%",
    fontWeight: "bold",
    color: "black",
    fontSize: 14,
    paddingBottom: 10
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

