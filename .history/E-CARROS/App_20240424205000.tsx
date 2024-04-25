import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Modal, Alert, FlatList } from 'react-native';
import Carousel from 'react-native-snap-carousel';

export default function App() {
  const [vehicles, setVehicles] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [newVehicle, setNewVehicle] = useState({
    brand: '',
    model: '',
    year: '',
    mileage: '',
    price: '',
  });

  const handleAddVehicle = () => {
    if (
      newVehicle.brand === '' ||
      newVehicle.model === '' ||
      newVehicle.year === '' ||
      newVehicle.mileage === '' ||
      newVehicle.price === ''
    ) {
      Alert.alert('Erro', 'Todos os campos são obrigatórios!', [{ text: 'Ok' }]);
      return;
    }

    setVehicles([...vehicles, newVehicle]);
    setNewVehicle({
      brand: '',
      model: '',
      year: '',
      mileage: '',
      price: '',
    });
    setModalVisible(false);

    Alert.alert('Sucesso', 'Veículo anunciado com sucesso!', [{ text: 'Ok' }]);
  };

  const handleSeeMore = async (vehicle) => {
    try {
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer `,
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages: [
            {
              role: 'user',
              content: `Saber mais sobre o veículo: ${vehicle.brand} ${vehicle.model} ${vehicle.year}`
            }
          ],
          temperature: 0.7,
          max_tokens: 150,
          top_p: 1,
        })
      });

      const data = await response.json();
      const vehicleInfo = data.choices[0].message.content;

      Alert.alert('Detalhes do Veículo', vehicleInfo, [{ text: 'Ok' }]);
    } catch (error) {
      console.error('Erro ao obter informações do veículo:', error);
      Alert.alert('Erro', 'Erro ao obter informações do veículo. Por favor, tente novamente mais tarde.', [{ text: 'Ok' }]);
    }
  };

  const renderItem = ({ item }) => {
    return (
      <View style={styles.vehicleItem}>
        <Text style={styles.vehicleText}>{`Marca: ${item.brand}`}</Text>
        <Text style={styles.vehicleText}>{`Modelo: ${item.model}`}</Text>
        <Text style={styles.vehicleText}>{`Ano: ${item.year}`}</Text>
        
        <TouchableOpacity
          style={styles.contactButton}
          onPress={() => handleSeeMore(item)}
        >
          <Text style={styles.contactButtonText}>Saber Mais</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>E-Carros</Text>
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.addButtonText}>Anunciar Veículo</Text>
      </TouchableOpacity>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Novo Veículo</Text>
            <TextInput
              style={styles.input}
              placeholder="Marca"
              value={newVehicle.brand}
              onChangeText={text => setNewVehicle({...newVehicle, brand: text})}
            />
            <TextInput
              style={styles.input}
              placeholder="Modelo"
              value={newVehicle.model}
              onChangeText={text => setNewVehicle({...newVehicle, model: text})}
            />
            <TextInput
              style={styles.input}
              placeholder="Ano"
              value={newVehicle.year}
              onChangeText={year => setNewVehicle({...newVehicle, year: year})}
            />
            <TextInput
              style={styles.input}
              placeholder="Quilometragem"
              value={newVehicle.mileage}
              onChangeText={number => setNewVehicle({...newVehicle, mileage: number})}
            />
            <TextInput
              style={styles.input}
              placeholder="Preço"
              value={newVehicle.price}
              onChangeText={number => setNewVehicle({...newVehicle, price: number})}
            />
            <TouchableOpacity
              style={styles.addButton}
              onPress={handleAddVehicle}
            >
              <Text style={styles.addButtonText}>Anunciar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.addButton, styles.cancelButton]}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.addButtonText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <FlatList
        style={styles.vehicleList}
        data={vehicles}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1d1d1d',
    alignItems: 'center',
    paddingTop: 40,
  },
  header: {
    fontSize: 29,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#FF5C00',
    paddingTop: 35,
  },
  addButton: {
    backgroundColor: '#5D59FF',
    padding: 10,
    borderRadius: 15,
    marginBottom: 20,
  },
  addButtonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  vehicleList: {
    flex: 1,
    width: '100%',
  },
  vehicleItem: {
    backgroundColor: 'white',
    padding: 20,
    marginBottom: 20,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 100, height: 20 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    marginTop: 40,
    marginRight: 30,
    marginRight: 30,

  },
  vehicleText: {
    fontSize: 16,
    marginBottom: 10,
  },
  contactButton: {
    backgroundColor: '#4CD964',
    padding: 5,
    borderRadius: 8,
    marginTop: 10,
  },
  contactButtonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(79, 79, 89, 1)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '80%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#000000',
    borderRadius: 8,
    padding: 10,
    marginBottom: 20,
  },
  cancelButton: {
    backgroundColor: '#FF5c00',
  },
});
