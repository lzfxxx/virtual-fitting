import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, IndexRoute, Link, browserHistory } from 'react-router';
import styles from './Mark.less';
import { Icon, Modal, Button, Tabs,message } from 'antd';
import request from 'superagent';
const TabPane = Tabs.TabPane;

// const URL1 = 'http://0.0.0.0:5000/' + window.u + '/img1.jpg';
// const URL2 = 'http://0.0.0.0:5000/' + window.u + '/img2.jpg';
// const URL3 = 'http://0.0.0.0:5000/' + window.u + '/img3.jpg';
// const url = 'http://0.0.0.0:5000/' + window.u;
// const resultsURL = "http://0.0.0.0:5000/results/" + window.u;

// const URL1 = 'http://0.0.0.0:5000/' + 'user1' + '/img1.jpg';
// const URL2 = 'http://0.0.0.0:5000/' + 'user1' + '/img2.jpg';
// const URL3 = 'http://0.0.0.0:5000/' + 'user1' + '/img3.jpg';
// const url = 'http://0.0.0.0:5000/' + 'user1';
// const resultsURL = "http://0.0.0.0:5000/results/" + "user1";

const height = 500;
const width = 500;

class MarkPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      URL1: 'http://0.0.0.0:5000/' + 'user1' + '/img1.jpg',
      URL2: 'http://0.0.0.0:5000/' + 'user1' + '/img2.jpg',
      URL3: 'http://0.0.0.0:5000/' + 'user1' + '/img3.jpg',
      url: 'http://0.0.0.0:5000/' + 'user1' + '/*',
      resultsURL: 'http://0.0.0.0:5000/results/' + 'user1',
      // URL1: 'http://0.0.0.0:5000/' + this.props.params.username + '/img1.jpg',
      // URL2: 'http://0.0.0.0:5000/' + this.props.params.username + '/img2.jpg',
      // URL3: 'http://0.0.0.0:5000/' + this.props.params.username + '/img3.jpg',
      // url: 'http://0.0.0.0:5000/' + this.props.params.username +'/*',
      // resultsURL: 'http://0.0.0.0:5000/results/' + this.props.params.username,
    };
  }

  render() {
    function callback(key) {
      console.log(key);
    }

    return (
      <Tabs defaultActiveKey="1" onChange={callback}>
        <TabPane tab="Image1" key="1" className={styles.tab}>
          <Mark URL={this.state.URL1} tab={"1"} url={this.state.url} resultsURL={this.state.resultsURL}/>
        </TabPane>
        <TabPane tab="Image2" key="2" className={styles.tab}>
          <Mark URL={this.state.URL2} tab={"2"} url={this.state.url} resultsURL={this.state.resultsURL}/>
        </TabPane>
        <TabPane tab="Image3" key="3" className={styles.tab}>
          <Mark URL={this.state.URL3} tab={"3"} url={this.state.url} resultsURL={this.state.resultsURL}/>
        </TabPane>
      </Tabs>
    );
  }
}

