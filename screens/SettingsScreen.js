import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View, Switch
} from 'react-native';
import { CardList } from 'react-native-card-list';
import { Button } from 'native-base';
import { TextInput } from 'react-native-gesture-handler';
import { CreditCardInput, LiteCreditCardInput } from "react-native-credit-card-input";
 
state = { useLiteCreditCardInput: false };

  _onChange = (formData) => console.log(JSON.stringify(formData, null, " "));
  _onFocus = (field) => console.log("focusing", field);
  _setUseLiteCreditCardInput = (useLiteCreditCardInput) => this.setState({ useLiteCreditCardInput });

const cards = [
  {
    id: "0",
    title: "Edit Profile",
    picture: require('./assets/editP.png'),
    content: 
    <View >
      <Text style={{alignSelf: 'stretch',
      marginBottom: 30}} >Edit Password</Text>
      <TextInput style={{alignSelf: 'stretch',
      height: 40,
      marginBottom: 30,
      color: '#fff',
      borderBottomColor: '#f8f8f8',
      borderBottomWidth: 1,}} placeholder="Old Password" secureTextEntry={true} placeholderTextColor='grey'
            
          />
      <TextInput style={{alignSelf: 'stretch',
      height: 40,
      marginBottom: 30,
      color: '#fff',
      borderBottomColor: '#f8f8f8',
      borderBottomWidth: 1,}} placeholder="New Password" secureTextEntry={true} placeholderTextColor='grey'
            
          />
      <TextInput style={{alignSelf: 'stretch',
      height: 40,
      marginBottom: 30,
      color: '#fff',
      borderBottomColor: '#f8f8f8',
      borderBottomWidth: 1,}}
      placeholder="Confirm Password" secureTextEntry={true} placeholderTextColor='grey'
            //onChangeText={(password) => this.setState({password})}
            //value={this.state.password}
      />
      <Button style={{alignSelf: 'stretch',
          alignItems: 'center',
          padding: 20,
          backgroundColor: '#d8d6d7',
          marginTop: 30,}}>
                <Text style={{alignItems: 'center',
      fontSize: 17,
      justifyContent: 'center',}}>Change Password</Text>
          </Button> 
    </View>
  },
  {
    id: "1",
    title: "Add Payment Method",
    picture: require('./assets/payment.jpg'),
    content: 
    <View style={{backgroundColor: "#F5F5F5",
    marginTop: 0,}}>
        <Switch
          style={{alignSelf: "center",
          marginTop: 20,
          marginBottom: 20}}
          onValueChange={this._setUseLiteCreditCardInput}
          value={this.state.useLiteCreditCardInput} />

        { this.state.useLiteCreditCardInput ?
          (
            <LiteCreditCardInput
              autoFocus
              inputStyle={{fontSize: 16,
                color: "black",}}

              validColor={"black"}
              invalidColor={"red"}
              placeholderColor={"darkgray"}

              onFocus={this._onFocus}
              onChange={this._onChange} />
          ) : (
            <CreditCardInput
              autoFocus

              requiresName
              requiresCVC
              requiresPostalCode

              labelStyle={{color: "black",
              fontSize: 12,}}
              inputStyle={{fontSize: 16,
                color: "black",}}
              validColor={"black"}
              invalidColor={"red"}
              placeholderColor={"darkgray"}

              onFocus={this._onFocus}
              onChange={this._onChange} />
          )
        }
      </View>
    
  }
  // },
  // {
  //   id: "2",
  //   title: "Bedroom in Arles",
  //   //picture: require('./assets/bed.jpg'),
  //   content: <Text>Bedroom in Arles</Text>
  // }
]
 
export default class SettingsScreen extends React.Component {
  static navigationOptions = {
    header:null,
  }; 
  render() {
    return (
      <View style={styles.container}>
        <CardList cards={cards} />
      </View>
    );
  }
}
 
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  regform: {
    alignSelf: 'stretch',
    flex: 1,
     backgroundColor: '#50031c',
     //backgroundGradient: 'vertical',
     paddingLeft:60,
     paddingRight:60,
     alignItems: 'center',
     justifyContent: 'center',

  },
  header:{
      fontSize: 24,
      color: '#fff',
      paddingBottom: 10,
      marginBottom: 20,
      borderBottomColor: '#fff',
      borderBottomWidth: 5,

  },
  textinput:{
      alignSelf: 'stretch',
      height: 40,
      marginBottom: 30,
      color: '#fff',
      borderBottomColor: '#f8f8f8',
      borderBottomWidth: 1,

  },
  button:{
    alignSelf: 'stretch',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#d8d6d7',
    marginTop: 30,
  },
  btntext:{
      alignItems: 'center',
      fontSize: 17,
      justifyContent: 'center',

  }
});
