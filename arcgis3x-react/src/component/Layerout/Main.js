import React, { Component } from 'react'
import { Switch, Route } from 'react-router-dom'

import GisServerMap from './../map/GisServerMap'
import GisAMap from './../map/GisAMap'
import GisGoogleMap from './../map/GisGoogleMap'
import GisTdtMap from './../map/GisTdtMap'
export default class Main extends Component{
    render(){
        return(
            <main>
                <Switch>
                    <Route exact path="/" component={GisServerMap} />
                    <Route exact path="/GisAMap" component={GisAMap} />
                    <Route exact path="/GisGoogleMap" component={GisGoogleMap} />
                    <Route exact path="/GisTdtMap" component={GisTdtMap} />
                </Switch>
            </main>
        )
    }
}