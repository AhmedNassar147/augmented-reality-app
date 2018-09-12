import React from 'react';
import { ScrollView, Modal } from 'react-native';
import SearchBar from './search';
import GooglePolyResultView from './googlePolyResultView';

const SearchableAssetsModaView = props => {
  const {
    modalStatus,
    onSearchHandler,
    searchValue,
    handleSearchChanged,
    assets,
    onSelectObject,
    handleClose
  } = props

  return (
    <Modal visible={modalStatus} animationType="slide" onRequestClose={handleClose} >
      <ScrollView style={{ paddingTop: 20 }}>
        <SearchBar
          onSearch={onSearchHandler}
          searchValue={searchValue}
          handleChange={handleSearchChanged}
        />

        <GooglePolyResultView assets={assets} onSelectObject={onSelectObject} />
      </ScrollView>
    </Modal>
  )
};

export default SearchableAssetsModaView;