var Mark = React.createClass({
  getInitialState: function(){
    return {
      mouseLS: [100,100],
      mouseRS: [400,100],
      point:"",
      loading: false
    };
  },
  componentWillMount() {
    this.src = this.props.URL+'?t='+new Date().getTime();

  },
  componentDidMount() {
    this.elmOffset = ReactDOM.findDOMNode(this).getBoundingClientRect();
    // this.setState({
    //   mouseXLS: this.elmOffset.left,
    //   mouseYLS: this.elmOffset.top,
    //   mouseXLS: this.elmOffset.left,
    //   mouseYLS: this.elmOffset.top,
    // });
  },
  mouseDown: function(event, point){
    event.preventDefault();
    this.point = point;
    this.setMousePosition(event);
    document.addEventListener('mousemove',this.mouseMove);
    document.addEventListener('mouseup',this.mouseUp);
  },
  mouseUp: function(event){
    document.removeEventListener('mousemove',this.mouseMove);
    document.removeEventListener('mouseup',this.mouseUp);
  },
  mouseMove: function(event){
    event.preventDefault();
    this.setMousePosition(event);
  },
  setMousePosition: function(event, point){
    // event.preventDefault();
    //console.log(event.pageX, event.pageY);
    //var bounds = this.getCurrentBounds(event.pageX,event.pageY);
    if(event.pageX < this.elmOffset.left) {
      event.pageX = this.elmOffset.left;
    }
    if(event.pageY < this.elmOffset.top) {
      event.pageY = this.elmOffset.top;
    }
    if(event.pageX > this.elmOffset.left + width) {
      event.pageX= this.elmOffset.left + width;
    }
    if(event.pageY > this.elmOffset.top + height) {
      event.pageY = this.elmOffset.top + height;
    }
    // console.log(event.pageX - this.elmOffset.left, event.pageY - this.elmOffset.top);
    // this.setState({mouseLS: [event.pageX - this.elmOffset.left,event.pageY - this.elmOffset.top]});
    // console.log(point);
    switch(this.point) {
      case "LS": this.setState({mouseLS: [event.pageX - this.elmOffset.left,event.pageY - this.elmOffset.top]});
        break;
      case "RS": this.setState({mouseRS: [event.pageX - this.elmOffset.left,event.pageY - this.elmOffset.top]});
        break;
    }

    // switch(this.state.point) {
    //   case "LS": this.setState({mouseLS: [event.pageX,event.pageY]});
    //     break;
    //   case "RS": this.setState({mouseRS: [event.pageX,event.pageY]});
    //     break;
    // }
  },
  // getCurrentBounds: function(pageX,pageY){
  //   var x = pageX;// - this.elmOffset.left;
  //   var y = pageY;// - this.elmOffset.top;
  //   return {
  //     mouseX: x,
  //     mouseY: y
  //   }
  // },
  setPoint(point) {
    this.setState({point: point});
  },

  setData() {
  switch(this.props.tab) {
    case "1":
      return {
        "LS1": [this.state.mouseLS[0], this.state.mouseLS[1]],
        "RS1": [this.state.mouseRS[0], this.state.mouseRS[1]]
      };
    case "2":
      return {
        "LS2": [this.state.mouseLS[0], this.state.mouseLS[1]],
        "RS2": [this.state.mouseRS[0], this.state.mouseRS[1]]
      };
    case "3":
      return {
        "LS3": [this.state.mouseLS[0], this.state.mouseLS[1]],
        "RS3": [this.state.mouseRS[0], this.state.mouseRS[1]]
      }
  }
    // switch(this.props.tab) {
    //   case "1":
    //     return {
    //       "LS1":[this.state.mouseLS[0] - this.elmOffset.left, this.state.mouseLS[1] - this.elmOffset.top],
    //       "RS1":[this.state.mouseRS[0] - this.elmOffset.left, this.state.mouseRS[1] - this.elmOffset.top]
    //     };
    //   case "2":
    //     return {
    //       "LS2":[this.state.mouseLS[0] - this.elmOffset.left, this.state.mouseLS[1] - this.elmOffset.top],
    //       "RS2":[this.state.mouseRS[0] - this.elmOffset.left, this.state.mouseRS[1] - this.elmOffset.top]
    //     };
    //   case "3":
    //     return {
    //       "LS3":[this.state.mouseLS[0] - this.elmOffset.left, this.state.mouseLS[1] - this.elmOffset.top],
    //       "RS3":[this.state.mouseRS[0] - this.elmOffset.left, this.state.mouseRS[1] - this.elmOffset.top]
    //     }
    // }
  },
  push() {
    switch(this.props.tab) {
      case "1":
        break;
      case "2":
        break;
      case "3":
        browserHistory.push('/results');
        break;
    }
  },
  confirm() {
    this.enterLoading();

    if(this.state.mouseLS[0] < 0 || this.state.mouseLS[1] < 0
      || this.state.mouseRS[0] < 0 || this.state.mouseRS[1] <0) {
      message.warning("Please finish the marking!");
      this.setState({ loading: false });
      return;
    }
    var data = this.setData();
    request
      .put(this.props.url)
      //.withCredentials()
      .send(data)
      .end((err, res) => {
        if (err) {
          console.log("Error!!!");
        } else {
          console.log(res);
        }
        request
          .get(this.props.resultsURL)
          //.withCredentials()
          .end((err, res) => {
            if (err) {
              console.log("Error!!!");
            } else {
              console.log(res);
              this.push();
            }
          });
      });

    this.setState({ loading: false });
  },
  enterLoading() {
    this.setState({ loading: true });
  },
  render: function(){
    var pointStyleLS = {
      top: this.state.mouseLS[1],
      left: this.state.mouseLS[0]
    };
    var pointStyleRS = {
      top: this.state.mouseRS[1],
      left: this.state.mouseRS[0]
    };
    return (
      <div className={styles.container}>
        <div>
          <img className={styles.radial} src={this.src} />
          <div className={styles.point} style={pointStyleLS} onMouseDown={(e) => this.mouseDown(e,"LS")}>LS</div>
          <div className={styles.point} style={pointStyleRS} onMouseDown={(e) => this.mouseDown(e,"RS")}>RS</div>
        </div>
        <div className={styles.container2}>
          Press the buttons and mark the points on your photo
          <br />
          <br />
          <Button type="ghost" onClick={ () => this.setPoint("LS") }>
            Left Shoulder
          </Button>
          <br />
          <Button type="ghost" onClick={ () => this.setPoint("RS") }>
            Right Shoulder
          </Button>
          <br />
          <Button type="primary" loading={this.state.loading} onClick={ () => this.confirm() }>
            Confirm
          </Button>
        </div>
      </div>
    );
  }
});

export default MarkPage;

/*
 <div className={styles.radial} onMouseDown={this.mouseDown}>
 <div className={styles.point} style={pointStyle}></div>
 </div>
*/
