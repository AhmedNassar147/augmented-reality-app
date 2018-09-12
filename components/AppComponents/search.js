import React from 'react'
import { View, TextInput, TouchableOpacity } from 'react-native'
import { Icon } from 'expo';

const SearchBar = ({ onSearch, handleChange, searchValue }) => {
  return (
    <View style={searchStyle}>
      <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'flex-start' }} >
        <TextInput
          onChangeText={text => handleChange(text)}
          value={searchValue}
          placeholder="Search"
          placeholderTextColor="gray"
          style={{ flex: 4, borderColor: 'transparent', fontSize: 13, fontWeight: '500', paddingHorizontal: 10 }}
        />
        <TouchableOpacity style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }} onPress={onSearch}>
          <Icon.Ionicons name="md-search" size={35} style={{ color: 'gray' }} />
        </TouchableOpacity>
      </View>
    </View>
  )
};

const searchStyle = {
  borderWidth: 1,
  borderRadius: 2,
  borderColor: '#ddd',
  borderBottomWidth: 0,
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.8,
  shadowRadius: 2,
  elevation: 1,
  marginLeft: 5,
  marginRight: 5,
  marginTop: 10,
  height: 45,
  marginBottom: 20
}

export default SearchBar;