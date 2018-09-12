import React from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';

const AssetItem = ({ asset, onSelectObject }) => {
  const { displayName, authorName, thumbnail: { url } } = asset;

  return (
    <TouchableOpacity
      style={{ alignItems: 'center', marginVertical: 4 }}
      onPress={() => onSelectObject(asset)}
    >
      <Image source={{ uri: url }} style={{ width: 150, height: 150, borderRadius: 15 }} />
      <Text children={displayName} style={{ fontWeight: 'bold', textAlign: 'center' }} />
      <Text children={authorName} style={{ color: 'blue', textAlign: 'center' }} />
    </TouchableOpacity>
  )
};

const GooglePolyResultView = ({ assets = [], onSelectObject }) => {
  if (assets.length === 0) {
    return <Text style={{ fontWeight: 'bold', textAlign: 'center', color: 'blue' }} children="no data .. ! please hit the search" />;
  } else {
    let assetsGroup = [];
    for (let i = 0; i < assets.length; i += 2) {
      if (i === assets.length - 1) {
        assetsGroup.push(
          <AssetItem
            key={i}
            asset={assets[i]}
            onSelectObject={onSelectObject}
          />
        );
        break;
      } else {
        assetsGroup.push(
          <View key={i} style={{ flex: 1, flexDirection: 'row', paddingHorizontal: 8, justifyContent: 'space-between' }} >
            <AssetItem asset={assets[i]} onSelectObject={onSelectObject} />
            <AssetItem asset={assets[i + 1]} onSelectObject={onSelectObject} />
          </View>

        )
      }
    }
    return assetsGroup;
  }
};

export default GooglePolyResultView;