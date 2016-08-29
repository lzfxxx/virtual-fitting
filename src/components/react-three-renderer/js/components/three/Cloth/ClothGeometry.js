import React from 'react';

const { PropTypes } = React;

import Cloth from './Cloth';

import PureRenderMixin from 'react-addons-pure-render-mixin';

class ClothGeometry extends React.Component {
  static propTypes = {
    cloth: PropTypes.instanceOf(Cloth).isRequired,
  };

  componentDidMount() {
    const geometry = this.refs.geometry;

    geometry.computeFaceNormals();
  }

  shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate;

  render() {
    const {
      cloth,
    } = this.props;

    // console.log(Cloth.clothFunction);
    // console.log(Cloth.w, Cloth.h, cloth.w, cloth.h);

    return (<parametricGeometry
      ref={'geometry'}
      parametricFunction={Cloth.clothFunction}
      slices={cloth.w}
      stacks={cloth.h}
      dynamic
    />);
  }
}

export default ClothGeometry;
