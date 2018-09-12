import React from 'react';
import { Icon } from 'expo';

const RenderIcon = ({ name, size, otherStyles = {}, onClickIcon }) => (
  <Icon.Entypo
    name={name}
    size={size}
    style={{ backgroundColor: "transparent", ...otherStyles }}
    onPress={onClickIcon}
  />
);

export default RenderIcon;