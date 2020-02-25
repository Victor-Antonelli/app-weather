import React, { Component } from 'react';
import { StyleSheet, Text, View, TextInput, KeyboardAvoidingView, TouchableOpacity } from 'react-native';
//import fetchLocationId from './services/api';

export default class App extends Component {
  
  state = { valTempMax: "", valTempMin: "", woeid: null, txtCidade: null, error: null };

  changeValTemp = async () =>  {
    
    if(this.state.txtCidade === null){
      this.setState({ error: "Campo de busca não preenchido" })
      return null;
    }  
    const locations = await fetch(
      `https://www.metaweather.com/api/location/search/?query=${this.state.txtCidade}`,
    ).then((response) => response.json())
    .then((responseJson) => {
      
      if(!responseJson[0]){
        this.setState({ error: "Cidade não encontrada!" })
        return null;
      }
      
      this.setState({ woeid: responseJson[0].woeid })
      const response = fetch(
        `https://www.metaweather.com/api/location/${this.state.woeid}/`,
      ).then((rexponse) => rexponse.json())
      .then((rexponseJson) => {
        
        let valTempMax = "Máxima de: " + Math.floor(rexponseJson.consolidated_weather[0].max_temp) + "ºc";
        let valTempMin = "Mínima de: " + Math.floor(rexponseJson.consolidated_weather[0].min_temp) + "ºc";
        this.setState({ valTempMax, valTempMin  })
      }

      );
    });

  }

  render(){
    return (
      <View style={styles.container}>
        <KeyboardAvoidingView style={styles.cardSearch}>
          <Text style={styles.title}>Previsão do Tempo</Text>
          <TextInput style={styles.inputSearch} placeholder="Procure por um lugar" onChangeText={(txtCidade) => this.setState({txtCidade})} />
          <TouchableOpacity style={styles.btnSearch} onPress={this.changeValTemp}>
            <Text>Pesquisar</Text>
          </TouchableOpacity>
          <View style={styles.tempDisplay}>
            <Text style={styles.valTemp}>{this.state.valTempMax}</Text>
            <Text style={styles.valTemp}>{this.state.valTempMin}</Text>
            <Text style={styles.error}>{this.state.error}</Text>
          </View>
        </KeyboardAvoidingView> 
      </View>
    );
  }
  
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#222',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    paddingBottom: 20
  },
  cardSearch: {
    backgroundColor: "#fafafa",
    borderColor: "#91c4cc",
    borderWidth: 2,
    borderRadius: 10,
    padding: 55
  },
  inputSearch: {
    borderRadius: 18,
    backgroundColor: "lightgray",
    height:  40,
    padding: 5
  },
  btnSearch: {
    marginTop: 10,
    height: 45,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFF",
    borderRadius: 25,
    borderColor: "#91c4cc",
    borderWidth: 2
  },
  tempDisplay: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20
  },
  error: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#f00"
  },
  valTemp: {
    fontSize: 25,
    fontWeight: "bold"
  }
  
});
