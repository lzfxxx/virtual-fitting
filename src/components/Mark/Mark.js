import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, IndexRoute, Link, browserHistory } from 'react-router';
import styles from './Mark.less';
import { Icon, Modal, Button, Tabs,message, Input, Popover } from 'antd';
import request from 'superagent';
import cookie from 'react-cookie';
import Vedio from '../Vedio/Vedio';
import Global from '../../services/Global';


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
function getUsername() {
  if(window.u) {
    return window.u;
  }
  if(cookie.load('username')) {
    return cookie.load('username');
  }
}

// const username = getUsername();

const height = 500;
const width = 500;
const zoom = 3;
const zoomHeight = 300;
const zoomWidth = 300;

class MarkPage extends Component {
  constructor(props) {
    super(props);
    this.username = getUsername();
    this.state = {
      URL1: Global.url + this.username + '/img1.jpg',
      URL2: Global.url + this.username + '/img2.jpg',
      // URL3: 'http://0.0.0.0:5000/' + 'user1' + '/img3.jpg',
      url: Global.url + this.username + '/*',
      computeURL: Global.url + 'compute/' + this.username,
      visible: false,
      key: "1",
      // URL1: 'http://0.0.0.0:5000/' + this.props.params.username + '/img1.jpg',
      // URL2: 'http://0.0.0.0:5000/' + this.props.params.username + '/img2.jpg',
      // URL3: 'http://0.0.0.0:5000/' + this.props.params.username + '/img3.jpg',
      // url: 'http://0.0.0.0:5000/' + this.props.params.username +'/*',
      // resultsURL: 'http://0.0.0.0:5000/results/' + this.props.params.username,
    };
  }

  handleCancel() {
    this.setState({
      visible: false,
    });
  }
  showModal() {
    this.setState({
      visible: true,
    });
  }
  changeKey(key) {
    this.setState({key: key});
  }

  onTabClick(activeKey) {
    this.setState({ key: activeKey });
  }
  render() {
    function callback(key) {
      console.log(key);
    }

    return (
      <div>
        <div style={{top: 100, right: 50, position: 'absolute'}}>
          Please mark your front and side photos, for guide press the question button&nbsp;&nbsp;&nbsp;
          <Button type="ghost"  shape="circle-outline" icon="question-circle-o"  onClick={() => this.showModal()}>
          </Button>
          <Modal ref="modal"
                 visible={this.state.visible}
                 title="Demo" onCancel={() => this.handleCancel()}
                 footer={[]}
          >
            <Vedio height={"300px"}/>
          </Modal>
        </div>
        <Tabs activeKey={this.state.key} onChange={callback} onTabClick={(activeKey) => this.onTabClick(activeKey)}>
          <TabPane tab="Front Photo" key="1" className={styles.tab}>
            <Mark URL={this.state.URL1} tab={"1"} url={this.state.url} resultsURL={this.state.computeURL} func={() => this.changeKey("2")}/>
          </TabPane>
          <TabPane tab="Side Photo" key="2" className={styles.tab}>
            <Mark2 URL={this.state.URL2} tab={"2"} url={this.state.url} resultsURL={this.state.computeURL} func={() => this.changeKey("2")}/>
          </TabPane>
        </Tabs>
      </div>
    );
  }
}

