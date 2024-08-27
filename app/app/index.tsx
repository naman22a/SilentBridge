import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Button, Text } from 'react-native-paper';

const Home = () => {
    return (
        <View style={styles.container}>
            <Text variant="headlineLarge">Home Page</Text>
            <Button
                style={{ marginTop: 20 }}
                buttonColor="#333"
                mode="contained"
                onPress={() => console.log('Pressed')}
            >
                Press me
            </Button>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        display: 'flex',
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
});

export default Home;
