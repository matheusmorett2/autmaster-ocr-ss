/**
 * Created by matheusmorett on 11/06/18.
 */
import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import 'moment/locale/pt-br';
import Dashboard from 'containers/Home';
import Template from 'containers/Template';
import TemplateCreate from 'containers/Template/TemplateCreate';
import Spreadsheet from 'containers/Spreadsheet';

class Router extends Component {
  render() {
    return (
      <Switch>
        <Route exact path="/template" component={Template} />    
        <Route exact path="/template/create" component={TemplateCreate} />    
        <Route exact path="/spreadsheet" component={Spreadsheet} />
        <Route path="/" component={Dashboard} />            
      </Switch>
    );
  }
}

export default Router;