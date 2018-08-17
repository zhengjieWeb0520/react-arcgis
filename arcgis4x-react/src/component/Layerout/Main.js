import React, { Component } from "react";
import { Switch, Route } from "react-router-dom";
import GisServerMap from "./../map/GisServerMap";
import GisAMap from "./../map/GisAMap";
import GisGoogleMap from "./../map/GisGoogleMap";
import GisGoogle3DMap from "./../map/GisGooleMap3D";
import GisTdtMap from "./../map/GisTdtMap";
import GisTdtMap3D from "./../map/GisTdtMap3D";
export default class Main extends Component {
  render() {
    return (
      <main>
        <Switch>
          <Route exact path="/" component={GisServerMap} />
          <Route exact path="/GisAMap" component={GisAMap} />
          <Route exact path="/GisGoogleMap" component={GisGoogleMap} />
          <Route exact path="/GisGoogleMap3D" component={GisGoogle3DMap} />
          <Route exact path="/GisTdtMap" component={GisTdtMap} />
          <Route exact path="/GisTdtMap3D" component={GisTdtMap3D} />
        </Switch>
      </main>
    );
  }
}
