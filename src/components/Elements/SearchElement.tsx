import { ChangeEvent, useState } from 'react';
import { Paper, InputBase, IconButton } from '@mui/material';
import { Search as SearchIcon, Close as CloseIcon } from '@mui/icons-material';

interface SearchElementProps {
  placeholder?: string;
  onSearch: (value: string) => void;
}

export const SearchElement = ({ placeholder = 'Search...', onSearch }: SearchElementProps) => {
  const [value, setValue] = useState('');

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value);
    onSearch(event.target.value);
  };

  const handleClear = () => {
    setValue('');
    onSearch('');
  };

  return (
    <Paper
      component="form"
      sx={{
        p: 2,
        display: 'flex',
        alignItems: 'center',
        width: "100%",
        height: "100%",
        borderRadius: 3,
      }}
    >
      {/* Search Icon */}
      <IconButton sx={{ p: '10px' }} disabled>
        <SearchIcon />
      </IconButton>

      {/* Input Field */}
      <InputBase
        sx={{ ml: 1, flex: 1 }}
        placeholder={placeholder}
        value={value}
        onChange={handleChange}
      />

      {/* Clear Icon */}
      {value && (
        <IconButton sx={{ p: '10px' }} onClick={handleClear}>
          <CloseIcon />
        </IconButton>
      )}
    </Paper>
  );
};
