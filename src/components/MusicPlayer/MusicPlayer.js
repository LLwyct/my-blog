import React from "react";
import { Button, Slider, Container, Grid } from "@material-ui/core";
import "./musicplayer.scss";

class MusicPlayer extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      play: false,
      currentTime: 0,
      fileList: [],
      files: [],
      currentIndex: 0,
    };
    this.requestAnimationFrame =
      window.requestAnimationFrame ||
      window.mozRequestAnimationFrame ||
      window.webkitRequestAnimationFrame ||
      window.msRequestAnimationFrame;
    // let cancelAnimationFrame = window.cancelAnimationFrame || window.webkitCancelAnimationFrame || window.mozCancelAnimationFrame;

    // 初始化canvas相关
    this.WIDTH = window.innerWidth;
    this.HEIGHT = window.innerHeight;
    this.canvas = null;
    this.ctx = null;

    this.input = document.createElement("input");
    this.input.setAttribute("type", "file");
    this.input.multiple = true;
    this.audio = new Audio();
    this.audio.addEventListener(
      "ended",
      this.onCurrentAudioEnded.bind(this),
      false
    );
    // 初始化Audio Context相关
    this.audioContext = new AudioContext();
    this.analyser = this.audioContext.createAnalyser();
    this.analyser.fftSize = 256;
    this.analyser.smoothingTimeConstant = 0.75;
    this.analyser.minDecibels = -90;
    this.analyser.maxDecibels = -10;

    this.bufferLength = this.analyser.fftSize / 2;
    this.dataArray_uint8 = new Uint8Array(this.bufferLength);
    this.isAudioInit = false;

    this.lastCallback = null;
    this.startXPos = 0;
    this.barHeight = 0;
    this.barWidth = Math.round((this.WIDTH * 0.5) / 128);
    this.gapWidth = 1;
    this.input.onchange = () => {
      if (this.checkAudioState() === 2) {
        this.audioPauseHandler();
      }
      if (this.input.files.length !== 0) {
        let newFileList = [];
        Array.from(this.input.files).forEach((cv) => {
          newFileList.push(cv.name);
        });
        this.setState({
          fileList: newFileList,
          files: this.input.files,
        });
        let file = this.state.files[this.state.currentIndex];
        let url = URL.createObjectURL(file);
        this.audio.src = url;
        this.setState({
          currentTime: this.audio.currentTime,
        });
        if (this.isAudioInit) {
          // cancelAnimationFrame(lastCallback);
          return;
        }
        this.audioSourceNode = this.audioContext.createMediaElementSource(
          this.audio
        );
        this.audioSourceNode.connect(this.analyser);
        this.analyser.connect(this.audioContext.destination);
        this.isAudioInit = true;
      }
    };

    this.draw = this.draw.bind(this);
    this.Upload = this.Upload.bind(this);
    this.audioPlayHandler = this.audioPlayHandler.bind(this);
    this.audioPauseHandler = this.audioPauseHandler.bind(this);
    this.changeCurrentTime = this.changeCurrentTime.bind(this);
    this.checkAudioState = this.checkAudioState.bind(this);
    this.onCurrentAudioEnded = this.onCurrentAudioEnded.bind(this);
    this.nextMusic = this.nextMusic.bind(this);
    this.preMusic = this.preMusic.bind(this);
  }

  componentDidMount() {
    this.canvas = document.querySelector("#canvas");
    this.ctx = this.canvas.getContext("2d");
    this.canvas.height = this.HEIGHT;
    this.canvas.width = this.WIDTH;
    requestAnimationFrame(this.draw);
  }

  preMusic() {
    if (this.checkAudioState() !== 0) {
      let flag = false;
      if (this.checkAudioState() === 2) {
        this.audioPauseHandler();
        flag = true;
      }
      const nextIndex =
        (this.state.currentIndex - 1 + this.state.fileList.length) %
        this.state.fileList.length;

      let file = this.state.files[nextIndex];
      try {
        let url = window.URL.createObjectURL(file);
        this.audio.src = url;
      } catch (error) {
        let url = window.URL.createObjectURL(file);
        this.audio.srcObject = url;
      }
      if (flag) {
        this.audioPlayHandler();
      }
      this.setState({
        currentIndex: nextIndex,
      });
    }
  }

  nextMusic(autoplay = false) {
    if (this.checkAudioState() !== 0) {
      let flag = false;
      if (this.checkAudioState() === 2) {
        this.audioPauseHandler();
        flag = true;
      }
      const nextIndex =
        (this.state.currentIndex + 1) % this.state.fileList.length;
      let file = this.state.files[nextIndex];
      try {
        let url = window.URL.createObjectURL(file);
        this.audio.src = url;
      } catch (error) {
        let url = window.URL.createObjectURL(file);
        this.audio.srcObject = url;
      }
      if (flag || autoplay) {
        this.audioPlayHandler();
      }
      this.setState({
        currentIndex: nextIndex,
      });
    }
  }

  onCurrentAudioEnded() {
    this.setState({
      play: false,
    });
    setTimeout(() => {
      this.nextMusic(true);
    }, 500);
  }

  checkAudioState() {
    if (this.audio === null) return -1;
    else if (this.audio.currentSrc === "") return 0;
    else if (this.audio.paused === true) return 1;
    else if (this.audio.paused === false) return 2;
    else return -1;
  }

  draw() {
    if (this.checkAudioState() === 2) {
      this.setState({
        currentTime: Math.round(
          (this.audio.currentTime / this.audio.duration) * 100
        ),
      });
    }
    this.ctx.fillStyle = "rgba(240,240,240,0.6)";
    this.analyser.getByteFrequencyData(this.dataArray_uint8);
    this.ctx.fillRect(0, 0, this.WIDTH, this.HEIGHT);
    this.startXPos = window.innerWidth * 0.2;
    let color = 0;
    for (let i = 0; i < this.bufferLength; ++i) {
      this.barHeight = this.dataArray_uint8[i];
      color = Math.round((this.barHeight / 256) * 128 + 64);
      this.ctx.fillStyle = `rgb(${color},${color},${color})`;
      this.ctx.fillRect(this.startXPos, 0, this.barWidth, this.barHeight || 1);
      this.startXPos += this.barWidth + this.gapWidth;
    }
    this.lastCallback = requestAnimationFrame(this.draw);
  }

  Upload() {
    this.input.click();
  }

  audioPlayHandler() {
    const currentAudioState = this.checkAudioState();
    if (currentAudioState === 0 || currentAudioState === -1) return;
    if (currentAudioState === 1) {
      this.audioContext.resume();
      this.audio.play();
    }
    this.setState({ play: true });
  }

  audioPauseHandler() {
    const currentAudioState = this.checkAudioState();
    if (currentAudioState === 0 || currentAudioState === -1) return;
    if (currentAudioState === 2) {
      this.audio.pause();
    }
    this.setState({ play: false });
  }

  changeCurrentTime(e, value) {
    if (this.checkAudioState() !== 0) {
      console.log(value);
      this.audio.currentTime = (value / 100) * this.audio.duration;
      this.setState({
        currentTime: Math.round(
          (this.audio.currentTime / this.audio.duration) * 100
        ),
      });
    }
  }

  componentWillUnmount () {
    this.audio.src = "";
    this.audio = null;
  }

  render() {
    return (
      <>
        <canvas
          id="canvas"
          style={{
            transform: "rotateX(180deg)",
            position: "fixed",
            bottom: "0",
            left: "0",
            height: "92vh",
            width: "100vw",
            zIndex: "-1",
            opacity: 0.75,
          }}
        >
        </canvas>
        <main id="player" style={{ width: "100%", position: "absolute", top: "30%"}}>
          <Container>
            <Grid justify="center" container>
              <Grid md={6} xs={12} item>
                <Button
                  onClick={this.Upload}
                  variant="contained"
                  fullWidth
                  disableElevation
                  style={{ background: "#ff4e5c", color: 'white' }}
                >
                  open
                </Button>
              </Grid>
              <section style={{ width: "100%"}}>
                <div id="player" style={{ padding: "10px 20px 10px 20px" }}>
                  <div style={{ marginTop: "50px" }}>
                    <Slider
                      value={this.state.currentTime}
                      onChange={this.changeCurrentTime}
                    />
                  </div>
                  <div
                    className="control-btn-group"
                    style={{ marginTop: "50px" }}
                  >
                    <div>
                      <Button onClick={this.preMusic}>left</Button>
                    </div>
                    <div
                      className="btn-border-circle"
                      style={{ margin: "0 30px" }}
                    >
                      {!this.state.play ? (
                        <div
                          className="playslash"
                          onClick={this.audioPlayHandler}
                        ></div>
                      ) : (
                        <div
                          className="pauseslash"
                          onClick={this.audioPauseHandler}
                        ></div>
                      )}
                    </div>
                    <div>
                      <Button onClick={this.nextMusic}>right</Button>
                    </div>
                  </div>
                </div>
              </section>
              <section style={{ width: "50%", margin: "0 auto" }}>
                <h3>
                  正在播放的是：
                  {this.state.fileList[this.state.currentIndex]}
                </h3>
                <ul>
                  {this.state.fileList.map((ele) => {
                    return <li key={ele}>{ele}</li>;
                  })}
                </ul>
              </section>
            </Grid>
          </Container>
        </main>
        
      </>
    );
  }
}

export default MusicPlayer;
