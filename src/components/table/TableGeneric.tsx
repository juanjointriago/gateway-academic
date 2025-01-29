import { ScrollView, View } from "react-native";
import { DataTable, useTheme } from "react-native-paper";
import { LabelGeneral } from "../labels";
import { useState } from "react";

type Column<T> = {
    title: string;
    key: keyof T;
    render?: (value: any, row: T) => React.ReactNode;
};

type GenericTableProps<T> = {
    columns: Column<T>[];
    data: T[];
    keyExtractor?: (item: T, index: number) => string | number;
    pageSize?: number;
};

export const GenericTable = <T,>({ columns, data, keyExtractor = (_, index) => index.toString(), pageSize = 5 }: GenericTableProps<T>) => {
    const { colors } = useTheme();

    const [page, setPage] = useState(1);

    const numberOfPages = Math.ceil(data.length / pageSize);
    const paginatedData = data.slice((page - 1) * pageSize, page * pageSize);

    return (
        <DataTable>
            {/* Encabezados de la tabla */}
            <DataTable.Header>
                {columns.map((column, index) => (
                    <DataTable.Title key={index.toString()}>
                        <LabelGeneral label={column.title} variant='titleSmall' styleProps={{ fontSize: 12, padding: 5, textAlign: 'center' }} />
                    </DataTable.Title>
                ))}
            </DataTable.Header>

            {/* Filas de la tabla */}
            {paginatedData.map((row, rowIndex) => (
                <DataTable.Row key={keyExtractor(row, rowIndex)} style={{ backgroundColor: rowIndex % 2 === 0 ? colors.background : colors.tertiaryContainer }}>
                    {columns.map((column, colIndex) => (
                        <DataTable.Cell key={colIndex.toString()}>
                            {column.render
                                ? column.render(row[column.key], row)
                                : <LabelGeneral label={row[column.key] as string} variant='bodySmall' styleProps={{ fontSize: 12, padding: 5 }} numberOfLines={2} />
                            }
                        </DataTable.Cell>
                    ))}
                </DataTable.Row>
            ))}

            {numberOfPages > 1 && (
                <DataTable.Pagination
                    page={page - 1}
                    numberOfPages={numberOfPages}
                    onPageChange={(newPage) => setPage(newPage + 1)}
                    label={`Página ${page} de ${numberOfPages}`}
                />
            )}
        </DataTable>
    );
};