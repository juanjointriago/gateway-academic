import { ScrollView, StyleSheet, View, DimensionValue } from "react-native";
import { DataTable, useTheme } from "react-native-paper";
import { LabelGeneral } from "../labels";
import { useState, useMemo } from "react";
import { theme } from "@/app/theme/theme";

type Column<T> = {
    title: string;
    key: keyof T;
    render?: (value: any, row: T) => React.ReactNode;
    width?: DimensionValue;
};

type GenericTableProps<T> = {
    columns: Column<T>[];
    data: T[];
    keyExtractor?: (item: T, index: number) => string | number;
    pageSize?: number;
    onRefresh?: () => Promise<void>;
    isRefreshing?: boolean
};

export const GenericTable = <T,>({
    columns,
    data,
    keyExtractor = (_, index) => index.toString(),
    pageSize = 5,
    onRefresh,
    isRefreshing = false
}: GenericTableProps<T>) => {
    const { colors } = useTheme();
    const [page, setPage] = useState(1);

    const numberOfPages = Math.ceil(data.length / pageSize);
    const paginatedData = data.slice((page - 1) * pageSize, page * pageSize);

    const styles = useMemo(() => StyleSheet.create({
        scrollContainer: {
            flex: 1,
        },
        tableContainer: {
            minWidth: '100%',
            paddingHorizontal: 8,
        },
        dataTable: {
            backgroundColor: 'transparent',
            elevation: 2,
            borderRadius: 8,
            overflow: 'hidden',
        },
        header: {
            backgroundColor: colors.secondaryContainer,
            paddingVertical: 8,
        },
        headerTitle: {
            justifyContent: 'center',
            alignItems: 'center',
            paddingHorizontal: 4,
            minWidth: 80,
            maxWidth: 120,
            width: 120,
            flexShrink: 1,
        },
        row: {
            paddingVertical: 8,
            borderBottomWidth: 0.5,
            borderBottomColor: colors.outlineVariant || colors.outline,
        },
        cell: {
            justifyContent: 'center',
            alignItems: 'center',
            paddingHorizontal: 4,
            minWidth: 80,
            maxWidth: 120,
            width: 120,
            flexShrink: 1,
            overflow: 'hidden',
        },
        pagination: {
            paddingVertical: 8,
            backgroundColor: colors.surfaceVariant,
        },
    }), [colors]);

    return (
        <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.scrollContainer}
        >
            <View style={styles.tableContainer}>
                <DataTable style={styles.dataTable}>
                    <DataTable.Header style={styles.header}>
                        {columns.map((column, index) => (
                            <DataTable.Title
                                key={index.toString()}
                                style={[
                                    styles.headerTitle,
                                    ...(column.width ? [{ width: column.width }] : [])
                                ]}
                            >
                                <LabelGeneral
                                    label={column.title}
                                    variant='titleSmall'
                                    styleProps={{
                                        fontSize: 11,
                                        fontWeight: 'bold',
                                        textAlign: 'center',
                                        color: colors.onSurfaceVariant
                                    }}
                                />
                            </DataTable.Title>
                        ))}
                    </DataTable.Header>
                    {/* Filas de la tabla */}
                    {paginatedData.map((row, rowIndex) => (
                        <DataTable.Row
                            key={keyExtractor(row, rowIndex)}
                            style={[
                                styles.row,
                                { backgroundColor: rowIndex % 2 === 0 ? colors.surface : colors.surfaceVariant }
                            ]}
                        >
                            {columns.map((column, colIndex) => (
                                <DataTable.Cell
                                    key={colIndex.toString()}
                                    style={[
                                        styles.cell,
                                        ...(column.width ? [{ width: column.width }] : [])
                                    ]}
                                >
                                    {column.render
                                        ? column.render(row[column.key], row)
                                        : <LabelGeneral
                                            label={row[column.key] as string}
                                            variant='bodySmall'
                                            styleProps={{
                                                fontSize: 11,
                                                textAlign: 'center',
                                                color: colors.onSurface
                                            }}
                                            numberOfLines={2}
                                        />
                                    }
                                </DataTable.Cell>
                            ))}
                        </DataTable.Row>
                    ))}
                    {/* Paginación */}
                    {numberOfPages > 1 && (
                        <DataTable.Pagination
                            page={page - 1}
                            numberOfPages={numberOfPages}
                            onPageChange={(newPage) => setPage(newPage + 1)}
                            label={`Página ${page} de ${numberOfPages}`}
                            style={styles.pagination}
                        />
                    )}
                </DataTable>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    scrollContainer: {
        flex: 1,
    },
    tableContainer: {
        minWidth: '100%',
        paddingHorizontal: 8,
    },
    dataTable: {
        backgroundColor: 'transparent',
        elevation: 2,
        borderRadius: 8,
        overflow: 'hidden',
    },
    header: {
        backgroundColor: theme.colors.secondaryContainer,
        paddingVertical: 8,
    },
    headerTitle: {
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 4,
        minWidth: 80,
        maxWidth: 120,
        width: 120,
        flexShrink: 1,
    },
    row: {
        paddingVertical: 8,
        borderBottomWidth: 0.5,
        borderBottomColor: theme.colors.outlineVariant || theme.colors.outline,
    },
    cell: {
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 4,
        minWidth: 80,
        maxWidth: 120,
        width: 120,
        flexShrink: 1,
        overflow: 'hidden',
    },
    pagination: {
        paddingVertical: 8,
        backgroundColor: theme.colors.surfaceVariant,
    },
});