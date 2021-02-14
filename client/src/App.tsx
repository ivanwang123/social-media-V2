import React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import { Container } from "semantic-ui-react";
import MenuBar from "./components/MenuBar";
import { AuthProvider } from "./context/authContext";
import Login from "./pages/Login";
import Register from "./pages/Register";
import PrivateRoute from "./hoc/PrivateRoute";
import UnPrivateRoute from "./hoc/UnPrivateRoute";
import Profile from "./pages/Profile";
import PostPage from "./pages/PostPage";
import Home from "./pages/Home";

function App() {
  return (
    <div className="App">
      <AuthProvider>
        <Router>
          <Container>
            <MenuBar />
            <Route exact path="/" component={Home} />
            <UnPrivateRoute exact path="/login" component={Login} />
            <UnPrivateRoute exact path="/register" component={Register} />
            <Route exact path="/profile/:handle" component={Profile} />
            <Route exact path="/post/:id" component={PostPage} />
          </Container>
        </Router>
      </AuthProvider>
    </div>
  );
}

export default App;
