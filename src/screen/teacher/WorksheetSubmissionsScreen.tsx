import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import {
    ActivityIndicator,
    Button,
    Card,
    Chip,
    DataTable,
    Divider,
    IconButton,
    List,
    Modal,
    Portal,
    Switch,
    Text,
    useTheme,
} from 'react-native-paper';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { WorksheetService } from '@/src/services/worksheets/worksheet.service';
import { getDocumentById } from '@/src/helpers/firestoreHelper';
import { USER_COLLECTION } from '@/src/constants/ContantsFirebase';
import {
    CompleteWordField,
    FillInBlankField,
    IWorksheet,
    IWorksheetSubmission,
    MultipleChoiceField,
    WorksheetField,
} from '@/src/interfaces';

// ─── Helpers ──────────────────────────────────────────────────────────────────

interface StudentSummary {
    studentId: string;
    studentName: string;
    latestSubmission: IWorksheetSubmission;
    attemptCount: number;
    bestScore: number;
}

const isInteractive = (f: WorksheetField) =>
    f.type === 'fill-blank' || f.type === 'multiple-choice' || f.type === 'complete-word';

const isAnswerCorrect = (field: WorksheetField, answer: string): boolean => {
    if (field.type === 'fill-blank') {
        const f = field as FillInBlankField;
        return f.caseSensitive
            ? answer === f.correctAnswer
            : answer.toLowerCase() === f.correctAnswer.toLowerCase();
    }
    if (field.type === 'multiple-choice') {
        const f = field as MultipleChoiceField;
        return answer === f.correctOptionId;
    }
    if (field.type === 'complete-word') {
        const f = field as CompleteWordField;
        return answer.toLowerCase() === f.correctAnswer.toLowerCase();
    }
    return false;
};

const getCorrectAnswerLabel = (field: WorksheetField): string => {
    if (field.type === 'fill-blank') return (field as FillInBlankField).correctAnswer;
    if (field.type === 'multiple-choice') {
        const f = field as MultipleChoiceField;
        return f.options.find((o) => o.id === f.correctOptionId)?.text ?? f.correctOptionId;
    }
    if (field.type === 'complete-word') return (field as CompleteWordField).correctAnswer;
    return '';
};

const formatDate = (ts: number) => {
    const d = new Date(ts);
    return d.toLocaleDateString('es-EC', { day: '2-digit', month: '2-digit', year: 'numeric' }) +
        ' ' + d.toLocaleTimeString('es-EC', { hour: '2-digit', minute: '2-digit' });
};

// ─── Main Screen ──────────────────────────────────────────────────────────────

