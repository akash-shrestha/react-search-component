import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import _ from "lodash";

interface Item {
  id: string | number;
  name: string;
}

interface ButtonProps {
  showSelectedOnly: boolean;
}

const Container = styled.div`
  width: 90%;
  max-width: 600px;
  min-width: auto;
  margin: 0 auto;
  padding: 20px;
  font-family: "Arial", sans-serif;
  background-color: ${({ theme }) => theme.componentBackground};
  transition: background-color 0.5s ease, color 0.5s ease;
  color: ${({ theme }) => theme.text};
  display: flex;
  flex-direction: column;
  border-radius: 5px;

  ul {
    padding: 0;
  }

  @media (max-width: 600px) {
    padding: 10px;
  }
`;

const SearchInput = styled.input`
  padding: 10px;
  width: calc(100% - 20px);
  background-color: ${({ theme }) => theme.inputBackground};
  border-radius: 5px;
  border: 1px solid ${({ theme }) => theme.inputBorder};
  margin-bottom: 10px;
  transition: all 0.3s ease;

  &:focus {
    border-color: #8888;
    background-color: #ffff;
  }
`;

const ClearButton = styled.button`
  padding: 10px;
  background-color: ${({ theme }) => theme.buttonBackground};
  color: ${({ theme }) => theme.buttonText};
  border-radius: 5px;
  border: none;
  cursor: pointer;
  margin: 16px auto;
  width: 90%;

  &:hover {
    background-color: red;
  }
`;

const ShowSelectedButton = styled.button<ButtonProps>`
  padding: 10px;
  color: ${({ theme }) => theme.buttonText};
  background-color: ${({ theme, showSelectedOnly }) =>
    showSelectedOnly ? "darkgreen" : "grey"};
  border-radius: 5px;
  border: none;
  cursor: pointer;
  margin: 0 0 16px auto;
  width: 20%;

  &:hover {
    background-color: green;
  }

  @media (hover: none) {
    &:hover {
      background-color: ${({ theme, showSelectedOnly }) =>
        showSelectedOnly ? "darkgreen" : "grey"};
    }
  }
`;

const ListItem = styled.li`
  padding: 15px;
  border-bottom: 1px solid ${({ theme }) => theme.listItemBorder};
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;

  @media (max-width: 600px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

const ListItemText = styled.span`
  font-size: 16px;

  @media (max-width: 600px) {
    font-size: 14px;
  }
`;

const SelectedText = styled.span`
  color: ${({ theme }) => theme.selectedText};
  font-weight: bold;
`;

const NotSelectedText = styled.span`
  color: ${({ theme }) => theme.listItemText};
  font-size: 14px;
`;

const Search: React.FC<{ data: Item[] }> = ({ data }) => {
  const [selectedItems, setSelectedItems] = useState<Item[]>([]);
  const [dataSource, setDataSource] = useState<Item[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showSelectedOnly, setShowSelectedOnly] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setDataSource(data);
  }, [data]);

  useEffect(() => {
    handleSearch(searchTerm);
  }, [searchTerm]);

  const handleSearch = _.debounce((term: string) => {
    if (term.length > 0) {
      setDataSource(getSearchResult(term, data));
    } else {
      setDataSource(data);
    }
  }, 500);

  const getSearchResult = (searchTerm: string, items: Item[]): Item[] => {
    const terms = searchTerm
      .toLowerCase()
      .split(" ")
      .filter((term) => term.length > 0);

    return items.filter((item) =>
      terms.some((term) => item.name.toLowerCase().includes(term))
    );
  };

  const toggleShowSelected = () => {
    setShowSelectedOnly(!showSelectedOnly);
  };

  const handleSelect = (item: Item) => {
    selectedItems.includes(item)
      ? setSelectedItems(selectedItems.filter((i) => i !== item))
      : setSelectedItems((currentSelectedItems) => [
          ...currentSelectedItems,
          item,
        ]);
  };

  const handleClear = () => {
    setSearchTerm("");
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  const filteredDataSource = showSelectedOnly
    ? dataSource.filter((item) => selectedItems.includes(item))
    : dataSource;

  return (
    <Container>
      <SearchInput
        ref={inputRef}
        onChange={(e) => setSearchTerm(e.target.value)}
        value={searchTerm}
        placeholder="Search..."
      />
      <ClearButton onClick={handleClear}>Clear</ClearButton>
      <ShowSelectedButton
        onClick={toggleShowSelected}
        showSelectedOnly={showSelectedOnly} /* for styling */
      >
        {showSelectedOnly ? "Show all" : "Show selected"}
      </ShowSelectedButton>
      <ul>
        {filteredDataSource.map((item) => (
          <ListItem key={item.id} onClick={() => handleSelect(item)}>
            <ListItemText>{item.name}</ListItemText>
            {selectedItems.includes(item) ? (
              <SelectedText>Selected</SelectedText>
            ) : (
              <NotSelectedText>Not selected</NotSelectedText>
            )}
          </ListItem>
        ))}
      </ul>
    </Container>
  );
};

export default Search;
