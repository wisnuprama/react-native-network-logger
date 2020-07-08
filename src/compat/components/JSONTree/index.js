/**
 * Fork of https://github.com/Dean177/react-native-json-tree
 */
import React from 'react';
import PropTypes from 'prop-types';
import { Text, View } from 'react-native';
import JSONNode from './JSONNode';
import createStylingFromTheme from './createStylingFromTheme';

const identity = (value) => value;

class JSONTree extends React.Component {
  static propTypes = {
    data: PropTypes.oneOfType([
      PropTypes.array,
      PropTypes.bool,
      PropTypes.number,
      PropTypes.object,
      PropTypes.string,
    ]).isRequired,
    hideRoot: PropTypes.bool,
    keyPath: PropTypes.arrayOf(
      PropTypes.oneOfType([PropTypes.string, PropTypes.number])
    ),
    postprocessValue: PropTypes.func,
    sortObjectKeys: PropTypes.oneOfType([PropTypes.func, PropTypes.bool]),
  };

  static defaultProps = {
    shouldExpandNode: (keyName, data, level) => level === 0, // expands root by default,
    hideRoot: false,
    keyPath: ['root'],
    getItemString: (type, data, itemType, itemString) => (
      <Text>
        {itemType} {itemString}
      </Text>
    ),
    labelRenderer: ([label]) => <Text>{label}:</Text>,
    valueRenderer: identity,
    postprocessValue: identity,
    isCustomNode: () => false,
    collectionLimit: 50,
    sortObjectKeys: true,
  };

  render() {
    const {
      data: value,
      keyPath,
      postprocessValue,
      hideRoot,
      ...rest
    } = this.props;

    const styling = createStylingFromTheme();

    return (
      <View {...styling('tree')}>
        <JSONNode
          hideRoot={hideRoot}
          keyPath={hideRoot ? [] : keyPath}
          postprocessValue={postprocessValue}
          styling={styling}
          value={postprocessValue(value)}
          {...rest}
        />
      </View>
    );
  }
}

export default JSONTree;
