import { View, Text, Button } from 'react-native';
import { router } from 'expo-router';

export default function Signup() {
  return (
    <View>
      <Text>
        Signup Screen 
      </Text>
      <Button title="Signup" onPress={() => router.replace('/')} />
    </View>
  );
}
