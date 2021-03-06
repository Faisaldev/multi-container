import { BrowserRouter as Router, Link, Route } from 'react-router-dom';
import './App.css';
import Fib from './Fib';
import logo from './logo.svg';
import OtherPage from './OtherPage';

function App() {
  return (
    <Router>
      <div className='App'>
        <header className='App-header'>
          <img src={logo} className='App-logo' alt='logo' />
          <p>
            Edit <code>src/App.js</code> and save to reload.
          </p>

          <Link to='/'>Home</Link>
          <Link to='/otherpage'>Other Page</Link>
        </header>
        <div>
          <Route exact path='/' component={Fib} />
          <Route path='/otherpage' component={OtherPage} />
        </div>
      </div>
    </Router>
  );
}

export default App;
