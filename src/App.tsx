import React, { useState } from "react";
import styled, { ThemeProvider } from "styled-components";

import sun from "./assets/sun.svg";
import moon from "./assets/moon.svg";
import { lightTheme, darkTheme } from "./styles/themes";
import Search from "./Components/Search";

interface Item {
  id: number;
  name: string;
}

const StyledApp = styled.div`
  background-color: ${({ theme }) => theme.background};
  color: ${({ theme }) => theme.text};
  min-height: 100vh;
  font-family: Arial, sans-serif;
  transition: background-color 0.5s ease, color 0.5s ease;
  display: flex;
  flex-direction: column;
`;

const Switch = styled.label`
  position: relative;
  display: inline-block;
  width: 60px;
  height: 34px;
  margin: 16px 24px 16px auto;
`;

const Slider = styled.span`
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #e8e8e8;
  transition: 0.5s;
  border-radius: 34px;

  &:before {
    position: absolute;
    content: "";
    height: 26px;
    width: 26px;
    left: 4px;
    bottom: 4px;
    background-color: white;
    transition: 0.5s;
    border-radius: 50%;
  }
`;

const SunIcon = styled.img`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 20px;
  height: 20px;
`;

const MoonIcon = styled.img`
  position: absolute;
  right: 5px;
  top: 50%;
  transform: translateY(-50%);
  width: 20px;
  height: 20px;
`;

const Checkbox = styled.input`
  opacity: 0;
  width: 0px;
  height: 0;

  &:checked + ${Slider} {
    background-color: #8c8c8c;
  }

  &:checked + ${Slider}:before {
    transform: translateX(26px);
    background-color: #bcbcbc;
  }
`;

const App: React.FC = () => {
  const [theme, setTheme] = useState(lightTheme);

  const toggleTheme = () => {
    setTheme(theme === lightTheme ? darkTheme : lightTheme);
  };

  const data: Item[] = [
    { id: 1, name: "Apple" },
    { id: 2, name: "Orange" },
    { id: 3, name: "Banana" },
    { id: 4, name: "Peach" },
    { id: 5, name: "Mango" },
    { id: 6, name: "Apple" },
    { id: 7, name: "Orange" },
    { id: 8, name: "Banana" },
    { id: 9, name: "Peach" },
    { id: 10, name: "Mango" },
  ];

  return (
    <ThemeProvider theme={theme}>
      <StyledApp>
        <Switch>
          <Checkbox type="checkbox" onChange={toggleTheme} />
          <Slider />
          <SunIcon src={sun} alt="Sun Icon" />
          <MoonIcon src={moon} alt="Moon Icon" />
        </Switch>
        <Search data={data} />
      </StyledApp>
    </ThemeProvider>
  );
};

export default App;
