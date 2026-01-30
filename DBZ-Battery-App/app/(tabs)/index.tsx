import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import * as Battery from "expo-battery";

/* ES MI MAIN O INDEX */
export default function App() {
  /* AQUI VA TODA LA LÓGICA Y VARIABLES */
  const [nivelBateria, setNivelBateria] = useState(0);
  const [personaje, setPersonaje] = useState<any>(null);

  const obtenerEnergia = async () => {
    const energia = await Battery.getBatteryLevelAsync(); //ESPERAMOS AL SENSOR
    /* await: Detiene la ejecución de esa función un milisegundo hasta que el sensor responda, evitando que la App use un dato vacío. */

    setNivelBateria(energia); //GUARDAMOS EL RESULTADO
  };

  const obtenerPersonaje = async (energia: number)=>{
    try{
      //CÁLCULO DEL RANGO
      let rangoBuscado = 'C';
      if (energia>=0.9) rangoBuscado = 'Z';
      else if (energia>=0.7) rangoBuscado = 'S';
      else if (energia>=0.5) rangoBuscado = 'A';
      else if (energia>=0.3) rangoBuscado = 'B';
      else if (energia<0.3) rangoBuscado = 'C';

      // PPETICIÓN GITHUB (LINK RAW)
      const respuesta = await fetch('https://raw.githubusercontent.com/Sergi0Y/dragon-ball-api/refs/heads/main/Json/characters.json');
      const datos = await respuesta.json();

      //FILTRADO ARRAY CHARACTERS
      const encontrado = datos.characters.find(
        (c: any) => c.name === 'Goku' && c.rank === rangoBuscado
      );

      //ACTUALIZAMOS ESTADO PARA QUE EL RENDER CAMBIE

      setPersonaje(encontrado);
    }catch (error){
      console.log("Error de conexión: ", error);
    }
  };
  
  useEffect(() => {
    const iniciar = async ()=>{
      // MIDE LA BATERÍA
      const energia = await Battery.getBatteryLevelAsync();
      setNivelBateria(energia);

      //BUSCA EL PERSONAJE CON LA ENERGÍA
      obtenerPersonaje(energia);
    }
    iniciar();
  }, []);
  /* El array vacío [] significa: "Solo ejecútate al nacer la App" */

  return (
    <View style={styles.container}>
      {/* ACA VA LO QUE EL USUARIO VE */}
      <Text style={styles.texto}>
        Hola mundo!, aquí va mi nivel de Ki: {Math.round(nivelBateria * 100)}%
      </Text>
      {personaje ? (
      <View style={styles.card}>
        <Text style={styles.formName}>{personaje.form}</Text>
        <Image source={{ uri: personaje.url_img }} style={styles.imagenChar} />
        <Text style={styles.rango}> Rango actual: {personaje.rank}</Text>  
      </View>
      ):(
        
        <Text style={{color: 'white'}}>Cargando guerrero...</Text>
      )}
    </View>
  );
}

/* STYLES */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#09f",
  },
  texto: {
    color: "#000000",
  },

    /* VIEW DE IMAGEN */
    
  card:{
    alignItems: 'center',
    padding: 10,
  },
  imagenChar: {
    width: 250,
    height: 250,
    resizeMode: 'contain', //PARA EVITAR QUE SE DEFORME
  },
  rango: {
    color: '#FF9900',
    marginTop: 10,
    fontStyle: 'italic',
  },
  formName:{
    color:'#fff',
    fontSize: 22,
    marginBottom: 10,
  },
  
});
