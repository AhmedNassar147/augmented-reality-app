import React, { Component } from 'react';
import { Constants, Permissions } from 'expo';
import { Text, TouchableOpacity, StyleSheet, View } from 'react-native';
import Colors from '../constants/Colors';


const Button = ({ children, onPress }) => (
  <TouchableOpacity style={styles.buttonTouchable} onPress={onPress}>
    <Text style={styles.buttonText}>{children}</Text>
  </TouchableOpacity>
);

class PermissionGuard extends Component {
  state = {
    status: null,
  };

  async componentWillMount() {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({ status: status === 'granted' });
  }


  _askAsync = async () => {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({ status });
  };

  // && Constants.appOwnership !== 'expo'
  onGrantAccessPressed = () => {
    if (this.state.status === 'denied') {
      return;
    } else {
      this._askAsync().then(err => err);
    }
  };

  render() {
    if (this.state.status !== 'granted') {
      return (
        <View style={styles.container}>
          <Text style={styles.infoText}>
            {Constants.manifest.name} needs access to the camera
          </Text>
          <Button onPress={this.onGrantAccessPressed}>Grant Access</Button>
        </View>
      );
    }
    else {
      return this.props.children
    };
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  infoText: {
    fontSize: 30,
    fontWeight: 'bold',
    color: Colors.dark,
    textAlign: 'center',
    marginBottom: '25%',
  },
  buttonTouchable: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.light,
  },
  buttonText: {
    color: Colors.dark,
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'center',
  },
});

export default PermissionGuard;