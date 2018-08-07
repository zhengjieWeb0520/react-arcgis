import React, { Component } from 'react'
import { Link } from 'react-router-dom'

export default class Header extends Component{
    render(){
        return(
            <header>
                <nav>
                    <ul>
                        <li><Link to="/">本地服务</Link></li>
                        <li><Link to="/GisAMap">高德地图</Link></li>
                        <li><Link to="/GisGoogleMap">谷歌地图</Link></li>
                        <li><Link to="/GisTdtMap">天地图</Link></li>
                    </ul>
                </nav>
            </header>
        )
    }
}