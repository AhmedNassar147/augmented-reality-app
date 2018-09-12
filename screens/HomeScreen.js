import { AR } from 'expo';
import ExpoTHREE, { AR as ThreeAR, THREE } from 'expo-three';
import React from 'react';
import { View, Dimensions, Platform } from 'react-native';
import ExpoGraphics from 'expo-graphics';

// import PermissionGaurd from './PermissionGaurd';

import GooglePoly from '../api/googlePoly';
import apiKey from '../constants/ApiKeys';
import { SearchableAssetsModaView, RenderIcon } from '../components/AppComponents';

const { GooglePolyKey } = apiKey;

class HomeScreen extends React.Component {

  static navigationOptions = {
    header: null,
  };

  constructor(props) {
    super(props);
    this.googlePoly = new GooglePoly(GooglePolyKey);
    this.state = {
      search: '',
      searchResult: [],
      isModalVisible: false,
      currentAsset: {}
    }
  }

  componentDidMount() {
    THREE.suppressExpoWarnings(true)
    ThreeAR.suppressWarnings()
  }

  onShouldReloadContext = () => {
    return Platform.OS === 'android';
  };

  onContextCreate = async ({ gl, scale: pixelRatio, width, height }) => {
    AR.setPlaneDetection(AR.PlaneDetectionTypes.Horizontal);

    this.renderer = new ExpoTHREE.Renderer({ gl, pixelRatio, width, height });

    this.scene = new THREE.Scene();
    this.scene.background = new ThreeAR.BackgroundTexture(this.renderer);
    this.camera = new THREE.PerspectiveCamera(width, width / height, 0.01, 5000);
    this.camera.position.z = 5;
    this.camera.lookAt(new THREE.Vector3());
  }


  onResize = ({ x, y, scale, width, height }) => {
    if (!this.renderer) {
      return;
    }
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setPixelRatio(scale);
    this.renderer.setSize(width, height);
  };

  onRender = (delta) => {

    // Rotate the object...
    if (this.threeModel) {
      this.threeModel.rotation.x += 2 * delta;
      this.threeModel.rotation.y += 1.5 * delta;
    }

    this.renderer.render(this.scene, this.camera);
  }

  onAddObjectPress = () => {
    // Remove the current object...
    this.onRemoveObjectPress();

    // Add the current object...
    GooglePoly.getThreeModel(this.state.currentAsset, object => {
      this.threeModel = object;
      ExpoTHREE.utils.scaleLongestSideToSize(object, 0.75);
      object.position.z = -3;
      this.scene.add(object);
    }, error => console.log(error));
  }

  onRemoveObjectPress = () => {
    if (this.threeModel) {
      this.scene.remove(this.threeModel);
    }
  }

  handleSearchChanged = value => this.setState({ search: value });

  onSearchHandler = () => {
    const text = this.state.search;
    this.googlePoly.setSearchParams(text);
    this.googlePoly.getSearchResults().then(assets => {
      this.setState({ searchResult: assets })
    }).catch(err => alert('there is somthing wrong with your network !'))
  }

  handleCloseSearchModal = () => this.setState({ isModalVisible: false });

  openSearchModal = () => this.setState({ isModalVisible: true });

  handleSelectObject = asset => {
    this.setState({ currentAsset: asset });
    this.handleCloseSearchModal()
  }

  componentWillUnmount() {
    this.handleCloseSearchModal()
  }


  render() {
    const { search, searchResult, isModalVisible } = this.state;
    const iconStyles = { backgroundColor: 'transparent', color: 'gray' }

    return (
      <View style={{ flex: 1 }} >
        <ExpoGraphics.View
          style={{ flex: 2, maxHeight: Dimensions.get('window').height - 45 }}
          onContextCreate={this.onContextCreate}
          onRender={this.onRender}
          onResize={this.onResize}
          isArEnabled
          isArRunningStateEnabled
          isArCameraStateEnabled
          arTrackingConfiguration={AR.TrackingConfigurations.World}
          onShouldReloadContext={this.onShouldReloadContext}
        />


        <View style={{ position: "absolute", bottom: 0, flex: 1, flexDirection: "row", backgroundColor: '#C5CAE9', borderTopWidth: 1 }}>
          <View style={{ flex: 1, flexDirection: "row", justifyContent: "space-between", backgroundColor: '#C5CAE9' }}>
            <RenderIcon size={40} name="circle-with-plus" onClickIcon={this.onAddObjectPress} otherStyles={iconStyles} />
            <RenderIcon size={40} name="magnifying-glass" onClickIcon={this.openSearchModal} otherStyles={iconStyles} />
            <RenderIcon size={40} name="circle-with-minus" onClickIcon={this.onRemoveObjectPress} otherStyles={iconStyles} />
          </View>
        </View>


        <SearchableAssetsModaView
          modalStatus={isModalVisible}
          onSearchHandler={this.onSearchHandler}
          searchValue={search}
          handleSearchChanged={this.handleSearchChanged}
          assets={searchResult}
          onSelectObject={this.handleSelectObject}
          handleClose={this.handleCloseSearchModal}
        />

      </View>
    );
  }
}

export default HomeScreen;