var Mark = React.createClass({
  getInitialState: function(){
    return {
      mouseFT: [250,100],
      mouseFB: [250,400],
      loading: false,
      // info: "Drag any point",
      // pointsVisibility: {
      //   "FT": false,
      //   "FB": false,
      // },
      info: "Choose one point to drag"
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
    // console.log(event.pageX ,this.elmOffset.left, event.pageY ,this.elmOffset.top);
    // this.setState({mouseLS: [event.pageX - this.elmOffset.left,event.pageY - this.elmOffset.top]});
    // console.log(point);
    switch(this.point) {
      case "FT": this.setState({mouseFT: [event.pageX - this.elmOffset.left,event.pageY - this.elmOffset.top]});
        break;
      case "FB": this.setState({mouseFB: [event.pageX - this.elmOffset.left,event.pageY - this.elmOffset.top]});
        break;
    }
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
    return {
      "FT": [this.state.mouseFT[0], this.state.mouseFT[1]],
      "FB": [this.state.mouseFB[0], this.state.mouseFB[1]]
    };
  },
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
  // },
  push() {
    switch(this.props.tab) {
      case "1":
        this.props.func();
        break;
      case "2":
        browserHistory.push('/results_'+getUsername());
        break;
    }
  },
  confirm() {
    this.enterLoading();


    if(this.state.mouseFT[0] == 250 && this.state.mouseFT[1] == 100
      && this.state.mouseFB[0] == 250 && this.state.mouseFB[1] == 400) {
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
          this.push();
        }
        this.setState({ loading: false });
      });

  },
  enterLoading() {
    this.setState({ loading: true });
  },
  getPosition() {
    switch(this.point) {
      case "FT":
        return (-this.state.mouseFT[0]*zoom+zoomWidth/2) + 'px ' + (-this.state.mouseFT[1]*zoom+zoomHeight/2) + 'px';
        break;
      case "FB":
        return (-this.state.mouseFB[0]*zoom+zoomWidth/2) + 'px ' + (-this.state.mouseFB[1]*zoom+zoomHeight/2) + 'px';
        break;
    }
  },
  mouseOver(point) {
    this.point = point;
    // var pointsVisibility ={
    //   "FT": false,
    //   "FB": false
    // };
    // pointsVisibility[point] = true;
    switch(point) {
      case "FT":
        this.setState({
          info: "Drag this point to the top of your body",
          // pointsVisibility: pointsVisibility
        });
        break;
      case "FB":
        this.setState({
          info: "Drag this point to the bottom of your body",
          // pointsVisibility: pointsVisibility
        });
        break;
    }
  },
  textPos(pointStyleFT, pointStyleFB) {
    switch(this.point) {
      case "FT":
        return {
          top: pointStyleFT.top+15,
          left: pointStyleFT.left-100,
          position: "absolute"
        };
      case "FB":
        return {
          top: pointStyleFB.top-30,
          left: pointStyleFB.left-100,
          position: "absolute"
        };
    }
    return {
      top: -1000,
      left: -1000,
      position: "absolute"
    };
  },
  render: function(){
    var pointStyleFT = {
      top: this.state.mouseFT[1],
      left: this.state.mouseFT[0]
    };
    var pointStyleFB = {
      top: this.state.mouseFB[1],
      left: this.state.mouseFB[0]
    };
    return (
      <div className={styles.container}>
        <div style={this.textPos(pointStyleFT, pointStyleFB)}><p style={{color: "white", fontWeight: 'bold'}}>{this.state.info}</p></div>
        <div>
          <img className={styles.radial} src={this.src} />
          <div className={styles.point} style={pointStyleFT} onMouseDown={(e) => this.mouseDown(e,"FT")} onMouseOver={() => this.mouseOver("FT")}>
            FT
          </div>
          <div className={styles.point} style={pointStyleFB} onMouseDown={(e) => this.mouseDown(e,"FB")} onMouseOver={() => this.mouseOver("FB")}>FB</div>
        </div>
        <div className={styles.container2}>
          <h2>{this.state.info}</h2>
          <br />
          <div
            style={{
              width: zoomWidth,
              height: zoomHeight,
              backgroundImage: 'url(' + this.src + ')',
              backgroundPosition: this.getPosition(),
              backgroundSize: width*zoom + 'px ' + height*zoom + 'px',
              backgroundRepeat: 'no-repeat'}}>
            <div className={styles.point} style={{marginTop: 150, marginLeft: 150}}></div>
          </div>
          <br />
          <br />
          <br />
          <Button type="primary" loading={this.state.loading} onClick={ () => this.confirm() }>
            Confirm
          </Button>
        </div>
      </div>
    );
  }
});

