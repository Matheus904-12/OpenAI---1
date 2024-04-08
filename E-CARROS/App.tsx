import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TextInput, TouchableOpacity, Modal, Alert } from 'react-native';

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
          "Authorization": `Bearer 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`,
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

  return (
    <View style={styles.container}>
      <Text style={styles.header}>E-Carros</Text>
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.addButtonText}>Anunciar Veículo</Text>
      </TouchableOpacity>
      <ScrollView style={styles.vehicleList}>
        {vehicles.map((vehicle, index) => (
          <View key={index} style={styles.vehicleItem}>
            <Text style={styles.vehicleText}>{`Marca: ${vehicle.brand}`}</Text>
            <Text style={styles.vehicleText}>{`Modelo: ${vehicle.model}`}</Text>
            <Text style={styles.vehicleText}>{`Ano: ${vehicle.year}`}</Text>
            <Text style={styles.vehicleText}>{`Quilometragem: ${vehicle.mileage}`}</Text>
            <Text style={styles.vehicleText}>{`Preço: ${vehicle.price}`}</Text>
            <TouchableOpacity
              style={styles.contactButton}
              onPress={() => handleSeeMore(vehicle)}
            >
              <Text style={styles.contactButtonText}>Saber Mais</Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>

      {/* Modal para adicionar novo veículo */}
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
              onChangeText={text => setNewVehicle({...newVehicle, year: text})}
            />
            <TextInput
              style={styles.input}
              placeholder="Quilometragem"
              value={newVehicle.mileage}
              onChangeText={text => setNewVehicle({...newVehicle, mileage: text})}
            />
            <TextInput
              style={styles.input}
              placeholder="Preço"
              value={newVehicle.price}
              onChangeText={text => setNewVehicle({...newVehicle, price: text})}
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    paddingTop: 40,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#FF5C00'
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
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  vehicleText: {
    fontSize: 16,
    marginBottom: 10,
  },
  contactButton: {
    backgroundColor: '#4CD964',
    padding: 10,
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
    backgroundColor: 'linear-gradient(to right, rgba(93, 89, 255, 1), rgba(153, 153, 153, 1))',
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
  modalTitle: {
    color: '#FF5C00',
    fontWeight: 'bold',
    padding: '15px',
    Right: '15px',
  },
  addButtonText: 
});
