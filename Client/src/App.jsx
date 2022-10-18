import themes from './styles/themes'
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Home from './pages/Home/Home';
import SignUp from './pages/SignUp/SignUp';

function App() {
  const theme = createTheme(themes);
  return (
    <ThemeProvider theme={theme}>
      <BrowserRouter>
        <Routes>
          <Route path="/" exact element={<SignUp />}/>
          <Route path="/Home" exact element={<Home />}/>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
