import * as React from 'react';
import "./App.scss";
import gsap from "gsap";
import { Switch, Route, Link, BrowserRouter } from "react-router-dom";
import router from './router/routes';

class App extends React.Component {
  componentDidMount() {
    gsap.from("nav ul li", {
      x: 100,
      opacity: 0,
      stagger: 0.2,
      duration: 1,
    });
    gsap.from(".header-brand", {
      x: -100,
      opacity: 0,
      duration: 1.5,
    });
  }

  render() {
    return (
      <BrowserRouter>
        <header id="golbal-header">
          <div className="container">
            <section className="useflex">
              <div className="header-brand">
                <h1>Lixuanc</h1>
              </div>
              <nav>
                <ul>
                  <li>
                    <Link to="/">Home</Link>
                  </li>
                  <li>
                    <Link to="/Blog">Blog</Link>
                  </li>
                  <li>
                    <Link to="/article">Picture</Link>
                  </li>
                </ul>
              </nav>
            </section>
          </div>
        </header>
        <section id="cy-background">
        </section>
        <ul className="transition">
          <li id="1"></li>
          <li id="2"></li>
          <li id="3"></li>
          <li id="4"></li>
          <li id="5"></li>
        </ul>
        <Switch>
          {
            router.map((v, i) => {
              if (!v.exact) {
                return <Route key={i} path={v.path} component={v.component}></Route>
              } else {
                return <Route key={i} exact path={v.path} component={v.component}></Route>
              }
            })
          }
        </Switch>
      </BrowserRouter>
    );
  }
}

export default App;
