import React, { Component } from 'react';
import { Center } from "@builderx/utils";
import { Alert, ScrollView, View, StyleSheet, Text, Image, AppRegistry, DatePickerIOS } from "react-native";
import { TextInput } from 'react-native-gesture-handler';
import { Button } from 'native-base';
import { Dropdown } from 'react-native-material-dropdown';

export default class App extends Component {
    static navigationOptions ={
        header:null
         // title: 'Registration Screen',
      };
      
  
    constructor(props){
      super(props);
      this.state = { username: '',
                      password: '',
                      email: '',
                      mobileNumber: '',
                      chosenDate: new Date()
                    };
                    
     //this.register2 = this.register2.bind(this);
     this.setDate = this.setDate.bind(this);
    }
    
    setDate(newDate) {
        this.setState({chosenDate: newDate});
      }
    async register2(){
     try { 
      let result = await fetch('http://127.0.0.:8080/register/provider', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(this.state),
      
      
    });
    console.log(result);
    this.checkStatus(result.status, result._bodyInit)
  } catch (error) {
      console.log(error);
      console.log('aywaaa')
    };
  }
  render() {
    let data = [{
        value: '2019',
      }, {
        value: '2020',
      }
    ]
    const {navigate} = this.props.navigation;
    return (
      <ScrollView>
          <View style={styles.root}>
        <View style={styles.rect} />
        {/* <Text style={styles.text}>Register</Text> */}
            <Text style={styles.header}>Vacation Request</Text>
          <TextInput style={styles.textinput} placeholder="Request Number" placeholderTextColor='#fff'
            value={this.state.username}>
          </TextInput>
          <Dropdown 
                //dropdownOffset={top = 60}
                label='Vacation Type'
                baseColor='#fff'
                placeholderTextColor='#fff'
                data={data}
           />
           <Text style={styles.tt}>From</Text>
           <DatePickerIOS
            mode = 'date'
            date={this.state.chosenDate}
            onDateChange={this.setDate}
            />
            <Text style={styles.tt}>To</Text>
           <DatePickerIOS
            mode = 'date'
            date={this.state.chosenDate}
            onDateChange={this.setDate}
            />
            <Text style={styles.header}>Return Date</Text>
           <DatePickerIOS
            mode = 'date'
            date={this.state.chosenDate}
            onDateChange={this.setDate}
            />
          
          <TextInput style={styles.textinput} placeholder="Phone Number" placeholderTextColor='#fff' onChangeText={(mobileNumber) => this.setState({mobileNumber})}
            value={this.state.mobileNumber}>
          </TextInput>
          {/* <Center horizontal>
          <Button9 style={styles.button7} />
          </Center>  */}
          
          
            <Button style={styles.button7} onPress={() => {this.register2()}}>
                <Text style={styles.bcont2}>Request</Text>
            </Button>
       
       </View>
      </ScrollView>
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
     paddingTop: 60,
     //alignItems: 'center',
     justifyContent: 'center',
  },
  rect: {
    height: '98%',
    width: '160%',
    top: 0,
    left: 0,
    position: "absolute",
    backgroundColor: "rgb(219, 178, 10)",
    opacity: 1
  },
  button7: {
    top: '100%',
    position: "absolute",
    height: 44,
    width: 130,
    left: "50%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(164,41,34,1)",
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
    color: "rgba(243,240,240,1)",
    fontSize: 23,
    fontFamily: "AGaramondPro-Regular"
  },
  header:{
    fontSize: 24,
    color: '#fff',
    paddingBottom: 10,
    marginBottom: 10,
    borderBottomColor: '#fff',
    borderBottomWidth: 2,

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
    color: '#fff',
    borderBottomColor: '#f8f8f8',
    borderBottomWidth: 1,
  },
  tt:{
    marginTop: 20,  
    alignSelf: 'stretch',
    //height: 40,
    //marginBottom: 30,
    color: '#fff',
    //borderBottomColor: '#f8f8f8',
    //borderBottomWidth: 1,
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
  
  button9: {
    top: 738.5,
    position: "absolute",
    height: 44,
    left: "32.8%"
  },
  text2: {
    top: 732,
    position: "absolute",
    backgroundColor: "transparent",
    left: "32.8%"
  }
});