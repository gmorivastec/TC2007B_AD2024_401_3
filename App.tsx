/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Button,
  Alert,
  Image
} from 'react-native';

import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';

// LIBRARY BEING USED:
// https://rnfirebase.io/

function App(): React.JSX.Element {
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [breed, setBreed] = useState("");
  const [name, setName] = useState("");
  const [imageURL, setImageURL] = useState("");

  const [user, setUser] = useState();

  // storage
  storage()
  .ref('puppy1.jpg')
  .getDownloadURL()
  .then(url => {
    console.log(url);
    setImageURL(url);
  });

  useEffect(
    () => {
      const subscriber = auth().onAuthStateChanged(user => {
        setUser(user);
        console.log("*** USER STATUS: " + user);
      });

      // when on unmount is invoked on this component
      // any methods returned on useEffect will be invoked
      // as part of the component's cleanup
      return subscriber;
    }, 
    []);
  
  useEffect(() => {
    const subscriber = firestore()
    .collection('perritos')
    .onSnapshot(querySnapshot => {
      console.log("+++++++++++++++++++++++");
      querySnapshot.forEach(currentDoc => {
        console.log(currentDoc.data());
      });
    });
    return subscriber;
  }, []);

  return (
    <View>
      <TextInput
        placeholder='email'
        onChangeText={text => {
          setEmail(text);
        }}
      />
      <TextInput
        placeholder='password'
        secureTextEntry={true}
        onChangeText={text => {
          setPassword(text);
        }}
      />
      <Button 
        title="Sign up"
        onPress={() => {
          auth()
          .createUserWithEmailAndPassword(email, password)
          .then((userCredential : FirebaseAuthTypes.UserCredential) => {
            console.log("user created successfully! " + userCredential.user.email);
          })
          .catch( error => {
            console.log(error.code);
          });
        }}
      />
      <Button 
        title="Sign in"
        onPress={() => {
          auth()
          .signInWithEmailAndPassword(email, password)
          .then(() => {
            console.log("SIGNED IN!");
          })
          .catch(error => {
            console.log(error);
          });
        }}
      />
      <Button 
        title="Sign out"
        onPress={() => {
          auth().signOut();
        }}
      />
      <TextInput
        placeholder='name'
        onChangeText={text => {
          setName(text);
        }}
      />

      <TextInput
        placeholder='breed'
        onChangeText={text => {
          setBreed(text);
        }}
      />
      <Button 
        title="Add new"
        onPress={() => {
          firestore()
          .collection('perritos')
          .add({
            breed: breed,
            name: name
          })
          .then(newDoc => {
            console.log("ADDED NEW DOCUMENT: " + newDoc.id);
          });
        }}
      />
      <Button 
        title="get all"
        onPress={() => {
          firestore()
          .collection('perritos')
          .get()
          .then(querySnapshot => {

            // traverse through results 
            querySnapshot.forEach(currentDocument => {
              console.log(currentDocument.data());
            });
          });
        }}
      />
      <Button 
        title="query"
        onPress={() => {
          firestore()
          .collection('perritos')
          .where('breed', '==', 'Labrador')
          .get()
          .then(querySnapshot => {

            // traverse through results 
            querySnapshot.forEach(currentDocument => {
              console.log(currentDocument.data());
            });
          });
        }}
      />
      {
        imageURL != "" ?
        <Image 
          source={{uri: imageURL}}
          style={{width: 100, height: 100}}
        /> 
        :
        <Text>Loading image...</Text>
      }
    </View>
  );
}

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default App;
