import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
    Alert,
    Image,
    ScrollView,
    StyleSheet,
    TextInput,
    View,
} from 'react-native';
import {
    ActivityIndicator,
    Button,
    Card,
    Divider,
    IconButton,
    Modal,
    Portal,
    ProgressBar,
    RadioButton,
    Surface,
    Text,
    useTheme,
} from 'react-native-paper';
import { useLocalSearchParams, useRouter } from 'expo-router';
import * as ScreenCapture from 'expo-screen-capture';
import * as Speech from 'expo-speech';
import {
    Gesture,
    GestureDetector,
    GestureHandlerRootView,
} from 'react-native-gesture-handler';
import Animated, {
    runOnJS,
    useAnimatedStyle,
    useSharedValue,
    withSpring,
} from 'react-native-reanimated';
import { useAuthStore } from '@/src/store/auth/auth.store';
import { WorksheetService } from '@/src/services/worksheets/worksheet.service';
import {
    CompleteWordField,
    FillInBlankField,
    ImageBlock,
    IWorksheet,
    IWorksheetSubmission,
    MultipleChoiceField,
    TextBlock,
    VoiceWordBlock,
    WorksheetField,
} from '@/src/interfaces';

// ─── Letter Chip (reanimated + gesture-handler tap) ──────────────────────────

interface LetterChipProps {
    letter: string;
    onPress: () => void;
    disabled?: boolean;
    color?: string;
}

const LetterChip: React.FC<LetterChipProps> = ({ letter, onPress, disabled, color }) => {
    const scale = useSharedValue(1);
    const theme = useTheme();

    const gesture = Gesture.Tap()
        .enabled(!disabled)
        .onBegin(() => {
            scale.value = withSpring(0.82, { damping: 15 });
        })
        .onFinalize(() => {
            scale.value = withSpring(1, { damping: 15 });
        })
        .onEnd(() => {
            runOnJS(onPress)();
        });

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
    }));

    return (
        <GestureDetector gesture={gesture}>
            <Animated.View
                style={[
                    styles.letterChip,
                    { backgroundColor: color ?? theme.colors.primaryContainer },
                    animatedStyle,
                ]}
            >
                <Text style={[styles.letterText, { color: color ? '#fff' : theme.colors.onPrimaryContainer }]}>
                    {letter}
                </Text>
            </Animated.View>
        </GestureDetector>
    );
};

// ─── CompleteWord component ───────────────────────────────────────────────────

interface CompleteWordProps {
    field: CompleteWordField;
    answer: string;
    onChange: (value: string) => void;
    showResult?: boolean;
    isCorrect?: boolean;
}