var Mark2 = React.createClass({
  getInitialState: function(){
    return {
      mouseST: [250,100],
      mouseSB: [250,400],
      mouseTC: [220,400],
      mouseCC: [250,250],
      height: '',
      loading: false,
      info: "Choose one point to drag"

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
    if(event.pageY < this.elmOffset.top-505) {
      event.pageY = this.elmOffset.top-505;
    }
    if(event.pageX > this.elmOffset.left + width) {
      event.pageX= this.elmOffset.left + width;
    }
    if(event.pageY > this.elmOffset.top-505 + height) {
      event.pageY = this.elmOffset.top-505 + height;
    }
    // console.log(event.pageX, this.elmOffset.left, event.pageY, this.elmOffset.top-505);

    // this.setState({mouseLS: [event.pageX - this.elmOffset.left,event.pageY - this.elmOffset.top]});
    // console.log(point);
    switch(this.point) {
      case "ST": this.setState({mouseST: [event.pageX - this.elmOffset.left,event.pageY - this.elmOffset.top+505]});
        break;
      case "SB": this.setState({mouseSB: [event.pageX - this.elmOffset.left,event.pageY - this.elmOffset.top+505]});
        break;
      case "TC": this.setState({mouseTC: [event.pageX - this.elmOffset.left,event.pageY - this.elmOffset.top+505]});
        break;
      case "CC": this.setState({mouseCC: [event.pageX - this.elmOffset.left,event.pageY - this.elmOffset.top+505]});
        break;
    }
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
    return {
      "ST": [this.state.mouseST[0], this.state.mouseST[1]],
      "SB": [this.state.mouseSB[0], this.state.mouseSB[1]],
      "TC": [this.state.mouseTC[0], this.state.mouseTC[1]],
      "CC": [this.state.mouseCC[0], this.state.mouseCC[1]],
      "H": this.state.height
    };
  },
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
  // },
  push() {
    switch(this.props.tab) {
      case "1":
        break;
      case "2":
        window.key = '5';
        browserHistory.push('/results_'+getUsername());
        break;
    }
  },
  handleInputChange(e) {
    console.log(e.target.value);
    this.setState({
      height: e.target.value,
    });
  },
  confirm() {


    if(this.state.mouseST[0] == 250 && this.state.mouseST[1] == 100
      && this.state.mouseSB[0] == 250 && this.state.mouseSB[1] == 400
      && this.state.mouseTC[0] == 220 && this.state.mouseTC[1] == 400
      && this.state.mouseCC[0] == 250 && this.state.mouseCC[1] == 250) {
      message.warning("Please finish the marking!");
      this.setState({ loading: false });
      return;
    }
    if(this.state.height == '') {
      message.warning("Please enter your height!");
      this.setState({ loading: false });
      return;
    }
    this.enterLoading();
    this.hide = message.loading('Computing your body size...', 0);
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
          request
            .get(this.props.resultsURL)
            //.withCredentials()
            .end((err, res) => {
              this.setState({ loading: false });
              setTimeout(this.hide, 0);
              if (err) {
                console.log("Error!!!");
              } else {
                console.log(res);
                this.push();
              }
            });
        }
      });
  },
  enterLoading() {
    this.setState({ loading: true });
  },
  getPosition() {
    switch(this.point) {
      case "ST":
        return (-this.state.mouseST[0]*zoom+zoomWidth/2) + 'px ' + (-this.state.mouseST[1]*zoom+zoomHeight/2) + 'px';
        break;
      case "SB":
        return (-this.state.mouseSB[0]*zoom+zoomWidth/2) + 'px ' + (-this.state.mouseSB[1]*zoom+zoomHeight/2) + 'px';
        break;
      case "TC":
        return (-this.state.mouseTC[0]*zoom+zoomWidth/2) + 'px ' + (-this.state.mouseTC[1]*zoom+zoomHeight/2) + 'px';
        break;
      case "CC":
        return (-this.state.mouseCC[0]*zoom+zoomWidth/2) + 'px ' + (-this.state.mouseCC[1]*zoom+zoomHeight/2) + 'px';
        break;
    }
  },
  mouseOver(point) {
    this.point = point;
    switch(point) {
      case "ST":
        this.setState({
          info: "Drag this point to the top of your body"
        });
        break;
      case "SB":
        this.setState({
          info: "Drag this point to the bottom of your body"
        });
        break;
      case "TC":
        this.setState({
          info: "Drag this point to the center of tiptoes"
        });
        break;
      case "CC":
        this.setState({
          info: "Drag this point to the center of your chest"
        });
        break;
    }
  },
  textPos(pointStyleST, pointStyleSB, pointStyleTC, pointStyleCC) {
    switch(this.point) {
      case "ST":
        return {
          top: pointStyleST.top+15,
          left: pointStyleST.left-100,
          position: "absolute"
        };
      case "SB":
        return {
          top: pointStyleSB.top-30,
          left: pointStyleSB.left-100,
          position: "absolute"
        };
      case "TC":
        return {
          top: pointStyleTC.top-30,
          left: pointStyleTC.left-100,
          position: "absolute"
        };
      case "CC":
        return {
          top: pointStyleCC.top+15,
          left: pointStyleCC.left-100,
          position: "absolute"
        };
    }
    return {
      top: -1000,
      left: -1000,
      position: "absolute"
    };
  },

  render: function(){
    var pointStyleST = {
      top: this.state.mouseST[1],
      left: this.state.mouseST[0]
    };
    var pointStyleSB = {
      top: this.state.mouseSB[1],
      left: this.state.mouseSB[0]
    };
    var pointStyleTC = {
      top: this.state.mouseTC[1],
      left: this.state.mouseTC[0]
    };
    var pointStyleCC = {
      top: this.state.mouseCC[1],
      left: this.state.mouseCC[0]
    };
    return (
      <div className={styles.container}>
        <div style={this.textPos(pointStyleST, pointStyleSB, pointStyleTC, pointStyleCC)}>
          <p style={{color: "white", fontWeight: 'bold'}}>{this.state.info}</p>
        </div>
        <div>
          <img className={styles.radial} src={this.src} />
          <div className={styles.point} style={pointStyleST} onMouseDown={(e) => this.mouseDown(e,"ST")} onMouseOver={() => this.mouseOver("ST")}>ST</div>
          <div className={styles.point} style={pointStyleSB} onMouseDown={(e) => this.mouseDown(e,"SB")} onMouseOver={() => this.mouseOver("SB")}>SB</div>
          <div className={styles.point} style={pointStyleTC} onMouseDown={(e) => this.mouseDown(e,"TC")} onMouseOver={() => this.mouseOver("TC")}>TC</div>
          <div className={styles.point} style={pointStyleCC} onMouseDown={(e) => this.mouseDown(e,"CC")} onMouseOver={() => this.mouseOver("CC")}>CC</div>
        </div>
        <div className={styles.container2}>
          <h2>{this.state.info}</h2>
          <br />
          <div
            style={{
              width: zoomWidth,
              height: zoomHeight,
              backgroundImage: 'url(' + this.src + ')',
              backgroundPosition: this.getPosition(),
              backgroundSize: width*zoom + 'px ' + height*zoom + 'px',
              backgroundRepeat: 'no-repeat'}}>
            <div className={styles.point} style={{marginTop: 150, marginLeft: 150}}></div>
          </div>
          <br />
          <Input placeholder="Please input your height" value={this.state.height} onChange={(e) => this.handleInputChange(e)}/>
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
