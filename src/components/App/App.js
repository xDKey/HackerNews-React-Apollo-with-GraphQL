import { Redirect, Route, Switch } from 'react-router';
import Header from '../Header/Header';
import LinkCreate from '../LinkCreate/LinkCreate';
import LinkList from '../LinkList/LinkList'
import Login from '../Login/Login';
import Search from '../Search/Search';

const  App = () => {
  return (
    <div className="App">
      <Header />
      <div>
        <Switch>
          <Route exact path='/' render={() => <Redirect to='/new/1' />} />

          <Route exact path='/create'>
            <LinkCreate />
          </Route>

          <Route exact path='/login'>
            <Login />
          </Route>

          <Route exact path='/search' >
            <Search />
          </Route>

          <Route exact path='/top'>
            <LinkList />
          </Route>

          <Route exact path='/new/:page'>
            <LinkList />
          </Route>

        </Switch>
      </div>
    </div>
  );
}

export default App;
