import React, { Component } from 'react';
import { Center } from "@builderx/utils";
import Button7 from "../symbols/button7";
import Button9 from "../symbols/button9";
import { Alert, View, StyleSheet, Text, Image, AppRegistry, AsyncStorage} from "react-native";
import { Button } from 'native-base';
import { TextInput } from 'react-native-gesture-handler';


export default class App extends Component {
    static navigationOptions ={
        header:null
         // title: 'Login Screen',
      };
  
      constructor(props){
        super(props);
        this.state = { email: '',
                        password: '',
                      };
       this.register2 = this.register2.bind(this);
      }
    showAlert (message) 
    {
      Alert.alert(
        'It seems something went wrong',
        message,
        [
          
          {
            text: 'Cancel',
            onPress: () => console.log('Cancel Pressed'),
            style: 'cancel',
          },
          {text: 'OK', onPress: () => console.log('OK Pressed')},
        ],
        {cancelable: false},
      );
    }
      checkStatus (token, message)
      {
        if(token == null){
          console.log("HHEEYYYY")
          this.showAlert(message)
        }
  
        else{
          this._storeData(token)
  
          
        }
      }
  
      _storeData = async(token) => { 
        try{
        //console.log("Ana fl try")
        await AsyncStorage.setItem('token', token)
        this.props.navigation.navigate("Main")
        
      }
      catch(error){
        console.log("Problem saving token")
      }
      }
      async register2()
      {
        try { 
         let result = await fetch('http://172.20.10.9:8080/login/provider', {
         method: 'POST',
         headers: {
           Accept: 'application/json',
           'Content-Type': 'application/json',
         },
         body: JSON.stringify(this.state),
       });
       console.log("gghygfy", result)
       body = JSON.parse(result._bodyInit)
       console.log(body.Status)
       
       token = body.Token
       this.checkStatus(token, body.Status);
     } catch (error) {
         console.log(error);
         console.log('aywaa')
       };
     }
    static navigationOptions ={
        header:null
         // title: 'Registration Screen',
      };
  render() {
    const {navigate} = this.props.navigation;
    return (
      <View style={styles.root}>
        <View style={styles.rect} />
        <Text style={styles.text}>CocoaBeans</Text>
        <Center horizontal>
          <Image source={require("./3.png")} style={styles.image} />
        </Center>
        {/* <Center horizontal> */}
          <TextInput style={styles.input} placeholder="Email" placeholderTextColor='#fff' onChangeText={(email) => this.setState({email})}
            value={this.state.email}>
          </TextInput>
          <TextInput style={styles.input2} placeholder="Password" secureTextEntry={true} placeholderTextColor='#fff' onChangeText={(password) => this.setState({password})}
            value={this.state.password}>
          </TextInput>
        {/* </Center> */}
        <Center horizontal>
          <Button style={styles.button7} onPress={() => {this.register2()}}>
            <Text style={styles.bcont2}>Login</Text>
          </Button>
        </Center>
        <Button style={styles.button9} onPress={() => {navigate('Second')}}>
            <Text style={styles.buttonContent}>Click Here</Text>
        </Button> 
        <Text style={styles.text2}>Not a provider? </Text>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  root: {
    backgroundColor: "white",
    flex: 1
  },
  rect: {
    height: 649.74,
    width: 375,
    top: 0,
    left: 0,
    position: "absolute",
    backgroundColor: "rgba(29,72,125,1)",
    opacity: 1
  },
  Broot: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "transparent",
    borderRadius: 5
  },
  buttonContent: {
    fontSize: 13,
    fontWeight: "500",
    fontFamily: "Roboto",
    color: "#000"
  },
  bcont2: {
    fontSize: 17,
    fontWeight: "500",
    fontFamily: "Roboto",
    color: "#fff"
  },
  text: {
    position: "absolute",
    backgroundColor: "transparent",
    left: "10.13%",
    top: "15.64%",
    color: "rgba(243,240,240,1)",
    fontSize: 16,
    fontFamily: "AGaramondPro-Regular"
  },
  image: {
    height: 300,
    width: 300,
    position: "absolute",
    top: "17.49%"
  },
  input: {
    //position: "absolute",
    top: "65.49%",
    borderBottomColor: '#f8f8f8',
    borderBottomWidth: 1,
    alignSelf: 'stretch',
    justifyContent:'center',
    alignItems:'center',
    marginLeft: 40,
    marginRight:60
  },
  input2: {
    //position: "absolute",
    top: "68.49%",
    borderBottomColor: '#f8f8f8',
    borderBottomWidth: 1,
    alignSelf: 'stretch',
    justifyContent:'center',
    alignItems:'center',
    marginLeft: 40,
    marginRight:60
  },
  button7: {
    top: 679,
    position: "absolute",
    height: 44,
    width: 130,
    left: "32.8%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(164,41,34,1)",
    paddingRight: 16,
    paddingLeft: 16,
    borderRadius: 5,
    opacity: 0.91
  },
  button9: {
    top: 738.5,
    position: "absolute",
    height: 44,
    left: "32.8%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "transparent",
    borderRadius: 5
  },
  text2: {
    top: 732,
    position: "absolute",
    backgroundColor: "transparent",
    left: "32.8%"
  }
});