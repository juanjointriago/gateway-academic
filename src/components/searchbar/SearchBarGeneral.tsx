import { FC, useRef, useState } from 'react'
import { Searchbar } from 'react-native-paper';

interface Props {
    value: string;
    onChange: (value: string) => void;
    debounceTime?: number;
    placeholder?: string;
}

export const SearchBarGeneral: FC<Props> = ({ onChange, value, debounceTime, placeholder }) => {

    const [internalValue, setInternalValue] = useState(value);
    const debounceRef = useRef<NodeJS.Timeout | null>(null);

    // Manejar el cambio de texto con debounce
    const handleChangeText = (text: string) => {
        setInternalValue(text);

        if (debounceRef.current) clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(() => {
            onChange(text); // Llamamos al callback después del debounce
        }, debounceTime);
    };

    return (
        <Searchbar
            placeholder={placeholder}
            value={internalValue}
            onChangeText={handleChangeText}
            inputStyle={{ fontSize: 14 }}
            style={{ marginBottom: 30 }}
        />
    )
}
