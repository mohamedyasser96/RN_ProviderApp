import React, { Component } from 'react';
import { Center } from "@builderx/utils";
import { Alert, View, StyleSheet, Text, Image, AppRegistry, CameraRoll } from "react-native";
import { TextInput } from 'react-native-gesture-handler';
import { Button } from 'native-base';
import { ImagePicker, Camera, Permissions } from 'expo';
// import RNFetchBlob from 'react-native-fetch-blob'

export default class App extends Component {
    static navigationOptions ={
        header:null
         // title: 'Registration Screen',
      };
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
      checkStatus (token, message){
        if(token == 406){
          console.log("HHEEYYYY")
          this.showAlert(message)
        }
  
        else{
          this.props.navigation.navigate("First")
          
        }
      }
  
    constructor(props){
      super(props);
      this.state = { username: '',
                      password: '',
                      email: '',
                      mobileNumber: '',
                      national_id: null,
                      hasCameraPermission: null,
                      type: Camera.Constants.Type.back,
                    };
  
     this.register2 = this.register2.bind(this);
    }

    async componentDidMount() {
      const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
      this.setState({ hasCameraPermission: status === 'granted' });
    }
    _pickImage = async () => {
      console.log('I am here')
      let result = await ImagePicker.launchImageLibraryAsync({
        allowsEditing: true,
        aspect: [4, 3],
      });
      
      console.log(result);
    
      if (!result.cancelled) {
        this.setState({ national_id: result });
      }
    };

  //   getPhotos = () => {
  //   CameraRoll.getPhotos({
  //     first: 20,
  //     assetType: 'All'
  //   })
  //   .then(r => this.setState({ photos: r.edges }))
  // }

    async register2(){
      let form = new FormData()
      let img = new FormData()
      form.append("username", this.state.username)
      form.append("password", this.state.password)
      form.append("email", this.state.email)
      form.append("mobileNumber", this.state.mobileNumber)
      form.append("file", this.state.national_id)
      console.log("#############")
      console.log(Object.keys(this.state.national_id))
      console.log("#############")
     try { 
      let result = await fetch('http://10.40.48.248:5000/register/provider', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'multipart/form-data',
      },
      body: form,
      file: this.state.national_id
    });
    console.log(result);
    this.checkStatus(result.status, result._bodyInit)
  } catch (error) {
      console.log(error);
      console.log('aywaaa')
    };
  }
  async reg(){
    try{
      const data = new FormData();
      data.append("username",this.state.username)
      data.append("password", this.state.password)
      data.append("email", this.state.email)
      //data.append("national_id", x)
      data.append("mobileNumber", this.state.mobileNumber)
      data.append("expertLevel", "2") // you can append anyone.
      data.append('national_id', {
                                        uri: this.state.national_id.uri,
                                        type: this.state.national_id.type, // or photo.type
                                        name: 'national_id'
      })
      // console.log(data)

      fetch('http://10.40.48.248:5000/register/provider', {
      method: 'post',
      headers: {
        Accept: 'application/json',
        'Content-Type': "*/*"
      },
      body: data,
      }).then(res => {
        console.log(res)
      });
    }
    catch (error) {
      console.log(error);
      console.log('aywaaa')
    };

  }
  render() {
    let { national_id } = this.state;
    const {navigate} = this.props.navigation;
    return (
      <View style={styles.root}>
        <View style={styles.rect} />
        <Text style={styles.text}>Register</Text>
        {/* <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}> */}
        {/* <Button large block
          title="Pick an image from camera roll"
          onPress={this._pickImage}
        /> */}
        {/* {national_id &&
          <Image source={{ path: national_id.uri }} style={{ width: 200, height: 200 }} />} */}
      {/* </View> */}
          <TextInput style={styles.textinput} placeholder="Username" placeholderTextColor='black' onChangeText={(username) => this.setState({username})}
            value={this.state.username}>
          </TextInput>
          <TextInput style={styles.textinput} placeholder="Email" placeholderTextColor='black' onChangeText={(email) => this.setState({email})}
            value={this.state.email}>
          </TextInput>
          <TextInput style={styles.textinput} placeholder="Password" secureTextEntry={true} placeholderTextColor='black' onChangeText={(password) => this.setState({password})}
            value={this.state.password}>
          </TextInput>
          <TextInput style={styles.textinput} placeholder="Phone Number" placeholderTextColor='black' onChangeText={(mobileNumber) => this.setState({mobileNumber})}
            value={this.state.mobileNumber}>
          </TextInput>
          {/* <Center horizontal>
          <Button9 style={styles.button7} />
          </Center>  */}
          
          <Center horizontal>
              <Button style={styles.button7} onPress={() => {this._pickImage }}>
                  <Text style={styles.bcont2}>Upload Doc</Text>
              </Button>
              <Button style={styles.button8} onPress={() => {this.reg()}}>
                  <Text style={styles.bcont2}>Register</Text>
              </Button>

          </Center>
          

      </View>
    );
  }
}