export const WorksheetSubmissionsScreen: React.FC = () => {
    const { worksheetId, worksheetTitle } = useLocalSearchParams<{
        worksheetId: string;
        worksheetTitle: string;
    }>();
    const router = useRouter();
    const theme = useTheme();

    const [worksheet, setWorksheet] = useState<IWorksheet | null>(null);
    const [summaries, setSummaries] = useState<StudentSummary[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedSummary, setSelectedSummary] = useState<StudentSummary | null>(null);
    const [togglingId, setTogglingId] = useState<string | null>(null);

    useEffect(() => {
        if (!worksheetId) return;
        (async () => {
            setLoading(true);
            const [ws, allSubs] = await Promise.all([
                WorksheetService.getWorksheetById(worksheetId),
                WorksheetService.getSubmissionsByWorksheetId(worksheetId),
            ]);
            setWorksheet(ws);

            // Group by studentId
            const byStudent: Record<string, IWorksheetSubmission[]> = {};
            for (const sub of allSubs) {
                if (!byStudent[sub.studentId]) byStudent[sub.studentId] = [];
                byStudent[sub.studentId].push(sub);
            }

            // Fetch student names
            const studentIds = Object.keys(byStudent);
            const userDocs = await Promise.all(
                studentIds.map((id) => getDocumentById<{ name?: string }>(USER_COLLECTION, id))
            );

            const result: StudentSummary[] = studentIds.map((id, i) => {
                const subs = byStudent[id];
                const latest = subs[0]; // already sorted desc by completedAt
                const best = Math.max(...subs.map((s) => s.score));
                return {
                    studentId: id,
                    studentName: userDocs[i]?.name ?? `Estudiante (${id.slice(0, 6)}…)`,
                    latestSubmission: latest,
                    attemptCount: subs.length,
                    bestScore: best,
                };
            });

            setSummaries(result);
            setLoading(false);
        })();
    }, [worksheetId]);

    const handleToggleShowAnswers = async (summary: StudentSummary) => {
        if (!summary.latestSubmission.id) return;
        setTogglingId(summary.latestSubmission.id);
        const newValue = !summary.latestSubmission.showAnswersOverride;
        try {
            await WorksheetService.updateSubmission(summary.latestSubmission.id, {
                showAnswersOverride: newValue,
            });
            setSummaries((prev) =>
                prev.map((s) =>
                    s.studentId === summary.studentId
                        ? {
                            ...s,
                            latestSubmission: { ...s.latestSubmission, showAnswersOverride: newValue },
                        }
                        : s
                )
            );
            if (selectedSummary?.studentId === summary.studentId) {
                setSelectedSummary((prev) =>
                    prev
                        ? { ...prev, latestSubmission: { ...prev.latestSubmission, showAnswersOverride: newValue } }
                        : null
                );
            }
        } finally {
            setTogglingId(null);
        }
    };

    const maxScore = worksheet?.settings.totalScore ?? 0;
    const teacherCanOverride = worksheet?.settings.teacherCanOverrideShowAnswers ?? false;

    if (loading) {
        return (
            <View style={[styles.centered, { backgroundColor: theme.colors.background }]}>
                <ActivityIndicator size="large" />
            </View>
        );
    }

    return (
        <>
            <View style={[styles.header, { backgroundColor: theme.colors.surface }]}>
                <IconButton icon="arrow-left" onPress={() => router.back()} />
                <Text style={[styles.headerTitle, { color: theme.colors.onSurface }]} numberOfLines={1}>
                    {worksheetTitle ?? 'Entregas'}
                </Text>
            </View>

            <ScrollView
                style={{ backgroundColor: theme.colors.background }}
                contentContainerStyle={styles.scrollContent}
            >
                {summaries.length === 0 ? (
                    <View style={styles.centered}>
                        <Text style={{ color: theme.colors.onSurfaceVariant, marginTop: 40 }}>
                            Aún no hay entregas para este worksheet.
                        </Text>
                    </View>
                ) : (
                    <>
                        <Text style={[styles.sectionTitle, { color: theme.colors.onSurfaceVariant }]}>
                            {summaries.length} alumno{summaries.length !== 1 ? 's' : ''} han entregado
                        </Text>

                        <DataTable>
                            <DataTable.Header>
                                <DataTable.Title style={{ flex: 3 }}>Alumno</DataTable.Title>
                                <DataTable.Title numeric style={{ flex: 1.5 }}>Mejor puntaje</DataTable.Title>
                                <DataTable.Title numeric style={{ flex: 1 }}>Intentos</DataTable.Title>
                                <DataTable.Title style={{ flex: 1 }} />
                            </DataTable.Header>

                            {summaries.map((summary) => (
                                <DataTable.Row
                                    key={summary.studentId}
                                    onPress={() => setSelectedSummary(summary)}
                                >
                                    <DataTable.Cell style={{ flex: 3 }}>
                                        <Text numberOfLines={1}>{summary.studentName}</Text>
                                    </DataTable.Cell>
                                    <DataTable.Cell numeric style={{ flex: 1.5 }}>
                                        {summary.bestScore}/{maxScore}
                                    </DataTable.Cell>
                                    <DataTable.Cell numeric style={{ flex: 1 }}>
                                        {summary.attemptCount}
                                    </DataTable.Cell>
                                    <DataTable.Cell style={{ flex: 1 }}>
                                        <IconButton icon="eye" size={18} onPress={() => setSelectedSummary(summary)} />
                                    </DataTable.Cell>
                                </DataTable.Row>
                            ))}
                        </DataTable>
                    </>
                )}
            </ScrollView>

            {/* Detail modal */}
            <Portal>
                <Modal
                    visible={!!selectedSummary}
                    onDismiss={() => setSelectedSummary(null)}
                    contentContainerStyle={[styles.modal, { backgroundColor: theme.colors.surface }]}
                >
                    {selectedSummary && worksheet ? (
                        <ScrollView>
                            <Text variant="titleLarge" style={{ marginBottom: 4 }}>
                                {selectedSummary.studentName}
                            </Text>
                            <Text style={{ color: theme.colors.onSurfaceVariant, marginBottom: 4, fontSize: 13 }}>
                                Intento #{selectedSummary.latestSubmission.attemptNumber} · {formatDate(selectedSummary.latestSubmission.completedAt)}
                            </Text>
                            <Text variant="titleMedium" style={{ marginBottom: 12 }}>
                                Puntaje:{' '}
                                <Text style={{ color: theme.colors.primary }}>
                                    {selectedSummary.latestSubmission.score}/{maxScore}
                                </Text>
                            </Text>

                            {/* Toggle show answers */}
                            {teacherCanOverride && (
                                <View style={styles.toggleRow}>
                                    <Text style={{ flex: 1, color: theme.colors.onSurface }}>
                                        Permitir ver respuestas correctas al alumno
                                    </Text>
                                    <Switch
                                        value={!!selectedSummary.latestSubmission.showAnswersOverride}
                                        onValueChange={() => handleToggleShowAnswers(selectedSummary)}
                                        disabled={togglingId === selectedSummary.latestSubmission.id}
                                    />
                                </View>
                            )}

                            <Divider style={{ marginVertical: 12 }} />

                            {/* Field-by-field breakdown */}
                            {worksheet.fields.filter(isInteractive).map((field) => {
                                const answer = String(selectedSummary.latestSubmission.answers[field.id] ?? '');
                                const correct = isAnswerCorrect(field, answer);
                                const correctLabel = getCorrectAnswerLabel(field);
                                const questionLabel =
                                    field.type === 'fill-blank'
                                        ? (field as FillInBlankField).beforeText
                                        : field.type === 'multiple-choice'
                                            ? (field as MultipleChoiceField).question
                                            : (field as CompleteWordField).instruction;

                                return (
                                    <Card
                                        key={field.id}
                                        style={[
                                            styles.fieldCard,
                                            { borderLeftColor: correct ? '#4caf50' : '#f44336' },
                                        ]}
                                        mode="outlined"
                                    >
                                        <Card.Content>
                                            <Text style={{ fontSize: 13, color: theme.colors.onSurfaceVariant, marginBottom: 4 }}>
                                                {questionLabel}
                                            </Text>
                                            <View style={styles.fieldAnswerRow}>
                                                <Chip
                                                    compact
                                                    style={{ backgroundColor: correct ? '#e8f5e9' : '#ffebee' }}
                                                    textStyle={{ color: correct ? '#2e7d32' : '#c62828' }}
                                                >
                                                    {answer || '(sin respuesta)'}
                                                </Chip>
                                                {!correct && (
                                                    <Text style={{ color: '#4caf50', fontSize: 12, marginLeft: 8 }}>
                                                        ✓ {correctLabel}
                                                    </Text>
                                                )}
                                            </View>
                                        </Card.Content>
                                    </Card>
                                );
                            })}

                            <Button
                                mode="outlined"
                                onPress={() => setSelectedSummary(null)}
                                style={{ marginTop: 16 }}
                            >
                                Cerrar
                            </Button>
                        </ScrollView>
                    ) : null}
                </Modal>
            </Portal>
        </>
    );
};

const styles = StyleSheet.create({
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingTop: 48,
        paddingBottom: 8,
        paddingRight: 16,
        elevation: 2,
    },
    headerTitle: {
        flex: 1,
        fontSize: 18,
        fontWeight: '600',
    },
    scrollContent: {
        padding: 16,
        paddingBottom: 40,
    },
    sectionTitle: {
        fontSize: 13,
        marginBottom: 8,
    },
    modal: {
        margin: 16,
        borderRadius: 16,
        padding: 20,
        maxHeight: '85%',
    },
    toggleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
        gap: 12,
    },
    fieldCard: {
        marginBottom: 10,
        borderLeftWidth: 4,
    },
    fieldAnswerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        flexWrap: 'wrap',
        marginTop: 4,
    },
});
