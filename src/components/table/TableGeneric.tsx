import { StyleSheet, View } from "react-native";
import { DataTable, useTheme } from "react-native-paper";
import { LabelGeneral } from "../labels";
import { useState, useMemo } from "react";

type Column<T> = {
    title: string;
    key: keyof T;
    render?: (value: any, row: T) => React.ReactNode;
    flex?: number;
};

type GenericTableProps<T> = {
    columns: Column<T>[];
    data: T[];
    keyExtractor?: (item: T, index: number) => string | number;
    pageSize?: number;
    onRefresh?: () => Promise<void>;
    isRefreshing?: boolean;
};

export const GenericTable = <T,>({
    columns,
    data,
    keyExtractor = (_, index) => index.toString(),
    pageSize = 5,
    onRefresh,
    isRefreshing = false,
}: GenericTableProps<T>) => {
    const { colors } = useTheme();
    const [page, setPage] = useState(1);

    const numberOfPages = Math.ceil(data.length / pageSize);
    const paginatedData = data.slice((page - 1) * pageSize, page * pageSize);

    const styles = useMemo(
        () =>
            StyleSheet.create({
                wrapper: {
                    borderRadius: 8,
                    elevation: 2,
                    overflow: "hidden",
                    marginHorizontal: 8,
                },
                dataTable: {
                    backgroundColor: colors.surface,
                },
                header: {
                    backgroundColor: colors.secondaryContainer,
                    minHeight: 44,
                },
                headerTitle: {
                    justifyContent: "center",
                    paddingHorizontal: 4,
                },
                row: {
                    minHeight: 48,
                    borderBottomWidth: 0.5,
                    borderBottomColor: colors.outlineVariant ?? colors.outline,
                },
                cell: {
                    justifyContent: "center",
                    alignItems: "center",
                    paddingHorizontal: 4,
                },
                pagination: {
                    backgroundColor: colors.surfaceVariant,
                },
            }),
        [colors]
    );

    return (
        <View style={styles.wrapper}>
            <DataTable style={styles.dataTable}>
                <DataTable.Header style={styles.header}>
                    {columns.map((column, index) => (
                        <DataTable.Title
                            key={index.toString()}
                            style={[styles.headerTitle, { flex: column.flex ?? 1 }]}
                        >
                            <LabelGeneral
                                label={column.title}
                                variant="titleSmall"
                                styleProps={{
                                    fontSize: 11,
                                    fontWeight: "bold",
                                    textAlign: "center",
                                    color: colors.onSecondaryContainer,
                                }}
                            />
                        </DataTable.Title>
                    ))}
                </DataTable.Header>

                {paginatedData.map((row, rowIndex) => (
                    <DataTable.Row
                        key={keyExtractor(row, rowIndex)}
                        style={[
                            styles.row,
                            {
                                backgroundColor:
                                    rowIndex % 2 === 0
                                        ? colors.surface
                                        : colors.surfaceVariant,
                            },
                        ]}
                    >
                        {columns.map((column, colIndex) => (
                            <DataTable.Cell
                                key={colIndex.toString()}
                                style={[styles.cell, { flex: column.flex ?? 1 }]}
                            >
                                {column.render ? (
                                    column.render(row[column.key], row)
                                ) : (
                                    <LabelGeneral
                                        label={row[column.key] as string}
                                        variant="bodySmall"
                                        styleProps={{
                                            fontSize: 11,
                                            textAlign: "center",
                                            color: colors.onSurface,
                                        }}
                                        numberOfLines={2}
                                    />
                                )}
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
                        style={styles.pagination}
                    />
                )}
            </DataTable>
        </View>
    );
};