const styles = StyleSheet.create({
  root: {
    backgroundColor: "white",
    flex: 1,
    alignSelf: 'stretch',
     paddingLeft:60,
     paddingRight:60,
     alignItems: 'center',
     justifyContent: 'center',
  },
  bcont2: {
    fontSize: 15,
    fontWeight: "500",
    fontFamily: "Roboto",
    color: "#fff"
  },
  rect: {
    height: '80%',
    width: '200%',
    top: 0,
    left: 0,
    position: "absolute",
    backgroundColor: "white",
    opacity: 1
  },
  button8: {
    top: '89%',
    position: "absolute",
    height: 44,
    width: 130,
    left: "32.8%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#42b3f4",
    paddingRight: 16,
    paddingLeft: 16,
    borderRadius: 5,
    opacity: 0.91
  },
  text: {
    position: "absolute",
    backgroundColor: "transparent",
    left: "10.13%",
    top: "15.64%",
    color: "black",
    fontSize: 23,
    fontFamily: "AGaramondPro-Regular"
  },
  image: {
    height: 300,
    width: 300,
    position: "absolute",
    top: "17.49%"
  },
  textinput:{
    alignSelf: 'stretch',
    height: 40,
    marginBottom: 30,
    color: 'black',
    borderBottomColor: 'black',
    borderBottomWidth: 1,
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
    top: '82.5%',
    position: "absolute",
    height: 44,
    width: 130,
    left: "32.8%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#42b3f4",
    paddingRight: 16,
    paddingLeft: 16,
    //paddingBottom: 10,
    borderRadius: 5,
    opacity: 0.91
  },
  button9: {
    top: '90%',
    position: "absolute",
    height: 44,
    left: "32.8%"
  },
  text2: {
    top: '88%',
    position: "absolute",
    backgroundColor: "transparent",
    left: "32.8%"
  }
});

// const styles = StyleSheet.create({
//   root: {
//     backgroundColor: "white",
//     flex: 1,
//     alignSelf: 'stretch',
//      paddingLeft:60,
//      paddingRight:60,
//      alignItems: 'center',
//      justifyContent: 'center',
//   },
//   rect: {
//     height: 649.74,
//     width: 375,
//     top: 0,
//     left: 0,
//     position: "absolute",
//     backgroundColor: "brown",
//     opacity: 1
//   },
//   button7: {
//     top: 679,
//     position: "absolute",
//     height: 44,
//     width: 130,
//     left: "32.8%",
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "center",
//     backgroundColor: "rgba(164,41,34,1)",
//     paddingRight: 16,
//     paddingLeft: 16,
//     borderRadius: 5,
//     opacity: 0.91
//   },
//   text: {
//     position: "absolute",
//     backgroundColor: "transparent",
//     left: "10.13%",
//     top: "15.64%",
//     color: "rgba(243,240,240,1)",
//     fontSize: 23,
//     fontFamily: "AGaramondPro-Regular"
//   },
//   image: {
//     height: 300,
//     width: 300,
//     position: "absolute",
//     top: "17.49%"
//   },
//   textinput:{
//     alignSelf: 'stretch',
//     height: 40,
//     marginBottom: 30,
//     color: '#fff',
//     borderBottomColor: '#f8f8f8',
//     borderBottomWidth: 1,
//   },
//   input: {
//     //position: "absolute",
//     top: "65.49%",
//     borderBottomColor: '#f8f8f8',
//     borderBottomWidth: 1,
//     alignSelf: 'stretch',
//     justifyContent:'center',
//     alignItems:'center',
//     marginLeft: 40,
//     marginRight:60
//   },
//   input2: {
//     //position: "absolute",
//     top: "68.49%",
//     borderBottomColor: '#f8f8f8',
//     borderBottomWidth: 1,
//     alignSelf: 'stretch',
//     justifyContent:'center',
//     alignItems:'center',
//     marginLeft: 40,
//     marginRight:60
//   },
//   button7: {
//     top: 679,
//     position: "absolute",
//     height: 44,
//     width: 130,
//     left: "32.8%",
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "center",
//     backgroundColor: "rgba(164,41,34,1)",
//     paddingRight: 16,
//     paddingLeft: 16,
//     borderRadius: 5,
//     opacity: 0.91
//   },
//   button9: {
//     top: 738.5,
//     position: "absolute",
//     height: 44,
//     left: "32.8%"
//   },
//   text2: {
//     top: 732,
//     position: "absolute",
//     backgroundColor: "transparent",
//     left: "32.8%"
//   }
// });