const CompleteWordInput: React.FC<CompleteWordProps> = ({
    field,
    answer,
    onChange,
    showResult,
    isCorrect,
}) => {
    const theme = useTheme();

    const [placed, setPlaced] = useState<string[]>(() => {
        if (answer) return answer.split('');
        return [];
    });
    const [available, setAvailable] = useState<string[]>(() => {
        if (answer) {
            const answerLetters = answer.split('');
            const remaining = [...field.scrambledLetters];
            for (const l of answerLetters) {
                const idx = remaining.indexOf(l);
                if (idx !== -1) remaining.splice(idx, 1);
            }
            return remaining;
        }
        return [...field.scrambledLetters];
    });

    const moveToplaced = (index: number) => {
        const letter = available[index];
        const newAvailable = available.filter((_, i) => i !== index);
        const newPlaced = [...placed, letter];
        setPlaced(newPlaced);
        setAvailable(newAvailable);
        onChange(newPlaced.join(''));
    };

    const moveToAvailable = (index: number) => {
        if (showResult) return;
        const letter = placed[index];
        const newPlaced = placed.filter((_, i) => i !== index);
        const newAvailable = [...available, letter];
        setPlaced(newPlaced);
        setAvailable(newAvailable);
        onChange(newPlaced.join(''));
    };

    const borderColor = showResult
        ? isCorrect
            ? '#4caf50'
            : '#f44336'
        : theme.colors.outline;

    return (
        <View style={styles.cwContainer}>
            {field.instruction ? (
                <Text style={[styles.cwInstruction, { color: theme.colors.onSurface }]}>
                    {field.instruction}
                </Text>
            ) : null}
            {field.imageUrl ? (
                <Image
                    source={{ uri: field.imageUrl }}
                    style={styles.cwImage}
                    resizeMode="contain"
                />
            ) : null}

            {/* Placed zone */}
            <Surface
                style={[styles.cwPlacedZone, { borderColor }]}
                elevation={0}
            >
                {placed.length === 0 ? (
                    <Text style={{ color: theme.colors.onSurfaceDisabled, fontSize: 13 }}>
                        Toca las letras de abajo para colocarlas aquí
                    </Text>
                ) : (
                    <View style={styles.cwLettersRow}>
                        {placed.map((letter, i) => (
                            <LetterChip
                                key={`placed-${i}`}
                                letter={letter}
                                onPress={() => moveToAvailable(i)}
                                disabled={showResult}
                                color={
                                    showResult
                                        ? isCorrect
                                            ? '#4caf50'
                                            : '#f44336'
                                        : undefined
                                }
                            />
                        ))}
                    </View>
                )}
            </Surface>

            {/* Available zone */}
            {!showResult && (
                <View style={[styles.cwLettersRow, { marginTop: 10 }]}>
                    {available.map((letter, i) => (
                        <LetterChip
                            key={`avail-${i}`}
                            letter={letter}
                            onPress={() => moveToplaced(i)}
                        />
                    ))}
                </View>
            )}

            {showResult && (
                <Text style={{ color: borderColor, marginTop: 6, fontSize: 13 }}>
                    Respuesta correcta: <Text style={{ fontWeight: 'bold' }}>{field.correctAnswer}</Text>
                </Text>
            )}
        </View>
    );
};

// ─── Field renderers ──────────────────────────────────────────────────────────

interface FieldRendererProps {
    field: WorksheetField;
    answers: Record<string, string>;
    onAnswer: (fieldId: string, value: string) => void;
    showResults: boolean;
    showCorrectAnswers: boolean;
}

