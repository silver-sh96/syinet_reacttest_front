import { Redirect, Route, Switch } from 'react-router-dom';
import './App.css';
import AdminLayout from "layouts/Admin.js";

function App() {
  return (
    <Switch>
      <Route path="/admin" render={(props) => <AdminLayout {...props} />} />
      <Redirect from="/" to="/admin/userList" />
    </Switch>
  );
}

export default App;