const FieldRenderer: React.FC<FieldRendererProps> = ({
    field,
    answers,
    onAnswer,
    showResults,
    showCorrectAnswers,
}) => {
    const theme = useTheme();

    switch (field.type) {
        case 'text': {
            const f = field as TextBlock;
            if (f.style === 'heading') {
                return (
                    <Text style={[styles.fieldHeading, { color: theme.colors.onSurface }]}>
                        {f.content}
                    </Text>
                );
            }
            if (f.style === 'instruction') {
                return (
                    <Text style={[styles.fieldInstruction, { color: theme.colors.secondary }]}>
                        {f.content}
                    </Text>
                );
            }
            return (
                <Text style={[styles.fieldParagraph, { color: theme.colors.onSurface }]}>
                    {f.content}
                </Text>
            );
        }

        case 'image': {
            const f = field as ImageBlock;
            return (
                <View style={styles.imageBlock}>
                    <Image
                        source={{ uri: f.imageUrl }}
                        style={styles.fieldImage}
                        resizeMode="contain"
                    />
                    {f.caption ? (
                        <Text style={[styles.imageCaption, { color: theme.colors.onSurfaceVariant }]}>
                            {f.caption}
                        </Text>
                    ) : null}
                </View>
            );
        }

        case 'voice-word': {
            const f = field as VoiceWordBlock;
            return (
                <Card style={styles.voiceCard} mode="outlined">
                    <Card.Content style={styles.voiceCardContent}>
                        <Image
                            source={{ uri: f.imageUrl }}
                            style={styles.voiceImage}
                            resizeMode="contain"
                        />
                        <View style={styles.voiceTextRow}>
                            <Text style={[styles.voiceWord, { color: theme.colors.onSurface }]}>
                                {f.word}
                            </Text>
                            <IconButton
                                icon="volume-high"
                                size={26}
                                iconColor={theme.colors.primary}
                                onPress={() =>
                                    Speech.speak(f.word, { language: f.language || 'en-US' })
                                }
                            />
                        </View>
                    </Card.Content>
                </Card>
            );
        }

        case 'fill-blank': {
            const f = field as FillInBlankField;
            const userAnswer = answers[f.id] ?? '';
            const isCorrect = showResults
                ? f.caseSensitive
                    ? userAnswer === f.correctAnswer
                    : userAnswer.toLowerCase() === f.correctAnswer.toLowerCase()
                : undefined;

            const borderColor = showResults
                ? isCorrect
                    ? '#4caf50'
                    : '#f44336'
                : theme.colors.outline;

            return (
                <View style={styles.fillBlankContainer}>
                    <View style={styles.fillBlankRow}>
                        {f.beforeText ? (
                            <Text style={[styles.fillBlankText, { color: theme.colors.onSurface }]}>
                                {f.beforeText}{' '}
                            </Text>
                        ) : null}
                        <TextInput
                            value={userAnswer}
                            onChangeText={(t) => onAnswer(f.id, t)}
                            editable={!showResults}
                            style={[
                                styles.fillBlankInput,
                                {
                                    borderColor,
                                    color: theme.colors.onSurface,
                                    backgroundColor: theme.colors.surface,
                                },
                            ]}
                            placeholder="___"
                            placeholderTextColor={theme.colors.onSurfaceDisabled}
                        />
                        {f.afterText ? (
                            <Text style={[styles.fillBlankText, { color: theme.colors.onSurface }]}>
                                {' '}{f.afterText}
                            </Text>
                        ) : null}
                    </View>
                    {f.hint && !showResults ? (
                        <Text style={[styles.hintText, { color: theme.colors.onSurfaceVariant }]}>
                            Pista: {f.hint}
                        </Text>
                    ) : null}
                    {showResults && showCorrectAnswers && !isCorrect ? (
                        <Text style={styles.correctAnswerText}>
                            Respuesta correcta: <Text style={{ fontWeight: 'bold' }}>{f.correctAnswer}</Text>
                        </Text>
                    ) : null}
                </View>
            );
        }

        case 'multiple-choice': {
            const f = field as MultipleChoiceField;
            const userAnswer = answers[f.id] ?? '';
            const isCorrect = showResults ? userAnswer === f.correctOptionId : undefined;

            return (
                <View style={styles.mcContainer}>
                    <Text style={[styles.mcQuestion, { color: theme.colors.onSurface }]}>
                        {f.question}
                    </Text>
                    <RadioButton.Group
                        onValueChange={(val) => {
                            if (!showResults) onAnswer(f.id, val);
                        }}
                        value={userAnswer}
                    >
                        {f.options.map((opt) => {
                            let optColor = theme.colors.onSurface;
                            if (showResults && showCorrectAnswers) {
                                if (opt.id === f.correctOptionId) optColor = '#4caf50';
                                else if (opt.id === userAnswer) optColor = '#f44336';
                            }
                            return (
                                <View key={opt.id} style={styles.mcOption}>
                                    <RadioButton value={opt.id} disabled={showResults} />
                                    {opt.imageUrl ? (
                                        <Image
                                            source={{ uri: opt.imageUrl }}
                                            style={styles.mcOptionImage}
                                            resizeMode="contain"
                                        />
                                    ) : null}
                                    <Text style={{ color: optColor, flex: 1 }}>{opt.text}</Text>
                                </View>
                            );
                        })}
                    </RadioButton.Group>
                    {showResults ? (
                        <Text style={{ color: isCorrect ? '#4caf50' : '#f44336', marginTop: 4, fontSize: 13 }}>
                            {isCorrect ? '✓ Correcto' : '✗ Incorrecto'}
                        </Text>
                    ) : null}
                </View>
            );
        }

        case 'complete-word': {
            const f = field as CompleteWordField;
            const userAnswer = answers[f.id] ?? '';
            const isCorrect = showResults
                ? userAnswer.toLowerCase() === f.correctAnswer.toLowerCase()
                : undefined;

            return (
                <CompleteWordInput
                    field={f}
                    answer={userAnswer}
                    onChange={(val) => onAnswer(f.id, val)}
                    showResult={showResults && showCorrectAnswers}
                    isCorrect={isCorrect}
                />
            );
        }

        default:
            return null;
    }
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

const isInteractive = (f: WorksheetField) =>
    f.type === 'fill-blank' || f.type === 'multiple-choice' || f.type === 'complete-word';

const computeScore = (
    fields: WorksheetField[],
    answers: Record<string, string>
): number => {
    let score = 0;
    for (const field of fields) {
        if (field.type === 'fill-blank') {
            const f = field as FillInBlankField;
            const ans = answers[f.id] ?? '';
            const correct = f.caseSensitive
                ? ans === f.correctAnswer
                : ans.toLowerCase() === f.correctAnswer.toLowerCase();
            if (correct) score += f.points;
        } else if (field.type === 'multiple-choice') {
            const f = field as MultipleChoiceField;
            if ((answers[f.id] ?? '') === f.correctOptionId) score += f.points;
        } else if (field.type === 'complete-word') {
            const f = field as CompleteWordField;
            const ans = answers[f.id] ?? '';
            if (ans.toLowerCase() === f.correctAnswer.toLowerCase()) score += f.points;
        }
    }
    return score;
};

// ─── Main Screen ──────────────────────────────────────────────────────────────

export const WorksheetScreen: React.FC = () => {
    const { worksheetId, unitId } = useLocalSearchParams<{
        worksheetId: string;
        unitId: string;
    }>();
    const router = useRouter();
    const theme = useTheme();
    const user = useAuthStore((state) => state.user);

    const [worksheet, setWorksheet] = useState<IWorksheet | null>(null);
    const [submissions, setSubmissions] = useState<IWorksheetSubmission[]>([]);
    const [loading, setLoading] = useState(true);
    const [answers, setAnswers] = useState<Record<string, string>>({});
    const [submitting, setSubmitting] = useState(false);
    const [showResults, setShowResults] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [finalScore, setFinalScore] = useState(0);
    const startedAt = useRef(Date.now());

    useEffect(() => {
        ScreenCapture.preventScreenCaptureAsync().catch(() => null);
        return () => {
            ScreenCapture.allowScreenCaptureAsync().catch(() => null);
        };
    }, []);

    useEffect(() => {
        if (!worksheetId || !user?.uid) return;
        (async () => {
            setLoading(true);
            const [ws, subs] = await Promise.all([
                WorksheetService.getWorksheetById(worksheetId),
                WorksheetService.getSubmissionsByStudentAndWorksheet(user.uid, worksheetId),
            ]);
            setWorksheet(ws);
            setSubmissions(subs);
            setLoading(false);
        })();
    }, [worksheetId, user?.uid]);

    const handleAnswer = useCallback((fieldId: string, value: string) => {
        setAnswers((prev) => ({ ...prev, [fieldId]: value }));
    }, []);

    const interactiveFields = worksheet?.fields.filter(isInteractive) ?? [];
    const answeredCount = interactiveFields.filter(
        (f) => (answers[f.id] ?? '').trim().length > 0
    ).length;
    const progress = interactiveFields.length > 0 ? answeredCount / interactiveFields.length : 0;
    const allAnswered = answeredCount === interactiveFields.length;

    const attemptNumber = submissions.length + 1;
    const maxAttempts = worksheet?.settings.maxAttempts ?? null;
    const attemptsExhausted = maxAttempts !== null && submissions.length >= maxAttempts;

    const bestScore = submissions.length > 0
        ? Math.max(...submissions.map((s) => s.score))
        : 0;

    const handleSubmit = async () => {
        if (!worksheet || !user?.uid) return;
        setSubmitting(true);

        const score = computeScore(worksheet.fields, answers);
        const maxScore = worksheet.settings.totalScore;

        const submission: Omit<IWorksheetSubmission, 'id'> = {
            worksheetId,
            unitId: unitId ?? '',
            studentId: user.uid,
            answers,
            score,
            maxScore,
            attemptNumber,
            startedAt: startedAt.current,
            completedAt: Date.now(),
            isGraded: !worksheet.settings.requiresGrading,
        };

        try {
            await WorksheetService.createSubmission(submission);
            setSubmissions((prev) => [...prev, { ...submission, id: 'local' }]);
            setFinalScore(score);

            if (worksheet.settings.showCorrectAnswers) {
                setShowResults(true);
            }

            if (worksheet.settings.showResultsToStudent) {
                setShowModal(true);
            } else if (!worksheet.settings.showCorrectAnswers) {
                Alert.alert('Entregado', 'Tu trabajo fue entregado correctamente.', [
                    { text: 'OK', onPress: () => router.navigate('/(tabs)/books' as any) },
                ]);
            }
        } catch {
            Alert.alert('Error', 'No se pudo guardar la entrega. Inténtalo de nuevo.');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <View style={[styles.centered, { backgroundColor: theme.colors.background }]}>
                <ActivityIndicator size="large" />
            </View>
        );
    }

    if (!worksheet) {
        return (
            <View style={[styles.centered, { backgroundColor: theme.colors.background }]}>
                <Text>No se pudo cargar el worksheet.</Text>
                <Button onPress={() => router.back()}>Volver</Button>
            </View>
        );
    }

    return (
        <GestureHandlerRootView style={{ flex: 1, backgroundColor: theme.colors.background }}>
            {/* Header */}
            <View style={[styles.header, { backgroundColor: theme.colors.surface }]}>
                <IconButton icon="arrow-left" onPress={() => router.back()} />
                <Text style={[styles.headerTitle, { color: theme.colors.onSurface }]} numberOfLines={1}>
                    {worksheet.title}
                </Text>
            </View>

            {/* Attempts exhausted */}
            {attemptsExhausted ? (
                <View style={[styles.centered, { backgroundColor: theme.colors.background, padding: 24 }]}>
                    <Text variant="headlineSmall" style={{ textAlign: 'center', marginBottom: 12 }}>
                        Has agotado tus intentos
                    </Text>
                    <Text style={{ textAlign: 'center', color: theme.colors.onSurfaceVariant, marginBottom: 20 }}>
                        Usaste {submissions.length} de {maxAttempts} intento{maxAttempts !== 1 ? 's' : ''}.
                    </Text>
                    <Text variant="titleLarge" style={{ textAlign: 'center', marginBottom: 20 }}>
                        Mejor puntaje: {bestScore} / {worksheet.settings.totalScore}
                    </Text>
                    <Button mode="contained" onPress={() => router.navigate('/(tabs)/books' as any)}>
                        Volver
                    </Button>
                </View>
            ) : (
                <ScrollView contentContainerStyle={styles.scrollContent}>
                    {/* Description */}
                    {worksheet.description ? (
                        <Text style={[styles.description, { color: theme.colors.onSurfaceVariant }]}>
                            {worksheet.description}
                        </Text>
                    ) : null}

                    {/* Attempt info */}
                    {maxAttempts !== null && (
                        <Text style={[styles.attemptInfo, { color: theme.colors.onSurfaceVariant }]}>
                            Intento {attemptNumber} de {maxAttempts}
                        </Text>
                    )}

                    {/* Progress bar */}
                    {interactiveFields.length > 0 && !showResults && (
                        <View style={styles.progressContainer}>
                            <Text style={{ color: theme.colors.onSurfaceVariant, fontSize: 13, marginBottom: 4 }}>
                                Progreso: {answeredCount}/{interactiveFields.length}
                            </Text>
                            <ProgressBar
                                progress={progress}
                                color={theme.colors.primary}
                                style={{ borderRadius: 4, height: 8 }}
                            />
                        </View>
                    )}

                    {/* Fields */}
                    {worksheet.fields.map((field, index) => (
                        <View key={field.id}>
                            {index > 0 && <Divider style={{ marginVertical: 12 }} />}
                            <FieldRenderer
                                field={field}
                                answers={answers}
                                onAnswer={handleAnswer}
                                showResults={showResults}
                                showCorrectAnswers={worksheet.settings.showCorrectAnswers}
                            />
                        </View>
                    ))}

                    {/* Submit button */}
                    {!showResults && (
                        <Button
                            mode="contained"
                            onPress={handleSubmit}
                            disabled={!allAnswered || submitting}
                            loading={submitting}
                            style={styles.submitButton}
                            contentStyle={{ paddingVertical: 6 }}
                        >
                            Entregar
                        </Button>
                    )}

                    {showResults && (
                        <Button
                            mode="outlined"
                            onPress={() => router.navigate('/(tabs)/books' as any)}
                            style={styles.submitButton}
                        >
                            Volver
                        </Button>
                    )}
                </ScrollView>
            )}

            {/* Results modal */}
            <Portal>
                <Modal
                    visible={showModal}
                    onDismiss={() => {
                        setShowModal(false);
                        if (!worksheet.settings.showCorrectAnswers) router.navigate('/(tabs)/books' as any);
                    }}
                    contentContainerStyle={[
                        styles.modal,
                        { backgroundColor: theme.colors.surface },
                    ]}
                >
                    <Text variant="headlineSmall" style={{ textAlign: 'center', marginBottom: 8 }}>
                        Resultado
                    </Text>
                    <Text
                        variant="displaySmall"
                        style={{ textAlign: 'center', color: theme.colors.primary, marginBottom: 8 }}
                    >
                        {finalScore} / {worksheet.settings.totalScore}
                    </Text>
                    <Text style={{ textAlign: 'center', color: theme.colors.onSurfaceVariant, marginBottom: 24 }}>
                        {finalScore >= worksheet.settings.totalScore * 0.7 ? '¡Buen trabajo! 🎉' : 'Sigue practicando 💪'}
                    </Text>
                    <Button
                        mode="contained"
                        onPress={() => {
                            setShowModal(false);
                            if (!worksheet.settings.showCorrectAnswers) router.navigate('/(tabs)/books' as any);
                        }}
                    >
                        {worksheet.settings.showCorrectAnswers ? 'Ver respuestas' : 'Cerrar'}
                    </Button>
                </Modal>
            </Portal>
        </GestureHandlerRootView>
    );
};

// ─── Styles ───────────────────────────────────────────────────────────────────

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
    description: {
        fontSize: 14,
        marginBottom: 12,
        lineHeight: 20,
    },
    attemptInfo: {
        fontSize: 13,
        marginBottom: 8,
    },
    progressContainer: {
        marginBottom: 16,
    },
    // Field styles
    fieldHeading: {
        fontSize: 20,
        fontWeight: '700',
        marginBottom: 6,
    },
    fieldInstruction: {
        fontSize: 14,
        fontStyle: 'italic',
        marginBottom: 6,
    },
    fieldParagraph: {
        fontSize: 15,
        lineHeight: 22,
        marginBottom: 6,
    },
    imageBlock: {
        alignItems: 'center',
        marginVertical: 8,
    },
    fieldImage: {
        width: '100%',
        height: 200,
        borderRadius: 8,
    },
    imageCaption: {
        fontSize: 12,
        marginTop: 4,
        textAlign: 'center',
    },
    voiceCard: {
        marginVertical: 6,
    },
    voiceCardContent: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    voiceImage: {
        width: 80,
        height: 80,
        borderRadius: 8,
    },
    voiceTextRow: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    voiceWord: {
        fontSize: 22,
        fontWeight: '700',
    },
    fillBlankContainer: {
        marginVertical: 6,
    },
    fillBlankRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'center',
        gap: 4,
    },
    fillBlankText: {
        fontSize: 15,
    },
    fillBlankInput: {
        borderWidth: 1.5,
        borderRadius: 6,
        paddingHorizontal: 10,
        paddingVertical: 4,
        fontSize: 15,
        minWidth: 80,
        textAlign: 'center',
    },
    hintText: {
        fontSize: 12,
        marginTop: 4,
        fontStyle: 'italic',
    },
    correctAnswerText: {
        color: '#f44336',
        fontSize: 13,
        marginTop: 4,
    },
    mcContainer: {
        marginVertical: 6,
    },
    mcQuestion: {
        fontSize: 15,
        fontWeight: '600',
        marginBottom: 8,
    },
    mcOption: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 4,
    },
    mcOptionImage: {
        width: 40,
        height: 40,
        borderRadius: 4,
        marginRight: 8,
    },
    // CompleteWord
    cwContainer: {
        marginVertical: 6,
    },
    cwInstruction: {
        fontSize: 14,
        marginBottom: 8,
    },
    cwImage: {
        width: '100%',
        height: 160,
        borderRadius: 8,
        marginBottom: 10,
    },
    cwPlacedZone: {
        borderWidth: 2,
        borderRadius: 10,
        minHeight: 54,
        padding: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    cwLettersRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
        justifyContent: 'center',
    },
    letterChip: {
        width: 40,
        height: 40,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 2,
    },
    letterText: {
        fontSize: 18,
        fontWeight: '700',
    },
    submitButton: {
        marginTop: 28,
        borderRadius: 8,
    },
    modal: {
        margin: 24,
        borderRadius: 16,
        padding: 24,
    },
});
